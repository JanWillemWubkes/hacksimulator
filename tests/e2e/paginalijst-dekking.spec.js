// E2E-guard: elke eigen paginalijst in de suite verantwoordt zich (Sessie 235)
//
// `helpers/paginas.js` is sinds Sessie 229 de gedeelde sitelijst, met bovenaan de instructie
// "Bij een NIEUWE pagina: hier toevoegen". Die instructie is correct en werd genegeerd — niet
// uit onwil, maar omdat je hem alleen leest als je dat bestand toch al opent, en wie een
// nieuwe spec schrijft opent hem juist niet. Een regel die alleen werkt bij wie hem al kent,
// is geen guard maar een hoop.
//
// Gemeten bij het schrijven van deze spec: ZEVEN specs houden een eigen padlijst aan. Dat is
// op zichzelf geen defect — vijf ervan zijn bewust gescopet op een populatie waar de rest van
// de site niets te meten heeft (een badge die er niet staat, een CSS-bestand dat niet laadt).
// Het defect is dat je aan een lijst niet ziet WELK van de twee hij is, en dat er niets rood
// wordt als hij stilletjes achterloopt op de site.
//
// Deze guard draait de populatie om: elke lijst moet zich melden, en de uitzonderingen
// verantwoorden zich met een reden die hier zwart op wit staat.
//
// Wat hij NIET doet: beoordelen of een scope inhoudelijk klopt. Dat kan een script niet. Hij
// dwingt af dat de keuze EXPLICIET is en dat de paden echt bestaan — de twee dingen die stil
// verrotten. De inhoudelijke vraag komt vanzelf terug zodra iemand hier een regel moet
// toevoegen.

import { test, expect } from './fixtures.js';
import { PAGINAS } from './helpers/paginas.js';
import fs from 'node:fs';
import path from 'node:path';

// Niet via `import.meta.url`: package.json heeft geen "type": "module", dus Playwright
// transpileert deze spec naar CJS en dan bestaat `import.meta` niet (ReferenceError op
// `require`). Playwright draait vanuit de map van playwright.config.js, waar ook testDir
// './tests/e2e' aan hangt — dus is cwd de projectwortel. Dat is een aanname, en die wordt
// hieronder geasserteerd i.p.v. gehoopt.
const WORTEL = process.cwd();
const HIER = path.join(WORTEL, 'tests', 'e2e');

/**
 * Specs die bewust op een deelverzameling meten, met de reden erbij.
 *
 * Toevoegen betekent een bewering doen die iemand kan nalopen. Schrijf dus WAAROM de rest
 * van de site hier niets te meten heeft, niet dat het nu eenmaal zo staat.
 */
const GESCOPET = {
  'blog-meta-separators.spec.js':
    'De |-scheiding komt uit een enkele ::after-regel in blog.css die op elke post identiek ' +
    'landt; drie posts bewijzen dezelfde regel als zestien.',
  'eyebrow-contrast.spec.js':
    'Alleen de pagina\'s die een .eyebrow-badge dragen. Elders is de populatie leeg, en een ' +
    'lege populatie is altijd groen (zie meten-en-guards.md #20).',
  'footer-reserve.spec.js':
    'Alleen pagina\'s met body.landing-page, want de reserve die hij meet bestaat alleen ' +
    'onder de mobiele CTA-balk van die layout.',
  'lead-magnet.spec.js':
    'De twee sample-pagina\'s zijn structurele tweelingen; de gedeelde scenario\'s draaien ' +
    'geparametriseerd i.p.v. dubbel uitgeschreven.',
  'legal-pages-overflow.spec.js':
    'De drie legal-pagina\'s laden mobile.css NIET, waardoor --font-size-base op mobiel 18px ' +
    'blijft. Die spec bestaat juist omdat ze in geen enkele andere assertie voorkwamen.',

  // ── De twee hieronder zijn GEEN bewuste scope maar een gemeten subset ─────────────────
  // Sessie 228 bouwde text-contrast.spec.js expliciet als de ONGEFILTERDE opvolger van deze
  // twee: 30 pagina's x 2 thema's x 2 viewports, elk element dat zelf tekst rendert, plus
  // dezelfde token-matrix voor de hover-paren (HOVER_PAREN bevat --color-link/-hover).
  // Met mutanten gemeten in Sessie 235, tegen een no-store server:
  //   --color-accent-text -> #9fef00  accent-spec 4 failed  | text-contrast ook rood (246x
  //                                                            rgb(159,239,0) op /index.html)
  //   --color-link -> #0969da         link-spec 1 failed    | text-contrast ook rood (12x
  //                                                            rgb(9,105,218) op /over-ons.html)
  // Beide dus redundant. Ze staan hier geregistreerd zodat deze guard groen is; de beslissing
  // om ze te verwijderen ligt bij de eigenaar van de suite.
  'accent-text-contrast.spec.js':
    'Subset van text-contrast.spec.js (ongefilterd, 30 pagina\'s, 2 viewports). Met mutanten ' +
    'gemeten redundant — kandidaat voor verwijdering.',
  'link-contrast.spec.js':
    'Subset van text-contrast.spec.js, inclusief de token-matrix voor de hover-paren. Met ' +
    'mutanten gemeten redundant — kandidaat voor verwijdering.',
};

