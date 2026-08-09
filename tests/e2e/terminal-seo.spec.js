// E2E Tests voor de educatiestrook onder de terminal (Sessie 218)
//
// Achtergrond: die strook is in maart 2026 gebouwd om AdSense van crawlbare tekst te
// voorzien — commit 1cc04ff heet letterlijk "full-viewport terminal + scroll hint for
// AdSense content" en het bericht zegt "Education content stays below the fold, fully
// crawlable by AdSense". Advertenties zijn in Sessie 208 verwijderd; de strook bleef
// staan en is sindsdien nooit heroverwogen.
//
// Nulmeting vóór de wijziging (productie, 1280x800):
//   strook 2424px van 3737px = 65% van de pagina · 396 woorden · 3 links (allemaal in
//   het laatste blok) · 0 <h1> op de hele pagina · zes command-kaarten die nmap,
//   hashcat en sqlmap bij naam noemen en géén link zijn.
//
// Er bestond geen enkele test die iets ónder de terminal asserteerde (grep op
// terminal-education, edu-command-card, scroll-hint, faq-terminal in tests/ = 0 hits).
// Dat is precies waarom de vier problemen hieronder stil konden ontstaan:
//
//   A) De FAQPage-JSON-LD (terminal.html:73-113) is een woordelijke kopie van de
//      zichtbare FAQ. Eén kant wijzigen levert structured data op over tekst die
//      Google niet ziet. De homepage bewaakt dit al (homepage-conversion.spec.js:304),
//      terminal.html niet.
//   B) Alle drie de bloglink-labels waren verouderd: "Wat is Ethisch Hacken? - Alles
//      wat je moet weten" tegen een <h1> die "Wat is ethisch hacken?" luidt, enzovoort.
//      De homepage heeft hier een test voor, deze pagina niet — dus dreven ze weg.
//   C) Zonder JS voegt de IntersectionObserver in src/ui/faq.js nooit `.visible` toe,
//      dus stond de hele strook op opacity 0 — inclusief elke link erin. index.html
//      heeft dat vangnet als <noscript><style> op regel 62-66; terminal.html niet.
//   D) De strook had geen enkele meting. `edu_section_reached` (Sessie 218) is het
//      eerste scroll-signaal op de site; zonder deze test kan hij stil sneuvelen.

import { test, expect } from './fixtures.js';

const PAGINA = '/terminal.html';

/** Scroll instant naar beneden en wacht per stap.
 *  `html { scroll-behavior: smooth }` staat inline in terminal.html, dus een synchrone
 *  lus met window.scrollTo() animeert en blijft op ~2px steken (Sessie 216). */
async function scrollDoorDeStrook(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await sleep(100);
    }
    await sleep(400);
  });
}

