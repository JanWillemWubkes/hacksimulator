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
// Die is bewust NIET mee ingeklapt; deze suite bewaakte dat onderscheid.
//
// Sessie 252 (TASKS #88): geen px-grens meer. navbar.js zet html.nav-ingeklapt zodra de
// uitgeklapte nav niet in de balk past (bewaakInklap), voor beide navbars. Twee redenen:
//   - alleen-tekstzoom 200% liet de marketing-nav 359px uitlopen bij een venster van 1280
//     (sessie 244): een px-grens kent de tekst niet;
//   - de terminal-navbar paste níét: op 769-1033px liep hij tot 266px buiten beeld,
//     onbereikbaar want position: fixed. De oude test hier controleerde alleen dat er géén
//     hamburger stond, en bewaakte zo de fout.
// De invariant is daarom: uitgeklapt ⟺ alles past, op één regel, met lucht tot het merk.

import { test, expect } from './fixtures.js';

// Lucht tussen woordmerk en eerste link in de uitgeklapte stand (navbar.js, bewaakInklap).
const MERK_LUCHT = 64;

// Eén pagina per navbar-context: statisch, blog (ander pad naar de CSS) en terminal.
const MARKETING_PAGINAS = ['/gidsen.html', '/index.html', '/over-ons.html', '/blog/nmap-beginnersgids.html'];

// 1280 is de eerste breedte bóven de inklapband en meteen de gangbare 13"-laptop; 1290
// en 1366 zitten erbij omdat het defect van Sessie 236 zich uitstrekte tot 1380 en met
// alleen 1280 en 1440 half onzichtbaar zou zijn gebleven.
// Sessie 252: 1184, 1224, 1232 en 1240 erbij, de buurt van het omslagpunt in drie engines.
const BREEDTES = [375, 700, 820, 1000, 1024, 1180, 1184, 1224, 1232, 1240, 1279, 1280, 1290, 1366, 1440];

async function meetNavbar(page) {
  return page.evaluate(async () => {
    // Wachten op de webfont is niet optioneel: de wrap-detectie hieronder meet
    // tekstbreedtes, en de webfont verschilt genoeg van de fallback om onder parallelle
    // load een vals positief op te leveren. (Was Space Grotesk; sinds Sessie 236 draagt
    // de nav de bodyletter Atkinson Hyperlegible Next.)
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

    const merk = document.querySelector('.landing-nav .nav-brand').getBoundingClientRect();
    const eerste = [...document.querySelectorAll('.landing-nav .nav-links a')].find((a) => a.getClientRects().length);
    return {
      ingeklapt: document.documentElement.classList.contains('nav-ingeklapt'),
      merkLucht: eerste ? eerste.getBoundingClientRect().left - merk.right : null,
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

        // Sessie 236: `gewrapt` werd hierboven al berekend en teruggegeven, maar nergens
        // geasserteerd — een meting die nooit meldt. Daardoor bleef maanden onopgemerkt
        // dat "Over ons" en de CTA op 1280-1287px over twee regels vielen, 70px hoog in
        // een balk van 59px. Precies de gangbare 13"-laptopbreedte, en precies de eerste
        // breedte bóven de inklapband — de band bewaakte zichzelf, niet zijn buur.
        expect(m.gewrapt, `${pad} @${breedte}px: label(s) over twee regels`).toEqual([]);
      }
    });
  }

});