// Een losse `const PAGINA = '/over-ons.html'` is een testfixture, geen paginalijst. De grens
// ligt daarom op twee of meer paden in dezelfde array-literal.
const DREMPEL = 2;

const PAD_IN_STRING = /['"](\/[A-Za-z0-9._/-]*\.html)['"]/g;
const ARRAY_LITERAL = /^const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\[(.*?)^\];/gms;

/** Alle spec-bestanden met een eigen padlijst, als { bestand, constante, paden }. */
function vindPadlijsten() {
  const gevonden = [];
  const bestanden = fs
    .readdirSync(HIER)
    .filter((n) => n.endsWith('.spec.js'))
    .sort();

  for (const bestand of bestanden) {
    const bron = fs.readFileSync(path.join(HIER, bestand), 'utf-8');
    for (const [, constante, body] of bron.matchAll(ARRAY_LITERAL)) {
      const paden = [...body.matchAll(PAD_IN_STRING)].map((m) => m[1]);
      if (paden.length >= DREMPEL) gevonden.push({ bestand, constante, paden });
    }
  }

  return { gevonden, aantalBestanden: bestanden.length };
}

test.describe('Paginalijsten in de suite', () => {

  test('elke eigen paginalijst staat geregistreerd met een reden', () => {
    const { gevonden, aantalBestanden } = vindPadlijsten();

    // Zelfbewaking: een scan die niets vindt ziet er identiek uit aan een schone suite.
    expect(
      fs.existsSync(HIER),
      `${HIER} bestaat niet — cwd is ${WORTEL} en dat is niet de projectwortel, dus deze ` +
        'scan zou over nul bestanden lopen en groen melden.'
    ).toBe(true);
    expect(aantalBestanden, 'geen enkel .spec.js gevonden — draait deze scan wel in tests/e2e?')
      .toBeGreaterThan(10);
    expect(
      gevonden.length,
      'nul padlijsten gevonden terwijl er er zeven waren — de regex matcht niet meer op de ' +
        'vorm van de bronbestanden, dus deze guard meet niets.'
    ).toBeGreaterThan(0);

    const onbekend = gevonden
      .filter((g) => !(g.bestand in GESCOPET))
      .map((g) => `${g.bestand} → ${g.constante} (${g.paden.length} paden)`);

    expect(
      onbekend,
      'Deze spec(s) houden een eigen paginalijst aan zonder registratie.\n' +
        'Kies één van twee, en doe dat bewust:\n' +
        "  1. Meet je de hele site? Importeer dan { PAGINAS } uit './helpers/paginas.js' —\n" +
        '     dan groeit de spec vanzelf mee met een nieuwe pagina.\n' +
        '  2. Is de scope echt beperkt? Zet hem dan in GESCOPET in deze spec, mét de reden\n' +
        '     waarom de rest van de site hier niets te meten heeft.'
    ).toEqual([]);
  });

  test('geen registratie zonder bijbehorende lijst', () => {
    const { gevonden } = vindPadlijsten();
    const metLijst = new Set(gevonden.map((g) => g.bestand));

    const dood = Object.keys(GESCOPET).filter((b) => !metLijst.has(b));
    expect(
      dood,
      `GESCOPET noemt ${dood.join(', ')}, maar die spec(s) hebben geen eigen paginalijst meer ` +
        '(hernoemd, verwijderd, of alsnog op PAGINAS gezet). Haal de registratie weg — een ' +
        'uitzondering die niets meer uitzondert leest als een afspraak die nog geldt.'
    ).toEqual([]);
  });

  test('elk gescopet pad bestaat ook in de sitelijst', () => {
    const { gevonden } = vindPadlijsten();
    const sitelijst = new Set(PAGINAS);

    const wees = [];
    for (const g of gevonden) {
      for (const pad of g.paden) {
        if (!sitelijst.has(pad)) wees.push(`${g.bestand} → ${g.constante}: ${pad}`);
      }
    }

    expect(
      wees,
      'Deze paden staan in een spec maar niet in helpers/paginas.js. Ofwel de pagina is ' +
        'hernoemd of weg (en de spec meet sindsdien over een 404), ofwel hij ontbreekt in de ' +
        'sitelijst en wordt door de sitebrede sweeps overgeslagen.'
    ).toEqual([]);
  });

  test('elk pad in de sitelijst wijst naar een bestaand bestand', () => {
    const ontbreekt = PAGINAS.filter(
      (pad) => !fs.existsSync(path.join(WORTEL, pad.replace(/^\//, '')))
    );

    expect(
      ontbreekt,
      `helpers/paginas.js noemt ${ontbreekt.join(', ')}, maar die bestand(en) staan niet in de ` +
        'repo. Een sweep hierover meet de 404-pagina en meldt vrolijk groen.'
    ).toEqual([]);

    // Zelfbewaking: de check hierboven is betekenisloos op een lege lijst.
    expect(PAGINAS.length, 'PAGINAS is leeg').toBeGreaterThanOrEqual(25);
  });
});
