// Gedeelde contrastmeter voor de WCAG-specs (Sessie 227)
//
// Deze code draait IN DE BROWSER, niet in Node. `page.evaluate()` serialiseert de callback,
// dus een gewone import is daarbinnen niet zichtbaar — vandaar dat elke spec zijn eigen
// kopie had. Bij de derde kopie (link-contrast) is dat een lockstep-probleem geworden:
// `accent-text-contrast.spec.js` en `eyebrow-contrast.spec.js` droegen allebei een eigen
// `effBg()`, en die moeten identiek blijven om vergelijkbare cijfers te geven.
//
// Oplossing: installeer de meter één keer op `window.__contrast` en laat elke evaluate hem
// daar vandaan halen. Geen `new Function`, geen bronstring-truc.
//
// ── De twee meetvallen die deze helper afdekt ────────────────────────────────────────────
//
//  1. Contrast hoort tegen de EFFECTIEVE achtergrond, niet tegen `--color-bg`.
//     `getComputedStyle(el).backgroundColor` geeft bij een badge `rgba(22,163,74,0.08)` —
//     geen kleur waar je tegen kúnt meten. Wie dan naar de paginakleur grijpt meet de laag
//     ONDER de verf. Zo ontstond de 3,10:1 in architecture-patterns.md §10, waar 2,85 het
//     antwoord was. `effBg()` loopt de ancestor-keten omhoog en composite tot de eerste
//     laag met `alpha === 1`.
//
//  2. Meten in dezelfde tick als een themawissel geeft de STARTWAARDE van een lopende
//     transitie. Diverse regels dragen `transition: color .15s` en `.related-card` zelfs
//     `transition: .15s` op alles. Sessie 226 rapporteerde daardoor bijna twee ernstige
//     light-mode-defecten (2,90 en 1,78) die na settelen 9,17 en 9,74 bleken — allebei AAA.
//     Diagnostisch signaal: komt een gemeten kleur met GEEN enkel token overeen, dan meet je
//     een tussenframe. Gebruik `zetThema()`, die wacht.

/**
 * Wachttijd na een themawissel voordat kleuren én achtergronden stabiel zijn.
 *
 * 400 ms was niet genoeg. Gemeten in Sessie 227: `.related-card .related-category` gaf in
 * LIGHT een contrast van 1,70:1 tegen rgb(32,44,56) — en rgb(32,44,56) is de badge-rgba
 * gecomposite over de DONKERE kaartkleur. De effectieve ACHTERGROND liep dus nog achter,
 * niet de tekstkleur. Sessie 226 noteerde ditzelfde element al: na 700 ms settelen kwamen
 * twee "ernstige defecten" (2,90 en 1,78) uit op 9,17 en 9,74.
 *
 * Diagnostisch signaal: komt een gemeten kleur OF achtergrond met geen enkel token overeen,
 * dan meet je een tussenframe.
 */
export const THEMA_SETTLE_MS = 700;

/**
 * Installeer de contrastmeter op `window.__contrast` van de HUIDIGE pagina.
 *
 * Moet ná `page.goto()` — een navigatie gooit `window` weg. Idempotent, dus een tweede
 * aanroep binnen dezelfde pagina is gratis.
 *
 * Beschikbaar daarna binnen elke `page.evaluate`:
 *   parse(css)        → {r,g,b,a} uit `rgb()`, `rgba()` of `#rrggbb` (tokens zijn hex)
 *   over(voor, achter)→ alpha-compositie van twee kleuren
 *   L(kleur)          → relatieve luminantie (WCAG)
 *   ratio(a, b)       → contrastverhouding, afgerond op 2 decimalen
 *   effBg(el)         → effectieve (gecomposite) achtergrond van een element
 *   eigenTekst(el)    → rendert dit element ZELF een tekstnode?
 *   isGroot(cs)       → large text volgens WCAG (≥24px, of ≥18,66px én bold)
 *   effOpacity(el)    → cumulatieve opacity van el + voorouders
 *   rendert(el)       → heeft rects, opacity > 0 en niet-transparante tekstkleur
 *   gelijk(a, b)      → kleurvergelijking op rgb, alpha genegeerd
 *   omschrijf(el)     → korte selector-achtige aanduiding voor foutmeldingen
 *
 * @param {import('@playwright/test').Page} page
 */
