/**
 * Edu Section Visibility Tracking - HackSimulator.nl (Sessie 218)
 *
 * Vuurt één GA4-event zodra de bezoeker de educatiestrook onder de terminal bereikt.
 * Doel: de doorscroll-rate van /terminal.html meetbaar maken (`edu_section_reached`
 * gedeeld door `page_view`). Die strook bestaat sinds maart 2026 zonder één meting.
 *
 * Bewust een eigen bestand, geen uitbreiding van src/ui/faq.js:
 *   - faq.js is een klassieke IIFE (`<script defer>`), geen module, en kan dus niet
 *     `import events from '../analytics/events.js'` doen;
 *   - faq.js wordt óók door index.html en contact.html geladen. Hem tot module maken
 *     verandert de uitvoeringssemantiek op twee pagina's die hier niets mee te maken
 *     hebben. Dit bestand hangt alleen aan terminal.html.
 *
 * Meet op `.terminal-education` zelf, niet op `.scroll-hint`: die hint staat onder
 * 768px op `display: none` (botsing met #mobile-quick-commands, Sessie 176). Eraan
 * koppelen zou de meting op mobiel laten afhangen van een element dat daar niet telt.
 */

import events from '../analytics/events.js';

const strook = document.querySelector('.terminal-education');

if (strook) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();

    // Omhullen: relatief geïmporteerde submodules dragen geen `?v=`, dus een
    // terugkerende bezoeker kan tot max-age=3600 een oude events.js uit cache
    // krijgen waarin deze functie nog niet bestaat (Sessie 214). Zonder guard is
    // dat een TypeError op elke scroll naar beneden.
    if (typeof events.eduSectionReached === 'function') {
      events.eduSectionReached();
    }
  }, { threshold: 0.1 });

  observer.observe(strook);
}
