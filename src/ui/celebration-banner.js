/**
 * Celebration Banner — ephemeral notification for achievement moments.
 *
 * Shows a terminal-native flash banner inside #terminal-container
 * that auto-dismisses after 4 seconds. Non-blocking: user can
 * keep typing while the banner is visible.
 */

function showCelebrationBanner(title) {
  var container = document.getElementById('terminal-container');
  if (!container) return;

  // Remove existing banner if any
  var existing = container.querySelector('.celebration-banner');
  if (existing) existing.remove();

  var banner = document.createElement('div');
  banner.className = 'celebration-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.textContent = '[✓] ' + title;

  container.appendChild(banner);

  // Auto-dismiss after 6 seconds (longer for milestone moments)
  setTimeout(function() {
    banner.classList.add('celebration-banner-exit');
    setTimeout(function() {
      if (banner.parentNode) banner.remove();
    }, 800);
  }, 6000);
}

export { showCelebrationBanner };
