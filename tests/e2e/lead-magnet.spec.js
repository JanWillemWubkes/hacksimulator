// E2E Tests voor Lead Magnets (sample-pentest + sample-juridisch landing pages + CTAs)
// Tests de happy path: landing rendert, CTAs navigeren, success-panel firet GA4 events
//
// De twee sample-pagina's zijn structurele tweelingen: zelfde markup, andere inhoud.
// Daarom draaien de gedeelde scenario's geparametriseerd over SAMPLES i.p.v. dubbel
// uitgeschreven. Sessie 212: juridisch had nul dekking, waardoor twee bugs maanden
// onzichtbaar bleven (verkeerde download-bestandsnaam + verkeerde welkomstmail).

import { test, expect } from './fixtures.js';

// Elke lead magnet heeft zijn eigen Brevo-formulier. Dat is geen stijlkeuze: de
// welkomst-automations draaien op een Form submitted-trigger, dus een gedeeld
// formulier maakt de instromen ononderscheidbaar en levert de verkeerde mail.
// Tot Sessie 212 deelde juridisch het pentest-formulier — vandaar de kruiscontrole
// in 'funnel-scheiding' hieronder.
const SAMPLES = [
  {
    id: 'pentest',
    naam: 'Sample Pentest',
    pad: '/sample-pentest.html',
    h1: 'Pentest Playbook',
    kaarten: ['Voorbereiding', 'verkennen', '6 fasen'],
    location: 'sample_pentest',
    pdf: '/assets/samples/pentest-playbook-sample.pdf?v=2',
    bestandsnaam: 'pentest-playbook-sample.pdf',
    downloadLocation: 'sample_success_panel',
    formToken: /sibforms\.com\/serve\/MUIFACJ0/,
    magnetId: 'pentest_sample',
    gidsenLocation: 'gidsen_pentest_sample'
  },
  {
    id: 'juridisch',
    naam: 'Sample Juridisch',
    pad: '/sample-juridisch.html',
    h1: 'juridische gids',
    kaarten: ['wet verbiedt', 'wél mag', 'meld je een lek'],
    location: 'sample_juridisch',
    pdf: '/assets/samples/juridische-gids-sample.pdf?v=2',
    bestandsnaam: 'juridische-gids-sample.pdf',
    downloadLocation: 'sample_juridisch_success_panel',
    formToken: /sibforms\.com\/serve\/MUIFAGIf/,
    magnetId: 'juridisch_sample',
    gidsenLocation: 'gidsen_juridisch_sample'
  }
];

// Brevo-POST onderscheppen zodat er nooit een echt contact wordt aangemaakt
async function mockBrevoSuccess(page) {
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
}

async function geefAnalyticsConsent(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('hacksim_analytics_consent', 'true');
  });
}

async function spyOpGtag(page) {
  await page.evaluate(() => {
    window.__gtagCalls = [];
    window.gtag = (...args) => window.__gtagCalls.push(args);
  });
}

