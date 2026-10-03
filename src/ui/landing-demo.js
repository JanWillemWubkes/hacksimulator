/**
 * landing-demo.js - de auto-demo van de hero-terminal (Landing Page)
 *
 * Sessie 238: geen typemachine meer. Sinds sessie 247 vraagt het contract één reeks per
 * command, regel voor regel: elke regel verschijnt met zijn glos (hero-registratie.js).
 * Wat er getoond wordt komt uit hero-antwoorden.js — dezelfde bron als wat een bezoeker
 * krijgt als hij zelf typt.
 *
 * - Toont het nmap-frame: het openingsbeeld uit het contract, en sinds sessie 247 ook de
 *   ruststand. Het rolt bij laden uit (het memorabele moment zonder klik). Onder
 *   prefers-reduced-motion staat de eindstand er meteen. Tot sessie 249 speelde het nog
 *   één keer als het netwerkdiagram later in beeld kwam; het diagram is uit de hero.
 * - Geen lus meer (finish review s247): na 3,2s toonde hij `ls`, en dan stonden 53/80/443
 *   gevuld zonder hun regels en glossen, 12 van elke 15,2s. De registratie (regel en glos
 *   op één rij) is het product; die hoort in rust heel te zijn.
 * - Stopt definitief zodra de bezoeker de terminal overneemt (handOff, via hero-repl.js).
 * - Pauzeert als het tabblad verborgen is.
 */

import { respons } from './hero-antwoorden.js';
import { maakRij, lichtOp } from './hero-registratie.js';

// Het enige command van de auto-demo: drie open poorten (53/80/443, het router-profiel van
// nmap.js), elk met zijn Nederlandse glos.
const SCAN = 'nmap 192.168.1.1';
const PROMPT = 'hacker@hacksim:~$';

let outputEl = null;
let typingTargetEl = null;

// Zodra de bezoeker zelf typt is de auto-demo definitief klaar: geen replay meer over
// zijn sessie heen.
let overgedragen = false;

const verminderd = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Leegt het invoerveld. Sinds Sessie 214 is `#typing-target` een <input>; de inline
 * breedte (Sessie 215) hoort bij de typemachine die er niet meer is, maar een oude
 * waarde mag de overname niet in de weg zitten.
 */
function leegInvoer() {
  if (!typingTargetEl) return;
  typingTargetEl.value = '';
  typingTargetEl.style.width = '';
}

/** Zet het nmap-frame neer en laat het uitrollen; het vorige frame maakt plaats. */
function toonScan({ oplichten = true } = {}) {
  outputEl.textContent = '';
  const rijen = [maakRij(`${PROMPT} ${SCAN}`, null, 'prompt')];
  for (const [tekst, glos] of respons(SCAN)) rijen.push(maakRij(tekst, glos, 'output'));
  rijen.forEach((r) => outputEl.appendChild(r));
  if (oplichten) lichtOp(rijen);
}

function init() {
  outputEl = document.getElementById('hero-demo');
  typingTargetEl = document.getElementById('typing-target');

  if (!outputEl || !typingTargetEl) {
    console.warn('[landing-demo] Required elements not found');
    return;
  }

  // De rijen staan meteen in de DOM; alleen hun beeld rolt uit.
  toonScan({ oplichten: !verminderd() });
  leegInvoer();
}

/** Er loopt niets meer dat gestopt hoeft te worden; blijft voor de API van hero-repl. */
function stop() {}

/**
 * De bezoeker neemt de terminal over. Onomkeerbaar: de auto-demo is een lokmiddel,
 * geen achtergrondproces dat over iemands sessie heen mag schrijven.
 */
function handOff() {
  overgedragen = true;
  leegInvoer();
}

// Modules draaien na het parsen, vóór DOMContentLoaded: de DOM is er al.
init();

// `handOff` wordt door hero-repl.js gebruikt zodra de bezoeker zelf typt of een chip tikt.
window.landingDemo = {
  stop,
  handOff,
  isHandedOff: () => overgedragen
};

