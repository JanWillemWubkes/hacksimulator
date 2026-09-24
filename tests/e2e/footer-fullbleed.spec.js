// E2E Tests voor de full-bleed component-footer (Sessie 235)
//
// Aanleiding: op /blog/ stond de footer 672px breed in een viewport van 1823px, ingesprongen
// tot 576px van links, met een Ko-fi-knop die over twee regels brak (70px hoog i.p.v. 47px).
//
// Oorzaak: blog/index.html sloot zijn <main class="blog-container"> nooit. De parser sluit
// zo'n tag stil bij </body> — geen console-fout, geen gebroken pagina — waardoor het door
// footer.js geinjecteerde <footer class="landing-footer"> een KIND van main.blog-container
// werd en diens `max-width: 720px` (blog.css:6) erfde.
//
// Gemeten voor de fix, 1823px viewport:
//
//   /blog/                       ouder MAIN.blog-container   672px   links 576   knop 194x70
//   /blog/terminal-basics.html   ouder BODY                 1823px   links   0   knop 210x47
//
// validate-blogs.sh check 3 vangt sinds dezelfde sessie de OORZAAK (een niet-gesloten
// structuurtag, statisch, in de pre-commit hook). Deze spec bewaakt de KLASSE: "de footer
// beslaat op elke pagina de volle body-breedte". Die faalt ook als ooit een CSS-regel hem
// inperkt, wat geen enkele tagteller ziet.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';

// De drie legal-pagina's dragen geen #footer-placeholder en laden init-components.js niet
// (gemeten: placeholder=0, init=0). Ze hebben dus terecht geen component-footer.
//
// Dat staat hier als TWEERICHTINGS-assertie, niet als skip-lijst: een pad dat hierin staat
// MOET de footer missen, een pad dat er niet in staat MOET hem hebben. Zo ruimt de
// uitzondering zichzelf op zodra die pagina's alsnog een footer krijgen - een skip zou dan
// stil groen blijven.
const ZONDER_FOOTER = new Set([
  '/assets/legal/privacy.html',
  '/assets/legal/terms.html',
  '/assets/legal/cookies.html',
]);

// Afrondingsmarge tussen Chromium, Firefox en WebKit. De echte bug is 1151px breed en
// 576px verschoven, dus dit verzwakt de assertie niet.
const SUBPIXEL = 1.5;

/**
 * Meet de geinjecteerde footer: waar hij in de boom hangt en welke pixels hij beslaat.
 * `clientWidth` van <html> is de juiste referentie, niet innerWidth: die telt de
 * verticale scrollbar mee en dan is 100% van body er altijd smaller dan.
 */
async function meetFooter(page) {
  return page.evaluate(() => {
    const f = document.querySelector('footer.landing-footer');
    if (!f) {
      return {
        aanwezig: false,
        // Diagnose: stond de placeholder er wel, dan is de injectie stukgegaan; stond hij
        // er niet, dan hoort deze pagina in ZONDER_FOOTER.
        placeholderAanwezig: !!document.getElementById('footer-placeholder'),
      };
    }

    const r = f.getBoundingClientRect();
    const keten = [];
    for (let p = f.parentElement; p; p = p.parentElement) {
      keten.push(p.tagName + (p.className ? '.' + String(p.className).split(' ')[0] : ''));
    }

    return {
      aanwezig: true,
      ouder: f.parentElement ? f.parentElement.tagName : null,
      ouderKlasse: f.parentElement ? String(f.parentElement.className || '') : '',
      keten: keten.join(' < '),
      breedte: +r.width.toFixed(1),
      links: +r.left.toFixed(1),
      beschikbaar: document.documentElement.clientWidth,
    };
  });
}

test.describe('Component-footer staat full-bleed op elke pagina', () => {

  // Zelfbewaking op de POPULATIE zelf. Zonder deze test is een leeggelopen PAGINAS-lijst
  // of een ZONDER_FOOTER-pad dat niemand meer bezoekt niet te onderscheiden van groen.
  test('de paginalijst en de uitzonderingen zijn allebei nog echt', () => {
    expect(PAGINAS.length, 'PAGINAS is leeg of uitgedund').toBeGreaterThanOrEqual(25);

    const wees = [...ZONDER_FOOTER].filter((pad) => !PAGINAS.includes(pad));
    expect(
      wees,
      `ZONDER_FOOTER noemt ${wees.join(', ')}, maar die staan niet in PAGINAS — ` +
        'de uitzondering wordt nergens meer getoetst en hoort weg.'
    ).toEqual([]);

    // Er moet aan BEIDE kanten iets te meten vallen, anders toetst de tweerichtings-
    // assertie hieronder in de praktijk maar een richting.
    expect(PAGINAS.filter((p) => !ZONDER_FOOTER.has(p)).length).toBeGreaterThan(0);
    expect(PAGINAS.filter((p) => ZONDER_FOOTER.has(p)).length).toBeGreaterThan(0);
  });

  for (const pad of PAGINAS) {
    const hoort = !ZONDER_FOOTER.has(pad);

    test(`${pad} — footer ${hoort ? 'beslaat de volle breedte' : 'hoort hier niet te staan'}`, async ({ page }) => {
      // terminal.html dekt zonder dit de pagina af met de legal-modal, die body op
      // overflow: hidden zet — dan meet je een clientWidth die geen bezoeker ziet.
      await page.addInitScript(() => {
        try { localStorage.setItem('hacksim_legal_accepted', 'true'); } catch { /* private mode */ }
      });

      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      // Bevriezen i.p.v. wachten: .footer-donate en .footer-social a dragen transform-
      // transities, en een halfweg geanimeerde transform verschuift de rect die we meten.
      await page.addStyleTag({
        content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
      });

      const m = await meetFooter(page);

      if (!hoort) {
        expect(
          m.aanwezig,
          `${pad} staat in ZONDER_FOOTER maar heeft wel een component-footer. ` +
            'Klopt dat? Haal het pad dan uit de set, zodat hij ook echt gemeten wordt.'
        ).toBe(false);
        return;
      }

      expect(
        m.aanwezig,
        `${pad} heeft geen footer.landing-footer` +
          (m.placeholderAanwezig
            ? ' terwijl #footer-placeholder er wel staat — de injectie in footer.js faalde.'
            : ' en ook geen #footer-placeholder — vergeten toe te voegen aan de pagina.')
      ).toBe(true);

      // De eigenlijke regressie: de footer hangt in een content-container i.p.v. in body.
      expect(
        m.ouder,
        `${pad}: de footer hangt in <${m.ouder}${m.ouderKlasse ? ' class="' + m.ouderKlasse + '"' : ''}> ` +
          `i.p.v. direct in <body>, en erft daarmee diens breedte/padding. Keten: ${m.keten}. ` +
          'Meestal een niet-gesloten containertag vlak boven het footer-placeholder-blok.'
      ).toBe('BODY');

      expect(
        Math.abs(m.breedte - m.beschikbaar),
        `${pad}: de footer is ${m.breedte}px breed binnen ${m.beschikbaar}px. Keten: ${m.keten}.`
      ).toBeLessThan(SUBPIXEL);

      expect(
        Math.abs(m.links),
        `${pad}: de footer begint ${m.links}px van links i.p.v. tegen de rand. Keten: ${m.keten}.`
      ).toBeLessThan(SUBPIXEL);
    });
  }
});