for (const sample of SAMPLES) {
  test.describe(`Lead Magnet — ${sample.naam}`, () => {

    test('landing page rendert hero, preview cards en Brevo form', async ({ page }) => {
      await page.goto(sample.pad);

      // Hero
      await expect(page.locator('h1')).toContainText(sample.h1);
      await expect(page.locator('.eyebrow-badge')).toContainText('Gratis Sample');

      // Preview cards (3 stuks)
      const cards = page.locator('section.page-section .feature-card');
      await expect(cards).toHaveCount(3);
      for (const [i, tekst] of sample.kaarten.entries()) {
        await expect(cards.nth(i)).toContainText(tekst);
      }

      // Brevo form aanwezig, met het formulier dat bij déze sample hoort
      const form = page.locator('#sib-form');
      await expect(form).toBeVisible();
      await expect(form).toHaveAttribute('action', sample.formToken);
      await expect(page.locator('#EMAIL')).toBeVisible();

      // Tracking attribute voor newsletter-tracking.js
      await expect(page.locator(`[data-newsletter-location="${sample.location}"]`)).toBeVisible();
    });

    test('success panel toggle firet newsletter_signup + lead_magnet_signup events', async ({ page }) => {
      await geefAnalyticsConsent(page);
      await page.goto(sample.pad);

      // Spy op gtag direct na pagina-load (newsletter-tracking.js initialiseert MutationObserver)
      await spyOpGtag(page);

      // Trigger success panel (Brevo zou dit doen na succesvol form-submit)
      await page.evaluate(() => {
        document.getElementById('success-message').style.display = 'block';
      });

      // MutationObserver heeft een tick nodig
      await page.waitForTimeout(200);

      const calls = await page.evaluate(() => window.__gtagCalls);
      const newsletterEvent = calls.find(c => c[0] === 'event' && c[1] === 'newsletter_signup');
      const leadMagnetEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_signup');

      expect(newsletterEvent).toBeDefined();
      expect(newsletterEvent[2]).toMatchObject({ location: sample.location });

      expect(leadMagnetEvent).toBeDefined();
      expect(leadMagnetEvent[2]).toMatchObject({
        sample_id: sample.id,
        location: sample.location
      });
    });

    test('form submit met mocked Brevo response toggelt success panel + firet GA4 events', async ({ page }) => {
      await geefAnalyticsConsent(page);
      await mockBrevoSuccess(page);

      await page.goto(sample.pad);
      await spyOpGtag(page);

      await page.locator('#EMAIL').fill(`e2e-${sample.id}@hacksimulator.nl`);
      await page.locator('#sib-form button[type="submit"]').click();

      // Wacht tot success panel zichtbaar wordt (brevo-submit.js → MutationObserver tick)
      await expect(page.locator('#success-message')).toBeVisible();

      // Na succes vervangt de bevestiging het formulier: velden + knop verborgen,
      // kaart krijgt .newsletter-submitted (verbergt stale titel/intro via CSS).
      await expect(page.locator('#sib-form')).toBeHidden();
      await expect(page.locator('#sample-form')).toHaveClass(/newsletter-submitted/);

      // Same-origin download-knop verschijnt in het panel (omzeilt Brevo's tracking-404 op mobiel)
      const downloadCta = page.locator(`#success-message a[data-lead-download="${sample.id}"]`);
      await expect(downloadCta).toBeVisible();
      await expect(downloadCta).toHaveAttribute('href', sample.pdf);

      // Sessie 212: expliciete download-naam, zodat het niet uitmaakt of de browser
      // het download-attribuut of het Content-Disposition-filename laat winnen
      await expect(downloadCta).toHaveAttribute('download', sample.bestandsnaam);

      const calls = await page.evaluate(() => window.__gtagCalls);
      const newsletterEvent = calls.find(c => c[0] === 'event' && c[1] === 'newsletter_signup');
      const leadMagnetEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_signup');

      expect(newsletterEvent).toBeDefined();
      expect(newsletterEvent[2]).toMatchObject({ location: sample.location });

      expect(leadMagnetEvent).toBeDefined();
      expect(leadMagnetEvent[2]).toMatchObject({
        sample_id: sample.id,
        location: sample.location
      });
    });

    test('download-knop firet lead_magnet_download event', async ({ page }) => {
      await geefAnalyticsConsent(page);
      await mockBrevoSuccess(page);

      await page.goto(sample.pad);
      await spyOpGtag(page);

      await page.locator('#EMAIL').fill(`dl-${sample.id}@hacksimulator.nl`);
      await page.locator('#sib-form button[type="submit"]').click();
      await expect(page.locator('#success-message')).toBeVisible();

      // Voorkom echte download/navigatie; delegated listener (document, bubble) vuurt nog steeds
      await page.evaluate(() => {
        document.querySelector('a[data-lead-download]')
          .addEventListener('click', e => e.preventDefault(), { capture: true });
      });
      await page.locator(`#success-message a[data-lead-download="${sample.id}"]`).click();

      const calls = await page.evaluate(() => window.__gtagCalls);
      const dlEvent = calls.find(c => c[0] === 'event' && c[1] === 'lead_magnet_download');
      expect(dlEvent).toBeDefined();
      expect(dlEvent[2]).toMatchObject({
        sample_id: sample.id,
        location: sample.downloadLocation
      });
    });

    test('landing page zit in sitemap', async ({ request }) => {
      const response = await request.get('/sitemap.xml');
      expect(response.ok()).toBe(true);
      const xml = await response.text();
      expect(xml).toContain(`https://hacksimulator.nl${sample.pad}`);
    });

  });
}

