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
