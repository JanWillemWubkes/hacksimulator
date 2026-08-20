// Gedeelde paginalijst voor de sitebrede sweeps (Sessie 229)
//
// Stond eerst als `const PAGINAS` in text-contrast.spec.js. Bij de tweede sweep
// (font-ligatures.spec.js) zou dat een tweede lijst worden, en twee lijsten die dezelfde
// site beschrijven lopen uit elkaar: een nieuwe pagina belandt dan in de ene sweep wél en
// in de andere niet, zonder dat iets rood wordt. Eén bron, twee importeurs.
//
// Bij een NIEUWE pagina: hier toevoegen. Beide sweeps pakken hem dan vanzelf op.

/**
 * Elke pagina die de site publiceert, als pad t.o.v. de Playwright-baseURL.
 *
 * @type {readonly string[]}
 */
export const PAGINAS = [
  '/index.html', '/over-ons.html', '/gidsen.html', '/contact.html', '/woordenlijst.html',
  '/404.html', '/sample-pentest.html', '/sample-juridisch.html', '/sample-download.html',
  '/commands/index.html', '/terminal.html', '/blog/index.html',
  '/blog/nmap-beginnersgids.html', '/blog/welkom.html', '/blog/owasp-top-10-uitgelegd.html',
  '/blog/wachtwoord-beveiliging.html', '/blog/terminal-basics.html',
  '/blog/social-engineering.html', '/blog/sql-injection-uitgelegd.html',
  '/blog/cybersecurity-tools.html', '/blog/ethisch-hacker-worden.html',
  '/blog/hashcat-wachtwoorden-kraken.html', '/blog/leren-hacken.html',
  '/blog/linux-bestandssysteem.html', '/blog/metasploit-beginnersgids.html',
  '/blog/wat-is-ethisch-hacken.html', '/blog/wireshark-beginnersgids.html',
  '/assets/legal/privacy.html', '/assets/legal/terms.html', '/assets/legal/cookies.html',
];