test.describe('Lead Magnets — download-bestandsnamen (productie-headers)', () => {

  // _headers is een Netlify-feature: een lokale statische server stuurt geen
  // Content-Disposition mee. Tegen een lokale BASE_URL zou deze test vals-rood zijn.
  const BASE = process.env.BASE_URL || 'https://hacksimulator.nl';
  const TEGEN_PRODUCTIE = /hacksimulator\.nl/.test(BASE);

  for (const sample of SAMPLES) {
    test(`${sample.bestandsnaam} wordt onder zijn eigen naam geserveerd`, async ({ request }) => {
      test.skip(!TEGEN_PRODUCTIE, '_headers is Netlify-only — lokale server zet geen Content-Disposition');

      const response = await request.get(sample.pdf);
      expect(response.ok()).toBe(true);

      // Sessie 212: één wildcard-regel zette filename="pentest-playbook-sample.pdf" voor
      // de héle map, dus wie de juridische sample downloadde kreeg de pentest-naam.
      const disposition = response.headers()['content-disposition'];
      expect(disposition, `geen Content-Disposition op ${sample.pdf}`).toBeTruthy();
      expect(disposition).toContain(`filename="${sample.bestandsnaam}"`);

      // De inline-keuze is bewust (iOS-webviews kunnen een geforceerde download niet aan)
      expect(disposition).toContain('inline');
    });
  }

});

test.describe('Lead Magnets — funnel-scheiding', () => {

  test('elke sample post naar een ánder Brevo-formulier', async ({ page }) => {
    // De kern van de Sessie 212-bug: één gedeeld formulier = één automation =
    // iedereen krijgt dezelfde welkomstmail, ongeacht welk sample hij aanvroeg.
    const acties = [];
    for (const sample of SAMPLES) {
      await page.goto(sample.pad);
      acties.push(await page.locator('#sib-form').getAttribute('action'));
    }

    for (const actie of acties) {
      expect(actie).toMatch(/sibforms\.com\/serve\//);
    }
    expect(new Set(acties).size, 'twee samples delen hetzelfde formulier — Brevo kan de instromen dan niet scheiden')
      .toBe(SAMPLES.length);
  });

  test('de homepage-nieuwsbrief staat los van beide sample-funnels', async ({ page }) => {
    await page.goto('/');
    const homepage = await page.locator('#sib-form').getAttribute('action');

    for (const sample of SAMPLES) {
      expect(homepage, `homepage deelt het formulier van ${sample.id}`).not.toMatch(sample.formToken);
    }
  });

});

test.describe('Lead Magnets — CTAs vanaf andere pagina\'s', () => {

  test('CTA op nmap-blog navigeert naar /sample-pentest.html', async ({ page }) => {
    await page.goto('/blog/nmap-beginnersgids.html');

    const cta = page.locator('a[data-lead-magnet="pentest_sample"][data-cta-location="blog_nmap_top"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/sample-pentest.html');

    await cta.click();
    await page.waitForURL(/sample-pentest\.html$/);
    await expect(page.locator('h1')).toContainText('Pentest Playbook');
  });

  // Elke betaalde gids met een gratis sample draagt die sample op zijn eigen kaart,
  // waar de koopbeslissing valt. Tot Sessie 213 stond juridisch als tekstlinkje in de
  // kaart en pentest alleen in een los blok onderaan — twee vormen voor één patroon.
  for (const sample of SAMPLES) {
    test(`sample-chip op gidsen.html navigeert naar ${sample.pad}`, async ({ page }) => {
      await page.goto('/gidsen.html');

      const chip = page.locator(
        `a[data-lead-magnet="${sample.magnetId}"][data-cta-location="${sample.gidsenLocation}"]`
      );
      await expect(chip).toBeVisible();
      await expect(chip).toHaveAttribute('href', sample.pad);

      // De chip hoort ín een gids-kaart te staan, niet in een los blok eronder.
      // Token-match, geen substring: `contains(@class,"gids-card")` matcht óók
      // `gids-card-body` en telt dan twee voorouders.
      await expect(
        chip.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " gids-card ")]')
      ).toHaveCount(1);

      await chip.click();
      await page.waitForURL(new RegExp(`${sample.id}\\.html$`));
      await expect(page.locator('h1')).toContainText(sample.h1);
    });
  }

  test('CTA op cybersecurity-tools blog firet lead_magnet_cta_click event', async ({ page }) => {
    // Geef analytics consent vooraf zodat GA4 events daadwerkelijk worden gefired
    await geefAnalyticsConsent(page);

    await page.goto('/blog/cybersecurity-tools.html');

    // Spy op gtag — vervang met collector vóór click
    await spyOpGtag(page);

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

});

test.describe('Lead Magnets — foutafhandeling + post-conversiepagina', () => {

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

});
