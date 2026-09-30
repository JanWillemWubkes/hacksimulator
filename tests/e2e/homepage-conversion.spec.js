// E2E Tests voor de conversie-structuur van de homepage (Sessie 214)
//
// Achtergrond: de homepage is gebouwd op de 9-staps conversietrechter uit
// `docs/landing-page-plan.md` (jan 2026). Drie stappen leunden daar op placeholder-cijfers
// ("1.200+ gebruikers" 2×, drie testimonials) die terecht nooit zijn geplaatst — waardoor
// stap 6 en 8 hol achterbleven. Deze suite bewaakt de structurele eigenschappen die daarna
// zijn hersteld, plus de twee lockstep-locaties die er bij het herstel bijna aan gingen.
//
// Nulmeting vóór de wijzigingen (375×812, verse bezoeker, commit d912f9b):
//   CTA-gat 4179px (5,1 schermen) · 7 verschillende CTA-labels · 1125 woorden in <main>
//   19 bloglinks in <main> · 25 tikdoelen <44px · 16 blokken onzichtbaar zonder JS
//
// De meeste asserties hier zijn geschreven vóór de fix en waren toen rood.

import { test, expect } from './fixtures.js';
import fs from 'fs';
import path from 'path';
import { zetThema } from './helpers/contrast.js';

const MOBIEL = { width: 375, height: 812 };

// Tikdoelen <44px die bewust buiten scope vallen. Geen tuning om de test groen te
// krijgen: dit zijn de enige twee waarvan vergroten de visuele identiteit raakt, want
// hun hoogte volgt uit de logo-typografie. De rest van de gevonden kleine doelen
// (blog-chips, leerpad-knoppen, "lees eerst"-links, footer-donatie en de GitHub-iconen)
// is wél gerepareerd, ook waar dat een gedeeld component raakte.
//   .skip-link   — verborgen tot toetsenbordfocus; geen aanwijsdoel, wel focusbaar
//   .nav-brand / .footer-logo — woordmerk; hoogte = tekstgrootte van het logo
const BUITEN_SCOPE_TIKDOEL = ['skip-link', 'nav-brand', 'footer-logo'];

async function meetHomepage(page) {
  return page.evaluate(async (buitenScope) => {
    // Wachten op de webfont is niet optioneel: de tikdoel-meting hangt aan line-height,
    // en Inter/Space Grotesk verschillen genoeg van de fallback om onder parallelle load
    // een element net boven of net onder de 44px-grens te laten uitkomen.
    await document.fonts.ready;

    const zichtbaar = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const ctas = [...document.querySelectorAll('a[href*="terminal.html"]')]
      .filter(zichtbaar)
      .map((a) => ({
        label: a.textContent.trim().replace(/\s+/g, ' '),
        y: Math.round(a.getBoundingClientRect().top + window.scrollY)
      }))
      .sort((a, b) => a.y - b.y);

    let grootsteGat = 0;
    for (let i = 1; i < ctas.length; i++) {
      grootsteGat = Math.max(grootsteGat, ctas[i].y - ctas[i - 1].y);
    }

    // Knoplabels: alleen wat als knóp is vormgegeven. Twee dingen vallen hier bewust
    // buiten:
    //   - de drie leerpad-deeplinks (?tutorial=) hebben eigen labels, want ze starten
    //     een specifieke missie en niet "de simulator";
    //   - het footer-navigatie-item "Simulator" is een bestemmingsnaam in een lijst
    //     naast Blog/Commands/Gidsen, geen oproep tot actie. "Start de simulator" zou
    //     daar juist misstaan.
    const primaireLabels = [
      ...new Set(
        [...document.querySelectorAll('a.btn-cta, a.btn-cta-nav, a.mobile-cta-link')]
          .filter((a) => a.getAttribute('href') === '/terminal.html')
          .map((a) => a.textContent.trim().replace(/\s+/g, ' '))
      )
    ];

    // Elk label dat érgens op een knop of link staat — de verzameling waaraan
    // geciteerde verwijzingen in lopende tekst en JSON-LD moeten voldoen.
    const alleLabels = new Set(
      [...document.querySelectorAll('a, button')].map((e) =>
        e.textContent.trim().replace(/\s+/g, ' ')
      )
    );

    // Geciteerde CTA-verwijzingen: `klik op "Start de simulator"` in zichtbare tekst
    // én in de FAQPage-JSON-LD. Beide moeten een knop noemen die echt bestaat.
    //
    // De JSON-LD wordt geparsed, niet geregexed: in de bron staat de aanhaling als \"
    // en een regex over de ruwe tekst levert dan een label mét backslash op — een vals
    // positief dat niets met de pagina te maken heeft.
    const jsonLdTekst = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => { try { return JSON.stringify(JSON.parse(s.textContent)); } catch { return ''; } })
      .join('\n')
      .replace(/\\"/g, '"');
    const citaten = [];
    for (const bron of [document.body.innerText, jsonLdTekst]) {
      for (const m of bron.matchAll(/["“]([Ss]tart[^"”]{0,40})["”]/g)) citaten.push(m[1]);
    }

    const kleineTikdoelen = [...document.querySelectorAll('a, button')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        if (r.height === 0 || r.height >= 44) return false;
        // WCAG 2.5.5-uitzondering: een link binnen een lopende zin.
        const ouder = e.parentElement;
        if (ouder && /^(P|LI|SPAN|EM|STRONG|CITE)$/.test(ouder.tagName)) return false;
        return !buitenScope.some((c) => e.classList.contains(c));
      })
      .map((e) => `${e.className || e.tagName}: ${Math.round(e.getBoundingClientRect().height)}px`);

    // FAQPage-lockstep: schema-tekst moet gelijk zijn aan de zichtbare tekst.
    const faqSchema = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } })
      .find((d) => d && d['@type'] === 'FAQPage');
    const schemaVragen = faqSchema ? faqSchema.mainEntity.map((q) => q.name) : [];
    const zichtbareVragen = [...document.querySelectorAll('.faq-question .faq-question-text')]
      .map((h) => h.textContent.trim());
    // Ook de antwoorden (sessie 244): tot dan vergeleek deze lockstep alleen de vragen, en
    // FAQ 8 miste in het schema zijn laatste zin zonder dat iets rood werd.
    const normaal = (t) => t.replace(/\s+/g, ' ').trim();
    const schemaAntwoorden = faqSchema ? faqSchema.mainEntity.map((q) => normaal(q.acceptedAnswer.text)) : [];
    const zichtbareAntwoorden = [...document.querySelectorAll('.faq-answer')]
      .map((a) => normaal(a.textContent));

    // Alleen `.blog-link`: die chips presenteren zich als de titel van een artikel, dus
    // daar moet het label de echte titel zijn. Twee andere soorten bloglinks vallen
    // hier bewust buiten, allebei omdat hun tekst een andere functie heeft:
    //   - ankertekst in proza ("…dat <a>je wilt leren hacken</a>, maar…") — de exacte
    //     <h1> afdwingen zou de zin slopen;
    //   - de leerpad-verwijzingen ("Lees eerst: Nmap-gids →") dragen een eigen frame en
    //     zijn bewust ingekort voor de kaartbreedte (Sessie 188).
    const bloglinks = [...document.querySelectorAll('main a.blog-link')].map((a) => ({
      href: a.getAttribute('href'),
      label: a.textContent.trim().replace(/\s+/g, ' ')
    }));

    return {
      grootsteGatPx: grootsteGat,
      viewportHoogte: window.innerHeight,
      primaireLabels,
      citaten: [...new Set(citaten)],
      alleLabels: [...alleLabels],
      kleineTikdoelen,
      schemaVragen,
      zichtbareVragen,
      schemaAntwoorden,
      zichtbareAntwoorden,
      bloglinks,
      woordenInMain: document.querySelector('main').innerText.split(/\s+/).filter(Boolean).length
    };
  }, buitenScopeArg());
}

function buitenScopeArg() {
  return BUITEN_SCOPE_TIKDOEL;
}

// Scrollposities in stappen van 0,9 viewport — dezelfde raster als vóór Sessie 216, zodat
// deze guard aantoonbaar dezelfde posities dekt als zijn voorganger.
async function scrollposities(page) {
  return page.evaluate(() => {
    const stap = Math.round(window.innerHeight * 0.9);
    const uit = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += stap) uit.push(y);
    return uit;
  });
}

