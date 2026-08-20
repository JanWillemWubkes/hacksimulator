// E2E-guard: ONGEFILTERD tekstcontrast over de hele site (Sessie 228)
//
// TASKS #72 vroeg om één token op één oppervlak (`--color-text-dim` op de edu-panelen,
// 5,21:1). Die reparatie is hier NIET los uitgevoerd, want het was de derde ronde van
// hetzelfde patroon:
//
//   Sessie 226  --color-text-dim  #8b949e → #a1a8b0   ("haalt nergens AAA")
//   Sessie 227  dezelfde waarde stond óók op --color-ui-secondary, --color-text-muted,
//               --terminal-demo-text-dim en drie hardcoded footer-regels — 34 elementen
//   #72         de nieuwe waarde haalt het op een derde oppervlak alsnog niet
//
// Elke ronde repareerde één vindplaats. De oorzaak daarvan is meetbaar: alle eerdere
// contrastspecs FILTEREN op een tokenlijst (link-contrast op vijf tokens, accent-text en
// eyebrow elk op één). Wat niet in de lijst staat wordt niet gemeten, dus de klasse is
// nooit gesloten.
//
// Deze spec filtert niet. Élk element dat zelf een tekstnode rendert wordt gemeten tegen
// zijn effectieve achtergrond. Eindstand van de sweep die hem voortbracht: 30 pagina's ×
// 2 thema's × 2 viewports = 13.157 element-toestanden, **152 onder AA en 378 onder AAA**,
// verdeeld over 18 kleurwaarden. Na de fixes: 0 en 0.
//
// ── Vier dingen die deze meting anders doet dan zijn voorgangers ─────────────────────────
//
//  1. GROEPEREN OP KLEURWAARDE, niet op token. Dezelfde hex zit onder meerdere namen:
//     #a1a8b0 is tegelijk --color-text-dim, --color-ui-secondary en --color-text-muted.
//     Per token rapporteren verdeelt één defect over drie regels en verbergt de omvang.
//
//  2. BEIDE VIEWPORTS. Niet cosmetisch — er zijn falers die maar in één van de twee
//     bestaan, en in allebei de richtingen:
//        alleen mobiel  (115)  blog-<strong>/h3 in dark: op desktop ≥18,66px én bold, dus
//                              LARGE (lat 4,5) en 6,70 haalt het; op mobiel zakt de
//                              font-size en geldt de lat van 7,0.
//        alleen desktop  (54)  .toggle-option: op mobiel zit de toggle in het dichtgeklapte
//                              menu en heeft dan geen rects.
//
//  3. SCROLLEN VÓÓR HET METEN. `.leerpad-card` start op `opacity: 0` en krijgt pas
//     `.visible` van een IntersectionObserver. Zonder `onthulAlles()` viel de hele
//     `.level-badge`-groep buiten de populatie — en dáár zat de laagste waarde van de site
//     (1,74:1).
//
//  4. DE UITSLUITINGEN ZIJN ZELF EEN ASSERTIE. Een sweep die elementen overslaat kan een
//     defect wegfilteren; daarom wordt elk overgeslagen element geclassificeerd en faalt de
//     test op een reden die niet in de lijst staat.
//
// ── Wat de meting corrigeerde t.o.v. de aanname ─────────────────────────────────────────
// Drie CSS-commentaren claimden een contrast dat ze niet haalden — allemaal in de veilige,
// geruststellende richting:
//     --color-prompt  "4.8:1 contrast (WCAG AA ✅)"    → 1,96:1 op de lichte terminal
//     --color-success "7.5:1 (WCAG AAA ✅)"            → 4,29:1 op #f8f8f8
//     --color-ui-primary "3.25:1 on white (WCAG AA)"   → 3,25 ís geen AA
// En het commentaar op --color-cta-primary zei "op een ACHTERGROND met wit erop is hij
// prima": wit op #16a34a mat 3,30:1, op 13 pagina's. Zie de tokens in styles/main.css.

