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
    await expect(cards.nth(0)).toContainText('Reconnaissance');
    await expect(cards.nth(1)).toContainText('Command-cheatsheet');
    await expect(cards.nth(2)).toContainText('Beslisboom');

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

  test('sample-pentest entry zit in sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    expect(xml).toContain('https://hacksimulator.nl/sample-pentest.html');
  });

});