// Eén scrollpositie meten. `behavior: 'instant'` is niet optioneel: html draagt
// `scroll-behavior: smooth` (animations.css), dus zonder die vlag ánimeert de sprong en
// meet je de vorige positie. De twee frames erna geven de IntersectionObserver in
// landing-demo.js zijn beurt — IO-callbacks worden pas in de volgende rendering-update
// afgeleverd, ná de rAF-callbacks van het huidige frame.
async function meetOpPositie(page, y) {
  await page.evaluate((doel) => {
    window.scrollTo({ top: doel, behavior: 'instant' });
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, y);

  return page.evaluate(() => {
    const labels = [...document.querySelectorAll('a[href*="terminal.html"]')]
      .filter((a) => {
        const r = a.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const x = r.left + r.width / 2;
        const midY = r.top + r.height / 2;
        // Het midden moet ín beeld liggen; buiten de viewport geeft elementFromPoint null
        // en is er niets aan te tikken.
        if (midY < 0 || midY > window.innerHeight || x < 0 || x > window.innerWidth) return false;
        const raak = document.elementFromPoint(x, midY);
        return raak === a || a.contains(raak);
      })
      .map((a) => a.textContent.trim().replace(/\s+/g, ' ') || '(zonder label)');
    const balk = document.querySelector('.mobile-cta-bar');
    return { labels, balk: balk ? balk.dataset.state : 'afwezig' };
  });
}

test.describe('Homepage conversie-structuur', () => {
  test.use({ viewport: MOBIEL });

  // Op élke scrollpositie hoort er een CTA in beeld te staan. Dat is de eigenschap die
  // de bezoeker merkt — "afstand tussen twee knoppen in de documentstroom" was de juiste
  // maat zolang alle CTA's meescrolden, maar een vaste balk zit per definitie op één
  // document-Y en zou dat getal betekenisloos maken.
  //
  // Drie breedtes: 375 (kleinste gangbare telefoon), 768 (grens van de oude mobiele
  // query) en 1000 (midden van de navbar-inklapband, waar de desktop-CTA óók verborgen
  // is — die band bleek net zo goed zonder knop te zitten).
  //
  // Herschreven in Sessie 216, op drie punten strenger dan de vorige versie:
  //
  //  1. Hij scrollt nu écht. `html { scroll-behavior: smooth }` staat in animations.css,
  //     dus `window.scrollTo(0, y)` ánimeert. De oude lus zette dat 13× in één synchrone
  //     tick; de animatie kreeg nooit een frame en `scrollY` bleef op 2px steken. Die test
  //     asserteerde dus dertien keer dezelfde ongescrollde pagina. `behavior: 'instant'`
  //     plus een await per stap springt wél.
  //  2. Hit-testing in plaats van bounding box. Een `visibility: hidden` balk heeft nog
  //     steeds een box van 65px; de oude assertie kon een verborgen CTA niet van een
  //     zichtbare onderscheiden. `elementFromPoint` op het midden meet wat de bezoeker
  //     kan raken. Elke positie die de oude versie afkeurde, keurt deze ook af.
  //  3. Async, zodat de IntersectionObserver van landing-demo.js zijn werk kan doen.
  //
  // Consent vooraf, anders meet de hit-test de cookiebanner in plaats van de pagina.
  for (const breedte of [375, 768, 1000]) {
    test(`@${breedte}px is er op elke scrollpositie een tikbare CTA`, async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem(
          'hacksim_analytics_consent',
          JSON.stringify({ necessary: true, analytics: true })
        );
      });
      await page.setViewportSize({ width: breedte, height: 812 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('.mobile-cta-bar[data-state]'));

      const posities = await scrollposities(page);
      const zonderCta = [];
      const dubbel = [];

      for (const y of posities) {
        const m = await meetOpPositie(page, y);
        if (!m.labels.length) zonderCta.push(`${y} (balk=${m.balk})`);
        const doublures = m.labels.filter((l, i) => m.labels.indexOf(l) !== i);
        if (doublures.length) dubbel.push(`${y}: ${doublures.join(', ')} (balk=${m.balk})`);
      }

      // Was: 4179px (5,1 schermen) tussen de hero-CTA en de eerste leerpad-knop.
      expect(zonderCta, `scrollposities zonder tikbare CTA: ${zonderCta.join(' | ')}`).toEqual([]);

      // De balk draagt hetzelfde label als hero/mid/final. Stond hij aan terwijl een van
      // die drie in beeld was, dan zag de bezoeker twee identieke groene knoppen op één
      // scherm (gemeten op 390×844, scrollpositie 0).
      expect(dubbel, `twee keer hetzelfde CTA-label tikbaar: ${dubbel.join(' | ')}`).toEqual([]);
    });
  }

  // De knop in de balk erft `visibility` van de balk, en `.btn-cta` draagt
  // `transition: all` (landing.css:219) — waardoor die overerving als transitie meeloopt.
  // Gemeten vóór de fix: ~150ms lang meldde de balk `hidden` terwijl de knop nog `visible`
  // was (onzichtbaar tikdoel dat wél reageert) en andersom een zichtbare balk waar een tik
  // niets deed. Twee gaten die alleen bestaan in het venster ná een toestandswissel, dus
  // geen enkele meting "in rust" ziet ze.
  test('de knop klapt mee met zijn balk, zonder na te lopen', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'hacksim_analytics_consent',
        JSON.stringify({ necessary: true, analytics: true })
      );
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await page.waitForFunction(() => document.querySelector('.mobile-cta-bar[data-state]'));

    // Scroll heen en weer over de grens waar de balk omklapt, en meet meteen — niet na
    // een ruime wachttijd, want dan is de transitie voorbij en is de bug onzichtbaar.
    const afwijkingen = await page.evaluate(async () => {
      const balk = document.querySelector('.mobile-cta-bar');
      const knop = balk.querySelector('a');
      const uit = [];
      for (const y of [0, 1200, 0, 1200]) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const balkVis = getComputedStyle(balk).visibility;
        const knopVis = getComputedStyle(knop).visibility;
        const r = knop.getBoundingClientRect();
        const raak = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        const raakbaar = raak === knop || knop.contains(raak);
        if (knopVis !== balkVis) uit.push(`y=${y}: balk ${balkVis}, knop ${knopVis}`);
        // Aantikbaarheid moet de balkstaat volgen, niet die van de transitie.
        if (raakbaar !== (balkVis === 'visible')) {
          uit.push(`y=${y}: balk ${balkVis} maar raakbaar=${raakbaar}`);
        }
      }
      return uit;
    });

    expect(afwijkingen, afwijkingen.join(' | ')).toEqual([]);
  });

  test('alle primaire CTA\'s naar /terminal.html dragen hetzelfde label', async ({ page }) => {
    await page.goto('/index.html');
    const m = await meetHomepage(page);
    // Was 4 verschillende namen voor één bestemming: "Start Simulator" (nav),
    // "Start Nu" (hero), "Start de Simulator" (mid), "Start de Terminal" (final).
    expect(m.primaireLabels).toHaveLength(1);
  });

  test('geciteerde CTA-verwijzingen noemen een knop die bestaat', async ({ page }) => {
    await page.goto('/index.html');
    const m = await meetHomepage(page);
    // Vangt de lockstep die bij het hernoemen bijna brak: de FAQ-tekst én de
    // FAQPage-JSON-LD citeren allebei letterlijk een knoplabel, net als "Hoe het werkt".
    // Alleen de zichtbare tekst hernoemen laat de structured data naar een knop wijzen
    // die niet meer bestaat — en Google eist gelijkheid schema ↔ zichtbaar.
    const onbekend = m.citaten.filter((c) => !m.alleLabels.includes(c));
    expect(onbekend, `citaten zonder bijbehorende knop: ${onbekend.join(' | ')}`).toEqual([]);
  });

  test('FAQPage-schema blijft woordelijk gelijk aan de zichtbare FAQ', async ({ page }) => {
    await page.goto('/index.html');
    const m = await meetHomepage(page);
    expect(m.schemaVragen.length).toBeGreaterThan(0);
    expect(m.zichtbareVragen).toEqual(m.schemaVragen);
    expect(m.schemaAntwoorden.length, 'evenveel antwoorden als vragen').toBe(m.schemaVragen.length);
    expect(m.zichtbareAntwoorden).toEqual(m.schemaAntwoorden);
  });

  test('elke bloglink draagt de echte titel van zijn doelpost', async ({ page, baseURL }) => {
    await page.goto('/index.html');
    const m = await meetHomepage(page);
    expect(m.bloglinks.length).toBeGreaterThan(0);

    const afwijkingen = [];
    for (const link of m.bloglinks) {
      const res = await page.request.get(new URL(link.href, baseURL).toString());
      const html = await res.text();
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      if (!h1) continue;
      const titel = h1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      // Een label mag korter zijn dan de <h1> (die draagt soms een SEO-staart als
      // ": complete carrièregids"), maar het mag geen ándere tekst zijn.
      if (!titel.toLowerCase().startsWith(link.label.toLowerCase())) {
        afwijkingen.push(`${link.href}: "${link.label}" != "${titel}"`);
      }
    }
    expect(afwijkingen, afwijkingen.join('\n')).toEqual([]);
  });

  test('de enige homepage-link naar leren-hacken blijft bestaan', async ({ page }) => {
    await page.goto('/index.html');
    // Die post (Sessie 210) hing aan één inline link in de pijnpunt-copy — precies de
    // alinea die bij het snoeien is herschreven. Zonder deze assertie verdwijnt hij stil.
    // Sinds W1 staat hij ook tussen de drie cornerstone-previews, vandaar ≥1 en niet ==1.
    expect(await page.locator('a[href*="leren-hacken"]').count()).toBeGreaterThanOrEqual(1);
  });

  test('geen tikdoel onder 44px in homepage-content', async ({ page }) => {
    await page.goto('/index.html');
    const m = await meetHomepage(page);
    // Was 20 (14 blog-chips @36px, 3 leerpad-knoppen @42px, 3 "lees eerst"-links @20px).
    // De 5 uitgezonderde staan in BUITEN_SCOPE_TIKDOEL met reden.
    expect(m.kleineTikdoelen, m.kleineTikdoelen.join(' | ')).toEqual([]);
  });
});