import { test, expect } from './fixtures.js';
import { installeerContrastMeter, zetThema, onthulAlles, LAT } from './helpers/contrast.js';
import { PAGINAS } from './helpers/paginas.js';

const VIEWPORTS = [
  { naam: 'desktop', width: 1280, height: 900 },
  { naam: 'mobile', width: 375, height: 812 },
];

/**
 * Tokenparen waarvan de HOVER-variant nergens in rusttoestand voorkomt.
 *
 * Een element-sweep meet per definitie de rusttoestand (architecture-patterns §17). Drie
 * van de vier onder-AA-defecten van Sessie 227 zaten in `:hover`, en de vierde
 * (`--color-link-hover` in dark) kwam in geen enkele gemeten kleur voor. Hovers simuleren
 * over 30 pagina's is onwerkbaar; in plaats daarvan wordt elk paar getoetst tegen de
 * achtergronden waar de BASISkleur feitelijk landt — daar kan de hover ook landen.
 */
const HOVER_PAREN = [
  ['--color-link', '--color-link-hover'],
  ['--color-ui-primary', '--color-ui-hover'],
];

/**
 * GEMETEN, GEDOCUMENTEERDE UITZONDERING — geen notitie maar een assertie.
 *
 * `--color-cta-primary` haalt AAA niet als TEKST: light #166534 meet 6,71:1 op de
 * paginakleur #f8f8f8. Dat is geen defect, want het is geen tekstkleur — het is het
 * CTA-OPPERVLAK, met `--color-cta-text` (wit, 7,13:1) erop. Voor accenttekst bestaat
 * `--color-accent-text` (#14532d, 8,58:1).
 *
 * Zo'n uitzondering verdampt zodra iemand het token toch als `color:` gebruikt — precies
 * wat er tot Sessie 228 op 32 plekken in styles/ en 3 in woordenlijst.html gebeurd was.
 * Daarom staat hier niet "let op, niet als tekst gebruiken" maar een assertie: NUL
 * elementen mogen tekst in deze kleur renderen. Gaat dat mis, dan valt deze test óók als
 * de nieuwe vindplaats toevallig op een achtergrond staat waar 6,71 wél genoeg is.
 *
 * ⚠️ In DARK is het token onmeetbaar via deze weg, en dat is geen mankement maar een
 * gemeten feit: `--color-cta-primary` en `--color-accent-text` zijn daar allebei #9fef00.
 * De check herkent elementen op KLEURWAARDE, dus elk legitiem gebruik van het
 * tekstalternatief zou als overtreding binnenkomen (14 pagina's, gemeten). Waar de twee
 * samenvallen valt er ook niets te onderscheiden: 13,36:1 op --color-bg is dan het
 * antwoord voor allebei. De check slaat dat geval over en `gelijkInThema` legt vast dát
 * hij overslaat — zodra de twee waarden uit elkaar lopen, gaat de check daar vanzelf weer
 * aan.
 */
const OPPERVLAK_TOKENS = [
  {
    naam: '--color-cta-primary',
    reden: 'CTA-oppervlak (wit erop = 7,13:1); als tekst meet het 6,71:1 op #f8f8f8',
    alsTekstGemeten: { light: 6.71, dark: 13.36 },
    tekstAlternatief: '--color-accent-text',
    gelijkInThema: { light: false, dark: true },
  },
];

/** Redenen waarom een element met eigen tekst tóch niet gemeten wordt. */
const TOEGESTANE_UITSLUITINGEN = new Set([
  'geen-rects',        // display:none, of een dichtgeklapt menu
  'opacity-0',         // scroll-reveal die (nog) niet gevuurd heeft, of een verborgen indicator
  'tekst-transparant', // color: …, 0 — rendert per definitie niets
]);

