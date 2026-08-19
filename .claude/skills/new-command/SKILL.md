---
name: new-command
description: Gebruik bij het toevoegen van een nieuw terminal-command aan HackSimulator (src/commands/*/). Maakt de bestaande 8-staps checklist-rule invokeerbaar als stap-voor-stap flow met test-gate. Trigger op "nieuw command", "command toevoegen".
---

# Nieuw terminal-command toevoegen

Dunne wrapper. De inhoudelijke standaard (toonvoorbeelden + 8-staps checklist) staat in
`.claude/rules/command-output.md` — **lees die eerst**. Die rule laadt automatisch zodra je een
bestand in `src/commands/` opent. Deze skill levert de volgorde + de gate zodat geen stap wegvalt.

## Flow
1. **Spec checken** — staat het command in `docs/commands-list.md` en past het in MVP-scope (PRD §13)?
2. **80/20-output** — realistische maar simplified output: EN-output + `← NL`-context + `[TIP]` (NL).
   Niet te technisch, niet te simpel (zie command-output.md voor good/bad-paren).
3. **Educatieve feedback** — elk command = leermoment. `[TIP]` verplicht; toon "waarom", niet alleen "wat".
4. **Help/man (NL)** — `manPage`-property, 3-tier: fuzzy-match typo → progressive hints → volledige man-page.
5. **Warning + consent (offensive tools)** — voor security-category (hashcat/hydra/sqlmap/metasploit/nikto):
   `[!]`-waarschuwing + het consent-model (eerste call zónder args toont box; call mét args accepteert +
   draait; zet `localStorage['security_tools_consent']` in try/catch). GEEN interactieve j/n-prompt.
6. **Mobile ≤40 chars** — output moet correct wrappen op 375px. Verifieer met de `verify-terminal`-skill
   (objectieve overflow-meting), niet op het oog.
7. **Error-handling** — missing args / invalid args / typo / file-not-found, elk met NL-tip.
8. **Bundle-impact** — <10KB per command; Terminal Core zit al krap tegen <400KB.

## Gate (verplicht)
```bash
npx playwright test          # of gerichter: npx playwright test tests/e2e/command-coverage.spec.js
```
Voeg dekking toe in `tests/e2e/` als het command een nieuw pad introduceert. Groen = klaar.

## NL-kop/copy
Nieuwe zichtbare tekst volgt NL-zinskapitaal + tone-of-voice ("je" niet "u", bemoedigend). Bij twijfel:
draai de `nl-content-reviewer`-agent.
