// Custom Brevo form submit handler.
//
// Brevo's main.js retourneert silent success op {success: true} maar laat
// onze #success-message div op display:none staan. Wij intercepten het
// submit-event, doen de POST zelf, en togglen de panels handmatig — wat
// óók de MutationObserver in newsletter-tracking.js triggert (en daarmee
// onze GA4 newsletter_signup + lead_magnet_signup events).

document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (!form || form.id !== 'sib-form') return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const errorPanel = document.getElementById('error-message');
  const successPanel = document.getElementById('success-message');
  const ACTIVE_CLASS = 'sib-form-message-panel--active';
  if (errorPanel) {
    errorPanel.style.display = 'none';
    errorPanel.classList.remove(ACTIVE_CLASS);
  }
  if (successPanel) {
    successPanel.style.display = 'none';
    successPanel.classList.remove(ACTIVE_CLASS);
  }

  try {
    const body = new URLSearchParams(new FormData(form)).toString();
    const url = form.action + (form.action.includes('?') ? '&' : '?') + 'isAjax=1';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const json = await res.json();

    if (json.success) {
      if (json.message && successPanel) {
        const span = successPanel.querySelector('.sib-form-message-panel__inner-text');
        if (span) span.textContent = json.message;
      }
      if (successPanel) {
        successPanel.style.display = 'block';
        successPanel.classList.add(ACTIVE_CLASS);
      }
      form.reset();
    } else {
      if (json.message && errorPanel) {
        const span = errorPanel.querySelector('.sib-form-message-panel__inner-text');
        if (span) span.textContent = json.message;
      }
      if (errorPanel) {
        errorPanel.style.display = 'block';
        errorPanel.classList.add(ACTIVE_CLASS);
      }
    }
  } catch (_err) {
    if (errorPanel) {
      errorPanel.style.display = 'block';
      errorPanel.classList.add(ACTIVE_CLASS);
    }
  }
}, true);
