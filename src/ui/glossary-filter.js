/**
 * Woordenlijst: bedraad de gedeelde term-filter met de glossary-selectors.
 *
 * Alle logica woont in term-filter.js; deze module levert alleen de config.
 *
 * @module glossary-filter
 */

import { initTermFilter } from './term-filter.js';

initTermFilter({
  sectionSel: '.glossary-category',
  itemSel: '.glossary-term',
  navSel: '.glossary-category-nav',
  inputSel: '#glossary-search',
  countSel: '#glossary-search-count',
  noResultsSel: '.glossary-no-results',
  noResultsQuerySel: '.glossary-no-results-query',
  clearSel: '.glossary-clear',
  itemNoun: 'termen',
});