test.describe('Homepage zonder JavaScript', () => {
  test.use({ viewport: MOBIEL, javaScriptEnabled: false });

  test('alle contentblokken blijven zichtbaar', async ({ page }) => {
    await page.goto('/index.html');
    // `.animate-on-scroll` staat op `opacity: 0` en wordt alleen door landing-demo.js
    // zichtbaar gemaakt. prefers-reduced-motion is wél afgevangen (landing.css:1863),
    // no-JS niet — dus faalt de scriptlading, dan zijn 16 blokken leeg: álle pijnpunten,
    // feature-kaarten, cijfers, leerpad-kaarten en stappen.
    //
    // NIET met toBeVisible()/isVisible() meten: die kijken naar bounding box en
    // `visibility`, en negeren `opacity`. Gemeten: op de ónveranderde pagina gaven ze
    // `true` terwijl de opacity aantoonbaar 0 was — de assertie was dus structureel
    // blind voor precies deze bug (vgl. checkVisibility() in Sessie 213).
    //
    // `evaluate` wérkt wél met javaScriptEnabled: false — Playwright's injected script
    // draait in een isolated world die de vlag niet raakt. Dat is hier de enige
    // meting die de faalklasse kán detecteren.
    // Sessie 238: de scroll-reveals zijn weg (één geregisseerd moment, niet een entree
    // per sectie), dus `.animate-on-scroll` heeft nul leden — en een lege populatie is
    // altijd groen. De populatie is nu alles wat in <main> zelf tekst rendert.
    const m = await page.evaluate(() => {
      const kandidaten = [...document.querySelectorAll('main *')].filter((e) =>
        [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
      const effOpacity = (e) => { let o = 1; for (let n = e; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return o; };
      return {
        aantal: kandidaten.length,
        onzichtbaar: kandidaten.filter((e) => effOpacity(e) === 0).map((e) => e.className || e.tagName).slice(0, 10),
      };
    });
    expect(m.aantal, 'geen tekst in <main> — de meting heeft niet gedraaid').toBeGreaterThan(50);
    expect(m.onzichtbaar, `onzichtbaar zonder JS: ${m.onzichtbaar.join(', ')}`).toEqual([]);
  });
});

// ==================== Sectieritme (Sessie 219) ====================
//
// Nulmeting vóór de wijziging: onder "HackSimulator in cijfers" liepen how-it-works,
// leerpad, blog-links en faq met één en dezelfde achtergrond door — 2390px @1440 en
// 3078px @375, oftewel 3,8 schermen die als één blok lezen. Boven cijfers was de
// langste zo'n reeks 1023/1329px (1,6 scherm).
//
// Twee bugs die bij het meten boven kwamen en die deze asserties bewaken:
//   1. `[data-theme="light"] .results-section` was rgba(248,248,248,0.8) over een
//      #f8f8f8 pagina → composit naar exact rgb(248,248,248), verschil [0,0,0]. De
//      band was in light mode onzichtbaar; alleen de haarlijnen droegen hem.
//   2. De nieuwsbrief-band was #161b22, en de kaarten zijn rgba(22,27,34,α) — tinten
//      van diezelfde kleur. Een kaart op die band composit naar de bándkleur (Δ0).
//      Daarom gaat een band in beide thema's ONDER --color-bg, niet erboven.
//
// De kaart-Δ-assertie is degene die bug 2 zou hebben gevangen; zonder haar is
// "de band is zichtbaarder" waar én zijn de kaarten erop verdwenen.

const VIEWPORTS = [{ width: 1440, height: 900 }, MOBIEL];
const THEMAS = ['dark', 'light'];

// Een oppervlak-reeks mag niet langer worden dan ~1,4 scherm. Dat is ruimer dan de
// gemeten 1,05/1,12 (marge voor groeiende content) en strenger dan de 1,6 die boven
// de vouw bestaat — de regel hoort een alarm te zijn, geen formaliteit.
const MAX_OPPERVLAK_VIEWPORTS = 1.4;

// De site-brede elevatiestap: kaarten staan 3 eenheden boven de pagina. Een band die
// dat verschil op zijn eigen oppervlak niet haalt, laat zijn kaarten oplossen.
const MIN_KAART_DELTA = 3;

// Composite de ancestor-keten tot de eerste laag met alpha === 1. Zonder dit meet je
// bij een rgba-achtergrond de laag ónder de verf — de fout uit Sessie 217.
// (Zelfde aanpak als effBg() in eyebrow-contrast.spec.js.)
const METEN = () => {
  const parse = (c) => { const n = c.match(/[\d.]+/g).map(Number); return n.length === 3 ? [...n, 1] : n; };
  const over = (fg, bg) => { const [r, g, b, a] = fg; return [0, 1, 2].map((i) => Math.round(a * [r, g, b][i] + (1 - a) * bg[i])); };
  const delta = (x, y) => Math.max(...[0, 1, 2].map((i) => Math.abs(x[i] - y[i])));
  const effBg = (el) => {
    let n = el; const lagen = [];
    while (n) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) { lagen.push(c); if (c[3] === 1) break; }
      n = n.parentElement;
    }
    return lagen.reverse().reduce((acc, c) => over(c, acc), [255, 255, 255]);
  };

  const alle = [...document.querySelectorAll('main > section, body > section')];
  // Alleen de secties ná de cijfers-band: dat is de reeks waar de klacht over ging.
  // Bewust NIET eerst alles groeperen en dan de reeks-mét-results zoeken — verliest
  // results zijn band, dan slokt die reeks de hele pagina op en meet de assertie
  // stilzwijgend een staartje. Knippen op DOM-positie kan niet dissolven.
  // Sessie 238: de cijfers heten nu #results.af-inventaris; de regel is dezelfde.
  const start = alle.findIndex((s) => s.id === 'results') + 1;
  const secties = alle.slice(start);

  // Groepeer opeenvolgende secties op effectieve achtergrond. Een gradient telt als
  // eigen beat: de final-cta-glow is een bewuste visuele onderbreking.
  const sleutel = (s) => {
    const cs = getComputedStyle(s);
    return effBg(s).join(',') + (cs.backgroundImage === 'none' ? '' : '+glow');
  };
  const reeksen = [];
  for (const s of secties) {
    const k = sleutel(s);
    const h = Math.round(s.getBoundingClientRect().height);
    const naam = s.id || (s.className.match(/af-[a-z]+(?!-)/g) || [s.className]).pop();
    if (reeksen.length && reeksen.at(-1).k === k) { reeksen.at(-1).h += h; reeksen.at(-1).leden.push(naam); }
    else reeksen.push({ k, h, leden: [naam] });
  }

  const pagina = effBg(document.body);
  const oppervlak = reeksen.filter((r) => !r.k.includes('glow') && r.k === pagina.join(','));

  // Sessie 242: feitenband weg, cijfers naar papier, de vragen werden een band.
  const banden = ['#leerpad', '.af-faq', '#newsletter'].map((sel) => {
    const el = document.querySelector(sel);
    const band = effBg(el);
    // Sessie 242: het leerpad heeft geen kaarten meer (kolommen met haarlijnen); wat
    // er nog op een band ligt is de donkere commandomodule, en die moet zich onderscheiden.
    const kaart = el.querySelector('.af-specimen-cmds');
    return { sel, bandDelta: delta(band, pagina), kaartDelta: kaart ? delta(effBg(kaart), band) : null };
  });

  // .results-grid stond hier tot Sessie 237 als derde vergelijkingsrail. Die sectie is
  // toen van vier tegels naar een inventarislijst gegaan en staat sindsdien bewust op een
  // smallere maat (68ch leesmaat i.p.v. de contentrail), dus hij is geen geldige
  // vergelijking meer. De assertie zelf blijft intact: .leerpad-cards (full-bleed, zonder
  // inner wrapper) moet nog steeds op dezelfde rail liggen als .how-it-works-steps (een
  // gewoon begrensde sectie), en dát is wat deze test bewijst.
  // Sessie 242: "Hoe het werkt" is geschrapt; .af-pijn-rij is de gewone begrensde rij.
  const rails = ['.af-specimens', '.af-pijn-rij'].map((sel) => {
    const b = document.querySelector(sel).getBoundingClientRect();
    return `${sel} ${Math.round(b.left)},${Math.round(b.right)}`;
  });

  return {
    langsteOppervlak: Math.max(...oppervlak.map((r) => r.h)),
    langsteReeks: oppervlak.slice().sort((a, b) => b.h - a.h)[0].leden.join('+'),
    viewportHoogte: window.innerHeight,
    banden,
    rails,
    bandVolleBreedte: Math.round(document.querySelector('#leerpad').getBoundingClientRect().width),
    clientWidth: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
};

test.describe('Homepage sectieritme', () => {
  for (const vp of VIEWPORTS) {
    for (const thema of THEMAS) {
      test(`@${vp.width}px ${thema}: geen sectiereeks leest als één blok`, async ({ page }) => {
        await page.setViewportSize(vp);
        await page.goto('/index.html');
        await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), thema);
        const m = await page.evaluate(METEN);

        const inViewports = m.langsteOppervlak / m.viewportHoogte;
        expect(
          inViewports,
          `langste reeks zonder achtergrondwissel: ${m.langsteReeks} = ${m.langsteOppervlak}px (${inViewports.toFixed(2)} scherm)`
        ).toBeLessThanOrEqual(MAX_OPPERVLAK_VIEWPORTS);

        // Elke band moet zichtbaar afwijken van de pagina...
        for (const b of m.banden) {
          expect(b.bandDelta, `${b.sel} verschilt ${b.bandDelta} van de pagina`).toBeGreaterThanOrEqual(MIN_KAART_DELTA);
        }
        // ...én zijn kaarten moeten er nog bovenop staan. Dit is de assertie die de
        // #161b22-val vangt: die haalt de regel hierboven wél en deze niet.
        for (const b of m.banden.filter((x) => x.kaartDelta !== null)) {
          expect(b.kaartDelta, `kaart op ${b.sel} verschilt ${b.kaartDelta} van zijn band`).toBeGreaterThanOrEqual(MIN_KAART_DELTA);
        }
      });
    }
  }

  test('een full-bleed band houdt zijn content op dezelfde rail', async ({ page }) => {
    await page.goto('/index.html');
    // .leerpad-section heeft geen inner wrapper, dus full-bleed zou de kaarten meetrekken.
    // De padding-inline-max() reproduceert de rail; deze assertie is het bewijs dat dat
    // klopt tegenover een gewone begrensde sectie (.how-it-works-steps).
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      const m = await page.evaluate(METEN);
      expect(new Set(m.rails.map((r) => r.split(' ')[1])).size, `@${vp.width}px rails: ${m.rails.join(' | ')}`).toBe(1);
      expect(m.bandVolleBreedte, `@${vp.width}px band niet edge-to-edge`).toBe(m.clientWidth);
      expect(m.overflow, `@${vp.width}px horizontale overflow`).toBe(false);
    }
  });
});