// ==================== Mobiele CTA-balk (Sessie 216) ====================
// De balk bestaat om altijd een CTA in beeld te houden (Sessie 214), maar op
// scrollpositie 0 deed hij dat niet: daar staat de hero-CTA al (gemeten op zes maten,
// midden y=306..361, balk pas vanaf y=602). Hij dekte er `whoami`/`pwd`/`help` af
// (360x800, 390x844) en zette een tweede identieke knop op het scherm.
//
// Regel: de balk staat in voor de primaire CTA en stapt opzij zodra diens *middelpunt*
// vrij ligt — onder de navbar, boven de balkrand. Die grens is gekozen omdat alleen zij
// beide eisen per constructie waarmaakt: "zodra hij het scherm raakt" laat de balk
// verdwijnen voor een strookje van 1px (geen tikdoel), "pas bij volledig zichtbaar" laat
// een venster van ~24px open waarin balk én CTA-midden allebei aantikbaar zijn (dubbele
// CTA). Bij "midden vrij" geldt: balk verborgen ⟺ CTA-midden aantikbaar — één conditie,
// dus geen gat en geen overlap. Geverifieerd over 890 posities à 10px in drie engines.
//
// Uitzondering (sessie 241): de balk blijft ook weg zolang hij een chip van de hero zou
// afdekken (zie zouChipAfdekken). In dat venster van 10-30px scroll is geen van beide
// "Start"-knoppen aantikbaar, maar de chips zijn het wel: die zijn daar de actie. Een
// afgedekte chip is erger, want een tik erop navigeerde weg in plaats van te proberen.
//
// Zonder JS blijft de CSS-default staan: dan gedraagt de pagina zich als vóór Sessie 216.
function initCtaBar() {
  const balk = document.querySelector('.mobile-cta-bar');
  if (!balk || !('IntersectionObserver' in window)) return;

  // Alleen de CTA's die hetzelfde label dragen als de balk ("Start de simulator"): hero
  // en final (de mid-CTA verviel met "Hoe het werkt" in sessie 242). Bewust NIET de leerpad-deeplinks (?tutorial=) — die dragen een ander
  // label, dus daar is geen duplicaat en blijft de balk juist nuttig als drager van het
  // canonieke label.
  const doelen = [...document.querySelectorAll('a.btn-cta[href="/terminal.html"]')]
    .filter((a) => !balk.contains(a));
  if (!doelen.length) return;

  // De navbar is `position: sticky; top: 0` en dekt dus echt af; een CTA die eronder
  // schuift is niet aantikbaar. Hoogte uit de bron, niet overgetikt.
  const navHoogte =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 0;

  // De balk meet zichzelf in plaats van een constante te dragen: dat neemt
  // env(safe-area-inset-bottom) mee en kan niet driften als de knop of padding verandert.
  // Werkt in beide toestanden omdat verbergen met `visibility` gaat — de box blijft staan.
  // Boven 1279px is de balk display:none (hoogte 0) en valt de ondergrens terug op de
  // vensterrand; het mechanisme is daar sowieso niet in beeld.
  function balkRand() {
    const b = balk.getBoundingClientRect();
    return b.height ? b.top : window.innerHeight;
  }

  function middenVrij(el) {
    const r = el.getBoundingClientRect();
    if (!r.height) return false;
    const mid = r.top + r.height / 2;
    return mid >= navHoogte && mid <= balkRand();
  }

  // De balk dekt nooit een chip van de hero af. Bij "midden vrij" alleen bleef er een smal
  // venster over: de hero-CTA net onder de navbar, de onderste chiprij nog in de balkzone.
  // Gemeten per 10px over drie engines en twee telefoonmaten: 22 scrollposities met een
  // afgedekte chip in de layout van sessie 240, 3 in die van 241 — nooit nul. In dat
  // venster zijn de chips zelf de actie, dus de balk wacht tot ze de zone uit zijn.
  const chips = [...document.querySelectorAll('.hero-chip')];

  function zouChipAfdekken() {
    const rand = balkRand();
    return chips.some((c) => {
      const r = c.getBoundingClientRect();
      return r.height > 0 && r.bottom > rand && r.top < window.innerHeight;
    });
  }

  function herbeoordeel() {
    balk.dataset.state = doelen.some(middenVrij) || zouChipAfdekken() ? 'verborgen' : 'zichtbaar';
  }

  // De observer is het "er is iets veranderd"-signaal; `middenVrij()` is de regel.
  // Bewust NIET op `entry.isIntersecting` beslissen: die is `true` zodra het doel de root
  // raakt, ongeacht de threshold — bij het passeren van 0.5 vuurt de callback en levert
  // dan gewoon `isIntersecting: true` met ratio 0.4.
  //
  // De rootMargin krimpt de root tot het gebied dat navbar noch balk bedekt, zodat de
  // callback-grens samenvalt met de predicaatgrens. Hij bepaalt alleen het *moment* — het
  // predicaat leest de echte geometrie, dus wat drift na een draaiing is onschadelijk.
  // De grenzen hangen af van de balkhoogte, en die is pas bekend als de balk bestaat. Sinds
  // sessie 252 bestaat hij zodra navbar.js html.nav-ingeklapt zet (inklappen op wat past,
  // TASKS #88); start deze module eerder, dan is hij nog display:none (hoogte 0) en klopten
  // de grenzen nooit meer: op 375 was op scroll 410 geen enkele actie bereikbaar. Daarom
  // bouwen de observers zich opnieuw op zodra de balk van maat verandert (ook bij draaien).
  let observers = [];
  function bouw() {
    observers.forEach((o) => o.disconnect());
    const onder = window.innerHeight - balkRand();
    const observer = new IntersectionObserver(herbeoordeel, {
      // window.innerHeight - balkRand() is de balkhoogte, of 0 wanneer hij display:none is.
      rootMargin: `-${navHoogte}px 0px -${onder}px 0px`,
      threshold: 0.5
    });
    doelen.forEach((el) => observer.observe(el));

    // De chips kruisen de balkrand met hun randen, niet hun midden: threshold 0 en 1 vuren
    // precies wanneer een chip de zone in- of uitgaat.
    const chipObserver = new IntersectionObserver(herbeoordeel, {
      rootMargin: `0px 0px -${onder}px 0px`,
      threshold: [0, 1]
    });
    chips.forEach((el) => chipObserver.observe(el));
    observers = [observer, chipObserver];
  }
  bouw();
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { bouw(); herbeoordeel(); }).observe(balk);
  }

  // Eén synchrone beoordeling bij init: de eerste IO-callback komt pas in de volgende
  // rendering-update, en dat is één frame waarin de balk zichtbaar over de chips flitst.
  herbeoordeel();
  window.addEventListener('resize', herbeoordeel, { passive: true });
}

initCtaBar();
