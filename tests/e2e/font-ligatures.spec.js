// Ligatuur-guard — HackSimulator.nl (Sessie 229)
//
// ── Waarom deze spec bestaat ────────────────────────────────────────────────────────────
// JetBrains Mono ligeert via de OpenType-feature `calt` (367 lookups, gemeten met fontTools
// op styles/fonts/jetbrainsmono-latin.woff2). `calt` staat in browsers standaard aan, en er
// stond nergens in styles/ een `font-variant-ligatures`-regel. De terminal rendeerde daardoor
// iets anders dan er in de DOM stond:
//
//     >=   →  ≥       'MySQL >= 5.0' in de sqlmap-output
//     _|_  →  ⊥       de sqlmap-banner
//     -|   →  ⊣       de sqlmap-banner
//     ->   →  →       `man sqlmap`: `$pdo->prepare(` rendeerde als `$pdo→prepare(`, ONDER
//                     het kopje "Veilige code:". Wie overtypt wat hij ziet krijgt een
//                     PHP-parse-error — bij precies het voorbeeld dat als het veilige
//                     alternatief wordt aangewezen. Dat is een leerbug, geen cosmetiek.
//
// ── De meetval die de opzet van deze spec bepaalt ───────────────────────────────────────
// JetBrains Mono-ligaturen behouden het monospace-grid EXACT. Gemeten breedteverschil tussen
// `>=` en `≥`, en tussen `$pdo->prepare()` met en zonder ligaturen: 0,00px. Een guard die
// breedtes of `textContent` vergelijkt is dus GROEN bij een kapotte render — `textContent`
// gaf op de live site keurig `>=` terug terwijl er ≥ op het scherm stond. Alleen gerenderde
// pixels bewijzen hier iets.
//
// ── Twee asserties die op verschillende dingen falen ────────────────────────────────────
//  A (dekking)  sitebreed: elk element dat in een monospace-familie rendert moet
//               `font-variant-ligatures: none` hebben. Populatie = ALLES; wat mono is,
//               moet zich verantwoorden. Faalt óók op een lege populatie.
//  B (werking)  op /terminal.html: pixelvergelijking die bewijst dat de ligaturen echt
//               niet vuren, mét een zelfbewakende tak die de meting zelf toetst.
//
// Mutanten waarmee dit is gefalsifieerd — gemeten, elk met een ANDERE faalsignatuur:
//
//     M1  de `*`-regel in main.css weghalen      30 failed / 1 passed   A op 29 pagina's
//                                                                       + B tak 2
//     M2  de regel scopen naar #terminal-output  29 failed / 2 passed   A alleen; B GROEN,
//                                                                       want de terminal
//                                                                       zelf blijft gedekt
//     M3  jetbrainsmono-latin.woff2 hernoemen     1 failed / 30 passed  B tak 1 alleen;
//                                                                       A GROEN
//
// De ene groene bij M1 is /assets/legal/terms.html — nul mono-elementen, dus daar valt niets
// te overtreden (zie PAGINAS_ZONDER_MONO). M2 en M3 bewijzen dat A en B zelfstandig werken:
// zonder M3 is de zelfbewakende tak niet te onderscheiden van een check die nooit kán falen,
// en zonder M2 zou A overbodig lijken naast B.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';
import { bevriesAnimaties } from './helpers/contrast.js';

/**
 * Families uit `--font-terminal` (styles/main.css). Een element telt als monospace zodra
 * zijn resolved `font-family` er één noemt.
 *
 * Let op: `getComputedStyle().fontFamily` geeft de GEDECLAREERDE lijst terug, niet het font
 * dat de browser uiteindelijk koos. Dat is hier precies goed — we willen weten of dit
 * element bedoeld is als monospace, niet welke fallback toevallig laadde.
 */
const MONO_FAMILIES = ['jetbrains mono', 'courier', 'monospace'];

/**
 * Pagina's die aantoonbaar NUL monospace-elementen dragen.
 *
 * De aanname bij het schrijven van deze spec was "elke pagina heeft wel ergens mono-tekst".
 * Die was fout, en de zelfbewakende tak ving hem. Gemeten over alle 30 pagina's:
 * terms.html 0, cookies.html 1, privacy.html 3, contact.html 1 — en aan de andere kant
 * linux-bestandssysteem.html 138 en commands/index.html 132.
 *
 * Vastgelegd als ASSERTIE in twee richtingen, niet als notitie: een pagina hierin MOET nul
 * houden, een pagina erbuiten MOET er minstens één hebben. Krijgt terms.html ooit een
 * codeblok, dan gaat deze lijst rood en moet hij bijgewerkt worden — een uitzondering die
 * stilzwijgend blijft staan is een guard die verdampt.
 */
