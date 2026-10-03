// De gedeelde laag van het affiche (sessie 252, TASKS #85)
//
// styles/affiche-basis.css zet navbar, footer en consentbanner op elke pagina in het affiche,
// terwijl de pagina's zelf één voor één migreren. Drie dingen bewaakt deze spec:
//
// 1. De chrome is overal dezelfde als op index: gemeten op de gerenderde stijl van navbar en
//    footer, in beide thema's, over de hele paginalijst (helpers/paginas.js). De juridische
//    pagina's hebben geen van beide en verantwoorden zich als uitzondering.
// 2. Het hertokenen gebeurt op de componentwortel, niet op :root. De oude wereld leest dezelfde
//    tokens in pagina-inhoud; een pagina die nog niet gemigreerd is, houdt dus haar eigen grond.
//    Een pagina die migreert, zet zichzelf in GEMIGREERD: dat is de plek waar de uitzondering
//    zich verantwoordt.
// 3. De app-navbar van de terminal staat op dezelfde rail en heeft dezelfde schakelaar als de
//    marketing-navbar.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';

const ZONDER_CHROME = ['/assets/legal/privacy.html', '/assets/legal/terms.html', '/assets/legal/cookies.html'];
const GEMIGREERD = ['/index.html'];
const MET_CHROME = PAGINAS.filter((p) => !ZONDER_CHROME.includes(p));

// De grond van de oude wereld (main.css), per thema. Hier en niet uit de CSS gelezen: als
// iemand het token op :root hertokent, moet deze waarde juist níét meebewegen.
const OUDE_GROND = { light: 'rgb(248, 248, 248)', dark: 'rgb(13, 17, 23)' };

// Wat de chrome op index is, het referentiepunt. Vast in de spec, zodat ook index zelf niet
// stil kan wegdrijven: papier/inkt, footer #111 in licht en #000 in donker.
const VERWACHT = {
  light: { navBg: 'rgb(239, 239, 236)', link: 'rgb(17, 17, 17)', fBg: 'rgb(17, 17, 17)', fTekst: 'rgb(239, 239, 236)', fDim: 'rgb(176, 176, 171)' },
  dark: { navBg: 'rgb(17, 17, 17)', link: 'rgb(239, 239, 236)', fBg: 'rgb(0, 0, 0)', fTekst: 'rgb(239, 239, 236)', fDim: 'rgb(176, 176, 171)' },
};

async function meetChrome(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
    const nav = cs('.landing-nav-wrapper') || cs('#navbar');
    const merk = cs('.nav-brand');
    const link = cs('.landing-nav .nav-links a:not(.active)') || cs('#navbar .navbar-links > li > a');
    const footer = cs('footer.landing-footer');
    return {
      navBg: nav && nav.backgroundColor,
      merkFont: merk && merk.fontFamily.split(',')[0].replace(/"/g, ''),
      merkGewicht: merk && merk.fontWeight,
      link: link && link.color,
      fBg: footer && footer.backgroundColor,
      fTekst: cs('footer.landing-footer .footer-column a') && cs('footer.landing-footer .footer-column a').color,
      fDim: cs('footer.landing-footer .footer-tagline') && cs('footer.landing-footer .footer-tagline').color,
      grond: getComputedStyle(document.body).backgroundColor,
    };
  });
}

