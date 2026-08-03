/**
 * hash-benchmarks - Eén bron van waarheid voor hash-kraaksnelheden.
 *
 * Deze cijfers staan op meerdere plekken op de site (man page hashcat, twee
 * blogposts). Zonder gedeelde bron driften ze uit elkaar: vóór Sessie 209
 * noemde de site drie verschillende getallen voor dezelfde MD5-snelheid, en
 * alle drie waren 3-5x te hoog.
 *
 * BRON: hashcat v6.2.6 benchmarkmodus (`hashcat -b`), NVIDIA GeForce RTX 4090,
 * één GPU, standaard instellingen. Dit zijn gepubliceerde benchmarkcijfers,
 * geen schattingen.
 *
 * REGEL: een snelheid zonder hardware erbij is betekenisloos. Noem daarom
 * ALTIJD de kaart (BENCHMARK_GPU) als je een van deze getallen toont.
 *
 * Wijzig je hier een getal? Dan moeten de blogposts mee. Check 6e in
 * scripts/validate-docs.sh bewaakt dat en faalt als ze uit elkaar lopen.
 */

/** Referentiekaart waar alle snelheden bij horen. */
export var BENCHMARK_GPU = 'RTX 4090';

/** Herkomst, voor bronvermelding in de UI en de blog. */
export var BENCHMARK_SOURCE = 'hashcat v6.2.6 benchmark, één RTX 4090';

/**
 * Kraaksnelheden per hash-algoritme.
 *   hs    = hashes per seconde (getal, voor berekeningen)
 *   label = weergavevorm in NL (voor output en blogtabellen)
 *
 * Argon2 heeft bewust GEEN getal: de snelheid hangt volledig af van de
 * geheugen-, tijd- en parallellisme-instellingen. Eén getal noemen zou een
 * schijnprecisie zijn. Liever een feit weglaten dan een onzekere claim
 * plaatsen (principe uit Sessie 164).
 */
export var HASH_SPEEDS = {
  MD5: {
    hs: 164e9,
    label: '~164 miljard/sec',
    verdict: 'Onveilig - nooit meer gebruiken'
  },
  SHA1: {
    hs: 50e9,
    label: '~50 miljard/sec',
    verdict: 'Onveilig - verouderd'
  },
  SHA256: {
    hs: 21.7e9,
    label: '~22 miljard/sec',
    verdict: 'Te snel voor wachtwoorden'
  },
  bcrypt: {
    hs: 184e3,
    label: '~184.000/sec (cost 5)',
    verdict: 'Goed - bewust traag gemaakt'
  },
  Argon2: {
    hs: null,
    label: 'hangt af van instellingen',
    verdict: 'Beste keuze voor nieuwe systemen'
  }
};

/**
 * Zoekruimte-groottes voor de kraaktijd-tabel in blog/wachtwoord-beveiliging.html.
 * Volledige zoekruimte (worst case), niet de helft (gemiddelde) - dat staat zo
 * ook in de blogtekst vermeld.
 */
export var CHARSETS = {
  lower: 26,        // a-z
  mixed: 52,        // a-z A-Z
  alnum: 62,        // a-z A-Z 0-9
  full: 95          // alle printbare ASCII-tekens
};

/**
 * Reken kraaktijd uit voor een wachtwoord van gegeven lengte en karakterset.
 * Geeft seconden terug (volledige zoekruimte / snelheid).
 *
 * @param {number} charsetSize - aantal mogelijke tekens per positie
 * @param {number} length - wachtwoordlengte
 * @param {number} hashesPerSecond - snelheid, default MD5 op de referentiekaart
 * @returns {number} seconden
 */
export function crackSeconds(charsetSize, length, hashesPerSecond) {
  var rate = hashesPerSecond || HASH_SPEEDS.MD5.hs;
  return Math.pow(charsetSize, length) / rate;
}