const PAGINAS_ZONDER_MONO = new Set(['/assets/legal/terms.html']);

/**
 * Probestrings: elke sequentie die op de live site aantoonbaar fout rendeerde, plus de
 * sqlmap-bannerregels waar het is opgevallen.
 */
const PROBE = [
  'MySQL >= 5.0 AND error-based',
  '$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");',
  'a != b  x <= y  p == q  r === s  f => g  h <- i',
  "|_ -| . [']     | .'| . |",
  '|___|_  [(]_|_|_|__,|  _|',
];

// ============================================================================
// A — DEKKING: sitebreed, populatie = alles
// ============================================================================

test.describe('A - elk monospace-element onderdrukt ligaturen', () => {
  for (const pad of PAGINAS) {
    test(`${pad} rendert geen ligaturen in mono-tekst`, async ({ page }) => {
      await page.goto(pad);
      await bevriesAnimaties(page);
      await page.evaluate(() => document.fonts.ready);

      const bevinding = await page.evaluate((families) => {
        const isMono = (fam) => {
          const f = fam.toLowerCase();
          return families.some((m) => f.includes(m));
        };

        const overtreders = [];
        let monoElementen = 0;

        for (const el of document.querySelectorAll('*')) {
          const cs = getComputedStyle(el);
          if (!isMono(cs.fontFamily)) continue;
          monoElementen++;
          if (cs.fontVariantLigatures === 'none') continue;

          overtreders.push({
            selector:
              el.tagName.toLowerCase() +
              (el.id ? `#${el.id}` : '') +
              (el.className && typeof el.className === 'string'
                ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                : ''),
            ligaturen: cs.fontVariantLigatures,
            font: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
          });
        }

        return { monoElementen, overtreders: overtreders.slice(0, 25) };
      }, MONO_FAMILIES);

      // Zelfbewakende tak, in twee richtingen. Nul mono-elementen op een pagina die er hoort
      // te hebben = kapotte meting (font-stack hernoemd, pagina niet geladen), geen schone
      // pagina — dan toetst de assertie hieronder namelijk niets.
      if (PAGINAS_ZONDER_MONO.has(pad)) {
        expect(
          bevinding.monoElementen,
          `${pad} staat in PAGINAS_ZONDER_MONO maar draagt nu ` +
            `${bevinding.monoElementen} monospace-element(en). Haal hem uit die lijst — ` +
            'anders blijft er een uitzondering staan die niets meer uitzondert.'
        ).toBe(0);
      } else {
        expect(
          bevinding.monoElementen,
          `${pad}: NUL monospace-elementen gevonden. Deze sweep toetst hier niets — ` +
            'controleer of --font-terminal nog naar een van MONO_FAMILIES verwijst, of ' +
            'zet de pagina in PAGINAS_ZONDER_MONO als hij echt geen mono-tekst heeft.'
        ).toBeGreaterThan(0);
      }

      expect(
        bevinding.overtreders,
        `${pad}: ${bevinding.overtreders.length} mono-element(en) zonder ` +
          '`font-variant-ligatures: none`. Die renderen `>=` als ≥ en `->` als →.'
      ).toEqual([]);
    });
  }
});

// ============================================================================
// B — WERKING: gerenderde pixels op de echte terminal
// ============================================================================

