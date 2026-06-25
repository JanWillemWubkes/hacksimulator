/**
 * Commands page scroll-spy
 *
 * Markeert de actieve categorie in de sticky filter-balk op basis van welke
 * categorie-sectie momenteel in beeld is. Hierdoor voelt de balk aan als een
 * echt filter: de huidige categorie licht op terwijl je scrollt.
 *
 * Geen inline JS (CSP-compliance, Sessie 174/176). Geladen als ES-module,
 * dus automatisch deferred — de DOM is bij uitvoering al geparset.
 *
 * @module commands-scrollspy
 */

const nav = document.querySelector('.commands-category-nav');

if (nav) {
  // Map: categorie-id -> bijbehorende nav-link
  const links = new Map();
  nav.querySelectorAll('a[href^="#"]').forEach((a) => {
    links.set(a.getAttribute('href').slice(1), a);
  });

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  // Alleen activeren als er iets te observeren valt.
  if (sections.length) {
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

        // Kies de bovenste zichtbare sectie (kleinste top-positie). Is er
        // niets zichtbaar (tussen secties in), behoud dan de huidige
        // highlight i.p.v. te flikkeren.
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
      {
        // Detectieband net onder de sticky chrome (navbar 60px + balk ~52px):
        // een sectie telt als "actief" zodra zijn top onder de balk schuift
        // tot ~45% viewport-hoogte.
        rootMargin: '-120px 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