// ==================== Onderpagina (Sessie 242) ====================
//
// Onder de hero stond een reeks van twaalf secties met één padding (129,6px @1440) en één
// koppenmaat, en een omslagkop van 66,24px bóven de h1 (64,8). Vier secties herhaalden in
// woorden wat Herkenbaar toont, en zijn geschrapt. Deze vier guards bewaken wat daarvoor in
// de plaats kwam; elk heeft een tak die bewijst dat de meting een populatie had.

const BREEDTES_ONDER = [1440, 1280, 1024, 375];

test.describe('Onderpagina', () => {
  for (const breedte of BREEDTES_ONDER) {
    test(`@${breedte}px is geen kop groter dan de h1`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const h1 = parseFloat(getComputedStyle(document.querySelector('h1')).fontSize);
        const koppen = [...document.querySelectorAll('main h2, main h3, #newsletter h2')]
          .filter((h) => h.getClientRects().length)
          .map((h) => ({ id: h.id || h.textContent.trim().slice(0, 30), fs: parseFloat(getComputedStyle(h).fontSize) }));
        return { h1, koppen, te_groot: koppen.filter((k) => k.fs > h1).map((k) => `${k.id} ${k.fs}px`) };
      });
      expect(m.koppen.length, 'geen koppen gemeten — de meting heeft niet gedraaid').toBeGreaterThan(5);
      expect(m.te_groot, `koppen groter dan de h1 (${m.h1}px)`).toEqual([]);
    });
  }

  test('elk anker in het landingsmenu wijst naar een element dat bestaat', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('#landing-mobile-menu a[href^="#"]', { state: 'attached' });
    const m = await page.evaluate(() => {
      const ankers = [...document.querySelectorAll('#landing-mobile-menu a[href^="#"]:not(.dropdown-trigger)')]
        .map((a) => a.getAttribute('href')).filter((h) => h.length > 1);
      return { ankers, zoek: ankers.filter((h) => !document.querySelector(h)) };
    });
    expect(m.ankers.length, 'geen menu-ankers gevonden').toBeGreaterThanOrEqual(3);
    expect(m.zoek, 'ankers zonder doel').toEqual([]);
  });

  // De glos-naad van de hero (terminal 1-7, uitleg 8-12) is de naad van de hele pagina:
  // elke tweedelige rij eronder deelt op dezelfde x. Sessie 243: ook in de band 1024-1279,
  // waar kop en actie onder elkaar vallen en de navbar inklapt; daar was hij ongedekt.
  for (const breedte of [1440, 1280, 1279, 1180, 1024]) {
    test(`@${breedte}px deelt elke tweedelige rij onder de hero op de glos-naad`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const naad = document.querySelector('.af-glos-kop').getBoundingClientRect().left;
        const paren = [
          ['.af-pijn-rij .af-transcript', '.af-pijn-rij .af-pijn-tekst'],
          ['.af-inventaris .af-lijst', null],
          ['.af-faq .af-faq-lijst', '.af-faq .af-faq-lees'],
          ['.af-sample h2', '.af-sample p'],
          ['.af-news-tekst', '.af-news-form'],
        ];
        return {
          naad,
          afwijkend: paren.map(([l, r]) => {
            const L = document.querySelector(l).getBoundingClientRect();
            const R = r ? document.querySelector(r).getBoundingClientRect() : { left: naad };
            return { l, links: L.right, rechts: R.left };
          }).filter((p) => Math.abs(p.links - naad) > 1 || Math.abs(p.rechts - naad) > 1)
            .map((p) => `${p.l}: ${p.links.toFixed(1)} | ${p.rechts.toFixed(1)}`),
          aantal: paren.length,
        };
      });
      expect(m.aantal).toBeGreaterThanOrEqual(4);
      expect(m.afwijkend, `naad op ${m.naad.toFixed(1)}`).toEqual([]);
    });
  }

  // De kantlijn meet "Vorm volgt soort" op 1440; in de band is de vragenlijst smaller en
  // dus hoger, en moet de lijn nog steeds de hele lengte volgen (sessie 243).
  for (const breedte of [1279, 1180, 1024]) {
    test(`@${breedte}px loopt de kantlijn langs de hele vragenlijst`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const lees = document.querySelector('.af-faq-lees');
        return { kantlijn: lees.getBoundingClientRect().height,
                 lijst: document.querySelector('.af-faq-lijst').getBoundingClientRect().height,
                 rand: parseFloat(getComputedStyle(lees).borderLeftWidth) };
      });
      expect(m.rand, 'geen kantlijn gemeten').toBeGreaterThan(0);
      expect(m.kantlijn, `kantlijn ${m.kantlijn.toFixed(0)}px naast een lijst van ${m.lijst.toFixed(0)}px`).toBeGreaterThanOrEqual(m.lijst - 1);
    });
  }

  // Lucht mag de inhoud niet overtreffen: met één maat voor alles hadden sample en
  // nieuwsbrief 259px lucht om 184 en 155px inhoud.
  for (const breedte of [1440, 375]) {
    test(`@${breedte}px heeft geen sectie onder de hero meer lucht dan inhoud`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const secties = [...document.querySelectorAll('main.af > section:not(#hero), #newsletter')];
        return secties.map((s) => {
          // img hoort erbij (sessie 243): de pagina's van de sample telden anders als lucht.
          const blad = [...s.querySelectorAll('h2,h3,p,li,a,img,.af-transcript,.af-specimen,.faq-item,input,button')]
            .filter((e) => e.getClientRects().length);
          let top = Infinity, bodem = 0;
          for (const e of blad) { const r = e.getBoundingClientRect(); top = Math.min(top, r.top); bodem = Math.max(bodem, r.bottom); }
          const h = s.getBoundingClientRect().height;
          return { naam: s.id || s.className.split(' ').pop(), inhoud: Math.round(bodem - top), lucht: Math.round(h - (bodem - top)) };
        });
      });
      expect(m.length, 'te weinig secties gemeten').toBeGreaterThanOrEqual(6);
      const fout = m.filter((s) => s.lucht > s.inhoud).map((s) => `${s.naam} lucht ${s.lucht} > inhoud ${s.inhoud}`);
      expect(fout).toEqual([]);
    });
  }
});

// ==================== Vorm volgt soort (Sessie 242, ronde 2) ====================
//
// Een doorloop van de hele pagina vond zeven plekken waar de vorm iets anders zei dan de
// inhoud: bloglinks in de vorm van FAQ-vragen (en één titel twee keer naast elkaar), een
// inleiding in de glos-kolom, Herkenbaar-koppen 16px boven hun prompt, haarlijnen door
// lopende tekst, en een nieuwsbriefveld 70px naast de naad. Eén assertie per soort fout.

