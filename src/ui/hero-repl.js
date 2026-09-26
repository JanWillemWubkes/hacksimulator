/**
 * hero-repl.js — interactieve hero-terminal op de homepage (Sessie 214)
 *
 * De hero toonde een terminalvenster met prompt en knipperende cursor dat niets deed.
 * Voor een product waarvan de belofte "typ commands, veilig" is, mocht de bezoeker het
 * product pas ervaren ná een klik plus een paginalading. Nu typt hij meteen.
 *
 * Bewuste grenzen:
 * - GEEN import van de echte engine. Terminal Core zit al ~37% boven het 400 KB-budget
 *   (TASKS.md); de responsemap is een eigen module van een paar KB
 *   (hero-antwoorden.js, sinds Sessie 238 gedeeld met de auto-demo).
 * - Het blijft een demo. Zes commands, dat staat er ook, en elke doodlopende weg wijst
 *   naar de volledige simulator.
 * - Alle uitvoer is afgeleid uit de échte bron (zie de verwijzingen per command), niet
 *   verzonnen. De vorige hand-geschreven demo toonde bestanden die niet bestonden.
 */

import events from '../analytics/events.js';
import { respons, CTA_LABEL } from './hero-antwoorden.js';
import { maakRij, lichtOp, zetDiagram } from './hero-registratie.js';

const outputEl = document.getElementById('hero-demo');
const inputEl = document.getElementById('typing-target');
const bodyEl = document.querySelector('.hero-terminal .terminal-body');
const chipsEl = document.getElementById('hero-chips');
const kolomEl = document.querySelector('.hero-terminal-col');

// Op elke andere pagina bestaan deze elementen niet — stil stoppen.
if (outputEl && inputEl && bodyEl) {
  initHeroRepl();
}

