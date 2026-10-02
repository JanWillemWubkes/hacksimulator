/**
 * hero-registratie.js — de registratie van de hero-terminal (Sessie 238)
 *
 * Eén outputregel is één rij met twee cellen: links de regel zoals de tool hem schrijft
 * (Engels, in de donkere module), rechts de Nederlandse glos op dezelfde rasterrij. Dat
 * de glos naast zíjn regel staat, is hier geen uitlijning maar constructie: regel en
 * glos zitten in hetzelfde element, dus ze kunnen niet uit elkaar lopen, ook niet als
 * een regel omslaat of de module scrollt. `hero-demo.spec.js` meet het toch, in pixels.
 *
 * Gedeeld door landing-demo.js (de auto-demo) en hero-repl.js (de bezoeker), zodat er
 * één renderer is in plaats van twee die uit elkaar kunnen groeien. Het netwerkdiagram
 * dat hier tot sessie 249 meeantwoordde, is uit de hero (proef V3: te veel lagen).
 *
 * Tekst gaat altijd via textContent: bij hero-repl komt de invoer van de bezoeker.
 */

/** Hoe lang de inversie staat; daarna loopt hij in --af-registratie (700ms, affiche.css) uit. */
const OPLICHT_MS = 450;

/** Afstand tussen twee regels van één reeks (sessie 247): de uitvoer rolt uit zoals een
 *  terminal hem schrijft. (Tot sessie 249 sprong op die tik ook een poort in het diagram open.) */
const STAP_MS = 90;

const verminderd = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Kleurt een regel op zijn marker, net als de echte renderer (ui/renderer.js:95-121)
 * maar met het kleinere hero-palet.
 */
export function markerKlasse(tekst) {
  const t = tekst.trim();
  if (t.startsWith('[TIP]') || t.startsWith('[→]')) return 'tip';
  if (t.startsWith('[~]')) return 'dim';
  if (t.startsWith('[!]')) return 'warn';
  if (/^(Command not found:|cat:|nmap:)/.test(t)) return 'err';
  return null;
}

/**
 * Bouwt één rij. `soort` is 'prompt' of 'output'.
 * De regel houdt de klasse `.terminal-line`: tests en de rest van de site lezen daarop de
 * uitvoer, en die mag de glos niet meetellen.
 */
export function maakRij(tekst, glos, soort = 'output') {
  const rij = document.createElement('div');
  rij.className = 'reg' + (soort === 'prompt' ? ' reg--prompt' : '');

  const regel = document.createElement('div');
  regel.className = soort === 'prompt' ? 'terminal-line prompt' : 'terminal-line output';
  const klasse = soort === 'prompt' ? null : markerKlasse(tekst);
  if (klasse) {
    const span = document.createElement('span');
    span.className = klasse;
    span.textContent = tekst;
    regel.appendChild(span);
  } else {
    // Een lege regel houdt zijn hoogte: zonder inhoud klapt de rij in.
    regel.textContent = tekst === '' ? ' ' : tekst;
  }
  rij.appendChild(regel);

  const glosEl = document.createElement('div');
  glosEl.className = 'reg-glos';
  if (glos) {
    glosEl.textContent = glos;
  } else {
    glosEl.setAttribute('aria-hidden', 'true');
  }
  rij.appendChild(glosEl);
  return rij;
}

/**
 * De signatuurbeweging: de reeks rolt regel voor regel uit, en elke rij (regel + glos)
 * licht op het moment van verschijnen op. De rijen staan meteen in de DOM; alleen het
 * beeld wacht (`.reg.is-rol`, een clip-path met een vertraging per regel). Wie de tekst
 * leest, een schermlezer of een test, ziet dus nooit een halve reeks.
 * Onder prefers-reduced-motion gebeurt er niets: de eindstand ís de rusttoestand.
 */
export function lichtOp(rijen) {
  if (verminderd() || !rijen.length) return;
  // Alleen wat in het venster staat telt mee: in de rusttoestand (flex-end) vallen prompt
  // en kop van een lange uitvoer boven de rand, en die telden eerst 400ms zwarte module.
  const venster = rijen[0].parentElement.getBoundingClientRect();
  let k = 0;
  rijen.forEach((r) => {
    if (r.getBoundingClientRect().bottom <= venster.top + 1) return;
    const ms = r.classList.contains('reg--prompt') ? 0 : k++ * STAP_MS;
    r.style.setProperty('--reg-vertraging', `${ms}ms`);
    r.classList.add('is-rol');
    setTimeout(() => {
      r.classList.add('is-lit');
      setTimeout(() => r.classList.remove('is-lit'), OPLICHT_MS);
    }, ms);
  });
}