test.describe('Vorm volgt soort', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('elke soort staat op zijn plek en in zijn eigen vorm', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const R = (e) => (typeof e === 'string' ? document.querySelector(e) : e).getBoundingClientRect();
      const cs = (e) => getComputedStyle(typeof e === 'string' ? document.querySelector(e) : e);
      const naad = R('.af-glos-kop').left;

      // 1. Bloglinks zijn geen vragen: andere letter of ander gewicht, en geen gedeelde titel.
      const vraag = cs('.af-faq .faq-question'), link = cs('.af-lees-lijst .blog-link');
      const zelfdeVorm = vraag.fontFamily === link.fontFamily && vraag.fontWeight === link.fontWeight;
      const vragen = [...document.querySelectorAll('.faq-question-text')].map((e) => e.textContent.trim());
      const dubbel = [...document.querySelectorAll('.blog-link')].map((a) => a.textContent.trim()).filter((t) => vragen.includes(t));

      // 2. Een inleiding hoort bij haar kop: zelfde linkerrand, niet in de glos-kolom.
      const koppen = [...document.querySelectorAll('.af-kop')].filter((k) => k.querySelector('p'));
      const losseInleiding = koppen.filter((k) => Math.abs(R(k.querySelector('p')).left - R(k.querySelector('h2')).left) > 1)
        .map((k) => k.querySelector('h2').id);

      // 3. Herkenbaar: de kop staat op de rij van zijn promptregel (midden tegen midden).
      const rijen = [...document.querySelectorAll('.af-pijn-rij')].map((r) => {
        const a = R(r.querySelector('h3')), b = R(r.querySelector('.terminal-line.prompt'));
        return Math.round((a.top + a.height / 2) - (b.top + b.height / 2));
      });

      // 4. Geen haarlijn door lopende tekst in de hero: óf geen lijn binnen de box, óf de
      //    box snijdt zich uit (eigen, dekkende achtergrond).
      const raster = document.querySelector('.af-hero-raster'); const rb = R(raster);
      const pl = parseFloat(cs(raster).paddingLeft); const kol = (rb.width - 2 * pl) / 12;
      const lijnen = [...Array(13)].map((_, i) => rb.left + pl + i * kol);
      const tekst = [...raster.querySelectorAll('p, .reg-glos:not(:empty)')].filter((e) => e.getClientRects().length && e.textContent.trim()
        && !e.closest('.af-term-body, .terminal-input-line'));
      const doorkruist = tekst.filter((e) => {
        const q = R(e); const n = lijnen.filter((x) => x > q.left + 2 && x < q.right - 2).length;
        const bg = cs(e).backgroundColor; const dekt = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        return n > 0 && !dekt;
      }).map((e) => e.className || e.tagName);

      // 5. Het nieuwsbriefveld begint op de naad.
      const veld = R('.af-news .newsletter-form .input').left;

      // 6. Paden (bronnen, blogartikelen) in één schrijfwijze: met / vooraan, zonder / achteraan.
      const paden = [...document.querySelectorAll('.af-lijst-waar, .af-lees-pad')].map((e) => e.textContent.trim());
      const scheef = paden.filter((p) => !p.startsWith('/') || p.endsWith('/'));

      // 7. De kantlijn loopt langs de hele vragenlijst, niet tot zijn eigen inhoud.
      const kantlijn = R('.af-faq-lees').height, lijst = R('.af-faq-lijst').height;

      // 8. De commandomodule van het leerpad heeft geen interne randen (die waren geërfd uit
      //    de gedeelde landing.css). Populatie: alles in de modules.
      const inModule = [...document.querySelectorAll('.af-specimen-cmds *')];
      const randen = inModule.filter((e) => ['Top', 'Right', 'Bottom', 'Left'].some((z) => {
        const c = cs(e); return c['border' + z + 'Style'] !== 'none' && parseFloat(c['border' + z + 'Width']) > 0;
      })).map((e) => e.className || e.tagName);

      return { zelfdeVorm, dubbel, koppen: koppen.length, losseInleiding, rijen, tekst: tekst.length, doorkruist, naad, veld,
        paden: paden.length, scheef, kantlijn, lijst, modulekinderen: inModule.length, randen };
    });

    expect(m.zelfdeVorm, 'bloglinks hebben de letter en het gewicht van de FAQ-vragen').toBe(false);
    expect(m.dubbel, 'titel staat als vraag én als bloglink').toEqual([]);
    expect(m.koppen, 'geen kop met inleiding gevonden').toBeGreaterThanOrEqual(3);
    expect(m.losseInleiding, 'inleiding niet op de linkerrand van haar kop').toEqual([]);
    expect(m.rijen.length).toBe(3);
    for (const d of m.rijen) expect(Math.abs(d), `Herkenbaar-kop ${d}px naast zijn promptregel`).toBeLessThanOrEqual(4);
    expect(m.tekst, 'geen hero-tekst gemeten').toBeGreaterThanOrEqual(3);
    expect(m.doorkruist, 'haarlijn door lopende tekst').toEqual([]);
    expect(Math.abs(m.veld - m.naad), `veld op ${m.veld.toFixed(1)}, naad op ${m.naad.toFixed(1)}`).toBeLessThanOrEqual(1);
    expect(m.paden, 'geen paden gemeten').toBeGreaterThanOrEqual(5);
    expect(m.scheef, 'pad in een andere schrijfwijze').toEqual([]);
    expect(m.kantlijn, `kantlijn ${m.kantlijn.toFixed(0)}px naast een lijst van ${m.lijst.toFixed(0)}px`).toBeGreaterThanOrEqual(m.lijst - 1);
    expect(m.modulekinderen, 'geen regels in de commandomodules').toBeGreaterThanOrEqual(9);
    expect(m.randen, 'randen in de commandomodule').toEqual([]);
  });
});

// Een aanhaallijn wijst van een regel naar zijn uitleg. Staan ze onder elkaar (mobiel),
// dan wijst hij nergens heen en stak hij als streepje buiten de zijmarge (sessie 242).
// ==================== De sample toont zijn pagina's (Sessie 243) ====================
//
// Linksonder in de sample stond een leeg vlak (779x72px op 1440, 592x124 op 1024): de kop
// is één regel, de uitleg ernaast vier. Proef A/B/C9/C4; gekozen: de negen pagina's zelf,
// verkleind, op de rasterrij van de knop. Ze bewijzen "de eerste 9 pagina's" en mogen dus
// niet stil gaan liegen: zin, afbeeldingen en pdf tellen hetzelfde.

const WORTEL = process.cwd();
const SAMPLE_PDF = path.join(WORTEL, 'assets', 'samples', 'pentest-playbook-sample.pdf');

test.describe('De sample toont wat erin staat', () => {
  // Sessie 243 toonde de negen pagina's als miniaturen; sessie 245 verving ze door een
  // inhoudsopgave (op telefoon waren ze 23-34px breed). De zin belooft nog steeds "de eerste
  // N pagina's": die telt tegen de pdf, en elke verwijzing in de tabel valt daarbinnen.
  test('zin telt als de pdf, en elke paginaverwijzing staat in de pdf, oplopend', async ({ page }) => {
    expect(fs.existsSync(SAMPLE_PDF), `${SAMPLE_PDF} bestaat niet — cwd is ${WORTEL}`).toBe(true);
    const inPdf = (fs.readFileSync(SAMPLE_PDF).toString('latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
    expect(inPdf, 'geen pagina\'s in de pdf gevonden — de telling heeft niet gedraaid').toBeGreaterThan(0);

    await page.goto('/index.html');
    const m = await page.evaluate(() => {
      const zin = document.querySelector('.af-sample p').textContent.match(/eerste (\d+) pagina/);
      const refs = [...document.querySelectorAll('.af-sample-inhoud .af-inhoud-p')]
        .map((e) => e.textContent.match(/\d+/g).map(Number));
      return { zin: zin ? Number(zin[1]) : null, refs, miniaturen: document.querySelectorAll('.af-sample img').length };
    });
    expect(m.zin, 'de zin noemt geen aantal pagina\'s meer').toBe(inPdf);
    expect(m.refs.length, 'geen inhoudsregels gevonden').toBeGreaterThanOrEqual(3);
    const plat = m.refs.flat();
    expect(Math.max(...plat), `verwijzing voorbij de laatste pdf-pagina (${inPdf})`).toBeLessThanOrEqual(inPdf);
    expect(Math.min(...plat), 'verwijzing naar een pagina onder 1').toBeGreaterThanOrEqual(1);
    expect(plat, 'paginaverwijzingen niet oplopend').toEqual([...plat].sort((x, y) => x - y));
    expect(m.miniaturen, 'er staan weer miniaturen in de sample').toBe(0);
  });

  for (const breedte of [1440, 1280, 1024, 768]) {
    test(`@${breedte}px staat de inhoud links op de rij van de knop, binnen de naad`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.locator('.af-sample').scrollIntoViewIfNeeded();
      const m = await page.evaluate(() => {
        const R = (q) => document.querySelector(q).getBoundingClientRect();
        const lijst = R('.af-sample-inhoud');
        const rijen = [...document.querySelectorAll('.af-sample-inhoud li')].map((li) => li.getBoundingClientRect());
        return { n: rijen.length, top: lijst.top, knopTop: R('.af-sample .af-knop').top, rechts: lijst.right, naad: R('.af-sample p').left };
      });
      expect(m.n, 'geen inhoudsregels gevonden').toBeGreaterThan(0);
      expect(Math.abs(m.top - m.knopTop), `inhoud op ${m.top.toFixed(0)}, knop op ${m.knopTop.toFixed(0)}`).toBeLessThanOrEqual(1);
      expect(m.rechts, 'de inhoud steekt over de naad').toBeLessThanOrEqual(m.naad + 1);
    });
  }
});

test.describe('Aanhaallijnen', () => {
  for (const breedte of [375, 1440]) {
    test(`@${breedte}px valt geen aanhaallijn buiten de rand van de inhoud`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const rand = document.querySelector('#features .af-raster');
        const pl = parseFloat(getComputedStyle(rand).paddingLeft);
        const links = rand.getBoundingClientRect().left + pl;
        const koppen = [...document.querySelectorAll('.af-pijn-tekst h3')];
        const uit = koppen.filter((h) => {
          const ps = getComputedStyle(h, '::before');
          if (ps.content === 'none' || ps.borderTopStyle === 'none') return false;
          return h.getBoundingClientRect().left + parseFloat(ps.left) < links - 0.5;
        }).map((h) => h.textContent.trim());
        return { koppen: koppen.length, uit };
      });
      expect(m.koppen, 'geen Herkenbaar-koppen gevonden').toBe(3);
      expect(m.uit, 'aanhaallijn buiten de zijmarge').toEqual([]);
    });
  }
});

// ==================== Polish (sessie 245) ====================
//
// Gemeten vóór de fix, 1440, beide thema's: de koffielink kreeg bij hover een rode rand
// onder zijn onderstreping (main.css zet --color-cta-primary: het signaalrood), de
// footerknop een onderstreping in zijn kader, de schakelaar een blauwe focusring naast 60
// rode, het GitHub-icoon geen zichtbare hover, het woordmerk een lime "HackSimulator" en
// een onderstreping in rust. Het e-mailveld stond 1,59px lager dan de knop, en brak op
// 768-1032 onder het veld (zonder rechterrand), omdat een (0,4,0)-regel in main.css de
// flex van de wrapper op elke breedte won. Het bloglinkblok stond op 0px van zijn letters.
//
// Elke meting hieronder heeft een tak die bewijst dat hij iets mat: een populatie, een
// hovertoestand die echt aan staat, of een positieve controle.

const ROOD = 'rgb(204, 10, 30)';
const POLISH_THEMAS = ['light', 'dark'];

const lijnOnderLink = (a) => {
  const c = getComputedStyle(a);
  const onderstreept = c.textDecorationLine.includes('underline');
  const zichtbaar = (w, s, kleur) => parseFloat(w) > 0 && s !== 'none' && !/rgba\(.*,\s*0\)$/.test(kleur) && kleur !== 'transparent';
  const rand = zichtbaar(c.borderBottomWidth, c.borderBottomStyle, c.borderBottomColor);
  const kader = rand && zichtbaar(c.borderTopWidth, c.borderTopStyle, c.borderTopColor);
  return {
    naam: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) || a.getAttribute('aria-label'),
    hover: a.matches(':hover'),
    onderstreept, rand, kader,
    schaduw: c.boxShadow !== 'none',
  };
};

