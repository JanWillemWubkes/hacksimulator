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

/** Categorie uit de hash, of null voor "alles". */
function actieveCategorie() {
  const hash = window.location.hash.slice(1);
  return !hash || hash === 'all' ? null : hash;
}

function herbeoordeel(knoppen, kaarten, teller) {
  const categorie = actieveCategorie();
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
  const draai = () => herbeoordeel(knoppen, kaarten, teller);

  window.addEventListener('hashchange', draai);
  draai(); // synchroon bij init: anders staat de eerste paint zonder aria-current
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
