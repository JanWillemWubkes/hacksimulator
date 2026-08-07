// E2E Tests voor de inklapbare marketing-navbar (Sessie 213)
//
// De marketing-navbar klapte pas onder 768px in, maar past daar lang niet: gemeten op
// productie 161px horizontale overflow @1000px en 341px @820px — op élke
// marketingpagina en op alle blogposts, die dezelfde navbar gebruiken.
//
// Twee grenzen, binair gezocht: vanaf 1147px loopt er niets meer buiten de balk, maar
// pas vanaf 1264px (Chromium/Firefox) resp. 1266px (WebKit) breekt er ook niets meer af.
// Daaronder "past" de nav puur doordat "Over Ons" en "Start Simulator" afbreken. De band
// loopt daarom tot 1279px (marge tot de gangbare 1280px-laptop) + een wrap-assertie.
//
// De terminal heeft een eigen, smallere navbar (menu 738px @1000px) die wél paste.
// Die is bewust NIET mee ingeklapt; deze suite bewaakt dat onderscheid.

import { test, expect } from './fixtures.js';

const INKLAP_TOT = 1279; // laatste breedte waarop de hamburger hoort te staan

// Eén pagina per navbar-context: statisch, blog (ander pad naar de CSS) en terminal.
const MARKETING_PAGINAS = ['/gidsen.html', '/index.html', '/over-ons.html', '/blog/nmap-beginnersgids.html'];

const BREEDTES = [375, 700, 820, 1000, 1024, 1180, 1279, 1280, 1440];

async function meetNavbar(page) {
  return page.evaluate(async () => {
    // Wachten op de webfont is niet optioneel: de wrap-detectie hieronder meet
    // tekstbreedtes, en Space Grotesk verschilt genoeg van de fallback om onder
    // parallelle load een vals positief op te leveren.
    await document.fonts.ready;

    const nav = document.querySelector('.landing-nav');
    const links = document.querySelector('.landing-nav .nav-links');
    const toggle = document.querySelector('.landing-nav-wrapper .navbar-toggle');
    const cta = document.querySelector('.landing-nav .btn-cta-nav');
    const vw = document.documentElement.clientWidth;

    // Bewust binnen de navbar gemeten en niet op document-niveau. Twee meetfouten
    // die dat zou opleveren, allebei nagemeten en allebei niet-navbar:
    //   - documentElement.scrollWidth geeft in Firefox 12px op blog@820px terwijl geen
    //     enkel element buiten beeld staat (scrollbar-boekhouding).
    //   - een clip-verborgen <th> uit .blog-table--stacked rapporteert wél een rect
    //     buiten de viewport, ook op productie, en veroorzaakt geen scroll.
    const buitenBeeld = [...nav.parentElement.querySelectorAll('*')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > vw + 0.5;
    }).length;

    // Wrap-detectie op hoogte, niet op getClientRects(): .nav-links is een flexbox,
    // dus elke <a> is een geblokkeerd flex-item en tekst over twee regels levert nog
    // steeds precies één rect op. Deze check bestaat omdat navPast hierin blind is —
    // tussen 1147 en ~1265px "paste" de nav puur doordat labels afbraken.
    const gewrapt = [...document.querySelectorAll('.landing-nav .nav-links a, .landing-nav .btn-cta-nav')]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.display === 'none') return false;
        const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
        const inhoud = el.getBoundingClientRect().height
          - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom);
        return Math.round(inhoud / lh) > 1;
      })
      .map((el) => el.textContent.trim());

    return {
      buitenBeeld,
      gewrapt,
      navPast: nav.scrollWidth <= nav.clientWidth + 1,
      navLinks: getComputedStyle(links).display,
      hamburger: getComputedStyle(toggle).display,
      ctaBalk: getComputedStyle(cta).display
    };
  });
}

test.describe('Marketing-navbar — geen horizontale overflow', () => {
  // Zeven breedtes x navigatie is in Firefox trager dan de standaard 30s.
  test.describe.configure({ timeout: 120_000 });

  for (const pad of MARKETING_PAGINAS) {
    test(`${pad} past op elke breedte`, async ({ page }) => {
      for (const breedte of BREEDTES) {
        await page.setViewportSize({ width: breedte, height: 800 });
        await page.goto(pad);
        const m = await meetNavbar(page);

        expect(m.buitenBeeld, `${pad} @${breedte}px: ${m.buitenBeeld} navbar-element(en) buiten beeld`).toBe(0);
        expect(m.navPast, `${pad} @${breedte}px: navbar-inhoud past niet in de balk`).toBe(true);
      }
    });
  }

});