test.describe('Polish (sessie 245)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  // Zonder beslissing dekt de cookiebanner de footer af en krijgt geen link daar de muis.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('hacksim_analytics_consent', 'false'));
  });

  for (const thema of POLISH_THEMAS) {
    test(`${thema}: geen link krijgt bij hover een tweede lijn`, async ({ page }) => {
      await page.goto('/index.html');
      await zetThema(page, thema);
      const links = page.locator('main a, #newsletter a, .landing-footer a');
      const n = await links.count();
      const dubbel = [];
      let gehoverd = 0;
      for (let i = 0; i < n; i++) {
        const a = links.nth(i);
        if (!(await a.isVisible())) continue;
        await a.scrollIntoViewIfNeeded();
        await a.hover();
        const m = await a.evaluate(lijnOnderLink);
        if (!m.hover) continue;
        gehoverd++;
        // Een onderstreping mag niet samengaan met een rand eronder, een kader of een schaduw.
        if (m.onderstreept && (m.rand || m.kader || m.schaduw)) dubbel.push(m.naam);
      }
      expect(gehoverd, 'te weinig links echt gehoverd — de meting heeft niet gedraaid').toBeGreaterThan(30);
      expect(dubbel, 'onderstreping plus een tweede lijn bij hover').toEqual([]);
    });
  }

  test('de koffielink draagt bij hover geen rood (pixels, met positieve controle)', async ({ page }) => {
    await page.goto('/index.html');
    await zetThema(page, 'light');
    const a = page.locator('.newsletter-or-support a');
    await a.scrollIntoViewIfNeeded();
    // Een clip-screenshot verloor in deze sessie de hovertoestand; daarom het hele venster.
    const roodOnder = async () => {
      const b = await a.boundingBox();
      const png = await page.screenshot();
      return page.evaluate(async ({ data, b }) => {
        const img = new Image(); img.src = data; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        // WebKit draait hier met deviceScaleFactor 2: reken CSS-px om naar beeldpixels.
        const k = img.width / innerWidth;
        const d = x.getImageData(Math.round(b.x * k), Math.round((b.y + b.height / 2) * k), Math.round(b.width * k), Math.round((b.height / 2 + 4) * k)).data;
        let rood = 0;
        for (let j = 0; j < d.length; j += 4) if (d[j] > 150 && d[j + 1] < 80 && d[j + 2] < 90) rood++;
        return rood;
      }, { data: 'data:image/png;base64,' + png.toString('base64'), b });
    };
    await a.hover();
    expect(await a.evaluate((e) => e.matches(':hover')), 'de link is niet gehoverd').toBe(true);
    expect(await roodOnder(), 'rode pixels onder de koffielink bij hover').toBe(0);
    // Positieve controle: dezelfde teller moet een rode rand wél zien.
    await a.evaluate((e) => { e.style.borderBottom = '2px solid rgb(204, 10, 30)'; });
    expect(await roodOnder(), 'de teller ziet een ingespoten rode rand niet').toBeGreaterThan(20);
  });

  test('beide woordmerken: geen onderstreping en geen kleurwissel, in rust noch bij hover', async ({ page }) => {
    // Een woordmerk is geen actie (sessie 236; besluit eigenaar sessie 245): geen hovertoestand.
    await page.addInitScript(() => localStorage.setItem('hacksim_analytics_consent', 'false'));
    await page.goto('/index.html');
    for (const thema of POLISH_THEMAS) {
      await zetThema(page, thema);
      for (const sel of ['.nav-brand', '.landing-footer a.footer-logo']) {
        const merk = page.locator(sel);
        await merk.scrollIntoViewIfNeeded();
        await page.mouse.move(1, 1);
        const meet = () => merk.evaluate((e) => {
          const tekst = [...e.querySelectorAll('*'), e].filter((k) => [...k.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()));
          return {
            hover: e.matches(':hover'),
            lijnen: tekst.map((k) => getComputedStyle(k).textDecorationLine).concat(getComputedStyle(e).textDecorationLine),
            kleuren: tekst.map((k) => getComputedStyle(k).color),
          };
        });
        const rust = await meet();
        await merk.hover();
        const hover = await meet();
        expect(rust.kleuren.length, `${thema} ${sel}: geen tekst in het woordmerk gevonden`).toBeGreaterThanOrEqual(1);
        expect(hover.hover, `${thema} ${sel}: niet gehoverd`).toBe(true);
        expect(rust.lijnen.filter((l) => l !== 'none'), `${thema} ${sel}: onderstreept in rust`).toEqual([]);
        expect(hover.lijnen.filter((l) => l !== 'none'), `${thema} ${sel}: onderstreept bij hover`).toEqual([]);
        expect(hover.kleuren, `${thema} ${sel}: kleur verandert bij hover`).toEqual(rust.kleuren);
      }
    }
  });

  test('elk focusbaar element toont de rode ring', async ({ page }) => {
    await page.goto('/index.html');
    // Uitzondering, met reden: het veld zelf draagt geen ring; die staat op zijn invoerregel
    // (sessie 246), zodat hij ook de prompt omsluit. Bewaakt in pixels in "Finish review".
    const UITGEZONDERD = ['hero-input'];
    for (const thema of POLISH_THEMAS) {
      await zetThema(page, thema);
      const n = await page.evaluate(() => {
        const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden])')]
          .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.mobile-cta-bar'));
        els.forEach((e, i) => { e.dataset.polishFocus = i; });
        return els.length;
      });
      const mis = [];
      let getoetst = 0;
      for (let i = 0; i < n; i++) {
        const el = page.locator(`[data-polish-focus="${i}"]`);
        const cls = (await el.getAttribute('class')) || '';
        if (UITGEZONDERD.some((u) => cls.split(' ').includes(u))) continue;
        await el.focus();
        await page.keyboard.press('Shift');
        const m = await el.evaluate((e) => ({ fv: e.matches(':focus-visible'), stijl: getComputedStyle(e).outlineStyle, kleur: getComputedStyle(e).outlineColor, naam: e.className || e.textContent.trim().slice(0, 30) }));
        if (!m.fv) continue;
        getoetst++;
        if (m.stijl === 'none' || m.kleur !== ROOD) mis.push(`${m.naam}: ${m.stijl} ${m.kleur}`);
      }
      expect(getoetst, `${thema}: te weinig elementen met :focus-visible — de meting heeft niet gedraaid`).toBeGreaterThan(40);
      expect(mis, `${thema}: focus zonder de rode ring`).toEqual([]);
    }
  });

  test('een icoon zonder tekst verandert zichtbaar bij hover', async ({ page }) => {
    await page.goto('/index.html');
    for (const thema of POLISH_THEMAS) {
      await zetThema(page, thema);
      const iconen = page.locator('.landing-footer .footer-social a');
      const n = await iconen.count();
      expect(n, 'geen footericonen gevonden').toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const a = iconen.nth(i);
        await a.scrollIntoViewIfNeeded();
        await page.mouse.move(1, 1);
        const lees = () => a.evaluate((e) => { const c = getComputedStyle(e); return { h: e.matches(':hover'), s: `${c.backgroundColor} ${c.color}` }; });
        const rust = await lees();
        await a.hover();
        const hover = await lees();
        expect(hover.h, `${thema}: icoon ${i} niet gehoverd`).toBe(true);
        expect(hover.s, `${thema}: icoon ${i} verandert niet van kleur of vlak`).not.toBe(rust.s);
      }
    }
  });

  test('het bloglinkblok heeft lucht naast de letters, en de tekst blijft op de naad', async ({ page }) => {
    for (const breedte of [1440, 1024, 375]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await zetThema(page, 'light');
      const links = page.locator('.af-lees-lijst .blog-link');
      const n = await links.count();
      expect(n, 'geen bloglinks gevonden').toBe(3);
      for (let i = 0; i < n; i++) {
        const a = links.nth(i);
        await a.scrollIntoViewIfNeeded();
        await page.mouse.move(1, 1);
        const meet = () => a.evaluate((e) => {
          const g = document.createRange(); g.selectNodeContents(e);
          const rs = [...g.getClientRects()]; const b = e.getBoundingClientRect();
          return { h: e.matches(':hover'), bg: getComputedStyle(e).backgroundColor, tl: Math.min(...rs.map((x) => x.left)), tr: Math.max(...rs.map((x) => x.right)), bl: b.left, br: b.right };
        });
        const rust = await meet();
        await a.hover();
        const hover = await meet();
        expect(hover.h, `@${breedte} link ${i} niet gehoverd`).toBe(true);
        expect(hover.bg, `@${breedte} link ${i} inverteert niet`).not.toBe(rust.bg);
        expect(hover.tl - hover.bl, `@${breedte} link ${i}: lucht links`).toBeGreaterThanOrEqual(6);
        expect(hover.br - hover.tr, `@${breedte} link ${i}: lucht rechts`).toBeGreaterThanOrEqual(6);
        expect(Math.abs(hover.tl - rust.tl), `@${breedte} link ${i}: tekst verschuift bij hover`).toBeLessThan(0.5);
      }
    }
  });

  test('de code staat bij de belofte, en de cijfertabel heeft geen glos', async ({ page }) => {
    for (const breedte of [1440, 1024, 375]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const sec = document.querySelector('.af-inventaris');
        const lijst = sec.querySelector('.af-lijst').getBoundingClientRect();
        const inleiding = sec.querySelector('.af-kop p');
        const buiten = [...sec.querySelectorAll('.af-raster > *')]
          .filter((e) => e.getClientRects().length && e.getBoundingClientRect().left > lijst.right - 1)
          .map((e) => e.className || e.tagName);
        return { github: !!inleiding.querySelector('a[href*="github.com"]'), buiten, kinderen: sec.querySelectorAll('.af-raster > *').length };
      });
      expect(m.kinderen, `@${breedte}: sectie leeg — de meting heeft niet gedraaid`).toBeGreaterThanOrEqual(2);
      expect(m.github, `@${breedte}: de GitHub-link staat niet in de inleiding`).toBe(true);
      expect(m.buiten, `@${breedte}: iets in de glos-kolom naast de cijfertabel`).toEqual([]);
    }
  });

  test('de laatste vraag sluit met een lijn alleen waar de kantlijn ernaast staat', async ({ page }) => {
    for (const breedte of [1440, 1280, 1024, 1023, 768, 375]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const vragen = [...document.querySelectorAll('.af-faq .faq-item')];
        const laatste = vragen.at(-1);
        const lees = document.querySelector('.af-faq-lees');
        const lb = laatste.getBoundingClientRect(), kb = lees.getBoundingClientRect();
        return {
          n: vragen.length, lijn: parseFloat(getComputedStyle(laatste).borderBottomWidth),
          andere: parseFloat(getComputedStyle(vragen.at(-2)).borderBottomWidth),
          ernaast: kb.left >= lb.right - 1, onderkantGelijk: Math.abs(kb.bottom - lb.bottom) < 1,
        };
      });
      expect(m.n, 'geen vragen gevonden').toBeGreaterThan(5);
      expect(m.andere, `@${breedte}: de andere vragen verloren hun lijn`).toBe(1);
      if (breedte >= 1024) {
        expect(m.ernaast, `@${breedte}: de kantlijn staat niet naast de vragen`).toBe(true);
        expect(m.lijn, `@${breedte}: laatste vraag zonder slotlijn naast de kantlijn`).toBe(1);
        expect(m.onderkantGelijk, `@${breedte}: kantlijn en slotlijn eindigen niet samen`).toBe(true);
      } else {
        expect(m.ernaast, `@${breedte}: de kantlijn staat nog naast de vragen`).toBe(false);
        expect(m.lijn, `@${breedte}: dubbele lijn boven het blogblok`).toBe(0);
      }
    }
  });

  test('nieuwsbrief: vanaf 1024 veld en knop op één rij tot de rand, daaronder onder elkaar', async ({ page }) => {
    await page.goto('/index.html');
    const BREEDTES = [1920, 1440, 1384, 1280, 1032, 1024, 1023, 900, 769, 768, 375, 320];
    let rij = 0, stapel = 0;
    for (const w of BREEDTES) {
      await page.setViewportSize({ width: w, height: 900 });
      const m = await page.evaluate(() => {
        const i = document.querySelector('.af-news .newsletter-form .input');
        const b = document.querySelector('.af-news .newsletter-button');
        const ri = i.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const r = document.querySelector('.af-news .af-raster'); const cs = getComputedStyle(r);
        const rand = r.getBoundingClientRect().right - parseFloat(cs.paddingRight);
        return {
          dTop: ri.top - rb.top, rechts: Math.max(ri.right, rb.right) - rand,
          iRand: [getComputedStyle(i).borderTopWidth, getComputedStyle(i).borderRightWidth], bRand: getComputedStyle(b).borderTopWidth,
          bBreed: rb.width, iBreed: ri.width,
        };
      });
      expect(Math.abs(m.rechts), `@${w}: formulier eindigt ${m.rechts.toFixed(1)}px naast de rand`).toBeLessThan(1);
      expect(m.iRand[0], `@${w}: veld en knop hebben een andere rand`).toBe(m.bRand);
      if (w >= 1024) {
        rij++;
        expect(Math.abs(m.dTop), `@${w}: veld staat ${m.dTop.toFixed(2)}px naast de knop`).toBeLessThan(0.5);
      } else {
        stapel++;
        expect(m.dTop, `@${w}: veld en knop staan naast elkaar`).toBeLessThan(-20);
        expect(m.iRand[1], `@${w}: gestapeld veld zonder rechterrand`).toBe(m.bRand);
        expect(Math.abs(m.bBreed - m.iBreed), `@${w}: knop niet zo breed als het veld`).toBeLessThan(1);
      }
    }
    expect(rij, 'geen rijbreedtes gemeten').toBeGreaterThan(3);
    expect(stapel, 'geen stapelbreedtes gemeten').toBeGreaterThan(3);
  });
});