test.describe('B - de ligaturen vuren aantoonbaar niet', () => {
  test('probe rendert identiek aan `none` en anders dan `normal`', async ({ page }) => {
    await page.goto('/terminal.html');

    // De legal-modal blokkeert de bootsequentie: zolang hij openstaat appendt de terminal
    // NUL regels. Wachten tot hij zichtbaar is en hem dan wegklikken — een directe
    // `isVisible()` op t=0 geeft `false` en slaat hem over, want de klasse `active` valt pas
    // rond 800ms. Gemeten: zonder deze wachttijd blijft #terminal-output 6s later nog leeg.
    // Dezelfde valstrik als de flaky autocomplete-spec uit Sessie 227.
    const legal = page.locator('#legal-modal');
    await expect(legal).toBeVisible({ timeout: 10000 });
    await page.click('#legal-accept-btn');
    await expect(legal).toBeHidden();

    await bevriesAnimaties(page);
    await page.evaluate(() => document.fonts.ready);

    // De bootsequentie appendt regels aan #terminal-output ná het laden. Injecteer de probe
    // pas als dat stil ligt, anders verschuift de layout tussen twee screenshots in.
    await page.waitForFunction(
      () => {
        const n = document.querySelectorAll('#terminal-output .terminal-line').length;
        const stabiel = window.__vorigeRegelTelling === n;
        window.__vorigeRegelTelling = n;
        return n > 0 && stabiel;
      },
      null,
      { timeout: 15000, polling: 400 }
    );

    // Probe IN #terminal-output, zodat hij de echte terminal-fontstack erft in plaats van
    // een nagebouwde. Eén element voor alle drie de metingen: zelfde positie, zelfde
    // achtergrond, zelfde subpixel-rasterisatie — elk pixelverschil is dan puur shaping.
    //
    // Bewust een <div>, GEEN <pre>: de UA-stylesheet zet op <pre> een eigen
    // `font-family: monospace`, en een UA-declaratie op het element zelf verslaat overerving.
    // De eerste versie hiervan rendeerde daardoor in de generieke browser-monospace (die niet
    // ligeert) i.p.v. in JetBrains Mono — gemeten: computed fontFamily was "monospace".
    //
    // `position: fixed` + een dékkende achtergrond: de probe blijft een DOM-kind van
    // #terminal-output (dus erft de fontstack), maar staat buiten de flow. Zonder dat
    // verschoof hij tussen de drie screenshots mee met de terminal-scroll en verschilden de
    // beelden op layout i.p.v. op shaping — assertie 2 werd daar intermitterend rood van.
    // Wélke achtergrondkleur maakt niet uit; alleen dat hij ondoorzichtig is.
    await page.evaluate((regels) => {
      const probe = document.createElement('div');
      probe.id = 'ligatuur-probe';
      probe.style.cssText =
        'position:fixed;top:120px;left:8px;z-index:2147483647;margin:0;padding:8px;' +
        'white-space:pre;background:var(--color-bg);';
      probe.textContent = regels.join('\n');
      document.querySelector('#terminal-output').prepend(probe);
    }, PROBE);

    const probe = page.locator('#ligatuur-probe');
    await expect(probe).toBeVisible();

    // Meet de probe zelf vóór je hem als meetinstrument gebruikt: rendert hij niet in de
    // terminal-fontstack, dan meet de rest van deze test een ander font dan de site toont.
    const probeFont = await probe.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(
      probeFont.toLowerCase(),
      'De probe erft de terminal-fontstack niet — deze test zou een ander font meten dan ' +
        'de site toont. Controleer of #terminal-output nog var(--font-terminal) draagt en ' +
        'of het probe-element geen eigen UA-font-family krijgt (<pre>, <code>, <kbd>).'
    ).toContain('jetbrains mono');

    const zetLigaturen = (waarde) =>
      page.evaluate((v) => {
        document.querySelector('#ligatuur-probe').style.fontVariantLigatures = v;
      }, waarde);

    const shotPagina = await probe.screenshot();      // wat de site feitelijk toont
    await zetLigaturen('normal');
    const shotAan = await probe.screenshot();         // browserdefault = de situatie vóór de fix
    await zetLigaturen('none');
    const shotUit = await probe.screenshot();         // expliciet onderdrukt

    // Tak 1 — ZELFBEWAKEND. Zijn 'normal' en 'none' identiek, dan ligeert dit font niet:
    // het webfont laadde niet (fallback Courier New heeft geen calt) of de probe raakt geen
    // enkele ligatuur-sequentie meer. In beide gevallen bewijst tak 2 niets, en zou hij
    // groen blijven ook als de fix verdwenen was.
    expect(
      shotAan.equals(shotUit),
      'De probe rendert identiek mét en zonder ligaturen. Deze meting kan niets aantonen — ' +
        'controleer of styles/fonts/jetbrainsmono-latin.woff2 laadt en of PROBE nog ' +
        'ligerende sequenties bevat (>=, ->, !=, _|_).'
    ).toBe(false);

    // Tak 2 — de eigenlijke assertie: de pagina onderdrukt de ligaturen.
    expect(
      shotPagina.equals(shotUit),
      'De terminal rendert niet zoals `font-variant-ligatures: none`. `>=` toont dan als ≥ ' +
        'en `$pdo->prepare` als `$pdo→prepare` — zie de regel in styles/main.css.'
    ).toBe(true);
  });
});