test.describe('Marketing-navbar — omslagpunt hamburger', () => {
  // Idem als hierboven: de omslagpunt-test doorloopt negen breedtes met een navigatie
  // per breedte. Onder drie parallelle browsers haalt Firefox de standaard 30s niet.
  test.describe.configure({ timeout: 120_000 });

  test('uitgeklapt alleen als alles past, anders de hamburger', async ({ page }) => {
    const gezien = { in: 0, uit: 0 };
    for (const breedte of BREEDTES) {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/gidsen.html');
      const m = await meetNavbar(page);

      if (m.ingeklapt) {
        gezien.in++;
        expect(m.hamburger, `@${breedte}px ingeklapt: de hamburger hoort zichtbaar te zijn`).not.toBe('none');
        expect(m.navLinks, `@${breedte}px ingeklapt: de desktop-links horen verborgen te zijn`).toBe('none');
        expect(m.ctaBalk, `@${breedte}px ingeklapt: de CTA hoort in het menu, niet in de balk`).toBe('none');
      } else {
        gezien.uit++;
        expect(m.hamburger, `@${breedte}px uitgeklapt: de hamburger hoort verborgen te zijn`).toBe('none');
        expect(m.navLinks, `@${breedte}px uitgeklapt: de desktop-links horen zichtbaar te zijn`).not.toBe('none');
        expect(m.ctaBalk, `@${breedte}px uitgeklapt: de CTA hoort in de balk te staan`).not.toBe('none');
        expect(m.gewrapt, `@${breedte}px breken nav-labels af: ${m.gewrapt.join(', ')}`).toEqual([]);
        expect(m.merkLucht, `@${breedte}px staat de eerste link te dicht op het merk`).toBeGreaterThanOrEqual(MERK_LUCHT - 0.5);
      }
    }
    // Zelfbewakend: beide standen moeten voorkomen, anders bewijst de lus niets. En de
    // vaste punten: een telefoon klapt altijd in, een gangbaar desktopvenster nooit.
    expect(gezien.in, 'geen enkele breedte ingeklapt: de meting heeft niet gedraaid').toBeGreaterThan(0);
    expect(gezien.uit, 'geen enkele breedte uitgeklapt: de meting heeft niet gedraaid').toBeGreaterThan(0);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/gidsen.html');
    expect((await meetNavbar(page)).ingeklapt, '@375px hoort de nav ingeklapt te zijn').toBe(true);
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto('/gidsen.html');
    expect((await meetNavbar(page)).ingeklapt, '@1440px hoort de nav uitgeklapt te zijn').toBe(false);
  });

  // TASKS #88: bij alleen-tekstzoom groeit de tekst, niet het venster. Nagebootst door de
  // letter van de hele balk (ook het merk) te vergroten; de nav moet dan op hetzelfde
  // venster inklappen in plaats van uit te lopen, en terugkomen als de tekst krimpt.
  test('tekstzoom klapt de nav in op een breed venster (#88)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto('/gidsen.html');
    expect((await meetNavbar(page)).ingeklapt, 'uitgangspunt: uitgeklapt @1440px').toBe(false);

    const zoom = await page.addStyleTag({ content: '.landing-nav-wrapper { font-size: 200%; } .landing-nav-wrapper * { font-size: inherit; }' });
    await expect.poll(async () => (await meetNavbar(page)).ingeklapt, { message: 'tekst 200%: de nav klapt niet in' }).toBe(true);
    const m = await meetNavbar(page);
    expect(m.buitenBeeld, 'tekst 200%: navbar-elementen buiten beeld').toBe(0);
    expect(m.hamburger).not.toBe('none');

    await zoom.evaluate((el) => el.remove());
    await expect.poll(async () => (await meetNavbar(page)).ingeklapt, { message: 'tekst terug: de nav klapt niet weer uit' }).toBe(false);
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

  // Sessie 241: het menu op de homepage sprak Engels ("Features", "FAQ", "DARK", "LIGHT")
  // tegen een publiek dat op Engels afhaakt. Exacte gelijkheid, geen lijst verboden
  // woorden: een denylist bewaakt alleen de woorden die we al kenden. "Blog" en "Commands"
  // zijn paginanamen en ingeburgerde leenwoorden, geen onvertaalde UI.
  test('het mobiele menu op de homepage is Nederlands', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.locator('.landing-nav-wrapper .navbar-toggle').click();
    const menu = page.locator('#landing-mobile-menu');
    await expect(menu).toBeVisible();

    const m = await menu.evaluate((el) => ({
      links: [...el.querySelectorAll('.navbar-links a')]
        .filter((a) => a.getClientRects().length)
        .map((a) => a.innerText.trim()),
      thema: [...el.querySelectorAll('.toggle-label')].map((s) => s.innerText.trim()),
      themaNaam: (el.querySelector('.theme-toggle') || {}).getAttribute?.('aria-label')
    }));

    expect(m.links.length, 'geen menulinks gevonden: de meting heeft niet gedraaid').toBeGreaterThan(0);
    expect(m.links).toEqual(['Start de simulator', 'Het verschil', 'Leerpad', 'Vragen',
      'Blog', 'Commands', 'Gidsen', 'Woordenlijst', 'Over ons']);
    // Sessie 252: zinskapitaal in de letter van het blad (was 11px in kapitalen).
    expect(m.thema).toEqual(['Donker', 'Licht']);
    expect(m.themaNaam).toMatch(/^Wissel naar (donker|licht) thema$/);
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

      // Sessie 252: de chrome staat sitebreed in het affiche. Daar is elke interactieve tekst
      // inkt en onderscheidt de CTA zich door gewicht, niet door een tweede kleur (zo staat
      // hij op index sinds sessie 236). Het neongroen hoorde bij de oude wereld.
      expect(kleuren.cta.kleur, 'CTA hoort inkt te zijn, zoals elke menulink').toBe(kleuren.gewoon.kleur);
      expect(kleuren.cta.kleur, 'CTA draagt nog het neongroen van de oude wereld').not.toBe('rgb(159, 239, 0)');
      expect(Number(kleuren.cta.gewicht), 'CTA is niet zwaarder dan een gewone menulink').toBeGreaterThan(Number(kleuren.gewoon.gewicht));
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

test.describe('Terminal-navbar: dezelfde inklapregel', () => {

  // Sessie 252: deze test heette "terminal houdt zijn inline nav tussen 769 en 1279px" en
  // controleerde alleen dat er géén hamburger stond. Ondertussen liep de navbar op
  // 769-1033px tot 266px buiten beeld (position: fixed, dus niet eens scrollbaar). Nu
  // dezelfde invariant als de marketing-navbar: uitgeklapt alleen als alles past.
  test('niets buiten beeld, en uitgeklapt alleen als alles past', async ({ page }) => {
    test.setTimeout(120_000);
    const gezien = { in: 0, uit: 0 };
    for (const breedte of [375, 769, 820, 900, 1000, 1024, 1100, 1280, 1440]) {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto('/terminal.html');
      const m = await page.evaluate(async () => {
        await document.fonts.ready;
        const vw = document.documentElement.clientWidth;
        const nav = document.querySelector('#navbar');
        const toggle = nav.querySelector('.navbar-toggle');
        const zichtbaar = [...nav.querySelectorAll('a, button')].filter((e) => e.checkVisibility() && !e.closest('.navbar-menu.active'));
        return {
          ingeklapt: document.documentElement.classList.contains('nav-ingeklapt'),
          hamburger: getComputedStyle(toggle).display,
          buitenBeeld: zichtbaar.filter((e) => e.getBoundingClientRect().right > vw + 0.5).map((e) => e.className || e.textContent.trim()),
          links: zichtbaar.filter((e) => e.closest('.navbar-links')).length,
        };
      });
      expect(m.buitenBeeld, `terminal @${breedte}px: navbar-element(en) buiten beeld`).toEqual([]);
      if (m.ingeklapt) {
        gezien.in++;
        expect(m.hamburger, `terminal @${breedte}px ingeklapt zonder hamburger`).not.toBe('none');
        expect(m.links, `terminal @${breedte}px ingeklapt, maar links in de balk`).toBe(0);
      } else {
        gezien.uit++;
        expect(m.hamburger, `terminal @${breedte}px uitgeklapt met hamburger`).toBe('none');
        expect(m.links, `terminal @${breedte}px uitgeklapt zonder links`).toBeGreaterThan(0);
      }
    }
    expect(gezien.in, 'terminal: geen enkele breedte ingeklapt').toBeGreaterThan(0);
    expect(gezien.uit, 'terminal: geen enkele breedte uitgeklapt').toBeGreaterThan(0);
  });

});