// ==================== Finish review (sessie 246) ====================
// De bevindingen van impeccable-finish-reviewer (vers, zonder historie) plus de eigen pass,
// elk nagemeten in gerenderde pixels. Contract: .impeccable/surfaces/index-html.md,
// blok "Finish review (sessie 246)".

/** Rode pixels op vier punten: midden van elke zijde, `d` px buiten de box. Ringt de
 *  outline (2px, offset 2px), dan ligt hij op 2-4px buiten de rand: `d` = 3. */
async function roodRondom(page, box, d = 3) {
  const png = await page.screenshot();
  return page.evaluate(async ({ data, b, d }) => {
    const img = new Image(); img.src = data; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const k = img.width / innerWidth;   // WebKit: deviceScaleFactor 2
    const mx = b.x + b.width / 2, my = b.y + b.height / 2;
    const punten = { links: [b.x - d, my], rechts: [b.x + b.width + d, my], boven: [mx, b.y - d], onder: [mx, b.y + b.height + d] };
    const uit = {};
    for (const [z, [px, py]] of Object.entries(punten)) {
      const p = x.getImageData(Math.round(px * k), Math.round(py * k), 1, 1).data;
      uit[z] = p[0] > 150 && p[1] < 80 && p[2] < 90;
    }
    return uit;
  }, { data: 'data:image/png;base64,' + png.toString('base64'), b: box, d });
}

/** Resolve een custom property van body tot rgb(). */
const tokenKleuren = (namen) => {
  const body = getComputedStyle(document.body);
  return namen.map((n) => {
    const e = document.createElement('i'); e.style.color = body.getPropertyValue(n).trim();
    document.body.appendChild(e); const c = getComputedStyle(e).color; e.remove(); return c;
  });
};

