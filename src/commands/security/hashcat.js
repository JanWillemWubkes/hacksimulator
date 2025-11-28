/**
 * hashcat - Password hash cracking simulator
 * Simulated command for the HackSimulator terminal
 * Educational tool demonstrating password cracking concepts
 */

import { boxText } from '../../utils/asciiBox.js';

/**
 * Simulated hash database with weak passwords
 */
const HASH_DATABASE = {
  // MD5 hashes (common but insecure)
  '5f4dcc3b5aa765d61d8327deb882cf99': { password: 'password', type: 'MD5', time: 0.02 },
  'e10adc3949ba59abbe56e057f20f883e': { password: '123456', type: 'MD5', time: 0.01 },
  '25f9e794323b453885f5181f1b624d0b': { password: '123456789', type: 'MD5', time: 0.01 },
  '827ccb0eea8a706c4c34a16891f84e7b': { password: '12345', type: 'MD5', time: 0.01 },
  '5d41402abc4b2a76b9719d911017c592': { password: 'hello', type: 'MD5', time: 0.03 },
  '098f6bcd4621d373cade4e832627b4f6': { password: 'test', type: 'MD5', time: 0.02 },
  '21232f297a57a5a743894a0e4a801fc3': { password: 'admin', type: 'MD5', time: 0.02 },
  '482c811da5d5b4bc6d497ffa98491e38': { password: 'password123', type: 'MD5', time: 0.03 },

  // SHA256 hashes (stronger but still crackable if weak password)
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': { password: 'password', type: 'SHA256', time: 0.15 },
  'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f': { password: '12345678', type: 'SHA256', time: 0.12 },
};

