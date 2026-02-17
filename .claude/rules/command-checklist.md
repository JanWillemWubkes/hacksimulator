# Command Implementation Checklist

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

4. **Warning (Offensive Tools)** - Juridische disclaimer + confirmatie
   - Required for: hashcat, hydra, sqlmap, metasploit, nikto (security category)
   - Pattern: `[!] Let op: [tool] is een offensive tool. Gebruik ALLEEN met toestemming!`
   - Confirmation: `Doorgaan? (j/n):` → if 'n' → cancel, if 'j' → proceed
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
   - Automated: Playwright E2E tests (`tests/e2e/` - 13 suites, 78 tests)
   - Cross-browser: Chrome, Firefox passing (Safari deferred)
   - Mobile: Real device test on iOS/Android

8. **Bundle Impact** - Measure KB increase, stay <500KB total
   - Before/after: Measure increase → should be <10KB per command
   - Warning: Bundle currently exceeds 500KB budget - optimize before adding commands

→ **Testing protocol:** `docs/testing/manual-protocol.md`
→ **E2E tests:** `tests/e2e/` directory
