// Reflow van al-gerenderde ASCII-boxen bij venster-resize (Sessie 205).
//
// Boxen worden door commands als platte strings op de breedte-van-dat-moment
// gerenderd; #terminal-output heeft pre-wrap, dus na een venster-versmalling
// wrappen de borderregels lelijk (lone │-regels). Deze module herbouwt de
// bestaande box-blokken in de DOM op de nieuwe getResponsiveBoxWidth().
//
// Ontwerpkeuzes:
// - Shrink-only: alleen blokken waarvan de topregel breder is dan de huidige
//   responsive breedte worden herbouwd (idempotent; badge-notificaties met hun
//   Math.min(width, 50)-clamp krijgen zo vanzelf de juiste behandeling). Bij
//   groter worden blijven boxen smal maar intact; verse output rendert vol.
// - Geen isMobileView()-guard: een half-gesnapt desktopvenster (683/720px) valt
//   ónder de 768-drempel — precies het scenario dat reflow moet redden. Op echt
//   mobiel bestaan geen box-blokken (borderless sinds Sessie 82) → no-op.
// - Geen typewriter-guard: de welcome/typewriter-output bevat geen box-glyphs
//   en box-renders zijn atomair binnen één task — de debounced handler kan
//   nooit een half gerenderd blok zien.
// - **bold** is niet round-trip-baar via textContent (asterisken zijn al naar
//   <strong> omgezet) — komt in desktop-boxcontent niet voor; geaccepteerd.

import { getResponsiveBoxWidth, wordWrap } from '../utils/box-utils.js';
import renderer from './renderer.js';

const CHARSETS = {
  '╭': { H: '─', V: '│', TL: '╭', TR: '╮', BL: '╰', BR: '╯', DL: '├', DR: '┤', bottom: '╰' },
  '┏': { H: '━', V: '┃', TL: '┏', TR: '┓', BL: '┗', BR: '┛', DL: '┣', DR: '┫', bottom: '┗' }
};
const BODY_CHARS = { '│': true, '┃': true, '├': true, '┣': true };
const BOTTOM_CHARS = { '╰': true, '┗': true };

const DEBOUNCE_MS = 250; // puur debounce; de charWidth-cache in box-utils is
                         // key-self-validating, dus geen ordering-eis met de
                         // 150ms-invalidatie daar.

/**
 * Vind opeenvolgende box-blokken (top-border t/m bottom-border) tussen de
 * directe kinderen van een container. State machine: een blok wordt verworpen
 * bij een niet-passende tussenregel; verweesde rijen (top weggetrimd door
 * _trimOutput's 500-regel-cap) vallen er vanzelf doorheen.
 */
function parseBlocks(container) {
  const blocks = [];
  let cur = null;
  // Snapshot: rebuild() insert clones, live children-iteratie is een bug.
  const children = Array.from(container.children);
  for (const el of children) {
    if (!el.classList || !el.classList.contains('terminal-line')) {
      cur = null; // wrappers/section-headers sluiten een open blok af
      continue;
    }
    const ch = (el.textContent || '')[0];
    if (CHARSETS[ch]) {
      cur = { charset: CHARSETS[ch], top: el, rows: [], bottom: null };
    } else if (cur && ch === cur.charset.bottom) {
      cur.bottom = el;
      blocks.push(cur); // top-direct-bottom = boxHeader (0 rows) — ook geldig
      cur = null;
    } else if (cur && BODY_CHARS[ch]) {
      cur.rows.push(el);
    } else {
      cur = null; // malformed → verwerpen, regels ongemoeid laten
    }
  }
  return blocks; // een open blok zonder bottom is bewust weggegooid
}

function setLine(el, text) {
  // Fallback op de private variant: bij een deploy kan de browser nog een
  // gecachete renderer.js zonder de publieke alias serveren (submodules worden
  // relatief geïmporteerd, dus de ?v=-bump op main.js bust ze niet).
  const format = renderer.formatText || renderer._formatText;
  el.innerHTML = format.call(renderer, text);
}

