/**
 * Newsletter Signup Tracking - HackSimulator.nl
 *
 * Observes Brevo's `#success-message` panel and fires a GA4 event when it
 * becomes visible (confirming a successful double-opt-in signup).
 *
 * Markup contract:
 *   <section class="newsletter-signup" data-newsletter-location="homepage">
 *     ...
 *     <div id="success-message" class="sib-form-message-panel" style="display:none;">
 *   </section>
 *
 * No-op on pages without a Brevo form (most blog posts).
 */

import events from '../analytics/events.js';

const successPanel = document.getElementById('success-message');
if (successPanel) {
  const locationAttr = successPanel.closest('[data-newsletter-location]');
  const location = locationAttr?.dataset.newsletterLocation || 'unknown';

  let fired = false;
  const observer = new MutationObserver(() => {
    if (fired) return;
    if (successPanel.style.display && successPanel.style.display !== 'none') {
      fired = true;
      events.newsletterSignup(location);
      if (location.startsWith('sample_')) {
        // Lead magnet funnel: also fire sample-specific event for separate measurement
        const sampleId = location.replace(/^sample_/, '');
        events.leadMagnetSignup(sampleId, location);
      }
      observer.disconnect();
    }
  });

  observer.observe(successPanel, {
    attributes: true,
    attributeFilter: ['style']
  });
}
