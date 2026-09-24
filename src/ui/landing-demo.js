/**
 * landing-demo.js - de auto-demo van de hero-terminal (Landing Page)
 *
 * Sessie 238: geen typemachine meer. Het direction contract vraagt één beweging per
 * command: de regels verschijnen in één keer en lichten samen met hun glos en hun
 * uitsparing in het diagram op (hero-registratie.js). Wat er getoond wordt komt uit
 * hero-antwoorden.js — dezelfde bron als wat een bezoeker krijgt als hij zelf typt.
 *
 * - Begint gevuld met het nmap-frame: het openingsbeeld uit het contract, en het enige
 *   beeld dat een bezoeker met prefers-reduced-motion ooit ziet.
 * - Stopt definitief zodra de bezoeker de terminal overneemt (handOff, via hero-repl.js).
 * - Pauzeert als het tabblad verborgen is.
 */

import { respons } from './hero-antwoorden.js';
import { maakRij, lichtOp, zetDiagram } from './hero-registratie.js';

const CONFIG = {
  commandPause: 3200,    // ms dat een antwoord blijft staan vóór het volgende command
  loopDelay: 2400,       // ms extra rust aan het eind van de reeks
  maxRijen: 24,          // de module toont er minder; dit begrenst alleen de DOM
};

// Volgorde van de demo. `nmap` staat vooraan: het openingsbeeld, en de enige scène die
// het diagram laat antwoorden met drie open poorten (53/80/443, het router-profiel).
const REEKS = ['nmap 192.168.1.1', 'ls', 'whoami', 'pwd'];
const PROMPT = 'hacker@hacksim:~$';

let outputEl = null;
let typingTargetEl = null;
let isRunning = false;

// Generatieteller. `isRunning = false` breekt de lopende await-keten NIET af: elke
// opgeschorte `delay()` komt gewoon terug en loopt verder langs zijn poorten. Zette
// iets `isRunning` intussen weer op true (de visibilitychange-handler deed dat), dan
// liepen er twee lussen in dezelfde DOM. Een lus die niet meer de huidige generatie
// is, stopt onherroepelijk.
let generatie = 0;

// Zodra de bezoeker zelf typt is de auto-demo definitief klaar. Zonder deze vlag
// herstartte hij bij elke tabwissel over de sessie van de bezoeker heen.
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

/** Schrijft één command met zijn antwoord en laat het als één rij oplichten. */
function toon(command, { oplichten = true } = {}) {
  const rijen = [maakRij(`${PROMPT} ${command}`, null, 'prompt')];
  for (const [tekst, glos] of respons(command)) rijen.push(maakRij(tekst, glos, 'output'));
  rijen.forEach((r) => outputEl.appendChild(r));
  while (outputEl.children.length > CONFIG.maxRijen) outputEl.firstChild.remove();
  if (oplichten) lichtOp(rijen);
  zetDiagram(command);
}

function init() {
  outputEl = document.getElementById('hero-demo');
  typingTargetEl = document.getElementById('typing-target');

  if (!outputEl || !typingTargetEl) {
    console.warn('[landing-demo] Required elements not found');
    return;
  }

  // Het venster begint gevuld in plaats van leeg: het nmap-frame staat er meteen, met
  // het diagram al in zijn eindstand. Zonder dit stond het venster ~1,2 s leeg.
  outputEl.textContent = '';
  toon(REEKS[0], { oplichten: false });
  leegInvoer();

  if (verminderd()) return;
  startAnimation();
}

async function startAnimation() {
  if (isRunning || overgedragen) return;
  isRunning = true;
  const gen = ++generatie;

  // De eerste ronde slaat REEKS[0] over: dat frame staat er al, en de demo leest
  // daardoor als een sessie die doorloopt in plaats van als een venster dat leeg begint.
  let volgende = 1;

  while (isRunning && gen === generatie) {
    await delay(CONFIG.commandPause);
    if (!isRunning || gen !== generatie) break;

    toon(REEKS[volgende]);
    volgende = (volgende + 1) % REEKS.length;
    if (volgende === 0) await delay(CONFIG.loopDelay);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stop() {
  isRunning = false;
  generatie++;   // maakt elke nog lopende lus onherroepelijk ongeldig
}

/**
 * De bezoeker neemt de terminal over. Onomkeerbaar: de auto-demo is een lokmiddel,
 * geen achtergrondproces dat over iemands sessie heen mag schrijven.
 */
function handOff() {
  overgedragen = true;
  stop();
  leegInvoer();
}

// Pauzeer als het tabblad niet zichtbaar is (performance).
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stop();
  } else if (!isRunning && !overgedragen && outputEl && !verminderd()) {
    startAnimation();
  }
});

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
// Zonder JS blijft de CSS-default staan: dan gedraagt de pagina zich als vóór Sessie 216.
function initCtaBar() {
  const balk = document.querySelector('.mobile-cta-bar');
  if (!balk || !('IntersectionObserver' in window)) return;

  // Alleen de CTA's die hetzelfde label dragen als de balk ("Start de simulator"): hero,
  // mid en final. Bewust NIET de leerpad-deeplinks (?tutorial=) — die dragen een ander
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

  function herbeoordeel() {
    balk.dataset.state = doelen.some(middenVrij) ? 'verborgen' : 'zichtbaar';
  }

  // De observer is het "er is iets veranderd"-signaal; `middenVrij()` is de regel.
  // Bewust NIET op `entry.isIntersecting` beslissen: die is `true` zodra het doel de root
  // raakt, ongeacht de threshold — bij het passeren van 0.5 vuurt de callback en levert
  // dan gewoon `isIntersecting: true` met ratio 0.4.
  //
  // De rootMargin krimpt de root tot het gebied dat navbar noch balk bedekt, zodat de
  // callback-grens samenvalt met de predicaatgrens. Hij bepaalt alleen het *moment* — het
  // predicaat leest de echte geometrie, dus wat drift na een draaiing is onschadelijk.
  const observer = new IntersectionObserver(herbeoordeel, {
    // window.innerHeight - balkRand() is de balkhoogte, of 0 wanneer hij display:none is.
    rootMargin: `-${navHoogte}px 0px -${window.innerHeight - balkRand()}px 0px`,
    threshold: 0.5
  });
  doelen.forEach((el) => observer.observe(el));

  // Eén synchrone beoordeling bij init: de eerste IO-callback komt pas in de volgende
  // rendering-update, en dat is één frame waarin de balk zichtbaar over de chips flitst.
  herbeoordeel();
  window.addEventListener('resize', herbeoordeel, { passive: true });
}

initCtaBar();
