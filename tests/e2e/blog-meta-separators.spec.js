/**
 * Scheidingstekens in de blog-meta-rij (Sessie 225)
 *
 * De `|` tussen datum, leestijd en categorie staat NERGENS in de HTML. Hij komt uit
 * `styles/blog.css`, als `::after` op elk kind van `.blog-post-meta` dat niet het laatste is.
 * Een `::after` is een kind BINNEN de box van zijn drager — onzichtbaar op een transparant
 * element, maar `.category-badge` heeft background + padding + border-radius, dus de tint werd
 * geverfd over `Beginners` + 8px marge + de glyph `|` + 8px rechterpadding.
 *
 * Nulmeting op /blog/leren-hacken.html (identiek in light en dark, alleen de tint verschilt):
 *
 *   breedte   badge-box   tekst+padding   overschot   layout
 *      375      105,8px       89,6px        16,2      kolom
 *     1280      115,4px       98,2px        17,1      rij
 *
 * De bug ontstond in Sessie 208: tot toen was de badge het laatste kind en matchte
 * `:not(:last-child)` hem niet. Die sessie plakte `.blog-ai-notice` erachter. Tweede keer dat
 * een positioneel gebonden regel in exact deze rij stil van doel wisselde — de eerste was de
 * kleurbug die Sessie 223 repareerde (zie het commentaar bij `.blog-post-meta` in blog.css).
 *
 * Twee defecten uit dezelfde regel die niet gemeld waren maar wel gemeten:
 *   - Het scheidingsteken zit vast aan het VORIGE item en overleeft dus een regeleinde. Op
 *     ≤768px is deze rij `flex-direction: column` en eindigde elke gestapelde regel in een
 *     losse `|` die niets scheidde; op desktop hing hij aan het eind van regel 1.
 *   - `margin-left` op `:not(:first-child)` wordt door `align-items: center` meegecentreerd,
 *     dus in kolom-layout stond het eerste item 4px links van de rest (180,0 / 184,0 / 184,0).
 *
 * Drie asserties, want ze falen op verschillende verzamelingen (mutanten hieronder):
 *   A  een element met een eigen achtergrond sluit om zijn eigen tekst
 *   B  het laatste item van een visuele regel draagt geen scheidingsteken
 *   C  in kolom-layout staan alle items op dezelfde horizontale as
 *
 * Mutanten — vijf, gemeten op chromium (12 declaraties per run), vier faalpatronen:
 *
 *   #   mutatie                                                  A  B  C   rood op      falers
 *   M1  `:not(.category-badge)` weg uit de separator-selector    x  .  .   769, 1280       6
 *   M2  `@media (min-width: 769px)` ontkracht (-> min-width:1px) .  x  .   375, 768        6
 *   M3  `column-gap` weg, `margin-left` op :not(:first-child)    .  .  x   375, 768        6
 *   M4  een 5e <span> achter .blog-ai-notice (= wat S208 deed)   .  x  .   769, 1280       2
 *   M5  `background` op het transparante `8 min`-item            x  .  .   769, 1280       6
 *
 * Twee voorspellingen klopten niet en dat is informatief: ik verwachtte dat M1 en M2 allebei
 * A én B rood zouden maken. Ze raken elk maar één assertie, want de twee helften van de fix
 * zijn onafhankelijk — M1 haalt alleen de badge-uitsluiting weg (de badge verft dan over zijn
 * pipe: A), M2 alleen de scoping (de badge blijft uitgesloten, dus in kolom-layout bungelen
 * uitsluitend <time> en `8 min`: B).
 *
 * M4 en M5 zijn het paar dat bewijst dat A noch B overbodig is: zelfde breedtes, tegengestelde
 * assertie. M4 laat een item zonder achtergrond bungelen (A ziet niets), M5 geeft een item
 * midden op de regel een achtergrond (B ziet niets). M3 raakt als enige C.
 * Alle vijf zijn ná de mutatie met `diff -q` gecontroleerd: een mutant die het bestand niet
 * verandert is groen om de verkeerde reden (Sessie 223).
 *
 * Geen themalus: de geometrie is gemeten identiek in light en dark (115,4 -> 98,2 in beide).
 * Alleen de tintkleur verschilt en die wordt hier niet geasserteerd.
 */
