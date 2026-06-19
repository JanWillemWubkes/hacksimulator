/**
 * CTA Click Tracking - HackSimulator.nl
 *
 * Delegated click listener for CTA tracking. Three branches:
 *  - `[data-product-id]` → fires GA4 `product_cta_click` (paid Gumroad CTAs)
 *  - `[data-lead-download]` → fires GA4 `lead_magnet_download` (same-origin PDF download)
 *  - `[data-lead-magnet]` → fires GA4 `lead_magnet_cta_click` (free sample CTAs)
 *
 * Markup contracts:
 *   <a href="..." data-product-id="<gumroad_id>" data-cta-location="<context>">
 *   <a href="..." data-lead-download="<sample_id>" data-cta-location="<context>">
 *   <a href="..." data-lead-magnet="<magnet_id>" data-cta-location="<context>">
 *
 * Uses `closest()` so nested elements (icons, spans inside <a>) still resolve.
 * Works with target="_blank": GA4 uses beacon transport by default.
 * Product branch wins on conflict (early return) — defensive, not a current case.
 */

import events from '../analytics/events.js';

document.addEventListener('click', (e) => {
  const productCta = e.target.closest('[data-product-id]');
  if (productCta) {
    events.productCtaClick(
      productCta.dataset.productId,
      productCta.dataset.ctaLocation || 'unknown',
      productCta.textContent.trim().slice(0, 80)
    );
    return;
  }

  const downloadCta = e.target.closest('[data-lead-download]');
  if (downloadCta) {
    events.leadMagnetDownload(
      downloadCta.dataset.leadDownload,
      downloadCta.dataset.ctaLocation || 'unknown'
    );
    return;
  }

  const magnetCta = e.target.closest('[data-lead-magnet]');
  if (magnetCta) {
    events.leadMagnetCtaClick(
      magnetCta.dataset.leadMagnet,
      magnetCta.dataset.ctaLocation || 'unknown',
      magnetCta.textContent.trim().slice(0, 80)
    );
  }
});
