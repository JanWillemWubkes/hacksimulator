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
 * één renderer en één diagram is in plaats van twee die uit elkaar kunnen groeien.
 *
 * Tekst gaat altijd via textContent: bij hero-repl komt de invoer van de bezoeker.
 */

/** Hoe lang de inversie staat; daarna loopt hij in --af-registratie (700ms, affiche.css) uit. */
const OPLICHT_MS = 450;

/** Poorten die het router-profiel open heeft (src/commands/network/nmap.js, 'router'). */
const OPEN_BIJ_ROUTER = ['53', '80', '443'];

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
 * Laat een reeks rijen samen oplichten: de signatuurbeweging. Eén klasse erop, één eraf.
 * Onder prefers-reduced-motion gebeurt er niets: de eindstand ís de rusttoestand.
 */
export function lichtOp(rijen) {
  if (verminderd() || !rijen.length) return;
  rijen.forEach((r) => r.classList.add('is-lit'));
  setTimeout(() => rijen.forEach((r) => r.classList.remove('is-lit')), OPLICHT_MS);
}

/**
 * Het diagram antwoordt op elk command. Netwerkcommando's raken de router, lokale
 * commando's jouw machine, en `help` laat het in rust. Een scan is kennis: open poorten
 * blijven open staan nadat je iets anders typt.
 */
export function zetDiagram(invoer) {
  const net = document.querySelector('.af-net');
  if (!net) return;
  const delen = invoer.trim().split(/\s+/);
  const naam = (delen[0] || '').toLowerCase();

  let actief = null;
  if (naam === 'nmap') actief = 'host';
  else if (['ls', 'cat', 'pwd', 'whoami'].includes(naam)) actief = 'jij';

  net.querySelectorAll('.af-node').forEach((n) => {
    n.classList.toggle('is-actief', n.dataset.node === actief);
  });

  if (naam === 'nmap' && delen[1] === '192.168.1.1') {
    const poorten = OPEN_BIJ_ROUTER.map((p) => net.querySelector(`.af-poort[data-poort="${p}"]`))
      .filter(Boolean);
    poorten.forEach((p) => p.classList.add('is-open'));
    lichtOp(poorten);
  }
}
