---
paths:
  - "src/commands/**/*.js"
---

# Command-output, toon en implementatiechecklist

Geldt voor alle commands in `src/commands/*/`. Specs: `docs/commands-list.md`.
Stap-voor-stap flow met test-gate: de `new-command`-skill.


## Error Messages

**GOOD:**
```
Bestand niet gevonden: passwords.txt
[TIP] Gebruik 'ls' om te zien welke bestanden er zijn, of 'find passwords' om te zoeken
```

**BAD:**
```
ERROR: File not found.
```

**Why:** Good = beginner knows next action + learns `ls`/`find` commands. Bad = frustrating, no help.

---

## Security Warnings

**GOOD:**
```
[!] Let op: sqlmap is een offensive tool voor het vinden van SQL injection kwetsbaarheden.
Gebruik dit ALLEEN op systemen waar je schriftelijke toestemming voor hebt!

Doorgaan? (j/n): _
```

**BAD:**
```
WARNING: Illegal use is prohibited.
```

**Why:** Good = educatief (wat doet de tool?) + ethisch (toestemming). Bad = juridisch jargon, beginner snapt niet waarom.

---

## Educational Tips

**GOOD:**
```
22/tcp   OPEN    SSH ← Secure Shell (remote terminal toegang)
80/tcp   OPEN    HTTP ← Webserver (onversleuteld!)

[TIP] Poort 22 open = mogelijkheid om op afstand in te loggen. Check of wachtwoord sterk genoeg is!
[TIP] Poort 80 = onversleutelde website. Gevoelige data? Gebruik poort 443 (HTTPS).
```

**BAD:**
```
PORT     STATE   SERVICE
22/tcp   open    ssh
80/tcp   open    http
```

**Why:** Good = context (← Nederlands), relevantie (waarom belangrijk?), actie (wat nu?). Bad = technisch, beginner leert niks.

---

## 80/20 Command Output Pattern

**DO:**
```javascript
// src/commands/network/nmap.js
return `
Starting Nmap scan...
PORT     STATE   SERVICE          ← Nederlands context
22/tcp   OPEN    SSH (Secure Shell)
80/tcp   OPEN    HTTP (Web Server)
443/tcp  OPEN    HTTPS (Encrypted Web)

[TIP] Poort 22 open = SSH toegang mogelijk. Check wachtwoord sterkte!
[!] Scan alleen systemen waar je toestemming voor hebt.
`;
```

**DON'T (te technisch):**
```javascript
return `
Starting Nmap 7.80 ( https://nmap.org ) at 2024-01-04 15:30 CET
Nmap scan report for 192.168.1.1
Host is up (0.0012s latency).
Not shown: 997 filtered ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
...
`;
```

**DON'T (te simpel):**
```javascript
return `Scan complete: 3 ports open`;
```

**Formula:** Technical output + `← Dutch context` + `[TIP]` + `[!]` warning

---

---


Nieuwe command toevoegen? Volg deze 8 stappen:

## Core Implementation

1. **80/20 Output** - Realistische maar simplified output (PRD §9.2)
   - Include: Command output (EN) + inline context (← NL) + tip (NL)
   - Example: `nmap` shows ports + service names + "Poort 22 = SSH toegang"
   - Files: All `src/commands/*/*.js` follow this pattern

2. **Educational Feedback** - Elke output is een leermoment
   - Required: `[TIP]` bij elke command (waarom belangrijk?)
   - Optional: `[!]` warning voor security tools (ethische gebruik)
   - Tone: "je" (not "u"), bemoedigend, context geven

3. **Help/Man Pages** - Nederlands, 3-tier help system (PRD §8.3)
   - Tier 1: Fuzzy matching voor typos → "Bedoelde je: [command]?"
   - Tier 2: Progressive hints na 3 fouten → "Tip: gebruik 'man [cmd]'"
   - Tier 3: Full man page via `man [command]` - syntax + voorbeelden + use cases
   - Files: `src/help/help-system.js`, `manPage` property in command object

## Security & Compliance

4. **Warning (Offensive Tools)** - Juridische disclaimer + consent
   - Required for: hashcat, hydra, sqlmap, metasploit, nikto (security category)
   - Pattern: `[!] Let op: [tool] is een offensive tool. Gebruik ALLEEN met toestemming!`
   - Consent-model (GEEN interactieve j/n-prompt): eerste aanroep **zonder args** toont
     de waarschuwingsbox zonder tool-output; de gebruiker "accepteert" door het commando
     **mét args** opnieuw te typen. Dat zet `localStorage['security_tools_consent']='true'`
     (in try/catch — private mode mag de flow niet breken) en draait de tool in dezelfde call.
   - Files: All `src/commands/security/*.js`

5. **Mobile Optimalisatie** - ≤40 chars output width voor 375px viewports
   - Test: Resize browser to 375px (iPhone SE), check command output wraps correctly
   - Fix: Break long lines, use abbreviations
   - Responsive: `styles/mobile.css` media queries handle layout

## Quality Assurance

6. **Error Handling** - Cover alle edge cases
   - Missing args: `nmap` without target → "Gebruik: nmap <target>"
   - Invalid args: `nmap invalid` → "Ongeldig IP/hostname formaat"
   - Typos: `nmpa` → "Bedoelde je: nmap? Gebruik 'man nmap' voor help"
   - File not found: `cat missing.txt` → "Bestand niet gevonden. Gebruik 'ls' om bestanden te zien"

7. **Testing** - Manual + automated coverage
   - Manual: Happy path + error cases + edge cases
   - Automated: Playwright E2E tests (`tests/e2e/` - 28 suites, 240 tests)
   - Cross-browser: Chrome, Firefox passing (Safari deferred)
   - Mobile: Real device test on iOS/Android

8. **Bundle Impact** - Measure KB increase, respect budget (Terminal Core <400KB / site totaal <1000KB)
   - Before/after: Measure increase → should be <10KB per command
   - Warning: Terminal Core currently exceeds the <400KB target (~547KB minified) - optimize before adding commands

→ **Testing protocol:** `docs/testing/manual-protocol.md`
→ **E2E tests:** `tests/e2e/` directory
