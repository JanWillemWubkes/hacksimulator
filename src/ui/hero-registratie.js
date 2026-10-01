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

/** Afstand tussen twee regels van één reeks (sessie 247): de uitvoer rolt uit zoals een
 *  terminal hem schrijft, en elke poort springt open op het moment van zíjn regel. */
const STAP_MS = 90;

/** Bij een scan tekent eerst de pijl zich van jouw machine naar de router; pas dan komt
 *  de uitvoer. Eén bron: zetDiagram geeft hem als --scan-duur aan affiche.css. */
const SCAN_MS = 360;

/** Scant dit command de router? Alleen dan opent het diagram poorten. */
function isScan(invoer) {
  const [naam = '', doel] = invoer.trim().split(/\s+/);
  return naam.toLowerCase() === 'nmap' && doel === '192.168.1.1';
}

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
 * De signatuurbeweging: de reeks rolt regel voor regel uit, en elke rij (regel + glos)
 * licht op het moment van verschijnen op. De rijen staan meteen in de DOM; alleen het
 * beeld wacht (`.reg.is-rol`, een clip-path met een vertraging per regel). Wie de tekst
 * leest, een schermlezer of een test, ziet dus nooit een halve reeks.
 * Onder prefers-reduced-motion gebeurt er niets: de eindstand ís de rusttoestand.
 */
export function lichtOp(rijen, invoer = '') {
  if (verminderd() || !rijen.length) return;
  // Alleen wat in het venster staat telt mee: in de rusttoestand (flex-end) vallen prompt
  // en kop van een lange uitvoer boven de rand, en die telden eerst 400ms zwarte module.
  const venster = rijen[0].parentElement.getBoundingClientRect();
  const voorloop = isScan(invoer) ? SCAN_MS : 0;
  let k = 0;
  rijen.forEach((r) => {
    if (r.getBoundingClientRect().bottom <= venster.top + 1) return;
    const ms = r.classList.contains('reg--prompt') ? 0 : voorloop + k++ * STAP_MS;
    r.style.setProperty('--reg-vertraging', `${ms}ms`);
    r.classList.add('is-rol');
    setTimeout(() => {
      r.classList.add('is-lit');
      setTimeout(() => r.classList.remove('is-lit'), OPLICHT_MS);
    }, ms);
  });
}

/** Zet een klasse opnieuw, zodat de animatie die eraan hangt opnieuw start. */
function herstart(el, klasse) {
  el.classList.remove(klasse);
  void el.offsetWidth;   // reflow: anders ziet de browser geen nieuwe start
  el.classList.add(klasse);
}

/**
 * Het diagram antwoordt op elk command. Netwerkcommando's raken de router, lokale
 * commando's jouw machine, en `help` laat het in rust. Een scan is kennis: open poorten
 * blijven open staan nadat je iets anders typt.
 *
 * Met `rijen` (de reeks die lichtOp laat uitrollen) speelt nmap het memorabele moment: de
 * scanpijl tekent zich en elke open poort springt invers open op de tik van zijn regel.
 * `is-open` staat meteen: de toestand is waar, alleen het beeld wacht (`.is-scan`).
 */
export function zetDiagram(invoer, rijen = null) {
  const net = document.querySelector('.af-net');
  if (!net) return;
  const naam = (invoer.trim().split(/\s+/)[0] || '').toLowerCase();

  let actief = null;
  if (naam === 'nmap') actief = 'host';
  else if (['ls', 'cat', 'pwd', 'whoami'].includes(naam)) actief = 'jij';

  net.querySelectorAll('.af-node').forEach((n) => {
    n.classList.toggle('is-actief', n.dataset.node === actief);
  });

  if (isScan(invoer)) {
    const poorten = OPEN_BIJ_ROUTER.map((p) => net.querySelector(`.af-poort[data-poort="${p}"]`))
      .filter(Boolean);
    poorten.forEach((p) => p.classList.add('is-open'));
    if (!rijen || verminderd()) return;
    // De poort volgt de vertraging die lichtOp zijn regel gaf; een regel buiten het venster
    // heeft er geen, en dan staat de poort open zodra de pijl er is.
    poorten.forEach((p) => {
      const regel = rijen.find((r) =>
        r.querySelector('.terminal-line').textContent.trimStart().startsWith(`${p.dataset.poort}/tcp`));
      const ms = regel && regel.style.getPropertyValue('--reg-vertraging');
      p.style.setProperty('--poort-vertraging', ms || `${SCAN_MS}ms`);
      herstart(p, 'is-scan');
    });
    net.style.setProperty('--scan-duur', `${SCAN_MS}ms`);
    herstart(net, 'is-scan');
  }
}