test.describe('Finish review (sessie 246)', () => {
  for (const thema of POLISH_THEMAS) {
    for (const breedte of [1440, 375]) {
      test(`${thema} @${breedte}: de invoerregel van de terminal krijgt bij focus de ring, rondom`, async ({ page }) => {
        await page.setViewportSize({ width: breedte, height: 900 });
        await page.addInitScript(() => localStorage.setItem('hacksim_analytics_consent', 'false'));
        await page.goto('/index.html');
        await zetThema(page, thema);
        const regel = page.locator('.af-term .terminal-input-line');
        await regel.scrollIntoViewIfNeeded();
        // Eerst de overname (de eerste focus leegt de demo), dan een rusttoestand op een
        // chip, zodat rust en focus alleen in de focus verschillen.
        await page.locator('.af-term .hero-input').focus();
        await page.locator('.hero-chip').nth(1).focus();
        // De box per toestand opnieuw: een focus op het veld kan de pagina scrollen (op 375
        // brengt de overname de uitvoer in beeld), en dan meet een oude box naast de ring.
        const rust = await roodRondom(page, await regel.boundingBox());
        await page.locator('.af-term .hero-input').focus();
        const focus = await roodRondom(page, await regel.boundingBox());
        // Zelfbewakend: in rust staat er nergens rood; anders bewijst "rood bij focus" niets.
        expect(Object.values(rust).filter(Boolean), `rood rond de invoerregel in rust: ${JSON.stringify(rust)}`).toEqual([]);
        expect(focus, 'de ring is niet aan alle vier de zijden zichtbaar').toEqual({ links: true, rechts: true, boven: true, onder: true });
      });
    }

    test(`${thema}: de consentbanner staat in de wereld van het affiche`, async ({ page }) => {
      await page.goto('/index.html');
      await zetThema(page, thema);
      await page.locator('#cookie-decline').waitFor({ state: 'visible' });
      const m = await page.evaluate((tokenKleurenSrc) => {
        const tokenKleuren = eval(tokenKleurenSrc);
        const [papier, inkt, inkt2] = tokenKleuren(['--af-papier', '--af-inkt', '--af-inkt-2']);
        const toegestaan = new Set([papier, inkt, inkt2, 'rgba(0, 0, 0, 0)']);
        const banner = document.getElementById('cookie-consent');
        const els = [banner, ...banner.querySelectorAll('*')].filter((e) => e.getClientRects().length);
        const vreemd = [];
        for (const e of els) {
          const c = getComputedStyle(e);
          const eigenTekst = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          const verf = [];
          if (eigenTekst) verf.push(['color', c.color]);
          if (c.backgroundColor !== 'rgba(0, 0, 0, 0)') verf.push(['background', c.backgroundColor]);
          for (const z of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(c[`border${z}Width`]) > 0 && c[`border${z}Style`] !== 'none') verf.push([`border-${z}`, c[`border${z}Color`]]);
          for (const [p, v] of verf) if (!toegestaan.has(v)) vreemd.push(`${e.tagName}.${e.className} ${p} ${v}`);
        }
        const knop = (id) => { const c = getComputedStyle(document.getElementById(id)); return `${c.backgroundColor} ${c.color} ${c.borderTopColor} ${c.borderTopWidth} ${c.fontWeight}`; };
        return { n: els.length, vreemd, bg: getComputedStyle(banner).backgroundColor, papier, accept: knop('cookie-accept-analytics'), weiger: knop('cookie-decline') };
      }, `(${tokenKleuren.toString()})`);
      expect(m.n, 'banner leeg — de meting heeft niet gedraaid').toBeGreaterThan(4);
      expect(m.bg, 'de banner heeft niet de grond van de pagina').toBe(m.papier);
      expect(m.vreemd, 'kleur in de banner die niet uit het affiche komt').toEqual([]);
      // Geen dark pattern: weigeren oogt precies zo zwaar als accepteren.
      expect(m.weiger, 'weigeren en accepteren zien er verschillend uit').toBe(m.accept);
      const knop = page.locator('#cookie-decline');
      const rust = await knop.evaluate((e) => getComputedStyle(e).backgroundColor);
      await knop.hover();
      expect(await knop.evaluate((e) => getComputedStyle(e).backgroundColor), 'bannerknop inverteert niet bij hover').not.toBe(rust);
    });

    test(`${thema}: de volgende chip inverteert zijn index, en houdt dat bij hover`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addInitScript(() => localStorage.setItem('hacksim_analytics_consent', 'false'));
      await page.goto('/index.html');
      await zetThema(page, thema);
      const volgende = page.locator('.hero-chip.is-next');
      expect(await volgende.count(), 'geen chip met is-next — de meting bewijst niets').toBe(1);
      const lees = () => page.evaluate(() => {
        const [papier, inkt] = ['--af-papier', '--af-inkt'].map((n) => { const e = document.createElement('i'); e.style.color = getComputedStyle(document.body).getPropertyValue(n).trim(); document.body.appendChild(e); const c = getComputedStyle(e).color; e.remove(); return c; });
        const chip = document.querySelector('.hero-chip.is-next'); const nr = chip.querySelector('.af-chip-nr');
        const ander = document.querySelector('.hero-chip:not(.is-next)');
        const cmdX = (c) => c.querySelector('.af-chip-cmd').getBoundingClientRect().left - c.getBoundingClientRect().left;
        return { papier, inkt, nrBg: getComputedStyle(nr).backgroundColor, nrKleur: getComputedStyle(nr).color, chipBg: getComputedStyle(chip).backgroundColor, schaduw: getComputedStyle(chip).boxShadow, dx: cmdX(chip) - cmdX(ander) };
      });
      const rust = await lees();
      expect(rust.schaduw, 'de zijbalk is terug').toBe('none');
      expect([rust.nrBg, rust.nrKleur], 'index van de volgende chip is niet geïnverteerd').toEqual([rust.inkt, rust.papier]);
      expect(Math.abs(rust.dx), 'het command van de volgende chip verspringt t.o.v. de andere').toBeLessThan(0.5);
      await volgende.hover();
      const hover = await lees();
      expect(hover.chipBg, 'de chip inverteert niet bij hover').toBe(hover.inkt);
      expect(hover.nrBg, 'de index verdwijnt in de geïnverteerde chip').not.toBe(hover.chipBg);
    });
  }

  test('Herkenbaar op smal: vervolgregels springen in en de glos staat onder zijn waarde', async ({ page }) => {
    let gebroken = 0;
    for (const breedte of [320, 375, 414, 767, 768, 1440]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const uit = { terug: [], glos: [], gebroken: 0, subs: 0, inline: 0 };
        for (const regel of document.querySelectorAll('#features .af-transcript .terminal-line')) {
          // Alleen de eigen tekst van de regel: de glos is een blok met een negatieve marge,
          // en zijn box begint links van zijn tekst.
          const rs = [...regel.childNodes].filter((n) => n.nodeType === 3).flatMap((n) => {
            const g = document.createRange(); g.selectNodeContents(n); return [...g.getClientRects()];
          }).filter((r) => r.width > 0);
          const tops = [...new Set(rs.map((r) => Math.round(r.top)))];
          if (tops.length < 2) continue;
          uit.gebroken++;
          const eerste = Math.min(...rs.filter((r) => Math.round(r.top) === tops[0]).map((r) => r.left));
          const verder = rs.filter((r) => Math.round(r.top) !== tops[0]).map((r) => r.left);
          if (Math.min(...verder) < eerste + 5) uit.terug.push(regel.textContent.trim().slice(0, 30));
        }
        for (const sub of document.querySelectorAll('#features .af-sub')) {
          uit.subs++;
          const regel = sub.parentElement; const tekst = regel.firstChild.textContent;
          const i = tekst.search(/\S/); const g = document.createRange(); g.setStart(regel.firstChild, i); g.setEnd(regel.firstChild, i + 1);
          const waarde = g.getBoundingClientRect();
          // De tekst van de glos, niet zijn box: de inspringing zit in een ::before.
          const h = document.createRange(); h.setStart(sub.firstChild, 0); h.setEnd(sub.firstChild, 1);
          const s = h.getBoundingClientRect();
          if (getComputedStyle(sub).display === 'inline') { uit.inline++; continue; }
          if (s.top < waarde.bottom - 1 || Math.abs(s.left - waarde.left) > 1.5) uit.glos.push(`${sub.textContent.trim()}: dx=${(s.left - waarde.left).toFixed(1)} onder=${s.top >= waarde.bottom - 1}`);
        }
        return uit;
      });
      expect(m.subs, 'geen glossen in Herkenbaar gevonden').toBe(2);
      if (breedte < 768) {
        gebroken += m.gebroken;
        expect(m.terug, `@${breedte}: een afgebroken regel loopt terug naar kolom 0`).toEqual([]);
        expect(m.glos, `@${breedte}: glos niet op een eigen regel onder zijn waarde`).toEqual([]);
        expect(m.inline, `@${breedte}: glos nog inline`).toBe(0);
      } else {
        expect(m.inline, `@${breedte}: glos niet meer inline naast zijn waarde`).toBe(2);
      }
    }
    // Zelfbewakend: op smal moeten er regels breken, anders toetst "springt in" niets.
    expect(gebroken, 'geen enkele regel brak op smal — de inspringing is niet getoetst').toBeGreaterThan(5);
  });

  test('vanaf 1280 staat de knop op de onderste kopregel, de microcopy op de rij van de ondertitel', async ({ page }) => {
    for (const breedte of [1280, 1366, 1440, 1920]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const h1 = document.querySelector('.af-hero-tekst h1');
        const probe = document.createElement('span'); probe.style.cssText = 'display:inline-block;width:0;height:0';
        h1.appendChild(probe); const basis = probe.getBoundingClientRect().bottom; probe.remove();
        const g = document.createRange(); g.selectNodeContents(h1);
        const regels = new Set([...g.getClientRects()].map((r) => Math.round(r.top))).size;
        const knop = document.querySelector('.af-hero-zij .af-cta').getBoundingClientRect();
        const micro = document.querySelector('.af-hero-zij .af-microcopy').getBoundingClientRect();
        const sub = document.querySelector('.af-hero-sub');
        const subTekst = parseFloat(getComputedStyle(sub).paddingTop) + sub.getBoundingClientRect().top;
        return { basis, regels, knopOnder: knop.bottom, knopL: knop.left, microTop: micro.top, microL: micro.left, subTekst };
      });
      expect(m.regels, `@${breedte}: de kop is geen twee regels — de basislijnmeting klopt niet`).toBe(2);
      expect(Math.abs(m.knopOnder - m.basis), `@${breedte}: knop ${(m.knopOnder - m.basis).toFixed(1)}px naast de basislijn van kopregel 2`).toBeLessThan(1.5);
      expect(Math.abs(m.microTop - m.subTekst), `@${breedte}: microcopy niet op de rij van de ondertitel`).toBeLessThan(1);
      expect(Math.abs(m.microL - m.knopL), `@${breedte}: microcopy niet onder de knop`).toBeLessThan(0.5);
    }
  });

  test('nieuwsbrief gestapeld: tussen veld en knop alleen de foutreserve', async ({ page }) => {
    await page.goto('/index.html');
    let gemeten = 0;
    for (let w = 320; w <= 768; w += 32) {
      await page.setViewportSize({ width: w, height: 900 });
      const m = await page.evaluate(() => {
        const i = document.querySelector('.af-news .newsletter-form .input').getBoundingClientRect();
        const b = document.querySelector('.af-news .newsletter-button').getBoundingClientRect();
        // main.css reserveert 1.6em onder het veldblok voor een foutmelding (16px: 25,6).
        const reserve = 1.6 * parseFloat(getComputedStyle(document.querySelector('.af-news .sib-input')).fontSize);
        return { gat: b.top - i.bottom, reserve };
      });
      gemeten++;
      expect(m.gat, `@${w}: veld en knop overlappen`).toBeGreaterThanOrEqual(0);
      expect(m.gat, `@${w}: ${m.gat.toFixed(1)}px tussen veld en knop, reserve ${m.reserve}`).toBeLessThanOrEqual(m.reserve + 1);
    }
    expect(gemeten, 'te weinig breedtes gemeten').toBeGreaterThan(10);
  });

  test('de footer tekent geen glyph als icoon (met positieve controle)', async ({ page }) => {
    await page.goto('/index.html');
    // Pijlen, vormen, dingbats, kaartsymbolen (♥ = U+2665) en emoji; niet © of ®, dat zijn
    // tekens en geen iconen.
    const glyphs = () => page.evaluate(() => {
      const f = document.querySelector('footer');
      return (f.innerText.match(/[\u2190-\u2BFF\u{1F000}-\u{1FAFF}]/gu) || []);
    });
    expect(await glyphs(), 'symboolglyph in de footer').toEqual([]);
    // Positieve controle: dezelfde teller ziet een ingespoten hartje.
    await page.evaluate(() => { document.querySelector('.footer-donate').insertAdjacentText('afterbegin', '♥ '); });
    expect((await glyphs()).length, 'de teller ziet een ingespoten glyph niet').toBe(1);
  });
});
