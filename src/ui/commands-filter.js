/**
 * Commands-pagina: bedraad de gedeelde term-filter met de commands-selectors.
 *
 * Vervangt de oude commands-scrollspy.js — de scroll-spy zit nu in term-filter.js,
 * aangevuld met een echt live zoekfilter over de command-cards.
 *
 * @module commands-filter
 */

import { initTermFilter } from './term-filter.js';

initTermFilter({
  sectionSel: '.commands-category',
  itemSel: '.command-card',
  navSel: '.commands-category-nav',
  inputSel: '#commands-search',
  countSel: '#commands-search-count',
  noResultsSel: '.commands-no-results',
  noResultsQuerySel: '.commands-no-results-query',
  clearSel: '.commands-clear',
  itemNoun: 'commands',
});