async function leesStrook(page) {
  return page.evaluate(() => {
    const txt = (e) => (e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ');
    const lds = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => {
        try {
          return JSON.parse(s.textContent);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const faq = lds.find((d) => d['@type'] === 'FAQPage');
    const webpage = lds.find((d) => d['@type'] === 'WebPage');
    const strook = document.querySelector('.terminal-education');

    return {
      h1s: [...document.querySelectorAll('h1')].map(txt),
      webpageName: webpage ? webpage.name : null,
      schemaVragen: faq ? faq.mainEntity.map((q) => q.name) : [],
      schemaAntwoorden: faq ? faq.mainEntity.map((q) => q.acceptedAnswer.text) : [],
      zichtbareVragen: [...document.querySelectorAll('.terminal-edu-faq .faq-question-text')].map(txt),
      zichtbareAntwoorden: [...document.querySelectorAll('.terminal-edu-faq .faq-answer')].map(txt),
      links: strook
        ? [...strook.querySelectorAll('a')].map((a) => ({
            href: a.getAttribute('href'),
            label: txt(a),
            opacity: getComputedStyle(a).opacity
          }))
        : []
    };
  });
}

test.describe('Educatiestrook onder de terminal', () => {
  test('precies één <h1>, woordelijk gelijk aan de JSON-LD WebPage.name', async ({ page }) => {
    // De pagina had er nul: de hoogste zichtbare kop was een <h2>, en de WebPage-naam
    // in het schema had geen enkele zichtbare tegenhanger om aan vast te zitten.
    await page.goto(PAGINA);
    const m = await leesStrook(page);
    expect(m.h1s).toHaveLength(1);
    expect(m.h1s[0]).toBe(m.webpageName);
  });

  test('FAQPage-schema blijft woordelijk gelijk aan de zichtbare FAQ', async ({ page }) => {
    // Bug A. Google eist dat structured data beschrijft wat de bezoeker kan zien.
    await page.goto(PAGINA);
    const m = await leesStrook(page);
    expect(m.schemaVragen.length).toBeGreaterThan(0);
    expect(m.zichtbareVragen).toEqual(m.schemaVragen);
    expect(m.zichtbareAntwoorden).toEqual(m.schemaAntwoorden);
  });

  test('elke link in de strook wijst naar een bestaande pagina', async ({ page, baseURL }) => {
    await page.goto(PAGINA);
    const m = await leesStrook(page);
    expect(m.links.length).toBeGreaterThanOrEqual(12);

    const kapot = [];
    for (const link of m.links) {
      const url = new URL(link.href, baseURL);
      const res = await page.request.get(url.origin + url.pathname);
      if (!res.ok()) kapot.push(`${link.href} -> HTTP ${res.status()}`);
    }
    expect(kapot, kapot.join('\n')).toEqual([]);
  });

  test('elke command-kaart linkt naar een anker dat op /commands/ bestaat', async ({ page, baseURL }) => {
    await page.goto(PAGINA);
    const ankers = await page.evaluate(() =>
      [...document.querySelectorAll('.edu-command-card')].map((a) => a.getAttribute('href'))
    );
    expect(ankers.length).toBeGreaterThan(0);

    const html = await (await page.request.get(new URL('/commands/', baseURL).toString())).text();
    const ontbrekend = ankers.filter((href) => {
      const id = (href.split('#')[1] || '').trim();
      return !id || !html.includes(`id="${id}"`);
    });
    expect(ontbrekend, `ankers zonder doel op /commands/: ${ontbrekend.join(' | ')}`).toEqual([]);
  });

  test('elk label onder "Verder lezen" draagt de <h1> van zijn doelpagina', async ({ page, baseURL }) => {
    // Bug B: alle drie de oorspronkelijke bloglabels waren verouderd én in Engelse
    // Title Case. Zonder deze assertie drijven ze opnieuw weg zodra een post hernoemt.
    await page.goto(PAGINA);
    const links = await page.evaluate(() =>
      [...document.querySelectorAll('.terminal-edu-blog-links a')].map((a) => ({
        href: a.getAttribute('href'),
        label: (a.textContent || '').trim().replace(/\s+/g, ' ')
      }))
    );
    expect(links.length).toBeGreaterThan(0);

    const afwijkingen = [];
    for (const link of links) {
      const res = await page.request.get(new URL(link.href, baseURL).toString());
      const html = await res.text();
      const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      if (!m) continue;
      const titel = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (titel !== link.label) afwijkingen.push(`${link.href}: "${link.label}" != "${titel}"`);
    }
    expect(afwijkingen, afwijkingen.join('\n')).toEqual([]);
  });

  test('geen tikdoel onder 44px in de strook (@375px)', async ({ page }) => {
    // De "Bekijk alle 40+ commands"-CTA mat als kale tekstlink 193x22px. Op de maat
    // waar het uitmaakt (telefoon) is dat onder de WCAG AAA-grens van 44x44.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGINA);
    await scrollDoorDeStrook(page);
    const klein = await page.evaluate(() =>
      [...document.querySelectorAll('.terminal-education a')]
        .map((a) => ({ href: a.getAttribute('href'), r: a.getBoundingClientRect() }))
        .filter((o) => o.r.height < 44 || o.r.width < 44)
        .map((o) => `${o.href} ${Math.round(o.r.width)}x${Math.round(o.r.height)}`)
    );
    expect(klein, klein.join(' | ')).toEqual([]);
  });

  test('edu_section_reached vuurt zodra de strook in beeld komt', async ({ page }) => {
    // Bug D. Dit event is de enige manier om te weten of iemand die strook ooit ziet.
    await page.goto(PAGINA);
    await page.evaluate(() => localStorage.setItem('hacksim_analytics_consent', 'true'));
    await page.goto(PAGINA);
    await page.evaluate(() => {
      window.__gtagCalls = [];
      window.gtag = (...args) => window.__gtagCalls.push(args);
    });

    const voorScroll = await page.evaluate(() =>
      window.__gtagCalls.filter((c) => c[1] === 'edu_section_reached').length
    );
    expect(voorScroll).toBe(0);

    await scrollDoorDeStrook(page);

    const naScroll = await page.evaluate(() =>
      window.__gtagCalls.filter((c) => c[1] === 'edu_section_reached').length
    );
    // Precies één: de observer disconnect na de eerste hit, dus heen-en-weer scrollen
    // mag geen tweede event opleveren.
    expect(naScroll).toBe(1);
  });
});

test.describe('Educatiestrook zonder JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('de hele strook en al zijn links blijven zichtbaar', async ({ page }) => {
    // Bug C: `.edu-command-card`, `.faq-item` en de links starten op opacity 0 en
    // worden alleen zichtbaar als de IntersectionObserver `.visible` toevoegt. Zonder
    // het <noscript><style>-vangnet is deze strook dan volledig onzichtbaar.
    await page.goto(PAGINA);
    const onzichtbaar = await page.evaluate(() =>
      [...document.querySelectorAll('.edu-command-card, .terminal-edu-faq .faq-item, .terminal-edu-blog-links a')]
        .filter((el) => getComputedStyle(el).opacity !== '1')
        .map((el) => el.tagName + '.' + (typeof el.className === 'string' ? el.className.split(' ')[0] : '?'))
    );
    expect(onzichtbaar, `op opacity 0 zonder JS: ${onzichtbaar.join(' | ')}`).toEqual([]);
  });
});
