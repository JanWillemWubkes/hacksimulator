// E2E Tests voor Lead Magnet (sample-pentest landing page + CTAs)
// Tests de happy path: landing rendert, CTAs navigeren, success-panel firet GA4 events

import { test, expect } from './fixtures.js';

test.describe('Lead Magnet — Sample Pentest', () => {

  test('landing page rendert hero, preview cards en Brevo form', async ({ page }) => {
    await page.goto('/sample-pentest.html');

    // Hero
    await expect(page.locator('h1')).toContainText('Pentest Playbook');
    await expect(page.locator('.eyebrow-badge')).toContainText('Gratis Sample');

    // Preview cards (3 stuks)
    const cards = page.locator('section.page-section .feature-card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText('Voorbereiding');
    await expect(cards.nth(1)).toContainText('verkennen');
    await expect(cards.nth(2)).toContainText('6 fasen');

    // Brevo form aanwezig met juiste action en email input
    const form = page.locator('#sib-form');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('action', /sibforms\.com\/serve\/MUIFACJ/);
    await expect(page.locator('#EMAIL')).toBeVisible();

    // Tracking attribute voor newsletter-tracking.js
    await expect(page.locator('[data-newsletter-location="sample_pentest"]')).toBeVisible();
  });

  test('CTA op nmap-blog navigeert naar /sample-pentest.html', async ({ page }) => {
    await page.goto('/blog/nmap-beginnersgids.html');

    const cta = page.locator('a[data-lead-magnet="pentest_sample"][data-cta-location="blog_nmap_top"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/sample-pentest.html');

    await cta.click();
    await page.waitForURL(/sample-pentest\.html$/);
    await expect(page.locator('h1')).toContainText('Pentest Playbook');
  });

  test('CTA op cybersecurity-tools blog firet lead_magnet_cta_click event', async ({ page }) => {
    // Geef analytics consent vooraf zodat GA4 events daadwerkelijk worden gefired
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('hacksim_analytics_consent', 'true');
    });

    await page.goto('/blog/cybersecurity-tools.html');

    // Spy op gtag — vervang met collector vóór click
    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    const cta = page.locator('a[data-lead-magnet="pentest_sample"][data-cta-location="blog_cybertools_mid"]');
    await expect(cta).toBeVisible();

    // Voorkom navigatie zodat we het event kunnen inspecteren
    await page.evaluate(() => {
      document.querySelector('a[data-lead-magnet="pentest_sample"]').addEventListener('click', e => e.preventDefault(), { capture: true });
    });

    await cta.click();

    const calls = await page.evaluate(() => window.__gtagCalls);
    const ctaEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_cta_click');
    expect(ctaEvent).toBeDefined();
    expect(ctaEvent[2]).toMatchObject({
      magnet_id: 'pentest_sample',
      location: 'blog_cybertools_mid'
    });
  });

  test('success panel toggle firet newsletter_signup + lead_magnet_signup events', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('hacksim_analytics_consent', 'true');
    });

    await page.goto('/sample-pentest.html');

    // Spy op gtag direct na pagina-load (newsletter-tracking.js initialiseert MutationObserver)
    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    // Trigger success panel (Brevo zou dit doen na succesvol form-submit)
    await page.evaluate(() => {
      const panel = document.getElementById('success-message');
      panel.style.display = 'block';
    });

    // MutationObserver heeft een tick nodig
    await page.waitForTimeout(200);

    const calls = await page.evaluate(() => window.__gtagCalls);
    const newsletterEvent = calls.find(c => c[0] === 'event' && c[1] === 'newsletter_signup');
    const leadMagnetEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_signup');

    expect(newsletterEvent).toBeDefined();
    expect(newsletterEvent[2]).toMatchObject({ location: 'sample_pentest' });

    expect(leadMagnetEvent).toBeDefined();
    expect(leadMagnetEvent[2]).toMatchObject({
      sample_id: 'pentest',
      location: 'sample_pentest'
    });
  });

  test('form submit met mocked Brevo response toggelt success panel + firet GA4 events', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('hacksim_analytics_consent', 'true');
    });

    // Intercept Brevo POST en geef gemockte success-response — voorkomt echt contact in Brevo
    // Regex i.p.v. glob: subdomain (09a5e5c2.sibforms.com) wordt niet consistent gematcht door **/...
    await page.route(/sibforms\.com\/serve\//, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Bedankt! Check je mailbox en bevestig je inschrijving om je sample te ontvangen.',
          redirect: null
        })
      });
    });

    await page.goto('/sample-pentest.html');

    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    await page.locator('#EMAIL').fill('e2e-test@hacksimulator.nl');
    await page.locator('#sib-form button[type="submit"]').click();

    // Wacht tot success panel zichtbaar wordt (brevo-submit.js → MutationObserver tick)
    await expect(page.locator('#success-message')).toBeVisible();

    // Na succes vervangt de bevestiging het formulier: velden + knop verborgen,
    // kaart krijgt .newsletter-submitted (verbergt stale titel/intro via CSS).
    await expect(page.locator('#sib-form')).toBeHidden();
    await expect(page.locator('#sample-form')).toHaveClass(/newsletter-submitted/);

    // Same-origin download-knop verschijnt in het panel (omzeilt Brevo's tracking-404 op mobiel)
    const downloadCta = page.locator('#success-message a[data-lead-download="pentest"]');
    await expect(downloadCta).toBeVisible();
    await expect(downloadCta).toHaveAttribute('href', '/assets/samples/pentest-playbook-sample.pdf?v=2');

    const calls = await page.evaluate(() => window.__gtagCalls);
    const newsletterEvent = calls.find(c => c[0] === 'event' && c[1] === 'newsletter_signup');
    const leadMagnetEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_signup');

    expect(newsletterEvent).toBeDefined();
    expect(newsletterEvent[2]).toMatchObject({ location: 'sample_pentest' });

    expect(leadMagnetEvent).toBeDefined();
    expect(leadMagnetEvent[2]).toMatchObject({
      sample_id: 'pentest',
      location: 'sample_pentest'
    });
  });

  test('form submit met error-response toont error panel', async ({ page }) => {
    await page.route(/sibforms\.com\/serve\//, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Er ging iets mis. Probeer het opnieuw.'
        })
      });
    });

    await page.goto('/sample-pentest.html');
    await page.locator('#EMAIL').fill('error-case@hacksimulator.nl');
    await page.locator('#sib-form button[type="submit"]').click();

    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#success-message')).not.toBeVisible();
  });

  test('sample-pentest entry zit in sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    expect(xml).toContain('https://hacksimulator.nl/sample-pentest.html');
  });

  test('sample-download pagina rendert download-knop + cross-sell + noindex', async ({ page }) => {
    await page.goto('/sample-download.html');

    await expect(page.locator('h1')).toContainText('sample staat klaar');

    // Same-origin download-knop (geen Brevo-link → werkt op mobiel)
    const downloadCta = page.locator('a[data-lead-download="pentest"]');
    await expect(downloadCta).toBeVisible();
    await expect(downloadCta).toHaveAttribute('href', '/assets/samples/pentest-playbook-sample.pdf?v=2');

    // Cross-sell naar het volledige Playbook (Gumroad)
    const crossSell = page.locator('a[data-product-id="wmvpx"]');
    await expect(crossSell).toBeVisible();
    await expect(crossSell).toHaveAttribute('href', /gumroad\.com\/l\/wmvpx/);

    // Post-conversie pagina: noindex
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('sample-download zit NIET in sitemap (noindex post-conversie pagina)', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xml = await response.text();
    expect(xml).not.toContain('sample-download');
  });

  test('download-knop firet lead_magnet_download event', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('hacksim_analytics_consent', 'true');
    });

    await page.route(/sibforms\.com\/serve\//, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Gelukt!' })
      });
    });

    await page.goto('/sample-pentest.html');
    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    await page.locator('#EMAIL').fill('dl-test@hacksimulator.nl');
    await page.locator('#sib-form button[type="submit"]').click();
    await expect(page.locator('#success-message')).toBeVisible();

    // Voorkom echte download/navigatie; delegated listener (document, bubble) vuurt nog steeds
    await page.evaluate(() => {
      document.querySelector('a[data-lead-download]')
        .addEventListener('click', e => e.preventDefault(), { capture: true });
    });
    await page.locator('#success-message a[data-lead-download="pentest"]').click();

    const calls = await page.evaluate(() => window.__gtagCalls);
    const dlEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_download');
    expect(dlEvent).toBeDefined();
    expect(dlEvent[2]).toMatchObject({
      sample_id: 'pentest',
      location: 'sample_success_panel'
    });
  });

});
