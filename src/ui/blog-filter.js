/**
 * Blogindex: toegankelijkheidslaag over het CSS-only categoriefilter.
 *
 * Het filteren zelf gebeurt in CSS via `:target` (zie blog.css) en blijft dus werken zonder
 * JavaScript — deze module voegt alleen toe wat CSS niet kan uitdrukken:
 *
 *   1. `aria-current="page"` op de actieve knop. De actieve staat was puur visueel, dus een
 *      schermlezer kon niet vaststellen welk filter aanstond.
 *   2. Een resultaatteller ("5 van 15 artikelen") in een `role="status"`-regio, zodat het
 *      wisselen van filter ook hoorbaar iets doet. Zelfde formulering als term-filter.js.
 *
 * Progressive enhancement: valt dit script weg, dan verandert er functioneel niets.
 *
 * @module blog-filter
 */

const ITEM_NOUN = 'artikelen';

/**
 * Categorie uit de hash, of null voor "alles".
 *
 * `geldig` is niet optioneel gedrag maar een correctheidseis: elke hash als categorie
 * behandelen liet de teller "0 van 15 artikelen" melden op `#main-content` — het doel van de
 * skip-link, en dus de eerste bediening die een toetsenbordgebruiker tegenkomt. CSS toonde
 * daar alle 15 kaarten (er is geen matchende :target-regel), dus de role="status"-regio
 * sprak een schermlezer tegen wat er stond. Zelfde gat op `#newsletter`.
 */
function actieveCategorie(geldig) {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === 'all' || !geldig.has(hash)) return null;
  return hash;
}

function herbeoordeel(knoppen, kaarten, teller, geldig) {
  const categorie = actieveCategorie(geldig);
  const doelHref = `#${categorie ?? 'all'}`;

  for (const knop of knoppen) {
    // aria-current hoort alleen op de actieve knop te staan, niet als lege string elders.
    if (knop.getAttribute('href') === doelHref) knop.setAttribute('aria-current', 'page');
    else knop.removeAttribute('aria-current');
  }

  if (!teller) return;
  const totaal = kaarten.length;
  const zichtbaar = categorie
    ? kaarten.filter((k) => k.dataset.category === categorie).length
    : totaal;
  // Leeg bij "alles": de teller verbergt zichzelf dan via :empty, geen layout-shift.
  teller.textContent = categorie ? `${zichtbaar} van ${totaal} ${ITEM_NOUN}` : '';
}

function init() {
  const knoppen = [...document.querySelectorAll('.category-btn')];
  const kaarten = [...document.querySelectorAll('.blog-post-card')];
  if (!knoppen.length || !kaarten.length) return;

  const teller = document.querySelector('.blog-filter-count');
  // Uit de pagina zelf, niet uit een lijst hier: dezelfde .category-target-divs die het
  // CSS-filter aanstuurt. Een nieuwe categorie is daarmee vanzelf geldig.
  const geldig = new Set([...document.querySelectorAll('.category-target')].map((d) => d.id));
  const draai = () => herbeoordeel(knoppen, kaarten, teller, geldig);

  window.addEventListener('hashchange', draai);
  draai(); // synchroon bij init: anders staat de eerste paint zonder aria-current
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
