/**
 * Contact Form AJAX Submission - HackSimulator.nl
 *
 * Handles form submission via Netlify Forms with
 * user feedback (loading state, success/error messages).
 */

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('.contact-submit');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Disable button tijdens verzenden
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verzenden...';
    status.textContent = '';
    status.className = 'form-status';

    var formData = new URLSearchParams(new FormData(form));

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    .then(function(response) {
      if (response.ok) {
        status.textContent = 'Bedankt voor je bericht! We reageren zo snel mogelijk.';
        status.className = 'form-status form-status-success';
        form.reset();
      } else {
        throw new Error('Verzenden mislukt');
      }
    })
    .catch(function() {
      status.textContent = 'Er ging iets mis. Probeer het opnieuw of mail naar contact@hacksimulator.nl';
      status.className = 'form-status form-status-error';
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verstuur Bericht';
    });
  });
});
