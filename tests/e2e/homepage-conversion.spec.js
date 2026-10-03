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
  // Sessie 248 (layout): de cijfers lopen over de volle breedte en staan hier niet meer in;
  // dat bewaakt "Layout (sessie 248)" (getal en bron op de twee rasterranden).
  // Sessie 249 (onderscheid): de sample staat onder elkaar met zijn tabel over het hele
  // raster, en is daarmee geen tweedelige rij meer; dat bewaakt "Onderscheid (sessie 249)".
  for (const breedte of [1440, 1280, 1279, 1180, 1024]) {
    test(`@${breedte}px deelt elke tweedelige rij onder de hero op de glos-naad`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const m = await page.evaluate(() => {
        const naad = document.querySelector('.af-glos-kop').getBoundingClientRect().left;
        const paren = [
          ['.af-pijn-rij .af-transcript', '.af-pijn-rij .af-pijn-tekst'],
          ['.af-faq .af-faq-lijst', '.af-faq .af-faq-lees'],
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
      expect(m.aantal).toBeGreaterThanOrEqual(3);
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

  // Sessie 249 (proef S3): kop, inleiding, inhoud en actie onder elkaar, in leesvolgorde.
  // Tot dan stond de inhoud links op de rij van de knop (sessie 245) en zigzagde de massa.
  for (const breedte of [1440, 1280, 1024, 768, 375]) {
    test(`@${breedte}px staat de sample in leesvolgorde onder elkaar`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const R = (q) => document.querySelector(q).getBoundingClientRect();
        const delen = ['.af-sample h2', '.af-sample p', '.af-sample-inhoud', '.af-sample-acties'].map((q) => [q, R(q)]);
        return { n: document.querySelectorAll('.af-sample-inhoud li').length,
          delen: delen.map(([q, r]) => ({ q, top: r.top, bottom: r.bottom, left: r.left })) };
      });
      expect(m.n, 'geen inhoudsregels gevonden').toBeGreaterThan(0);
      const fout = [];
      for (let i = 1; i < m.delen.length; i++) {
        const a = m.delen[i - 1], b = m.delen[i];
        if (b.top < a.bottom - 1) fout.push(`${b.q} (top ${b.top.toFixed(0)}) begint vóór het einde van ${a.q} (${a.bottom.toFixed(0)})`);
        if (Math.abs(b.left - m.delen[0].left) > 1) fout.push(`${b.q} op x ${b.left.toFixed(0)}, kop op ${m.delen[0].left.toFixed(0)}`);
      }
      expect(fout).toEqual([]);
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
      // Een budget dat met de populatie meegroeit: los 13,2s in Firefox, in de gate van
      // sessie 246 (47 min, met iemand in de browser) over de vaste 30s. 400ms per element
      // per thema, ~4x de losse meting.
      if (thema === POLISH_THEMAS[0]) test.setTimeout(POLISH_THEMAS.length * n * 400 + 15_000);
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
        // Schuiven zonder animatie: html heeft scroll-behavior: smooth, en sinds de lucht van
        // sessie 250 staat de invoerregel op 375x900 net onder de vouw. Dan mat de rust een box
        // halverwege de scroll (y 825 op weg naar 391), boven op de rode CTA-balk.
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
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

  // Sessie 247 (bolder): de kop over alle twaalf kolommen op afficheschaal. Sessie 249 (proef
  // V1-V3): de actie staat in de leesrij, onder de ondertitel en links op dezelfde lijn: kop,
  // zin, knop. Van 247 tot 249 stond hij in kolom 10-12 op de rij van de ondertitel ("vreemd
  // gepositioneerd", eigenaar); die guard is hierdoor vervangen. Vanaf 1280 staat de microcopy
  // naast de knop, daaronder eronder.
  for (const breedte of [375, 768, 1024, 1279, 1280, 1440, 1920]) {
    test(`@${breedte}px staat de actie in de leesrij: kop, zin, knop`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const tekst = (el) => {
          const g = document.createRange(); g.selectNodeContents(el);
          const rs = [...g.getClientRects()];
          return { top: Math.min(...rs.map((x) => x.top)), bottom: Math.max(...rs.map((x) => x.bottom)),
                   left: Math.min(...rs.map((x) => x.left)), regels: new Set(rs.map((x) => Math.round(x.top))).size };
        };
        const h1el = document.querySelector('.af-hero-tekst h1');
        const fs = (el) => parseFloat(getComputedStyle(el).fontSize);
        const knopEl = document.querySelector('.af-hero-zij .af-cta');
        const volgorde = [h1el, document.querySelector('.af-hero-sub'), knopEl];
        return {
          h1: tekst(h1el), sub: tekst(document.querySelector('.af-hero-sub')),
          knop: knopEl.getBoundingClientRect().toJSON(), micro: document.querySelector('.af-hero-zij .af-microcopy').getBoundingClientRect().toJSON(),
          stap: fs(h1el) / fs(document.querySelector('#pijn-kop')),
          domOk: volgorde.every((el, i) => i === 0 || volgorde[i - 1].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
        };
      });
      expect(m.domOk, 'de bronvolgorde is niet kop, zin, knop').toBe(true);
      expect(m.knop.top, 'de knop staat niet onder de ondertitel').toBeGreaterThanOrEqual(m.sub.bottom);
      expect(Math.abs(m.knop.left - m.sub.left), `knop ${(m.knop.left - m.sub.left).toFixed(1)}px naast de lijn van de zin`).toBeLessThan(1);
      expect(Math.abs(m.sub.left - m.h1.left), 'de zin staat niet op de lijn van de kop').toBeLessThan(6);
      if (breedte >= 1280) {
        expect(m.h1.regels, `@${breedte}: de kop is geen twee regels (plafond --af-affiche te hoog?)`).toBe(2);
        expect(m.stap, `@${breedte}: kop maar ${m.stap.toFixed(2)}x de sectiekop: geen affiche`).toBeGreaterThanOrEqual(1.7);
        expect(m.micro.left, 'microcopy staat niet naast de knop').toBeGreaterThanOrEqual(m.knop.right);
        expect(Math.abs((m.micro.top + m.micro.height / 2) - (m.knop.top + m.knop.height / 2)), 'microcopy niet op de rij van de knop').toBeLessThan(1);
      } else {
        expect(m.micro.top, 'microcopy staat niet onder de knop').toBeGreaterThanOrEqual(m.knop.bottom - 0.5);
      }
    });
  }

  // Sessie 250 (eigenaar: "het zit allemaal een beetje krap op elkaar"). Gemeten vóór op 1440:
  // kop→zin 14, zin→knop 20, knop→terminal 26: alles even ver, dus geen groepen. Nu staan kop,
  // zin en knop dicht bij elkaar en is de stap naar de terminal de grote: minstens 1,4x de
  // grootste stap binnen de groep, en minstens 40px.
  test('lucht naar groep: de stap naar de terminal is de grote', async ({ page }) => {
    const fout = [];
    let gemeten = 0;
    for (const breedte of [375, 768, 1024, 1279, 1280, 1440, 1920]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const tekst = (el) => { const g = document.createRange(); g.selectNodeContents(el); const rs = [...g.getClientRects()];
          return { top: Math.min(...rs.map((x) => x.top)), bottom: Math.max(...rs.map((x) => x.bottom)) }; };
        const h1 = tekst(document.querySelector('#hero-kop')), sub = tekst(document.querySelector('.af-hero-sub'));
        const k = document.querySelector('.af-hero-zij .af-cta').getBoundingClientRect();
        const mc = document.querySelector('.af-hero-zij .af-microcopy').getBoundingClientRect();
        const t = document.querySelector('.af-term-kop').getBoundingClientRect();
        return { binnen: Math.max(sub.top - h1.bottom, k.top - sub.bottom), groep: t.top - Math.max(k.bottom, mc.bottom) };
      });
      gemeten++;
      if (!(r.binnen > 0)) fout.push(`${breedte}: geen stap binnen de groep gemeten (${r.binnen})`);
      if (r.groep < 40 - 0.5) fout.push(`${breedte}: naar de terminal maar ${r.groep.toFixed(1)}px`);
      if (r.groep < 1.4 * r.binnen) fout.push(`${breedte}: groep ${r.groep.toFixed(1)} tegen binnen ${r.binnen.toFixed(1)}, minder dan 1,4x`);
    }
    expect(gemeten, 'de breedtes zijn niet gemeten').toBe(7);
    expect(fout).toEqual([]);
  });

  // Finish review s247: het mono-pad stond bóven de bloglinktitel en las als eyebrow (de
  // craft floor verbiedt dat zonder uitzondering). Nu onder de titel, en het tikdoel blijft.
  test('bloglinks: het pad staat onder de titel, niet erboven, en het tikdoel blijft 44px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    // elementFromPoint werkt alleen binnen het venster: elke rij eerst in beeld.
    const rijen = await page.evaluate(() => [...document.querySelectorAll('.af-lees-lijst li')].map((li) => {
      li.scrollIntoView({ block: 'center', behavior: 'instant' });
      const a = li.querySelector('.blog-link'); const pad = li.querySelector('.af-lees-pad');
      const g = document.createRange(); g.selectNodeContents(a); const tekst = [...g.getClientRects()];
      const p = pad.getBoundingClientRect(); const box = a.getBoundingClientRect();
      const midden = document.elementFromPoint(box.left + 4, box.bottom - 2);
      return { titelOnder: Math.max(...tekst.map((r) => r.bottom)), padTop: p.top, hoogte: box.height,
               onderkantRaaktLink: a.contains(midden) };
    }));
    expect(rijen.length, 'geen bloglinks gevonden').toBe(3);
    for (const r of rijen) {
      expect(r.padTop, 'het pad staat boven of in zijn titel').toBeGreaterThanOrEqual(r.titelOnder - 1);
      expect(r.hoogte, 'tikdoel onder 44px').toBeGreaterThanOrEqual(44);
      expect(r.onderkantRaaktLink, 'het pad vangt de tik op de onderkant van de link').toBe(true);
    }
  });

  // Sessie 247: het slot is de slotklap op inkt, de sample staat op papier (omgewisseld; zo
  // geen ~1000px aaneengesloten zwart, finish review s246). Op inkt inverteert de actie naar
  // papier: naar inkt zou hij in zijn grond verdwijnen.
  for (const thema of ['light', 'dark']) {
    test(`slot op inkt, sample op papier, en de slotactie inverteert naar papier (${thema})`, async ({ page }) => {
      await page.goto('/index.html');
      await zetThema(page, thema);
      const lees = () => page.evaluate(() => {
        const v = (n) => {
          const p = document.createElement('div'); p.style.color = `var(${n})`; document.body.appendChild(p);
          const c = getComputedStyle(p).color; p.remove(); return c;
        };
        const bg = (s) => getComputedStyle(document.querySelector(s)).backgroundColor;
        return { inkt: v('--af-inkt'), papier: v('--af-papier'), slot: bg('.af-slot'), sample: bg('.af-sample'),
          kop: getComputedStyle(document.querySelector('.af-slot h2')).color };
      });
      const m = await lees();
      // Zelfbewakend: inkt en papier zijn verschillende kleuren, anders bewijst gelijkheid niets.
      expect(m.inkt).not.toBe(m.papier);
      expect(m.slot, 'het slot staat niet op inkt').toBe(m.inkt);
      expect(m.kop, 'de slotkop is niet papier op inkt').toBe(m.papier);
      expect(m.sample, 'de sample staat niet op papier').toBe(m.papier);

      await page.locator('.af-slot .af-cta').hover();
      const slotHover = await page.evaluate(() => getComputedStyle(document.querySelector('.af-slot .af-cta')).backgroundColor);
      expect(slotHover, 'de slotactie inverteert naar inkt en verdwijnt in zijn grond').toBe(m.papier);
      await page.locator('.af-hero .af-cta').hover();
      const heroHover = await page.evaluate(() => getComputedStyle(document.querySelector('.af-hero .af-cta')).backgroundColor);
      expect(heroHover, 'de uitzondering lekt: de hero-actie inverteert niet meer naar inkt').toBe(m.inkt);
    });
  }

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

  // Mono is voor wat je kunt nalopen (paden, adressen, nummers), nooit voor een kop. Populatie
  // omgedraaid: niet een lijst koppen, maar élk element dat iets labelt (h1-h6 en elk doel
  // van aria-labelledby), zodat een nieuwe kop er vanzelf onder valt. Sessie 246 vond
  // "Verder lezen op de blog" in vette mono.
  for (const thema of POLISH_THEMAS) {
    test(`${thema}: geen kop in mono, en de kolomkoppen op de naad hebben één vorm`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/index.html');
      await zetThema(page, thema);
      const m = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[aria-labelledby]')].flatMap((e) => e.getAttribute('aria-labelledby').split(/\s+/));
        const koppen = [...new Set([...document.querySelectorAll('h1, h2, h3, h4, h5, h6'), ...ids.map((i) => document.getElementById(i)).filter(Boolean)])]
          .filter((e) => e.getClientRects().length && !e.closest('.af-term, .af-transcript, footer, nav'));
        const mono = koppen.filter((e) => /JetBrains/i.test(getComputedStyle(e).fontFamily.split(',')[0])).map((e) => e.textContent.trim().slice(0, 40));
        const vorm = (s) => { const c = getComputedStyle(document.querySelector(s)); return `${c.fontFamily.split(',')[0]} ${c.fontWeight} ${c.fontSize} ${c.color}`; };
        return { n: koppen.length, mono, glos: vorm('.af-glos-kop'), lees: vorm('.af-lees-label') };
      });
      expect(m.n, 'te weinig koppen gevonden — de populatie is leeg').toBeGreaterThan(8);
      expect(m.mono, 'kop in mono').toEqual([]);
      expect(m.lees, 'de twee kolomkoppen op de naad hebben twee vormen').toBe(m.glos);
    });
  }

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