import { test, expect } from './fixtures.js';

// Drie posts met drie verschillende badge-teksten, zodat de fix niet op één tekstbreedte
// wordt bewezen. De HTML van de meta-rij is identiek in alle 15 posts.
const POSTS = [
  { pad: '/blog/leren-hacken.html', badge: 'Beginners' },
  { pad: '/blog/wat-is-ethisch-hacken.html', badge: 'Concepten' },
  { pad: '/blog/nmap-beginnersgids.html', badge: 'Tools' },
];

// 768 en 769 liggen aan weerszijden van de mediaquery-grens: daar leeft of sterft de scoping
// van de separator-regel. 375 is de telefoonmaat, 1280 de gemelde maat.
const BREEDTES = [375, 768, 769, 1280];

// Firefox en WebKit meten consequent tot 1px anders dan chromium op dezelfde tekst.
const SUBPIXEL = 1;

const METING = async () => {
  const rij = document.querySelector('.blog-post-meta');
  if (!rij) return { rij: null };

  // De headingfont wordt pas aangevraagd zodra er tekst mee gerenderd wordt; `fonts.ready`
  // alleen resolvet dan te vroeg en je meet fallback-metrics (Sessie 222).
  const cs = getComputedStyle(rij);
  try {
    await document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
  } catch (_) { /* fallback-font: dan valt er niets te laden */ }
  await document.fonts.ready;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const kinderen = [...rij.children].map((el) => {
    const r = el.getBoundingClientRect();
    const stijl = getComputedStyle(el);
    const na = getComputedStyle(el, '::after');

    // Range telt pseudo-elementen NIET mee, dus het verschil met de border-box is precies
    // wat het ::after-teken + zijn marge binnen de geverfde box innemen.
    let tekstRechts = null;
    if (el.childNodes.length > 0) {
      const bereik = document.createRange();
      bereik.selectNodeContents(el);
      const t = bereik.getBoundingClientRect();
      if (t.width > 0) tekstRechts = t.right;
    }

    const bg = stijl.backgroundColor;
    const alpha = (() => {
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (!m) return 0;
      const d = m[1].split(',').map((v) => parseFloat(v));
      return d.length < 4 ? 1 : d[3];
    })();

    return {
      naam: el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
      tekst: (el.textContent || '').trim().slice(0, 30),
      top: r.top,
      bottom: r.bottom,
      breedte: r.width,
      rechts: r.right,
      midden: r.left + r.width / 2,
      tekstRechts,
      paddingRechts: parseFloat(stijl.paddingRight) || 0,
      achtergrondAlpha: alpha,
      achtergrond: bg,
      scheidingsteken: na.content,
    };
  });

  const badges = rij.querySelectorAll('.category-badge');

  return {
    rij: true,
    richting: cs.flexDirection,
    kinderen,
    aantalBadges: badges.length,
    badgeTekst: badges.length ? (badges[0].textContent || '').trim() : null,
    badgeBreedte: badges.length ? badges[0].getBoundingClientRect().width : 0,
  };
};

// Twee items staan op dezelfde visuele regel als hun boxen verticaal overlappen. Niet op
// gelijke `top` toetsen: align-items:center geeft de badge een andere hoogte dan zijn buren
// (gemeten @769px: top 306 naast 307). In kolom-layout is de overlap exact nul.
const zelfdeRegel = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;

const heeftScheidingsteken = (k) =>
  k.scheidingsteken && k.scheidingsteken !== 'none' && k.scheidingsteken !== '""';