/** Herbouw één blok op de gegeven totale breedte (borders inbegrepen). */
function rebuildBlock(block, width) {
  const c = block.charset;
  const inner = width - 2;

  // Top: label = alles tussen de hoeken met de horizontale glyphs van beide
  // kanten gestript. De spaties blijven bij het label horen (' VOLGENDE STAP ',
  // '  SECURITY WARNING  ') — zelfde conventie als de producers.
  const raw = (block.top.textContent || '').slice(1, -1);
  let label = raw.replace(new RegExp('^' + c.H + '+'), '').replace(new RegExp(c.H + '+$'), '');
  if (label.length > inner) label = label.slice(0, inner);
  if (label.length > 0) {
    const left = Math.max(0, Math.floor((inner - label.length) / 2));
    const right = Math.max(0, inner - label.length - left);
    setLine(block.top, c.TL + c.H.repeat(left) + label + c.H.repeat(right) + c.TR);
  } else {
    setLine(block.top, c.TL + c.H.repeat(inner) + c.TR);
  }

  for (const row of block.rows) {
    const t = row.textContent || '';
    const first = t[0];
    if (first === c.DL) {
      setLine(row, c.DL + c.H.repeat(inner) + c.DR);
      continue;
    }
    const content = t.slice(1, -1).trimEnd();
    if (content.length <= inner) {
      setLine(row, c.V + content.padEnd(inner, ' ') + c.V);
    } else {
      // wordWrap eet leidende spaties (split(' ')) — indent apart bewaren en
      // elke part her-prefixen, zoals de producers zelf ook doen.
      const indent = content.match(/^ */)[0];
      const parts = wordWrap(content.trimStart(), Math.max(10, inner - indent.length));
      setLine(row, c.V + (indent + parts[0]).padEnd(inner, ' ') + c.V);
      let prev = row;
      for (let i = 1; i < parts.length; i++) {
        // cloneNode(false) kopieert de className (kleur-erfenis) met lege
        // dataset — boxregels horen geen data-indent te hebben.
        const extra = row.cloneNode(false);
        setLine(extra, c.V + (indent + parts[i]).padEnd(inner, ' ') + c.V);
        prev.after(extra);
        prev = extra;
      }
    }
  }

  setLine(block.bottom, c.BL + c.H.repeat(inner) + c.BR);
}

const PIN_MARGE_PX = 40;

function isPinned(outputEl) {
  return outputEl.scrollTop + outputEl.clientHeight >= outputEl.scrollHeight - PIN_MARGE_PX;
}

function reflow(outputEl, wasPinned) {
  const width = getResponsiveBoxWidth();
  // Completion-wrappers zijn eigen containers; de wrapper-elementen zelf nooit
  // vervangen — _revealCelebration houdt er referenties + animatie-state op.
  const containers = [
    outputEl,
    ...outputEl.querySelectorAll(
      '.terminal-completion-mission, .terminal-completion-certificate, .terminal-completion-followup'
    )
  ];
  let touched = false;
  for (const container of containers) {
    for (const block of parseBlocks(container)) {
      // Shrink-only: past de box al, dan afblijven (ook na eerdere reflow).
      if ((block.top.textContent || '').length > width) {
        rebuildBlock(block, width);
        touched = true;
      }
    }
  }
  if (touched && wasPinned) {
    // 'instant' overschrijft de CSS scroll-behavior:smooth op #terminal-output
    // (animations.css): een positie-herstel hoort niet zichtbaar te animeren,
    // en een lopende animatie laat de scroll-listener tussenposities zien.
    outputEl.scrollTo({ top: outputEl.scrollHeight, behavior: 'instant' });
  }
}

export function initBoxReflow(outputEl) {
  if (!outputEl || typeof window === 'undefined') return;

  // De pin-status moet doorlopend bijgehouden worden: tegen de tijd dat onze
  // debounced handler draait heeft de browser de output al op de nieuwe breedte
  // geherwrapt (scrollHeight gegroeid), waardoor "stond de gebruiker onderaan?"
  // dan niet meer te meten valt. Scroll-events tijdens een resize-cyclus zijn
  // browser-eigen correcties, geen gebruikersintentie → negeren.
  let wasPinned = true; // verse terminal staat onderaan
  let resizing = false;
  outputEl.addEventListener('scroll', () => {
    if (!resizing) wasPinned = isPinned(outputEl);
  }, { passive: true });

  let timer;
  window.addEventListener('resize', () => {
    resizing = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        reflow(outputEl, wasPinned);
      } catch (e) {
        // Reflow is cosmetisch — een onverwachte DOM-vorm mag de app nooit
        // breken. Bestaande (mogelijk gewrapte) output blijft dan staan.
        console.warn('box-reflow overgeslagen:', e);
      } finally {
        resizing = false;
      }
    }, DEBOUNCE_MS);
  });
}