// Sessie 248 (layout): de cijfers over de volle breedte op het raster, en het slot als
// tegenhanger van de hero. Twee besluiten gingen om: "haarlijnen alleen in de hero" (s242)
// en "kolom 8-12 leeg naast de cijfers" (s245, proef N3). Zie het contract, "Layout (sessie 248)".
test.describe('Layout (sessie 248)', () => {
  test('slot en cijfers op elke breedte, per 8px van 320 tot 1920', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);
    const fout = { slotkop: [], slotKolom: [], slotRegel: [], slotOnder: [], getalRand: [], bronRand: [], getalSchaal: [], overlap: [], overloop: [],
      symmetrie: [], bronOnder: [], labelRegel: [] };
    const tak = { naast: 0, onder: 0, bron: 0, bronOnder: 0, gemeten: 0 };
    for (let w = 320; w <= 1920; w += 8) {
      await page.setViewportSize({ width: w, height: 900 });
      // WebKit werkt layout niet bij als het venster in kleine stappen over een mediagrens
      // groeit (matchMedia zegt al het nieuwe): over 768 bleef `display: none` staan (85
      // breedtes), over 1280 bleven hero- én slotactie links (81 van 81). Gemeten sessie 248,
      // gelijk op HEAD vóór deze sessie; weg na een herlading. Zelfde familie als de rijhoogte
      // in hero-demo (sessie 243). Dit meet layout per breedte, niet dat venstergedrag.
      if (w === 768 || w === 1280) { await page.reload(); await page.evaluate(() => document.fonts.ready); }
      // Eén frame laten renderen vóór het meten (sessie 252). De navbar klapt sindsdien in op
      // wat past, via de resize-gebeurtenis, en die valt pas in het volgende frame. Direct na
      // setViewportSize meten zag in WebKit op 320-336 nog de uitgeklapte nav (scrollWidth
      // 1035): een toestand die nooit geschilderd wordt.
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const r = await page.evaluate(() => {
        const R = (e) => e.getBoundingClientRect();
        const raster = document.querySelector('.af-slot .af-raster');
        const cs = getComputedStyle(raster);
        const L = R(raster).left + parseFloat(cs.paddingLeft);
        const Rr = R(raster).right - parseFloat(cs.paddingRight);
        const h1 = parseFloat(getComputedStyle(document.querySelector('h1')).fontSize);
        const kop = document.querySelector('.af-slot h2');
        const zin = document.querySelector('.af-slot-zin');
        const knop = document.querySelector('.af-slot .af-cta');
        // Tekstranden uit de glyphs (Range), niet uit de box: de box staat op de lijn, de
        // letter op --af-cel ervan.
        const inkt = (e) => { const g = document.createRange(); g.selectNodeContents(e); const q = [...g.getClientRects()]; return { l: Math.min(...q.map((x) => x.left)), r: Math.max(...q.map((x) => x.right)) }; };
        const rijen = [...document.querySelectorAll('.af-lijst-rij')].map((rij) => {
          const g = rij.querySelector('.result-number'), l = rij.querySelector('.result-label'), b = rij.querySelector('.af-lijst-waar');
          return { g: R(g), l: R(l), b: b.getClientRects().length ? R(b) : null, gFs: parseFloat(getComputedStyle(g).fontSize),
            gInkt: inkt(g).l, bInkt: inkt(b).r, lRegel: parseFloat(getComputedStyle(l).lineHeight) };
        });
        return {
          L, R: Rr, kol: (Rr - L) / 12, h1, kopFs: parseFloat(getComputedStyle(kop).fontSize),
          breed: matchMedia('(min-width: 1280px)').matches,
          zin: R(zin), zinPad: parseFloat(getComputedStyle(zin).paddingTop), knop: R(knop), rijen,
          tabelBreed: matchMedia('(min-width: 768px)').matches,
          sw: document.documentElement.scrollWidth,
        };
      });
      tak.gemeten++;
      if (Math.abs(r.kopFs - r.h1) > 0.1) fout.slotkop.push(`${w}: ${r.kopFs} tegen h1 ${r.h1}`);
      if (r.breed) {
        tak.naast++;
        const kol10 = r.L + 9 * r.kol;
        if (r.knop.left < kol10 - 1 || r.knop.right > r.R + 1) fout.slotKolom.push(`${w}: knop ${r.knop.left.toFixed(1)}-${r.knop.right.toFixed(1)}, kolom 10 op ${kol10.toFixed(1)}`);
        const regel = r.zin.top + r.zinPad;
        if (Math.abs(r.knop.top - regel) > 1) fout.slotRegel.push(`${w}: knop ${r.knop.top.toFixed(1)}, eerste zinregel ${regel.toFixed(1)}`);
      } else {
        tak.onder++;
        if (r.knop.top < r.zin.bottom - 1) fout.slotOnder.push(`${w}: knop ${r.knop.top.toFixed(1)} naast de zin (bodem ${r.zin.bottom.toFixed(1)})`);
      }
      r.rijen.forEach((q, i) => {
        if (Math.abs(q.g.left - r.L) > 1) fout.getalRand.push(`${w} rij ${i}: getal op ${q.g.left.toFixed(1)}, rand ${r.L.toFixed(1)}`);
        if (Math.abs(q.gFs - r.h1) > 0.1) fout.getalSchaal.push(`${w} rij ${i}: ${q.gFs} tegen h1 ${r.h1}`);
        if (q.g.right > q.l.left + 0.5) fout.overlap.push(`${w} rij ${i}: getal tot ${q.g.right.toFixed(1)}, label vanaf ${q.l.left.toFixed(1)}`);
        if (r.tabelBreed) tak.bron++; else tak.bronOnder++;
        if (!q.b) { fout.bronOnder.push(`${w} rij ${i}: geen bron zichtbaar`); return; }
        if (r.tabelBreed) {
          if (Math.abs(q.b.right - r.R) > 1) fout.bronRand.push(`${w} rij ${i}: bron tot ${q.b.right.toFixed(1)}, rand ${r.R.toFixed(1)}`);
          if (q.l.right > q.b.left + 0.5) fout.overlap.push(`${w} rij ${i}: label tot ${q.l.right.toFixed(1)}, bron vanaf ${q.b.left.toFixed(1)}`);
          // Gelijke binnenruimte links en rechts (finish review s248): getal en bron elk
          // minstens 8px van hun lijn, en even ver.
          const links = q.gInkt - r.L, rechts = r.R - q.bInkt;
          if (links < 8 || Math.abs(links - rechts) > 1) fout.symmetrie.push(`${w} rij ${i}: getal ${links.toFixed(1)} van de lijn, bron ${rechts.toFixed(1)}`);
          if (w >= 1280 && q.l.height > q.lRegel * 1.5) fout.labelRegel.push(`${w} rij ${i}: label ${q.l.height.toFixed(1)}px hoog bij regel ${q.lRegel}`);
        } else {
          if (Math.abs(q.b.left - q.l.left) > 1 || q.b.top < q.l.bottom - 1) fout.bronOnder.push(`${w} rij ${i}: bron op ${q.b.left.toFixed(1)},${q.b.top.toFixed(1)}, label ${q.l.left.toFixed(1)} tot ${q.l.bottom.toFixed(1)}`);
        }
      });
      if (r.sw > w) fout.overloop.push(`${w}: scrollWidth ${r.sw}`);
    }
    // Zelfbewakend: beide vormen van het slot en beide vormen van de tabel zijn gemeten.
    expect(tak.gemeten, 'niet elke breedte gemeten').toBe(201);
    expect(tak.naast, 'nooit de brede vorm van het slot gemeten').toBeGreaterThan(50);
    expect(tak.onder, 'nooit de gestapelde vorm van het slot gemeten').toBeGreaterThan(50);
    expect(tak.bron, 'nooit een bron gemeten').toBeGreaterThan(100);
    expect(tak.bronOnder, 'nooit de smalle tabel gemeten').toBeGreaterThan(50);
    expect(fout.slotkop, 'de slotkop staat niet op afficheschaal').toEqual([]);
    expect(fout.slotKolom, 'de slotactie staat niet in kolom 10-12').toEqual([]);
    expect(fout.slotRegel, 'de slotknop staat niet op de eerste regel van de zin').toEqual([]);
    expect(fout.slotOnder, 'de slotactie staat smal niet onder de zin').toEqual([]);
    expect(fout.getalRand, 'het getal staat niet op de linker rasterrand').toEqual([]);
    expect(fout.bronRand, 'de bron staat niet op de rechter rasterrand').toEqual([]);
    expect(fout.getalSchaal, 'het getal staat niet op afficheschaal').toEqual([]);
    expect(fout.overlap, 'cellen van de cijfertabel overlappen').toEqual([]);
    expect(fout.overloop, 'horizontale overloop').toEqual([]);
    expect(fout.symmetrie, 'getal en bron hebben niet dezelfde binnenruimte').toEqual([]);
    expect(fout.bronOnder, 'smal staat de bron niet onder het label').toEqual([]);
    expect(fout.labelRegel, 'het label vult zijn cel niet (breekt af vanaf 1280)').toEqual([]);
  });

  // Focus is dezelfde toestand als hover: inversie (finish review s248). Tak: in rust is de
  // rij níét inkt, anders bewijst de focusmeting niets.
  for (const thema of ['light', 'dark']) {
    test(`een cijferrij inverteert bij focus, zoals bij hover (${thema})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/index.html');
      await zetThema(page, thema);
      const lees = () => page.evaluate(() => {
        const rij = document.querySelector('.af-lijst-rij');
        const inkt = getComputedStyle(document.body).getPropertyValue('--af-inkt').trim();
        const kleur = (c) => { const d = document.createElement('div'); d.style.color = c; document.body.append(d); const v = getComputedStyle(d).color; d.remove(); return v; };
        return { inkt: kleur(inkt), rij: getComputedStyle(rij).backgroundColor, getal: getComputedStyle(rij.querySelector('.result-number')).backgroundColor };
      });
      const rust = await lees();
      expect(rust.rij, 'in rust is de rij al inkt — de meting bewijst niets').not.toBe(rust.inkt);
      await page.locator('.af-lijst-rij').first().focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      const focus = await lees();
      expect(await page.evaluate(() => document.activeElement.classList.contains('af-lijst-rij')), 'de focus staat niet op de rij').toBe(true);
      expect([focus.rij, focus.getal], 'de rij inverteert niet bij focus').toEqual([focus.inkt, focus.inkt]);
    });
  }

  // Populatie: élk element in main met een betegelde verloop-achtergrond (tegel smaller dan
  // het element), niet een lijst selectors. Uitzonderingen benoemd: hero en cijfers.
  test('haarlijnen alleen in de hero en de cijfers', async ({ page }) => {
    for (const breedte of [1440, 375]) {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      const plekken = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => {
        const c = getComputedStyle(e);
        if (!c.backgroundImage.includes('linear-gradient')) return false;
        const m = c.backgroundSize.split(',')[0].match(/([\d.]+)(%|px)/);
        if (!m) return false;
        const w = e.getBoundingClientRect().width;
        const tegel = m[2] === '%' ? parseFloat(m[1]) / 100 * w : parseFloat(m[1]);
        return tegel > 0 && tegel < w - 1;
      }).map((e) => e.closest('section')?.id || e.className));
      expect(plekken.filter((p) => p === 'hero').length, `@${breedte}: geen haarlijnen in de hero gemeten — de meting zag niets`).toBe(1);
      expect(plekken.filter((p) => p === 'results').length, `@${breedte}: de cijfers staan niet op het raster`).toBe(1);
      expect(plekken.filter((p) => p !== 'hero' && p !== 'results'), `@${breedte}: haarlijnen buiten hero en cijfers`).toEqual([]);
    }
  });

  // Gerenderde pixels, niet de achtergrondkleur in de cascade: per kolomlijn die een tekstvak
  // kruist, telt hoeveel pixelrijen in dat vak de lijnkleur hebben. Positieve controle: in
  // de lucht tussen kop en tabel staat op elke lijn een pixel dat geen papier is.
  for (const thema of ['light', 'dark']) {
    test(`geen haarlijn door tekst in de cijfers, gerenderd (${thema})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/index.html');
      await zetThema(page, thema);
      await page.locator('#results').scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      const png = (await page.locator('#results').screenshot()).toString('base64');
      const m = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
        const sec = document.querySelector('#results'); const sr = sec.getBoundingClientRect();
        const k = img.width / sr.width;
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        // In apparaatpixels: WebKit draait hier op deviceScaleFactor 2 en legt de tegels anders
        // op het pixelraster dan Chromium. De lijnkolom wordt daarom gezocht, niet uitgerekend.
        const dpx = (dx, Y) => [...x.getImageData(dx, Math.floor((Y - sr.top) * k), 1, 1).data].slice(0, 3).join(',');
        const raster = sec.querySelector('.af-raster'); const rb = raster.getBoundingClientRect();
        const pl = parseFloat(getComputedStyle(raster).paddingLeft); const kol = (rb.width - 2 * pl) / 12;
        const yLucht = sec.querySelector('.af-lijst').getBoundingClientRect().top - 8;
        const papier = dpx(Math.floor((rb.left + pl + kol * 11.5 - sr.left) * k), yLucht);
        const kolommen = [...Array(11)].map((_, i) => {
          const X = rb.left + pl + (i + 1) * kol - sr.left;
          for (let dx = Math.floor((X - 3) * k); dx <= Math.ceil((X + 3) * k); dx++) if (dpx(dx, yLucht) !== papier) return dx;
          return null;
        });
        const controle = kolommen.map((dx) => (dx === null ? papier : dpx(dx, yLucht)));
        const lijnen = kolommen.map((dx) => (dx === null ? -1 : dx / k + sr.left));
        const px = (X, Y) => dpx(Math.round((X - sr.left) * k), Y);
        const tekst = [...sec.querySelectorAll('h2, .af-kop p, .result-number, .result-label, .af-lijst-waar')].filter((e) => e.getClientRects().length);
        const door = [];
        for (const e of tekst) {
          const q = e.getBoundingClientRect();
          lijnen.forEach((X, i) => {
            if (X <= q.left + 2 || X >= q.right - 2) return;
            let n = 0, rijen = 0;
            for (let Y = q.top + 1; Y < q.bottom - 1; Y += 1) { rijen++; if (px(X, Y) === controle[i]) n++; }
            if (n / rijen > 0.3) door.push(`${e.className || e.tagName} lijn ${i + 1}: ${n}/${rijen}`);
          });
        }
        return { papier, controle, tekst: tekst.length, door };
      }, png);
      expect(m.tekst, 'geen tekst in de cijfers gemeten').toBeGreaterThanOrEqual(9);
      expect(m.controle.filter((c) => c === m.papier), 'positieve controle: geen haarlijn zichtbaar in de lucht').toEqual([]);
      expect(m.door, 'haarlijn door tekst in de cijfers').toEqual([]);
    });
  }
});