for (const thema of ['light', 'dark']) {
  test(`navbar en footer zijn op elke pagina die van index (${thema})`, async ({ page }) => {
    test.setTimeout(MET_CHROME.length * 4000 + 20_000);
    await page.addInitScript((t) => {
      localStorage.setItem('theme', t);
      localStorage.setItem('hacksim_legal_accepted', 'true');
      localStorage.setItem('hacksim_analytics_consent', '{"necessary":true,"analytics":false}');
    }, thema);
    const fout = [];
    let gemeten = 0;
    for (const pad of MET_CHROME) {
      await page.goto(pad);
      await page.waitForSelector('footer.landing-footer');
      const m = await meetChrome(page);
      gemeten++;
      for (const k of Object.keys(VERWACHT[thema])) {
        if (m[k] !== VERWACHT[thema][k]) fout.push(`${pad} ${k}: ${m[k]} (verwacht ${VERWACHT[thema][k]})`);
      }
      if (m.merkFont !== 'Archivo' || m.merkGewicht !== '800') fout.push(`${pad} woordmerk: ${m.merkFont} ${m.merkGewicht}`);
      // De grens van de laag: een pagina die nog niet gemigreerd is, houdt haar grond.
      if (!GEMIGREERD.includes(pad) && m.grond !== OUDE_GROND[thema]) {
        fout.push(`${pad} grond: ${m.grond}; de laag heeft de pagina zelf geraakt (hertokend op :root?)`);
      }
    }
    // Zelfbewakend: de populatie is de paginalijst, niet wat toevallig laadde.
    expect(gemeten, 'niet elke pagina met chrome is gemeten').toBe(MET_CHROME.length);
    expect(MET_CHROME.length, 'de paginalijst is leeg of bijna leeg').toBeGreaterThan(20);
    expect(fout).toEqual([]);
  });
}

test('de inhoud van een blogpost leest de oude tokens nog (hertokenen op de wortel)', async ({ page }) => {
  // .blog-post-footer is pagina-inhoud die --color-bg-footer leest, net als de sitefooter.
  // Hertokent iemand op :root, dan wordt dit blok mee zwart en verdwijnt de grens.
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/blog/welkom.html');
  const m = await page.evaluate(() => ({
    blok: getComputedStyle(document.querySelector('.blog-post-footer')).backgroundColor,
    footer: getComputedStyle(document.querySelector('footer.landing-footer')).backgroundColor,
  }));
  expect(m.footer, 'de sitefooter staat niet in het affiche').toBe('rgb(17, 17, 17)');
  expect(m.blok, 'de inhoud van de blogpost is meegekleurd met de chrome').toBe('rgb(26, 26, 26)');
});

// Finish review s252: de onderstreping stond alleen op de blog. Elke navbestemming draagt hem.
test('elke navbestemming markeert zichzelf', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Budget per navigatie (meten-en-guards §32): los ±2s per pagina, onder zes workers in
  // Firefox gingen zes navigaties over de standaard 30s.
  test.setTimeout(5 * 8000 + 15_000);
  const BESTEMMINGEN = { '/blog/welkom.html': 'Blog', '/commands/index.html': 'Commands', '/gidsen.html': 'Gidsen', '/woordenlijst.html': 'Woordenlijst', '/over-ons.html': 'Over ons' };
  const fout = [];
  for (const [pad, naam] of Object.entries(BESTEMMINGEN)) {
    await page.goto(pad);
    await page.waitForSelector('.landing-nav .nav-links a');
    const m = await page.evaluate(() => [...document.querySelectorAll('.landing-nav .nav-links a[aria-current="page"]')]
      .map((a) => ({ tekst: a.textContent.trim(), lijn: getComputedStyle(a).textDecorationLine })));
    if (m.length !== 1 || m[0].tekst !== naam || m[0].lijn !== 'underline') fout.push(`${pad}: ${JSON.stringify(m)}`);
  }
  expect(fout).toEqual([]);
});