export default {
  name: 'hashcat',
  category: 'security',
  description: 'Password hash cracking tool',
  usage: 'hashcat <hash>',

  async execute(args, flags, context) {
    // Show warning on first use
    if (args.length === 0) {
      const warningContent = `HASHCAT - Advanced Password Recovery Tool

JURIDISCHE WAARSCHUWING:
Password cracking is ALLEEN LEGAAL op systemen waar je
expliciete toestemming voor hebt.

  Straf: Computercriminaliteit wet overtreding

EDUCATIEF GEBRUIK:
Deze simulator demonstreert password cracking concepten veilig.
Bevat alleen zwakke demo hashes.

GEBRUIK:
  hashcat <hash>

Voorbeelden van zwakke demo hashes:
  hashcat 5f4dcc3b5aa765d61d8327deb882cf99  (MD5)
  hashcat 21232f297a57a5a743894a0e4a801fc3  (MD5)`;

      const warningBox = boxText(warningContent, 'SECURITY WARNING', 60);

      return `${warningBox}`;
    }

    const hash = args[0].toLowerCase();

    // Check if hash is in our database
    const result = HASH_DATABASE[hash];

    if (!result) {
      return `hashcat v6.2.5 - Password Recovery Tool

Analyzing hash: ${hash}

[*] Detecting hash type...
[!] Hash not found in demo database

[ ? ] TIP: Deze simulator heeft een beperkte database met ALLEEN zwakke passwords.
        In de echte wereld gebruikt hashcat:
        • Wordlists (rockyou.txt = 14 miljoen wachtwoorden)
        • Brute force (alle combinaties proberen)
        • Rules (transformaties: password → p@ssw0rd)
        • GPU acceleration (miljarden hashes per seconde)

[ ! ]  Security tip: Gebruik sterke, unieke wachtwoorden!`;
    }

    // Simulate cracking process
    const { password, type, time } = result;

    let output = `hashcat v6.2.5 - Password Recovery Tool

Analyzing hash: ${hash}

[*] Detecting hash type... ${type} detected  ← Hash algoritme identificatie
[*] Loading wordlist... rockyou.txt (14,344,391 words)
[*] Starting attack...

Session..........: hashcat
Status...........: Running
Hash.Type........: ${type}
Time.Started.....: ${new Date().toLocaleString('nl-NL')}
Speed.#1.........: ${(1000 / time).toFixed(0)} MH/s  ← Miljoen hashes per seconde

${'.'.repeat(50)}

[+] HASH CRACKED!

Hash: ${hash}
Password: ${password}
Time: ${time}s

[ ? ] LEERMOMENT: Waarom werd dit gekraakt?

1. **Zwak wachtwoord**: "${password}" staat in top 100 meest gebruikte wachtwoorden
2. **${type} is snel**: Moderne GPU's kunnen ${type === 'MD5' ? '200+ miljard' : '50+ miljard'} ${type} hashes per seconde
3. **Geen salt**: Hash heeft geen salt → rainbow tables werken
4. **Wordlist match**: Stond in rockyou.txt wordlist

[ ! ] BESCHERM JEZELF:
   [ ✓ ] Gebruik wachtwoordmanager (LastPass, 1Password, Bitwarden)
   [ ✓ ] Minimaal 12+ karakters met speciale tekens
   [ ✓ ] Uniek wachtwoord per service (credential stuffing preventie)
   [ ✓ ] 2FA waar mogelijk`;

    return output;
  },

  manPage: `
NAAM
    hashcat - Advanced password recovery tool

SYNOPSIS
    hashcat <HASH>

BESCHRIJVING
    Hashcat is 's werelds snelste password cracker met GPU support.
    Deze simulator demonstreert password cracking concepten op een
    veilige, educatieve manier met een beperkte database.

ARGUMENTEN
    HASH
        Password hash om te kraken (MD5, SHA256, etc.)

VOORBEELDEN
    hashcat 5f4dcc3b5aa765d61d8327deb882cf99
        Kraak een MD5 hash (zwak wachtwoord)

    hashcat 21232f297a57a5a743894a0e4a801fc3
        Kraak een andere MD5 hash

EDUCATIEVE CONTEXT
    [###] Wat is een password hash?
       Als je wachtwoord "password" is, slaat de server NIET "password" op,
       maar een hash: "5f4dcc3b5aa765d61d8327deb882cf99"

       • Hash is one-way (niet te reverse engineeren)
       • Zelfde input = altijd zelfde output
       • Kleine verandering = compleet andere hash

    [ ~ ] Hoe werkt password cracking?
       1. **Dictionary attack**: Probeer elk woord uit wordlist
       2. **Brute force**: Probeer alle combinaties (aaa, aab, aac...)
       3. **Hybrid**: Wordlist + transformaties (password → p@ssw0rd)
       4. **Rainbow tables**: Pre-computed hash tables

    [ → ] Waarom werkt dit?
       • Mensen kiezen voorspelbare wachtwoorden
       • Top 10: password, 123456, qwerty, admin, letmein...
       • 80% van mensen hergebruikt wachtwoorden
       • Computers zijn SNEL (miljarden pogingen per seconde)

    [ ! ]  Hash types:
       • MD5 (insecure)     → 200 miljard hashes/sec (RTX 3090)
       • SHA1 (insecure)    → 100 miljard hashes/sec
       • SHA256 (ok)        → 50 miljard hashes/sec
       • bcrypt (secure)    → 100,000 hashes/sec ← Intentioneel traag!
       • Argon2 (secure)    → 10,000 hashes/sec ← Beste keuze

    [###]  Salting:
       Salt = random data toegevoegd aan wachtwoord voor hashing

       Zonder salt:
          password → 5f4dcc3b5aa765d61d8327deb882cf99

       Met salt (elke user anders):
          password + "x8f2k" → a3c9e1b8f2...
          password + "9m2p1" → 7e4f8c2a1b...

       → Rainbow tables werken niet meer!
       → Elke hash moet individueel gekraakt worden

JURIDISCHE WAARSCHUWING
    [ ! ]  ALLEEN LEGAAL met expliciete toestemming!

    Legal use cases:
       [ ✓ ] Je eigen wachtwoorden testen
       [ ✓ ] Forensische analyse (met warrant)
       [ ✓ ] Penetration testing (met contract)
       [ ✓ ] Security research (ethisch)

    Illegale use cases:
       [ X ] Stolen password databases kraken
       [ X ] Ongeautoriseerde toegang tot systemen
       [ X ] Credential stuffing attacks
       [ X ] Verkopen van gekraakte accounts

    Straf: Tot 6 jaar gevangenisstraf (Computercriminaliteit wet)

REAL-WORLD BREACHES
    [ * ] Grote data breaches met gekraakte hashes:
       • LinkedIn (2012)    → 117 miljoen SHA1 hashes (geen salt)
       • Adobe (2013)       → 153 miljoen zwak encrypted passwords
       • RockYou (2009)     → 32 miljoen plaintext passwords
       • Collection #1      → 773 miljoen credentials (credential stuffing)

    Gevolgen:
       • Accounts overgenomen
       • Identity theft
       • Financial fraud
       • Reputatie schade voor bedrijven

BESCHERMING ALS DEVELOPER
[###] Best practices:
       [ ✓ ] Gebruik bcrypt of Argon2 (NEVER MD5/SHA1/SHA256 direct!)
       [ ✓ ] Unique salt per password (auto in bcrypt)
       [ ✓ ] Rate limiting op login (prevent brute force)
       [ ✓ ] 2FA/MFA waar mogelijk
       [ ✓ ] Password strength requirements (min 12 chars)
       [ ✓ ] Breach detection (HaveIBeenPwned API)

    Code voorbeeld (Node.js + bcrypt):
       const bcrypt = require('bcrypt');
       const hash = await bcrypt.hash('password', 10);
       // 10 rounds = 2^10 iterations = intentionally slow

BESCHERMING ALS GEBRUIKER
[###] Doe dit:
       [ ✓ ] Password manager (LastPass, 1Password, Bitwarden)
       [ ✓ ] Uniek wachtwoord per site (credential stuffing preventie)
       [ ✓ ] Minimaal 16+ karakters (brute force resistance)
       [ ✓ ] Gebruik zinnen: "ILove2Eat!Pizza@Night"
       [ ✓ ] 2FA overal (authenticator app, niet SMS)
       [ ✓ ] Check HaveIBeenPwned.com regelmatig

    [ X ] NIET doen:
       [ X ] password, 123456, qwerty, admin
       [ X ] Zelfde wachtwoord op meerdere sites
       [ X ] Wachtwoorden delen
       [ X ] Wachtwoorden opschrijven (behalve in password manager)

GERELATEERDE COMMANDO'S
    hydra (brute force), john (andere cracker), metasploit
`.trim()
};