async function meet(page) {
  await installeerContrastMeter(page);
  return page.evaluate(
    ({ hoverParen, oppervlakTokens }) => {
      const { parse, over, ratio, effBg, eigenTekst, isGroot, effOpacity, omschrijf } = window.__contrast;
      const root = getComputedStyle(document.documentElement);
      const token = (n) => parse(root.getPropertyValue(n).trim());

      const rijen = [];
      const uitgesloten = [];
      const achtergrondenVanKleur = new Map();

      for (const el of document.querySelectorAll('*')) {
        if (!eigenTekst(el)) continue;

        // Classificeer wat we NIET meten, in plaats van het stil over te slaan.
        if (el.getClientRects().length === 0) { uitgesloten.push({ reden: 'geen-rects', sel: omschrijf(el) }); continue; }
        if (effOpacity(el) === 0) { uitgesloten.push({ reden: 'opacity-0', sel: omschrijf(el) }); continue; }
        const cs = getComputedStyle(el);
        const rauw = parse(cs.color);
        if (!rauw || rauw.a === 0) { uitgesloten.push({ reden: 'tekst-transparant', sel: omschrijf(el) }); continue; }

        const bg = effBg(el);
        // Tekstkleur met alpha < 1 landt óp de achtergrond; ratio() negeert alpha, dus
        // zonder deze compositie meet je een kleur die niemand ziet. Zo stond
        // --color-toggle-text-inactive (rgba(204,204,204,.4)) als "#cccccc" te boek terwijl
        // het gerenderd rgb(97,97,97) is: 2,82:1 in plaats van 10,73:1.
        const kleur = rauw.a < 1 ? over(rauw, bg) : rauw;
        const groot = isGroot(cs);
        const kleurTekst = `rgb(${Math.round(kleur.r)}, ${Math.round(kleur.g)}, ${Math.round(kleur.b)})`;
        const bgTekst = `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`;

        if (!achtergrondenVanKleur.has(kleurTekst)) achtergrondenVanKleur.set(kleurTekst, new Set());
        achtergrondenVanKleur.get(kleurTekst).add(bgTekst);

        rijen.push({
          sel: omschrijf(el), kleur: kleurTekst, bg: bgTekst,
          tekst: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34),
          fontSize: cs.fontSize, fontWeight: cs.fontWeight, groot,
          lat: groot ? 4.5 : 7, contrast: ratio(kleur, bg),
        });
      }

      // ── Token-matrix: dekt de HOVER zonder hem te simuleren ──────────────────────────
      const bodyBg = effBg(document.body);
      const bodyTekst = `rgb(${Math.round(bodyBg.r)}, ${Math.round(bodyBg.g)}, ${Math.round(bodyBg.b)})`;
      const matrixOvertreders = [];
      for (const [basis, hover] of hoverParen) {
        const b = token(basis);
        if (!b) continue;
        const sleutel = `rgb(${b.r}, ${b.g}, ${b.b})`;
        // Achtergronden waar de BASISkleur feitelijk landt. Staat hij nergens op deze
        // pagina, dan is de paginakleur de ondergrens — daar zou een link landen als er een
        // kwam. Zonder die ondergrens toetsen pagina's zonder links helemaal niets.
        const bgs = achtergrondenVanKleur.get(sleutel) || new Set([bodyTekst]);
        for (const naam of [basis, hover]) {
          const c = token(naam);
          if (!c) { matrixOvertreders.push(`${naam}: token bestaat niet`); continue; }
          for (const bg of bgs) {
            const r = ratio(c, parse(bg));
            // Lat 7,0 (normale tekst), bewust streng: een hover kan op élk element landen,
            // ook het kleinste, dus de large-text-uitzondering geldt hier niet.
            if (r < 7) matrixOvertreders.push(`${naam} (${root.getPropertyValue(naam).trim()}) op ${bg}: ${r}:1`);
          }
        }
      }

      // ── Oppervlak-tokens mogen nergens als TEKST renderen ────────────────────────────
      const oppervlakAlsTekst = [];
      const oppervlakOvergeslagen = [];
      const thema = document.documentElement.getAttribute('data-theme');
      for (const t of oppervlakTokens) {
        const c = token(t.naam);
        const alt = token(t.tekstAlternatief);
        if (!c) { oppervlakAlsTekst.push(`${t.naam}: token bestaat niet`); continue; }
        if (!alt) { oppervlakAlsTekst.push(`${t.tekstAlternatief}: tekstalternatief bestaat niet`); continue; }

        // Vallen oppervlak- en tekstwaarde samen, dan kan een kleurvergelijking ze niet
        // onderscheiden. Overslaan — maar wél terugmelden, zodat de verwachting in
        // `gelijkInThema` toetsbaar blijft in plaats van een stille aanname te worden.
        const samen = c.r === alt.r && c.g === alt.g && c.b === alt.b;
        oppervlakOvergeslagen.push({ naam: t.naam, thema, samen });
        if (samen) continue;

        const sleutel = `rgb(${c.r}, ${c.g}, ${c.b})`;
        for (const r of rijen) {
          if (r.kleur !== sleutel) continue;
          oppervlakAlsTekst.push(`${r.sel} "${r.tekst}" rendert TEKST in ${t.naam} — gebruik ${t.tekstAlternatief}`);
        }
      }

      return {
        rijen, uitgesloten, oppervlakAlsTekst, oppervlakOvergeslagen, matrixOvertreders,
        kleuren: achtergrondenVanKleur.size,
        thema,
      };
    },
    { hoverParen: HOVER_PAREN, oppervlakTokens: OPPERVLAK_TOKENS }
  );
}