// ==================== Onderscheid (sessie 249) ====================
//
// Na de critique van sessie 249 en proeven op gelijke maat (H2, S3, B1; contract
// "Onderscheid (sessie 249)"). Elke test heeft een zelfbewakende tak die eist dat de vorm die
// hij bewaakt ook echt gemeten is.

test.describe('Onderscheid (sessie 249)', () => {
  // H2: de chips zijn één toetsenrij vast onder de terminal, met hun randen op de rasterlijnen
  // en zonder tussenruimte; de herkomst per chip is weg. Per 8px van 320 tot 1920.
  test('de toetsenrij staat op het raster, tegen de terminal, op elke breedte', async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('/index.html');
    await page.evaluate(() => document.fonts.ready);
    const fout = { populatie: [], vorm: [], raster: [], aaneen: [], terminal: [] };
    const vormen = { 6: 0, 3: 0, 2: 0 };
    let gemeten = 0;
    for (let w = 320; w <= 1920; w += 8) {
      await page.setViewportSize({ width: w, height: 900 });
      // WebKit werkt de layout niet bij als het venster in stappen over een mediagrens groeit
      // (meten-en-guards §35); opnieuw laden op 768 en 1280.
      if (w === 768 || w === 1280) { await page.reload(); await page.evaluate(() => document.fonts.ready); }
      const r = await page.evaluate(() => {
        const raster = document.querySelector('.af-hero-raster');
        const cs = getComputedStyle(raster); const rb = raster.getBoundingClientRect();
        const L = rb.left + parseFloat(cs.paddingLeft), Rr = rb.right - parseFloat(cs.paddingRight);
        const kolommen = cs.gridTemplateColumns.split(' ').length;
        const chips = [...document.querySelectorAll('.hero-chip')].map((c) => {
          const q = c.getBoundingClientRect();
          // Wat de chip aan tekst toont, per kind: alleen index en command horen erin.
          const kinderen = [...c.children].filter((k) => k.getClientRects().length && k.textContent.trim()).map((k) => k.className);
          return { l: q.left, r: q.right, t: q.top, b: q.bottom, kinderen };
        });
        return { L, kol: (Rr - L) / kolommen, kolommen, chips,
          herkomst: document.querySelectorAll('.af-chip-herkomst').length,
          term: document.querySelector('.af-term').getBoundingClientRect().bottom };
      });
      gemeten++;
      if (r.herkomst || r.chips.length !== 6) fout.populatie.push(`${w}: ${r.chips.length} chips, ${r.herkomst} herkomst`);
      const vreemd = r.chips.filter((c) => c.kinderen.some((k) => k !== 'af-chip-nr' && k !== 'af-chip-cmd'));
      if (vreemd.length) fout.populatie.push(`${w}: chip toont ${vreemd[0].kinderen.join(', ')}`);
      const perRij = r.chips.filter((c) => Math.abs(c.t - r.chips[0].t) < 1).length;
      const verwacht = w >= 1280 ? 6 : w >= 768 ? 3 : 2;
      if (perRij !== verwacht) { fout.vorm.push(`${w}: ${perRij} per rij, verwacht ${verwacht}`); continue; }
      vormen[perRij]++;
      const span = r.kolommen / perRij;
      r.chips.forEach((c, i) => {
        const k = (i % perRij) * span;
        const links = r.L + k * r.kol, rechts = r.L + (k + span) * r.kol;
        if (Math.abs(c.l - links) > 1 || Math.abs(c.r - rechts) > 1) fout.raster.push(`${w} chip ${i + 1}: ${c.l.toFixed(1)}-${c.r.toFixed(1)}, lijnen ${links.toFixed(1)}-${rechts.toFixed(1)}`);
        if (i % perRij && Math.abs(c.l - r.chips[i - 1].r) > 1) fout.aaneen.push(`${w} chip ${i + 1}: ${(c.l - r.chips[i - 1].r).toFixed(1)}px naast zijn buur`);
        if (i >= perRij && Math.abs(c.t - r.chips[i - perRij].b) > 1) fout.aaneen.push(`${w} chip ${i + 1}: ${(c.t - r.chips[i - perRij].b).toFixed(1)}px onder de rij erboven`);
      });
      if (Math.abs(r.chips[0].t - r.term) > 1) fout.terminal.push(`${w}: toetsenrij op ${r.chips[0].t.toFixed(1)}, terminal eindigt op ${r.term.toFixed(1)}`);
    }
    expect(gemeten, 'niet elke breedte gemeten').toBe(201);
    expect(vormen[6], 'nooit zes per rij gemeten').toBeGreaterThan(50);
    expect(vormen[3], 'nooit drie per rij gemeten').toBeGreaterThan(50);
    expect(vormen[2], 'nooit twee per rij gemeten').toBeGreaterThan(40);
    expect(fout.populatie, 'chipinhoud').toEqual([]);
    expect(fout.vorm, 'chips per rij').toEqual([]);
    expect(fout.raster, 'chipranden niet op de rasterlijnen').toEqual([]);
    expect(fout.aaneen, 'chips niet aaneengesloten').toEqual([]);
    expect(fout.terminal, 'toetsenrij los van de terminal').toEqual([]);
  });

  // Open punt (a) uit sessie 248: twee tabellen, twee regels. Nu één: een cel op een
  // rasterlijn draagt vanaf 768 zelf de celmaat (index en getal even ver van hun lijn),
  // onder 768 staan ze allebei op de lijn.
  for (const breedte of [375, 768, 1024, 1440]) {
    test(`@${breedte}px houden de cijfertabel en de sample-inhoud één regel voor de cel op de lijn`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const inkt = (e) => { const g = document.createRange(); g.selectNodeContents(e); return g.getBoundingClientRect().left; };
        const getal = [...document.querySelectorAll('.af-lijst-rij')].map((r) => inkt(r.querySelector('.result-number')) - r.getBoundingClientRect().left);
        const index = [...document.querySelectorAll('.af-sample-inhoud li')].map((r) => inkt(r.querySelector('.af-inhoud-nr')) - r.getBoundingClientRect().left);
        return { getal, index, cel: parseFloat(getComputedStyle(document.querySelector('.af-lijst .result-number')).paddingLeft) };
      });
      expect(m.getal.length, 'geen cijferrijen').toBeGreaterThanOrEqual(3);
      expect(m.index.length, 'geen inhoudsregels').toBeGreaterThanOrEqual(3);
      // Tak: vanaf 768 is er echt binnenruimte, eronder echt niet; anders bewijst gelijkheid niets.
      if (breedte >= 768) expect(Math.min(...m.getal), 'getal staat op de lijn').toBeGreaterThanOrEqual(8);
      else expect(Math.max(...m.getal), 'getal staat niet op de lijn').toBeLessThanOrEqual(1);
      const verschil = [...m.getal, ...m.index].map((x) => x - m.getal[0]).filter((d) => Math.abs(d) > 1);
      expect(verschil, `getal ${m.getal.map((x) => x.toFixed(1))}, index ${m.index.map((x) => x.toFixed(1))}`).toEqual([]);
    });
  }

  // Open punt (b): label en bron op de basislijn van het getal, vanaf 768. Gemeten met een
  // nul-hoge inline-block aan het eind van elke cel: zijn top ís de basislijn van de laatste regel.
  for (const breedte of [768, 1024, 1280, 1440, 1920]) {
    test(`@${breedte}px staan label en bron op de basislijn van het getal`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 900 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);
      const rijen = await page.evaluate(() => [...document.querySelectorAll('.af-lijst-rij')].map((rij) => {
        const lijn = (q) => {
          const p = document.createElement('span');
          p.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
          rij.querySelector(q).appendChild(p);
          const y = p.getBoundingClientRect().top; p.remove(); return y;
        };
        return { getal: lijn('.result-number'), label: lijn('.result-label'), bron: lijn('.af-lijst-waar') };
      }));
      expect(rijen.length, 'geen cijferrijen').toBeGreaterThanOrEqual(3);
      const fout = rijen.flatMap((r, i) => ['label', 'bron'].filter((k) => Math.abs(r[k] - r.getal) > 1)
        .map((k) => `rij ${i + 1}: ${k} ${(r[k] - r.getal).toFixed(1)}px van de basislijn`));
      expect(fout).toEqual([]);
    });
  }

  // Aangrenzend (critique s249): in het leerpad kwam "Lees eerst" in de Tab-volgorde vóór de
  // knop maar stond hij in beeld eronder (`order: 2`). Bron- en beeldvolgorde zijn gelijk.
  for (const vp of [{ width: 1440, height: 900 }, MOBIEL]) {
    test(`@${vp.width}px volgt het leerpad in beeld de volgorde van de bron`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/index.html');
      const voeten = await page.evaluate(() => [...document.querySelectorAll('.af-specimen-voet')]
        .map((v) => [...v.querySelectorAll('a, button')].map((a) => a.getBoundingClientRect().top)));
      expect(voeten.length, 'geen leerpadkolommen').toBe(3);
      const fout = voeten.flatMap((tops, i) => tops.slice(1).filter((t, j) => t < tops[j] - 1).map(() => `kolom ${i + 1}: ${tops.map((t) => t.toFixed(0)).join(' > ')}`));
      expect(voeten.every((t) => t.length >= 2), 'minder dan twee links per kolom').toBe(true);
      expect(fout).toEqual([]);
    });
  }
});