test.describe('Marketing-navbar — omslagpunt hamburger', () => {
  // Idem als hierboven: de omslagpunt-test doorloopt negen breedtes met een navigatie
  // per breedte. Onder drie parallelle browsers haalt Firefox de standaard 30s niet.
  test.describe.configure({ timeout: 120_000 });

  test('hamburger tot en met 1279px, desktop-links vanaf 1280px', async ({ page }) => {
    for (const breedte of BREEDTES) {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/gidsen.html');
      const m = await meetNavbar(page);

      if (breedte <= INKLAP_TOT) {
        expect(m.hamburger, `@${breedte}px hoort de hamburger zichtbaar te zijn`).not.toBe('none');
        expect(m.navLinks, `@${breedte}px horen de desktop-links verborgen te zijn`).toBe('none');
        expect(m.ctaBalk, `@${breedte}px hoort de CTA in het menu te zitten, niet in de balk`).toBe('none');
      } else {
        expect(m.hamburger, `@${breedte}px hoort de hamburger verborgen te zijn`).toBe('none');
        expect(m.navLinks, `@${breedte}px horen de desktop-links zichtbaar te zijn`).not.toBe('none');
        expect(m.ctaBalk, `@${breedte}px hoort de CTA in de balk te staan`).not.toBe('none');
        // Zichtbaar zijn is niet genoeg: de labels moeten ook op één regel passen.
        expect(m.gewrapt, `@${breedte}px breken nav-labels af: ${m.gewrapt.join(', ')}`).toEqual([]);
      }
    }
  });

  test('menu opent als volledig overlay in de nieuwe band (1000px)', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto('/gidsen.html');

    const menu = page.locator('#landing-mobile-menu');
    await expect(menu).toBeHidden();

    await page.locator('.landing-nav-wrapper .navbar-toggle').click();
    await expect(menu).toBeVisible();

    const overlay = await menu.evaluate((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        position: s.position,
        flexDirection: s.flexDirection,
        top: Math.round(r.top),
        left: Math.round(r.left),
        breedte: Math.round(r.width),
        viewportBreedte: document.documentElement.clientWidth,
        bodyOverflow: getComputedStyle(document.body).overflow
      };
    });

    expect(overlay.position, 'menu hoort een fixed overlay te zijn, geen inline rij').toBe('fixed');
    expect(overlay.flexDirection).toBe('column');
    expect(overlay.left).toBe(0);
    expect(overlay.breedte).toBe(overlay.viewportBreedte);
    expect(overlay.bodyOverflow, 'achtergrond mag niet meescrollen').toBe('hidden');

    // Alle zes menu-links bereikbaar
    await expect(menu.locator('.navbar-links a')).toHaveCount(6);
  });

  // "Start Simulator" is de primaire conversie-actie. In de desktopbalk is dat een
  // neongroene knop; in het menu was het tot Sessie 213 niet van "Woordenlijst" te
  // onderscheiden. Oorzaak: main.css `.navbar-links > li:not(.navbar-dropdown) > a`
  // (0,2,2) versloeg `.navbar-links .mobile-cta-link` (0,2,0) — gelijk aantal klassen,
  // maar twee type-selectors gaven de doorslag. Beide breedtes getest: 375px valt onder
  // mobile.css, 1000px onder de inklapband in landing.css.
  for (const breedte of [375, 1000]) {
    test(`primaire CTA in het menu is onderscheidend @${breedte}px`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/gidsen.html');
      await page.locator('.landing-nav-wrapper .navbar-toggle').click();

      const kleuren = await page.locator('#landing-mobile-menu').evaluate((menu) => {
        const cta = menu.querySelector('.mobile-cta-link');
        const gewoon = [...menu.querySelectorAll('.navbar-links a')]
          .find((a) => !a.classList.contains('mobile-cta-link'));
        const lees = (el) => ({ kleur: getComputedStyle(el).color, gewicht: getComputedStyle(el).fontWeight });
        return {
          cta: lees(cta),
          gewoon: lees(gewoon),
          neon: getComputedStyle(document.documentElement).getPropertyValue('--color-cta-dark-frame').trim()
        };
      });

      expect(kleuren.cta.kleur, 'CTA heeft dezelfde kleur als een gewone menulink')
        .not.toBe(kleuren.gewoon.kleur);
      expect(kleuren.cta.kleur, 'CTA hoort de neon dark-frame-kleur te dragen').toBe('rgb(159, 239, 0)');
      expect(Number(kleuren.cta.gewicht)).toBeGreaterThan(Number(kleuren.gewoon.gewicht));
    });
  }

  test('menu sluit met Escape en via de toggle', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto('/gidsen.html');

    const menu = page.locator('#landing-mobile-menu');
    const toggle = page.locator('.landing-nav-wrapper .navbar-toggle');

    await toggle.click();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(menu).toBeVisible();
    await toggle.click();
    await expect(menu).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

});

test.describe('Terminal-navbar blijft ongemoeid', () => {

  // De terminal heeft een eigen navbar-variant die in deze band wél past. Zou hij
  // meeklappen, dan zouden gebruikers op een 1024px-laptop onnodig een hamburger zien.
  test('terminal houdt zijn inline nav tussen 769 en 1279px', async ({ page }) => {
    for (const breedte of [820, 1000, 1279]) {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/terminal.html');

      const toggleDisplay = await page
        .locator('#navbar .navbar-toggle')
        .evaluate((el) => getComputedStyle(el).display);

      expect(toggleDisplay, `terminal @${breedte}px hoort géén hamburger te tonen`).toBe('none');
    }
  });

});
