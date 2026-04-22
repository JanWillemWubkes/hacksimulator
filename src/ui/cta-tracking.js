/**
 * CTA Click Tracking - HackSimulator.nl
 *
 * Delegated click listener on any element with `data-product-id`.
 * Fires GA4 `product_cta_click` event via analytics/events.js (consent-aware).
 *
 * Markup contract:
 *   <a href="..." data-product-id="<gumroad_id>" data-cta-location="<context>">
 *     Button label
 *   </a>
 *
 * Uses `closest()` so nested elements (icons, spans inside <a>) still resolve.
 * Works with target="_blank": GA4 uses beacon transport by default.
 */

import events from '../analytics/events.js';

document.addEventListener('click', (e) => {
  const cta = e.target.closest('[data-product-id]');
  if (!cta) return;

  events.productCtaClick(
    cta.dataset.productId,
    cta.dataset.ctaLocation || 'unknown',
    cta.textContent.trim().slice(0, 80)
  );
});