export async function installeerContrastMeter(page) {
  await page.evaluate(() => {
    if (window.__contrast) return;

    // Accepteert óók hex, want tokens komen via getPropertyValue binnen als '#rrggbb'.
    const parse = (c) => {
      if (!c) return null;
      const h = c.trim().match(/^#([0-9a-f]{6})$/i);
      if (h) {
        const n = parseInt(h[1], 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
      }
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(',').map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };

    const over = (f, b) => ({
      r: f.r * f.a + b.r * (1 - f.a),
      g: f.g * f.a + b.g * (1 - f.a),
      b: f.b * f.a + b.b * (1 - f.a),
      a: 1,
    });

    const lin = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);

    const ratio = (a, b) => {
      const x = L(a) + 0.05;
      const y = L(b) + 0.05;
      return Math.round((100 * Math.max(x, y)) / Math.min(x, y)) / 100;
    };

    const effBg = (el) => {
      const stapel = [];
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0) stapel.push(c);
        if (c && c.a === 1) break;
      }
      let acc = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = stapel.length - 1; i >= 0; i--) acc = over(stapel[i], acc);
      return acc;
    };

    // Een container die de kleur alleen doorgeeft aan kinderen telt niet mee — anders wordt
    // elke voorouder dubbel geteld en schiet de populatie op.
    const eigenTekst = (el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);

    const isGroot = (cs) => {
      const px = parseFloat(cs.fontSize);
      return px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
    };

    const gelijk = (a, b) => a && b && a.r === b.r && a.g === b.g && a.b === b.b;

    // Cumulatieve opacity van het element én al zijn voorouders. `opacity` erft niet, maar
    // stapelt wel: een kind van een `opacity: 0`-container is onzichtbaar hoe ondoorzichtig
    // het zelf ook is.
    const effOpacity = (el) => {
      let o = 1;
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const v = parseFloat(getComputedStyle(n).opacity);
        if (!Number.isNaN(v)) o *= v;
      }
      return o;
    };

    // Rendert dit element daadwerkelijk zichtbare tekst?
    //
    // `getComputedStyle(el).color` blijft gewoon een kleur teruggeven voor iets dat niemand
    // ziet — een sweep die daar niet op filtert rapporteert defecten op onzichtbare
    // elementen. Gemeten in Sessie 228: `.toggle-indicator` staat op `opacity: 0` behalve
    // in de active-pill, en leverde 54 valse metingen op (waaronder 1,00:1).
    //
    // `visibility: hidden` telt hier NIET als onzichtbaar-en-dus-overslaan: zulke elementen
    // houden hun rects en worden zichtbaar zodra een toestand omklapt (zie
    // architecture-patterns §11), dus hun kleur moet kloppen. Volledig transparante tekst
    // (`color: …, 0`) rendert per definitie niets en valt af.
    const rendert = (el) => {
      if (el.getClientRects().length === 0) return false;
      if (effOpacity(el) === 0) return false;
      const c = parse(getComputedStyle(el).color);
      return !!c && c.a > 0;
    };

    const omschrijf = (el) => {
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += '#' + el.id;
      else if (el.className && typeof el.className === 'string')
        sel += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
      return sel;
    };

    window.__contrast = {
      parse, over, lin, L, ratio, effBg, eigenTekst, isGroot, gelijk, omschrijf,
      effOpacity, rendert,
    };
  });
}