test.describe('Blog-meta-rij — scheidingstekens blijven buiten de geverfde badge', () => {

  for (const post of POSTS) {
    for (const breedte of BREEDTES) {
      test(`${post.pad} @${breedte}px: badge sluit om zijn tekst, geen los scheidingsteken`, async ({ page }) => {
        await page.setViewportSize({ width: breedte, height: 900 });
        const respons = await page.goto(post.pad);

        // Zelfbewaking: een 404 of een gewijzigde structuur heeft nul scheidingstekens en zou
        // deze test groen laten staan zonder iets te meten.
        expect(respons?.status(), `${post.pad} gaf HTTP ${respons?.status()}`).toBe(200);

        const m = await page.evaluate(METING);
        const context = `${post.pad} @${breedte}px`;

        expect(m.rij, `${context}: geen .blog-post-meta gevonden — meet deze test nog wel iets?`).toBe(true);
        expect(m.aantalBadges, `${context}: verwacht precies één .category-badge`).toBe(1);
        expect(m.badgeTekst, `${context}: de badge is leeg`).toBe(post.badge);
        expect(m.badgeBreedte, `${context}: de badge heeft breedte 0`).toBeGreaterThan(0);

        // A — een element met een eigen achtergrond verft niet buiten zijn eigen tekst. Generiek:
        // dit vangt élk toekomstig item met achtergrond in deze rij, niet alleen de badge.
        const teVer = m.kinderen
          .filter((k) => k.achtergrondAlpha > 0 && k.tekstRechts !== null)
          .map((k) => ({ k, over: k.rechts - k.tekstRechts - k.paddingRechts }))
          .filter(({ over }) => over > SUBPIXEL)
          .map(({ k, over }) =>
            `${k.naam} "${k.tekst}" verft ${over.toFixed(1)}px voorbij zijn tekst ` +
            `(box tot ${k.rechts.toFixed(1)}, tekst tot ${k.tekstRechts.toFixed(1)}, ` +
            `padding-right ${k.paddingRechts}, bg ${k.achtergrond})`);
        expect(
          teVer,
          `${context}: een geverfde achtergrond loopt door over een ::after-scheidingsteken. ` +
            `Staat .category-badge nog uitgesloten in de separator-selector in styles/blog.css?`
        ).toEqual([]);

        // B — het laatste item van een visuele regel draagt geen scheidingsteken. Eén predicaat
        // dekt zowel de wrap op desktop als de kolom-layout op mobiel.
        const bungelt = m.kinderen
          .map((k, i) => ({ k, i }))
          .filter(({ k, i }) =>
            heeftScheidingsteken(k) &&
            !m.kinderen.slice(i + 1).some((volgende) => zelfdeRegel(k, volgende)))
          .map(({ k }) =>
            `${k.naam} "${k.tekst}" draagt ${k.scheidingsteken} maar heeft geen buur op zijn regel`);
        expect(
          bungelt,
          `${context}: een scheidingsteken scheidt niets (richting: ${m.richting}). ` +
            `Staat de separator-regel nog gescoped op @media (min-width: 769px)?`
        ).toEqual([]);

        // C — in kolom-layout staan alle items op dezelfde horizontale as. Alleen daar: in
        // rij-layout hebben items per definitie verschillende centers.
        if (m.richting === 'column') {
          const middens = m.kinderen.map((k) => k.midden);
          const spreiding = Math.max(...middens) - Math.min(...middens);
          expect(
            spreiding,
            `${context}: de gestapelde items staan ${spreiding.toFixed(1)}px uit elkaar ` +
              `gecentreerd (${m.kinderen.map((k) => `${k.naam} ${k.midden.toFixed(1)}`).join(', ')}). ` +
              `Staat er weer een margin-left op .blog-post-meta > :not(:first-child)?`
          ).toBeLessThanOrEqual(SUBPIXEL);
        }
      });
    }
  }
});
