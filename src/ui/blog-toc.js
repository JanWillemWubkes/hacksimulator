/**
 * Blogpost: inhoudsopgave met actieve-sectiemarkering.
 *
 * Aanleiding (Sessie 226): geen enkele post had in-page navigatie. Artikelen lopen tot ~17.800px
 * op 375px — zo'n 22 schermen scrollen zonder enige manier om een sectie over te slaan of ernaar
 * terug te keren.
 *
 * Werkverdeling met scripts/add-heading-ids.mjs:
 *   - de `id`s staan STATISCH in de HTML, zodat validate-blogs.sh ze kan bewaken en een deeplink
 *     werkt zonder JavaScript;
 *   - de TOC zelf wordt hier RUNTIME gebouwd, omdat een statische lijst in 15 bestanden in
 *     lockstep met de koppen zou moeten blijven — precies de drift die dit project bestrijdt.
 *
 * @module blog-toc
 */

/** Koppen in callouts en CTA-boxen zijn geen artikelsecties. */
const GEEN_SECTIE = '.blog-cta, .blog-tip, .blog-warning, .blog-info, .blog-support-banner';
const MIN_ITEMS = 3;

function sectieKoppen() {
  const inhoud = document.querySelector('.blog-post-content');
  if (!inhoud) return [];
  return [...inhoud.querySelectorAll('h2[id]')].filter((h) => !h.closest(GEEN_SECTIE));
}

function bouwToc(koppen) {
  const details = document.createElement('details');
  details.className = 'blog-toc';
  // Open op desktop, dicht op mobiel: daar kost een lijst van 6-14 items anders een half scherm
  // vóór het artikel begint. Bewust niet opnieuw omgezet bij resize — dat zou een keuze van de
  // lezer overschrijven.
  details.open = window.matchMedia('(min-width: 769px)').matches;

  const summary = document.createElement('summary');
  summary.textContent = 'Inhoudsopgave';
  details.append(summary);

  const ol = document.createElement('ol');
  for (const kop of koppen) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${kop.id}`;
    a.textContent = kop.textContent.trim();
    li.append(a);
    ol.append(li);
  }
  details.append(ol);

  const nav = document.createElement('nav');
  // De klasse is niet decoratief maar nodig voor de cascade: de TOC staat binnen
  // .blog-post-content, en `[data-theme="light"] .blog-post-content ol a` (0,2,2) verslaat
  // anders de eigen linkkleur. `.blog-toc-nav .blog-toc ol li a` komt op (0,2,3) en wint
  // zonder !important.
  nav.className = 'blog-toc-nav';
  nav.setAttribute('aria-label', 'Inhoudsopgave');
  nav.append(details);
  return nav;
}

/**
 * Actieve sectie = de laatste kop die boven de leesgrens staat.
 * Eén geometrisch predicaat, ook synchroon aangeroepen bij init en resize — de observer is
 * alleen het "er is iets veranderd"-signaal (zie architecture-patterns.md §12).
 */
function maakHerbeoordelaar(koppen, links) {
  return () => {
    // De grens moet mee-ademen met scroll-padding-top: een #anker-sprong parkeert de kop
    // daar, dus een grens die alleen de navbar telt markeert stelselmatig de vórige sectie.
    // Gemeten: kop landt op 76px terwijl de grens op 68px stond -> altijd één te vroeg.
    const padding = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop
    );
    const navHoogte = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
    );
    const basis = Number.isFinite(padding) ? padding : (Number.isFinite(navHoogte) ? navHoogte + 16 : 76);
    const grens = basis + 8; // tolerantie voor afronding bij smooth scroll
    let actief = null;
    for (const kop of koppen) {
      if (kop.getBoundingClientRect().top <= grens) actief = kop;
      else break;
    }
    // Boven de eerste kop is er geen actieve sectie; dan markeren we niets.
    for (const [id, a] of links) {
      if (actief && id === actief.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };
}

function init() {
  const koppen = sectieKoppen();
  if (koppen.length < MIN_ITEMS) return; // te kort artikel: een TOC voegt niets toe

  const nav = bouwToc(koppen);
  // Vóór de eerste sectiekop: daarmee staat de TOC automatisch ná de intro-alinea's,
  // zonder aan te nemen hoeveel dat er zijn.
  koppen[0].before(nav);

  // De TOC duwt de inhoud omlaag. Was de pagina met een #fragment geopend, dan had de browser
  // al gescrold en klopt die positie nu niet meer — opnieuw toepassen.
  if (window.location.hash) {
    const doel = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (doel) doel.scrollIntoView();
  }

  const links = new Map([...nav.querySelectorAll('a')].map((a) => [a.getAttribute('href').slice(1), a]));
  const herbeoordeel = maakHerbeoordelaar(koppen, links);

  // Bewust een scroll-listener en géén IntersectionObserver. Met `html { scroll-behavior: smooth }`
  // (animations.css) vuurt een observer alleen tijdens de animatie, op posities die de gebruiker
  // nooit te zien krijgt; ná afloop kruist er niets meer, dus blijft de markering staan op een
  // tussenstand. Gemeten gaf dat stelselmatig de vórige sectie. rAF-throttling houdt het goedkoop.
  let gepland = false;
  const opScroll = () => {
    if (gepland) return;
    gepland = true;
    requestAnimationFrame(() => { gepland = false; herbeoordeel(); });
  };
  window.addEventListener('scroll', opScroll, { passive: true });
  window.addEventListener('resize', opScroll, { passive: true });
  herbeoordeel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
