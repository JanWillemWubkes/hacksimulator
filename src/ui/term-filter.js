/**
 * Herbruikbare live-zoekfilter + categorie scroll-spy voor referentie-pagina's.
 *
 * Twee gedragingen, gevoed door één config-object zodat meerdere pagina's
 * (woordenlijst, commands) dezelfde logica delen met eigen selectors:
 *  1. Een zoekveld dat kaarten live filtert op tekstinhoud, lege categorieen
 *     meeverbergt en een teller/lege-staat toont.
 *  2. Categorie-chips die met een IntersectionObserver de actieve sectie
 *     oplichten tijdens scrollen (scroll-spy).
 *
 * Geen inline JS (CSP-compliance). Importeer dit vanuit een dunne per-pagina
 * module die `initTermFilter(config)` aanroept met de juiste selectors.
 *
 * @module term-filter
 */

const DEFAULTS = {
  // Detectieband net onder de sticky chrome (navbar 60px + balk ~96px):
  // een sectie telt als "actief" zodra zijn top onder de balk schuift.
  scrollSpyRootMargin: '-160px 0px -55% 0px',
  // Zelfstandig naamwoord in de resultaat-teller ("X van Y <noun>").
  itemNoun: 'termen',
};

/** Normaliseer voor accent-ongevoelig, hoofdletter-ongevoelig zoeken. */
export function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/* ==================== Live zoekfilter ==================== */
function initFilter(cfg) {
  const input = document.querySelector(cfg.inputSel);
  const count = document.querySelector(cfg.countSel);
  const noResults = document.querySelector(cfg.noResultsSel);
  const noResultsQuery = noResults && noResults.querySelector(cfg.noResultsQuerySel);
  const clearBtn = noResults && noResults.querySelector(cfg.clearSel);

  if (!input) return;

  // Cache nodes + genormaliseerde tekst 1x: de filter-loop blijft daardoor
  // allocatievrij per toetsaanslag.
  const sections = [...document.querySelectorAll(cfg.sectionSel)].map((section) => ({
    el: section,
    terms: [...section.querySelectorAll(cfg.itemSel)].map((el) => ({
      el,
      text: normalize(el.textContent),
    })),
  }));
  const total = sections.reduce((n, s) => n + s.terms.length, 0);

  const apply = () => {
    const query = normalize(input.value.trim());
    let matches = 0;

    sections.forEach((section) => {
      let sectionHasMatch = false;
      section.terms.forEach((term) => {
        const hit = query === '' || term.text.includes(query);
        term.el.hidden = !hit;
        if (hit) {
          sectionHasMatch = true;
          matches += 1;
        }
      });
      // Verberg een hele categorie (incl. kop) als geen enkele term matcht.
      section.el.hidden = !sectionHasMatch;
    });

    // Teller: leeg bij lege query (CSS verbergt :empty), anders "X van Y <noun>".
    if (count) {
      count.textContent = query === '' ? '' : `${matches} van ${total} ${cfg.itemNoun}`;
    }

    // Lege-staat.
    if (noResults) {
      const empty = query !== '' && matches === 0;
      noResults.hidden = !empty;
      if (empty && noResultsQuery) noResultsQuery.textContent = input.value.trim();
    }
  };

  input.addEventListener('input', apply);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      apply();
      input.focus();
    });
  }

  // Chip-klik tijdens een actieve zoekopdracht: wis eerst de query, anders springt
  // de browser naar een sectie die het filter zojuist verborg. De anchor-default
  // (de sprong) blijft intact.
  const nav = document.querySelector(cfg.navSel);
  if (nav) {
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a[href^="#"]') && input.value !== '') {
        input.value = '';
        apply();
      }
    });
  }
}

/* ==================== Scroll-spy chips ==================== */
function initScrollSpy(cfg) {
  const nav = document.querySelector(cfg.navSel);
  if (!nav) return;

  const links = new Map();
  nav.querySelectorAll('a[href^="#"]').forEach((a) => {
    links.set(a.getAttribute('href').slice(1), a);
  });

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (activeId) => {
    links.forEach((a, id) => a.classList.toggle('active', id === activeId));
  };

  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // Kies de bovenste zichtbare sectie; niets zichtbaar → behoud highlight.
      let topId = null;
      let topPos = Infinity;
      visible.forEach((id) => {
        const top = document.getElementById(id).getBoundingClientRect().top;
        if (top < topPos) {
          topPos = top;
          topId = id;
        }
      });

      if (topId) setActive(topId);
    },
    { rootMargin: cfg.scrollSpyRootMargin, threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Initialiseer filter + scroll-spy voor één pagina.
 * @param {object} config - selectors + opties; ontbrekende velden vallen terug op DEFAULTS.
 */
export function initTermFilter(config) {
  const cfg = { ...DEFAULTS, ...config };
  initFilter(cfg);
  initScrollSpy(cfg);
}