function initHeroRepl() {
  const PROMPT = 'hacker@hacksim:~$';
  const MAX_REGELS = 120;          // begrenst het geheugen bij lang doorspelen
  const MAX_INVOER = 60;           // langere invoer is geen command maar geplakte tekst

  // De begeleidingsvolgorde: van "wat staat hier" naar "wat kan ik ermee".
  const SUGGESTIES = ['ls', 'cat notes.txt', 'nmap 192.168.1.1', 'whoami', 'pwd', 'help'];

  let overgenomen = false;
  let afgerond = false;
  const gedaan = new Set();

  /**
   * Analytics mag de demo nooit breken. Twee redenen om dit te omhullen:
   *  1. `events.js` is deze sessie uitgebreid, maar relatief geïmporteerde submodules
   *     dragen geen `?v=` — een terugkerende bezoeker kan tot `max-age` (3600s) een
   *     oude events.js uit cache krijgen zonder deze methodes (zie het cache-patroon in
   *     .claude/rules/caching-deploy.md);
   *  2. de tracker praat met gtag, en dat is code van derden.
   */
  function meld(naam, arg) {
    try {
      if (typeof events[naam] === 'function') events[naam](arg);
    } catch (e) {
      /* stil: een meetfout is geen reden om de bezoeker zijn terminal af te pakken */
    }
  }

  function isSmal() {
    return window.innerWidth < 768;
  }

  // ==================== Rendering ====================
  // Eén rij per regel: de regel links in de module, de glos rechts op dezelfde rij
  // (hero-registratie.js). Tekst gaat daar via textContent — de invoer komt van de bezoeker.
  function schrijf(tekst, soort, glos = null) {
    const rij = maakRij(tekst, glos, soort);
    outputEl.appendChild(rij);
    return rij;
  }

  function trim() {
    while (outputEl.children.length > MAX_REGELS) outputEl.firstChild.remove();
  }

  function pinScroll() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // Het nieuwste command bovenaan, niet de laatste regel onderaan: wie een chip tikt moet
  // zien wát hij tikte. Naar de bodem pinnen schoof bij nmap (374px uitvoer in 205px) de
  // promptregel en "Nmap scan report" 107px boven de rand weg. Past de uitvoer wél, dan
  // klemt de browser dit vanzelf op de bodem. Strak op de rand en niet op de padding: met
  // 8px ruimte erboven piepte de afgesneden onderkant van de vorige regel erdoor.
  function toonCommand(promptRij) {
    bodyEl.scrollTop = promptRij.offsetTop;
  }

// ==================== Overname ====================
  function neemOver() {
    if (overgenomen) return;
    overgenomen = true;

    if (window.landingDemo && window.landingDemo.handOff) window.landingDemo.handOff();

    outputEl.innerHTML = '';
    bodyEl.classList.add('is-live');
    outputEl.setAttribute('aria-live', 'polite');
    inputEl.readOnly = false;
    inputEl.value = '';
    inputEl.placeholder = 'typ een command…';

    // De uitnodiging boven het venster is opgebruikt zodra hij is aangenomen.
    if (kolomEl) kolomEl.classList.add('is-taken');

    // De auto-demo zette een inline breedte per aanslag (zie landing-demo.js setTyped).
    // Inline verslaat de stylesheet, dus zonder dit blijft het veld één teken breed en
    // kan de bezoeker zijn eigen command niet zien.
    inputEl.style.width = '';

    // Expliciet focussen: Firefox focust het veld niet vanzelf, omdat het op het moment
    // van de mousedown nog `readonly` was (gemeten: document.activeElement bleef BODY).
    // Zonder deze regel klikt een Firefox-bezoeker de terminal aan, ziet hem live gaan,
    // en verdwijnen zijn toetsaanslagen in het niets.
    inputEl.focus();

    schrijf('Demo-terminal — 6 commands werken hier.', 'output');
    schrijf(
      isSmal() ? '[→] Typ of tik een command.' : '[→] Typ een command, of tik een suggestie.',
      'output'
    );
    pinScroll();
    markeerVolgende();

    meld('heroDemoStarted');
  }

  function markeerVolgende() {
    if (!chipsEl) return;
    const volgende = SUGGESTIES.find((s) => !gedaan.has(s));
    chipsEl.querySelectorAll('.hero-chip').forEach((chip) => {
      const cmd = chip.dataset.command;
      chip.classList.toggle('is-next', cmd === volgende);
      chip.classList.toggle('is-done', gedaan.has(cmd));
    });
  }

  function voerUit(invoer) {
    const command = invoer.trim().slice(0, MAX_INVOER);
    if (!command) return;

    const rijen = [schrijf(`${PROMPT} ${command}`, 'prompt')];
    for (const [tekst, glos] of respons(command, isSmal())) {
      rijen.push(schrijf(tekst, 'output', glos));
    }
    // De signatuur: regel, glos en diagramuitsparing lichten samen op, één keer.
    lichtOp(rijen);
    zetDiagram(command);

    gedaan.add(command);

    // Alleen op `every()` en niet op `gedaan.size`: `gedaan` verzamelt élke invoer, dus
    // zes willekeurige woorden zouden anders de afrondboodschap triggeren. En één keer,
    // niet bij elk volgend command — een herhaalde CTA is ruis, geen aansporing.
    if (!afgerond && SUGGESTIES.every((s) => gedaan.has(s))) {
      afgerond = true;
      schrijf('', 'output');
      schrijf(
        isSmal()
          ? `[→] Klik op "${CTA_LABEL}" voor 40+ commands.`
          : `[→] Je hebt de basis te pakken. Klik op "${CTA_LABEL}" voor 40+ commands en het leerpad.`,
        'output'
      );
    }

    trim();
    toonCommand(rijen[0]);
    markeerVolgende();

    // Alléén de commandonaam, nooit argumenten (PRD §13). De guard in
    // analytics/tracker.js:146 is het vangnet, niet de eerste verdediging.
    meld('heroDemoCommand', command.split(/\s+/)[0].toLowerCase());
  }

  // ==================== Events ====================
  // Geen autofocus: dat zou op mobiel het toetsenbord openen bij paginalading.
  ['pointerdown', 'focus', 'keydown'].forEach((type) => {
    inputEl.addEventListener(type, neemOver);
  });

  // De hele promptregel is het tikdoel, niet alleen het veld. In rust is dat veld sinds
  // Sessie 215 nog maar één teken breed (zodat de cursor bij de tekst staat), en een
  // tikdoel van 10px is er geen — WebKit miste hem zelfs in de testrun. Zo werkt het ook
  // in een echte terminal: klikken in het venster zet je op de prompt.
  const promptRegel = document.querySelector('.hero-terminal .terminal-input-line');
  if (promptRegel) {
    promptRegel.addEventListener('pointerdown', (e) => {
      if (e.target === inputEl) return;   // het veld regelt zichzelf al
      e.preventDefault();                 // anders verliest het veld de focus weer
      neemOver();
      inputEl.focus();
    });
  }

  inputEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const waarde = inputEl.value;
    inputEl.value = '';
    voerUit(waarde);
  });

  if (chipsEl) {
    chipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.hero-chip');
      if (!chip) return;
      neemOver();
      inputEl.focus();
      voerUit(chip.dataset.command);
    });
  }

  markeerVolgende();
}