// Finish review s252: navlinks hadden een blauwe ring met radius (landing.css won). Elk focusbaar
// element in de chrome draagt de rode ring, op een pagina in de oude wereld, in beide thema's.
for (const thema of ['light', 'dark']) {
  test(`elk focusbaar element in de chrome toont de rode ring (${thema})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((t) => localStorage.setItem('theme', t), thema);
    await page.goto('/gidsen.html');
    await page.waitForSelector('.cookie-banner.active');
    // Transities bevriezen: knoppen dragen transition: all, en zonder bevriezing meet je de ring
    // halverwege zijn overgang naar rood (gemeten: rgb(181,16,33) en dergelijke).
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important}' });
    const n = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.landing-nav-wrapper a[href], .landing-nav-wrapper button, footer.landing-footer a[href], footer.landing-footer button, .cookie-banner a[href], .cookie-banner button')]
        .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
      els.forEach((e, i) => { e.dataset.chromeFocus = i; });
      return els.length;
    });
    test.setTimeout(n * 2 * 400 + 20_000);
    const mis = [];
    let getoetst = 0;
    for (let i = 0; i < n; i++) {
      const el = page.locator(`[data-chrome-focus="${i}"]`);
      await el.focus();
      await page.keyboard.press('Shift');
      const m = await el.evaluate((e) => ({ fv: e.matches(':focus-visible'), s: getComputedStyle(e).outlineStyle, k: getComputedStyle(e).outlineColor, r: getComputedStyle(e).borderTopLeftRadius, naam: e.getAttribute('aria-label') || e.textContent.trim().slice(0, 24) }));
      if (!m.fv) continue;
      getoetst++;
      if (m.s === 'none' || m.k !== 'rgb(204, 10, 30)' || m.r !== '0px') mis.push(`${m.naam}: ${m.s} ${m.k} radius ${m.r}`);
    }
    expect(getoetst, 'te weinig focusbare elementen getoetst: de meting heeft niet gedraaid').toBeGreaterThan(15);
    expect(mis).toEqual([]);
  });
}

test('de banner staat op de rail en "Meer info" is een link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/gidsen.html');
  await page.waitForSelector('.cookie-banner.active');
  const m = await page.evaluate(() => {
    const merk = document.querySelector('.landing-nav .nav-brand').getBoundingClientRect();
    const cta = document.querySelector('.landing-nav .btn-cta-nav').getBoundingClientRect();
    const inh = document.querySelector('.cookie-banner .cookie-content').getBoundingClientRect();
    const l = getComputedStyle(document.querySelector('.cookie-banner a[href]'));
    return { links: inh.left - merk.left, rechts: inh.right - cta.right, lijn: l.textDecorationLine };
  });
  expect(Math.abs(m.links), 'de banner begint niet op de rail van de navbar').toBeLessThan(1);
  expect(Math.abs(m.rechts), 'de banner eindigt niet op de rail van de navbar').toBeLessThan(1);
  expect(m.lijn, '"Meer info" is niet als link te herkennen').toBe('underline');
});

// Finish review s252: de twee menubladen verschilden (terminal 19,8px/400 en rijen van 63px),
// er stond een lege dubbele lijn tussen links en acties, glyphs als icoon in het Help-menu, en
// de themaschakelaar had labels van 11px. Eén blad, gemeten in beide navbars.
test('het ingeklapte menublad is in beide navbars hetzelfde', async ({ page }) => {
  test.setTimeout(4 * 10_000 + 15_000);   // vier navigaties, twee naar de zware terminal
  await page.addInitScript(() => localStorage.setItem('hacksim_legal_accepted', 'true'));
  const fout = [];
  for (const breedte of [375, 900]) {
    await page.setViewportSize({ width: breedte, height: 800 });
    const metingen = {};
    for (const [pad, menu] of [['/gidsen.html', '#landing-mobile-menu'], ['/terminal.html', '#navbar-menu']]) {
      await page.goto(pad);
      await page.locator('.navbar-toggle:visible').first().click();
      await expect(page.locator(menu)).toBeVisible();
      metingen[pad] = await page.evaluate((menu) => {
        const m = document.querySelector(menu);
        const links = [...m.querySelectorAll('.navbar-links > li > a:not(.mobile-cta-link)')];
        // De actieve link hoort dezelfde vorm te hebben; alleen de onderstreping onderscheidt hem.
        const vorm = (a) => { const s = getComputedStyle(a); return `${s.fontSize}/${s.fontWeight}/${Math.round(a.closest('li').getBoundingClientRect().height)}`; };
        const acties = getComputedStyle(m.querySelector('.navbar-actions'));
        const opties = [...m.querySelectorAll('.theme-toggle .toggle-option')].map((o) => o.getBoundingClientRect().height);
        const glyphs = [...m.querySelectorAll('a')].map((a) => [getComputedStyle(a, '::before').content, getComputedStyle(a, '::after').content])
          .flat().filter((c) => c && c !== 'none' && c !== 'normal' && /[+→►×]/.test(c));
        const label = getComputedStyle(m.querySelector('.theme-toggle .toggle-label')).fontSize;
        return { vormen: [...new Set(links.map(vorm))], dubbel: acties.borderTopWidth !== '0px', opties, glyphs, label, linkMaat: getComputedStyle(links[0]).fontSize };
      }, menu);
    }
    const [mk, tm] = [metingen['/gidsen.html'], metingen['/terminal.html']];
    if (mk.vormen.length !== 1 || tm.vormen.length !== 1 || mk.vormen[0] !== tm.vormen[0]) fout.push(`@${breedte} links: marketing ${mk.vormen} tegen terminal ${tm.vormen}`);
    for (const [naam, x] of Object.entries(metingen)) {
      if (x.dubbel) fout.push(`@${breedte} ${naam}: dubbele lijn boven de acties`);
      if (x.glyphs.length) fout.push(`@${breedte} ${naam}: glyphs als icoon ${x.glyphs}`);
      if (x.opties.length !== 2 || x.opties.some((h) => h < 42)) fout.push(`@${breedte} ${naam}: schakelaarhelften ${x.opties}`);
      if (x.label !== x.linkMaat) fout.push(`@${breedte} ${naam}: schakelaarlabel ${x.label} tegen links ${x.linkMaat}`);
    }
  }
  expect(fout).toEqual([]);
});

test('de pagina waar je bent is een onderstreping, geen blok', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/blog/welkom.html');
  const m = await page.evaluate(() => {
    const a = document.querySelector('.landing-nav .nav-links a.active');
    const s = getComputedStyle(a);
    return { tekst: a.textContent.trim(), huidig: a.getAttribute('aria-current'), bg: s.backgroundColor, lijn: s.textDecorationLine, dikte: s.textDecorationThickness, kleur: s.color };
  });
  expect(m.tekst).toBe('Blog');
  expect(m.huidig, 'de schermlezer hoort waar je bent').toBe('page');
  expect(m.bg, 'actief is geen inktblok: dat is het gebaar van hover').toBe('rgba(0, 0, 0, 0)');
  expect(m.lijn).toBe('underline');
  expect(m.dikte).toBe('2px');
  expect(m.kleur, 'actief draagt geen eigen kleur (was het lime van de prompt)').toBe('rgb(17, 17, 17)');
});

test('de terminal-navbar staat op dezelfde rail en heeft dezelfde schakelaar', async ({ page }) => {
  // Zes navigaties: los 10,1s, onder zes workers in Firefox over de standaard 30s (gemeten s252).
  test.setTimeout(6 * 10_000 + 15_000);
  await page.addInitScript(() => {
    localStorage.setItem('hacksim_legal_accepted', 'true');
    localStorage.setItem('hacksim_analytics_consent', '{"necessary":true,"analytics":false}');
  });
  const meet = (nav) => page.evaluate((nav) => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const t = document.querySelector(`${nav} .theme-toggle`);
    return {
      merk: r(`${nav} .nav-brand`).left,
      schakelaar: Math.round(t.getBoundingClientRect().height),
      label: Math.round(t.querySelector('.toggle-label').getBoundingClientRect().width),
    };
  }, nav);
  const fout = [];
  for (const breedte of [1440, 1920, 375]) {
    await page.setViewportSize({ width: breedte, height: 800 });
    await page.goto('/gidsen.html');
    await page.waitForSelector('.landing-nav .nav-brand');
    const marketing = await meet('.landing-nav');
    await page.goto('/terminal.html');
    await page.waitForSelector('#navbar .nav-brand');
    const app = await meet('#navbar');
    if (Math.abs(app.merk - marketing.merk) > 0.5) fout.push(`@${breedte} merk ${app.merk} tegen ${marketing.merk}`);
    if (breedte >= 1440) {
      if (app.schakelaar !== marketing.schakelaar) fout.push(`@${breedte} schakelaar ${app.schakelaar}px tegen ${marketing.schakelaar}px`);
      if (app.label > 1) fout.push(`@${breedte} de labels DONKER/LICHT staan zichtbaar in de terminal-navbar`);
    }
  }
  expect(fout).toEqual([]);
});