/**
 * Zet alle transities en animaties uit voor de rest van deze pagina.
 *
 * Wachten is hier niet genoeg gebleken. Met alleen een `waitForTimeout` mat de sweep van
 * Sessie 227 `.related-category` in light de ene run op 7,88 (correct, tegen de badge over
 * de witte kaart) en de andere run op 1,70 tegen rgb(32,44,56) — de badge over de DONKERE
 * kaartkleur. Ook het aantal gemeten elementen wisselde per run (106 vs 110 op dezelfde
 * pagina), want de fade-ins uit `animations.css` bepalen wanneer een kaart zijn eindstaat
 * heeft. Een guard die soms 1,70 meet gaat willekeurig rood.
 *
 * Transities uitzetten haalt de race weg in plaats van hem te overleven: `getComputedStyle`
 * geeft dan per definitie de eindwaarde. `!important` is hier het juiste gereedschap — dit
 * is een meetinstrument dat auteur-transities MOET verslaan, geen productie-CSS.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function bevriesAnimaties(page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }`,
  });
}

/**
 * Scroll de pagina één keer helemaal door, zodat scroll-onthulde inhoud daadwerkelijk
 * zichtbaar wordt, en keer daarna terug naar boven.
 *
 * Zonder dit meet een sweep alleen wat boven de vouw staat. `.leerpad-card` (landing.css
 * :1328) staat op `opacity: 0` en krijgt pas `.visible` van een IntersectionObserver;
 * hetzelfde patroon staat op drie andere kaartgroepen ("Entrance animation"). Gemeten in
 * Sessie 228: zonder scrollen viel de hele `.level-badge`-groep buiten de populatie — en
 * díé bevat het laagste contrast van de site (1,74:1).
 *
 * Let op de volgorde: dit hoort ná `bevriesAnimaties()`, want dan klapt `.visible`
 * onmiddellijk door in plaats van over een transitie. `behavior: 'instant'` is nodig omdat
 * `animations.css` `html { scroll-behavior: smooth }` zet — een smooth scroll levert
 * tussenposities op en de observers vuren dan op een andere plek dan bedoeld.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function onthulAlles(page) {
  await page.evaluate(async () => {
    const stap = Math.round(window.innerHeight * 0.8);
    const eind = document.documentElement.scrollHeight;
    for (let y = 0; y < eind + stap; y += stap) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 150));
  });
}

/**
 * Zet het thema en wacht tot kleuren én achtergronden stabiel zijn.
 *
 * Bevriest eerst de animaties, zodat de wachttijd alleen nog de layout hoeft op te vangen
 * en niet een lopende fade. Uitlezen in dezelfde tick meet een tussenframe — zie de kop.
 *
 * @param {import('@playwright/test').Page} page
 * @param {'light'|'dark'} thema
 */
export async function zetThema(page, thema) {
  await bevriesAnimaties(page);
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);

    // `data-theme` is niet de enige themastaat op de pagina. `navbar.js:290`
    // (`updateThemeToggleUI`) verplaatst óók de `.active`-klasse op `.toggle-option`, en
    // `.toggle-option.active` draagt een eigen achtergrond-pill. Zetten we alleen het
    // attribuut, dan spreekt de toggle het thema tegen en meten we een combinatie die op
    // de echte site niet bestaat.
    //
    // Gemeten gevolg in Sessie 228: de `.toggle-indicator` in de active-pill kwam uit op
    // 1,00:1 (`--color-button-bg` op `--color-button-bg`) — een "defect" op een element
    // dat daar `opacity: 0` heeft. Twee valse positieven over 27 pagina's.
    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(t === 'light'));
      toggle.querySelectorAll('.toggle-option').forEach((optie) => {
        optie.classList.toggle('active', optie.dataset.theme === t);
      });
    });
  }, thema);
  await page.waitForTimeout(THEMA_SETTLE_MS);
}

/** WCAG-drempels. Large text = ≥24px, of ≥18,66px én bold. */
export const LAT = {
  AA: (groot) => (groot ? 3 : 4.5),
  AAA: (groot) => (groot ? 4.5 : 7),
};