const beschrijf = (r) =>
  `${r.sel} "${r.tekst}" — ${r.contrast}:1 (lat ${r.lat}); ${r.kleur} op ${r.bg}, ` +
  `${r.fontSize}/${r.fontWeight}${r.groot ? ' LARGE' : ''}`;

test.describe('Tekstcontrast — ongefilterd, élk renderend element (WCAG AAA)', () => {

  // Deze spec doet per test vier volledige metingen (2 viewports × 2 thema's), en elke
  // meting loopt `document.querySelectorAll('*')` af met een `getComputedStyle` per element
  // plus een ancestor-wandeling voor de effectieve achtergrond. Op een blogpost van ~17.800px
  // is dat veel werk.
  //
  // Gemeten op webkit, serieel, /blog/nmap-beginnersgids.html: **24,6 s**. De standaard
  // testtimeout is 30 s, dus onder vier workers loopt hij eroverheen — dat gaf 17 falers,
  // allemaal webkit, allemaal `page.evaluate: Test timeout of 30000ms exceeded` (chromium en
  // firefox bleven groen). Het is dus geen hang: `onthulAlles()` wacht op rAF en zou bij
  // throttling nooit terugkeren, maar met 120 s slaagt dezelfde test wél.
  //
  // 120 s = ~5× de gemeten seriële tijd. Bewust ruim: een timeout die je op de gemeten
  // waarde plakt, wordt de volgende flaky test.
  test.describe.configure({ timeout: 120_000 });

  // Eén test per pagina; binnen de test 2 viewports × 2 thema's op dezelfde navigatie.
  // (Zestien navigaties in één test werd flaky zodra er een tweede worker naast draaide —
  // zie de notitie in accent-text-contrast.spec.js. Een viewportwissel is geen navigatie.)
  for (const pad of PAGINAS) {
    test(`${pad} — alle tekst haalt AAA (2 thema's × 2 viewports)`, async ({ page }) => {
      // De legal-modal vóór de navigatie accepteren i.p.v. wegklikken: anders dekt de modal
      // terminal.html af en blijven de edu-panelen (het oppervlak uit #72) ongemeten.
      await page.addInitScript(() => {
        try { localStorage.setItem('hacksim_legal_accepted', 'true'); } catch { /* private mode */ }
      });
      await page.goto(pad);
      await page.evaluate(() => document.fonts.ready);

      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        for (const thema of ['light', 'dark']) {
          // zetThema() bevriest transities én animaties. Wachten alleen is niet genoeg
          // gebleken: dezelfde pagina gaf met dezelfde wachttijd de ene run 7,88 en de
          // andere 1,70. Zie helpers/contrast.js.
          await zetThema(page, thema);
          await onthulAlles(page);
          const m = await meet(page);
          const waar = `${pad} (${thema}, ${vp.naam})`;

          // ── 1. Zelfbewaking. Zonder deze tak zet een pagina die main.css niet laadt, of
          //      een selector die niets meer matcht, de hele test stil op groen.
          expect(
            { thema: m.thema, gemeten: m.rijen.length > 0, kleuren: m.kleuren > 0 },
            `${waar}: de meter kon niets meten. Laadt deze pagina main.css, en heeft ` +
              `zetThema() het attribuut gezet? (gemeten ${m.rijen.length} elementen)`
          ).toEqual({ thema, gemeten: true, kleuren: true });

          // ── 2. De kern: ongefilterde element-sweep.
          const onderAAA = m.rijen.filter((r) => r.contrast < r.lat);
          expect(
            onderAAA.map(beschrijf),
            `${waar}: ${onderAAA.length} van ${m.rijen.length} tekstelementen haalt WCAG AAA ` +
              `niet. Meet tegen de EFFECTIEVE achtergrond (gecomposite tot de eerste ` +
              `alpha===1), niet tegen --color-bg — een badge met een eigen rgba ligt op de ` +
              `compositie. Lat: ${LAT.AAA(false)} normaal, ${LAT.AAA(true)} large.`
          ).toEqual([]);

          // ── 3. De uitsluitingen zijn zelf een assertie. Een sweep die stilletjes
          //      elementen overslaat kan een defect wegfilteren; elke overgeslagen reden
          //      moet een bekende zijn.
          const onbekend = m.uitgesloten.filter((u) => !TOEGESTANE_UITSLUITINGEN.has(u.reden));
          expect(
            onbekend.map((u) => `${u.sel}: ${u.reden}`),
            `${waar}: een element werd overgeslagen om een reden die niet gedocumenteerd is.`
          ).toEqual([]);

          // ── 4. Token-matrix: dekt de HOVER-toestand zonder hem te simuleren.
          expect(
            m.matrixOvertreders,
            `${waar}: een link-/UI-token haalt geen AAA op een achtergrond waar de ` +
              `basiskleur op deze pagina werkelijk landt. Dit vangt de HOVER — die komt in ` +
              `de rusttoestand-sweep hierboven nooit voor.`
          ).toEqual([]);

          // ── 5. De gedocumenteerde uitzondering, als assertie.
          expect(
            m.oppervlakAlsTekst,
            `${waar}: een OPPERVLAK-token wordt als tekstkleur gebruikt. ` +
              OPPERVLAK_TOKENS.map((t) => `${t.naam}: ${t.reden}`).join(' | ')
          ).toEqual([]);

          // ── 6. En de uitzondering-op-de-uitzondering is óók een assertie. In dark valt
          //      --color-cta-primary samen met --color-accent-text, dus check 5 slaat daar
          //      over. Dat is vastgelegd in `gelijkInThema`; loopt het uit elkaar (of komt
          //      het in light samen), dan hoort de tabel bijgewerkt te worden en niet de
          //      check stilzwijgend van doel te wisselen.
          expect(
            m.oppervlakOvergeslagen.map((o) => `${o.naam}/${o.thema}: ${o.samen}`),
            `${waar}: valt een oppervlak-token samen met zijn tekstalternatief, anders dan ` +
              `vastgelegd? Waar ze samenvallen kan check 5 niets onderscheiden.`
          ).toEqual(
            OPPERVLAK_TOKENS.map((t) => `${t.naam}/${thema}: ${t.gelijkInThema[thema]}`)
          );
        }
      }
    });
  }

  // ── De toestand die een idle sweep per definitie niet ziet ────────────────────────────
  //
  // --color-warning en --color-info renderen op geen enkele stilstaande pagina: ze zitten
  // in .terminal-output-warning, .tip-box en .warning-icon, en die bestaan pas nádat de
  // bezoeker een commando heeft getypt. Gemeten in light stonden ze op 2,60 en 4,89 — de
  // eerste ruim onder AA — zonder dat één van de 30 pagina-tests hierboven ze aanraakt.
  // Datzelfde geldt voor negen van de tien --color-prompt-gebruiken in terminal.css.
  test('terminal-uitvoer haalt AAA in beide thema\'s (de toestand ná commando\'s)', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('hacksim_legal_accepted', 'true'); } catch { /* private mode */ }
    });
    await page.goto('/terminal.html');
    await page.evaluate(() => document.fonts.ready);

    // Gekozen om de vier semantische kleuren én de man-page-opmaak te raken:
    // nmap → [TIP] (info), hashcat → [!] (warning), een onbekend commando → error.
    for (const cmd of ['help', 'nmap 192.168.1.1', 'ls', 'hashcat', 'zzzonbekend', 'man nmap']) {
      await page.fill('#terminal-input', cmd);
      await page.press('#terminal-input', 'Enter');
    }
    await expect(page.locator('#terminal-output .terminal-line').first()).toBeVisible();

    for (const thema of ['light', 'dark']) {
      await zetThema(page, thema);
      await installeerContrastMeter(page);

      const m = await page.evaluate(() => {
        const { parse, over, ratio, effBg, eigenTekst, isGroot, rendert, omschrijf } = window.__contrast;
        const rijen = [];
        for (const el of document.querySelectorAll('#terminal-output *, #terminal-input-wrapper *')) {
          if (!eigenTekst(el) || !rendert(el)) continue;
          const cs = getComputedStyle(el);
          const bg = effBg(el);
          const rauw = parse(cs.color);
          const kleur = rauw.a < 1 ? over(rauw, bg) : rauw;
          const groot = isGroot(cs);
          rijen.push({ sel: omschrijf(el), tekst: (el.textContent || '').trim().slice(0, 34),
            kleur: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
            fontSize: cs.fontSize, fontWeight: cs.fontWeight, groot,
            lat: groot ? 4.5 : 7, contrast: ratio(kleur, bg) });
        }
        // Het invoerveld apart: een <input> heeft géén tekstnode, dus eigenTekst() ziet hem
        // niet — terwijl de getypte tekst wel degelijk tekst is. Precies daar zat 1,96:1.
        const inp = document.querySelector('#terminal-input');
        if (inp) {
          const cs = getComputedStyle(inp);
          const bg = effBg(inp);
          rijen.push({ sel: 'input#terminal-input (getypte waarde)', tekst: inp.value || '(leeg)',
            kleur: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
            fontSize: cs.fontSize, fontWeight: cs.fontWeight, groot: false,
            lat: 7, contrast: ratio(parse(cs.color), bg) });
        }
        return { rijen, kleuren: [...new Set(rijen.map((r) => r.kleur))].length };
      });

      // Zelfbewaking: heeft het typen daadwerkelijk uitvoer opgeleverd, en in meer dan één
      // kleur? Een lege terminal zou deze test anders groen laten zonder iets te meten.
      expect(
        { regels: m.rijen.length > 50, kleuren: m.kleuren >= 4 },
        `terminal-uitvoer (${thema}): te weinig gemeten (${m.rijen.length} elementen, ` +
          `${m.kleuren} kleuren). Zijn de commando's uitgevoerd?`
      ).toEqual({ regels: true, kleuren: true });

      const onderAAA = m.rijen.filter((r) => r.contrast < r.lat);
      expect(
        onderAAA.map(beschrijf),
        `terminal-uitvoer (${thema}): ${onderAAA.length} van ${m.rijen.length} elementen ` +
          `onder AAA. In light draait de terminal op de PAGINAkleur (#f8f8f8), niet op een ` +
          `donker venster — semantische kleuren die in dark kloppen zijn daar te licht.`
      ).toEqual([]);
    }
  });

});
