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
      bloglinks,
      woordenInMain: document.querySelector('main').innerText.split(/\s+/).filter(Boolean).length
    };
  }, buitenScopeArg());
}

function buitenScopeArg() {
  return BUITEN_SCOPE_TIKDOEL;
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
  for (const breedte of [375, 768, 1000]) {
    test(`@${breedte}px is er op elke scrollpositie een CTA in beeld`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 812 });
      await page.goto('/index.html');
      await page.evaluate(() => document.fonts.ready);

      const kaal = await page.evaluate(() => {
        const hoogte = document.documentElement.scrollHeight;
        const stap = Math.round(window.innerHeight * 0.9);
        const zonderCta = [];
        for (let y = 0; y < hoogte; y += stap) {
          window.scrollTo(0, y);
          const inBeeld = [...document.querySelectorAll('a[href*="terminal.html"]')].some((a) => {
            const r = a.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
          });
          if (!inBeeld) zonderCta.push(y);
        }
        return zonderCta;
      });

      // Was: 4179px (5,1 schermen) tussen de hero-CTA en de eerste leerpad-knop.
      expect(kaal, `scrollposities zonder zichtbare CTA: ${kaal.join(', ')}`).toEqual([]);
    });
  }

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
    const onzichtbaar = await page.evaluate(
      () => [...document.querySelectorAll('.animate-on-scroll')]
        .filter((e) => getComputedStyle(e).opacity === '0').length
    );
    expect(onzichtbaar, `${onzichtbaar} blokken onzichtbaar zonder JS`).toBe(0);
  });
});
