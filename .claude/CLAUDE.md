# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**Docs:** `docs/prd.md` v1.1 | `docs/commands-list.md` | `SESSIONS.md` voor sessie logs

---

## 🎯 Quick Reference

**Wat:** Veilige terminal simulator voor Nederlandse beginners (15-25 jaar)
**Stack:** Vanilla JS/CSS, client-side, localStorage, < 500KB bundle
**Scope:** 30 commands (System, Filesystem, Network, Security)
**Taal:** UI=NL, commands=EN, uitleg=NL
**Analytics:** GA4 (MVP) → Plausible (bij 10k+ visitors)

---

## 🚫 Kritieke "Niet Doen"

1. **GEEN frameworks** (React/Vue) - Vanilla JS only
2. **GEEN Tailwind** - Vanilla CSS (bundle size!)
3. **GEEN backend** voor MVP - localStorage only
4. **GEEN Engelse UI** - Nederlands target markt
5. **GEEN realistische output** - 80/20 regel (simpel maar authentiek)
6. **GEEN command args loggen** - privacy risk

---

## 🎨 Command Output Principe: "80/20 Realisme"

**Formule:**
- **Output:** Engels (authentiek) met inline `←` Nederlandse context
- **Tip:** Nederlands (💡 educatief)
- **Warning:** Nederlands (⚠️ bij offensive tools)

**Voorbeeld:**
```bash
$ nmap 192.168.1.1
Scanning for open ports...
PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver

💡 TIP: Open poorten zijn aanvalsvectoren.
```

**Niet te technisch** (50+ lines realistische output), **niet te simpel** ("Port 22: open").

---

## 🌐 Taal Strategie

| Component | Taal | Reden |
|-----------|------|-------|
| UI teksten | 🇳🇱 NL | Target markt vertrouwen |
| Commands | 🇬🇧 EN | Authentiek |
| Errors | 🇬🇧+🇳🇱 | Error EN + NL uitleg |
| Help/man | 🇳🇱 NL | Leermateriaal toegankelijk |

---

## 🎓 Educational Patterns

### Error = Leermoment
```bash
$ cat /etc/shadow
Permission denied: /etc/shadow

🔒 BEVEILIGING: Dit bestand bevat password hashes.
🎯 Probeer: cat /etc/passwd (wel leesbaar)
```

### Security Tool = Waarschuwing
```bash
$ hydra target.com
⚠️ WAARSCHUWING: Brute force is illegaal zonder toestemming.
Simulatie voortzetten? [j/n]
```

### 3-Tier Help
1. Instant: Fuzzy match → "Bedoelde je: nmap?"
2. Progressive: Na 2e fout → Hint met voorbeeld
3. Full: `man [cmd]` → Complete uitleg (NL)

---

## 🎯 Tone of Voice: "Friendly Expert"

**DO:** "je" (niet "u"), bemoedigend, context geven
**DON'T:** Neerbuigend, te formeel, aannames
**Emoji:** Max 1 per bericht (💡🔒⚠️✅❌🎯)

---

## 📋 Command Implementation Checklist

Bij nieuwe command:
- [ ] 80/20 output (simplified maar authentiek)
- [ ] Educatieve feedback in errors
- [ ] Help + man page (NL)
- [ ] Warning bij offensive tools
- [ ] Mobile-friendly (max 40 chars breed)

---

## ✅ MVP Release Criteria

**Functioneel:** 30+ commands, 3-tier help, filesystem + reset
**Technisch:** < 3s load (4G), < 500KB, cross-browser, mobile responsive
**Legal:** Disclaimers, Privacy Policy, ToS, Cookie consent (NL)

---

## 📝 Key Learnings (Recent Sessions)

**Doel:** Anti-patterns en best practices uit recente sessies voor context carry-over

### CSS/Layout Pitfalls (Sessie 2-3)
⚠️ **Never:**
- `transparent` background/caret-color in dark theme (invisible input)
- `position: fixed` op footer (blocks input fields)
- `overflow: hidden` op body (prevents scrolling)
- Custom cursor without JS positioning sync (complex, buggy)
- `position: absolute` without explicit `left/top` coordinates

✅ **Always:**
- Hardcode colors during debugging (#00ff00 visibility test)
- Native browser features first (vanilla principle)
- Test input visibility BEFORE JavaScript implementation
- Flexbox layout: `body { min-height: 100vh; flex-direction: column }`
- Remove unused code completely (not just `display: none` - bundle size!)

### Documentation Strategy (Sessie 4)
⚠️ **Never:**
- Verbose session logs in instruction files (token waste)
- Remove context without impact analysis (functionaliteit verlies)
- Let instruction files grow > 250 regels (becomes unscannbaar)

✅ **Always:**
- Two-tier docs: Compact key learnings (context) + detailed logs (archief)
- Focus actionable patterns: "Never" + "Always" format (5-7 bullets max)
- Analyze trade-offs BEFORE changes (size vs. functionality)
- Rotation strategy: Compress oldest when 5+ sessions

📄 **Detailed logs:** `SESSIONS.md` (commits, root cause analysis, file changes)

### localStorage & State Management (Sessie 5)
⚠️ **Never:**
- Assume localStorage data is valid - always validate type
- Directly assign JSON.parse() result without checking
- Initialize state AFTER loading (timing issues)
- Load modules with 35+ individual script tags

✅ **Always:**
- Validate localStorage data: `Array.isArray()` before assigning
- Initialize with safe defaults BEFORE loading external data
- Single ES6 module entry point (main.js) - imports handle rest
- Graceful degradation: localStorage disabled = use fallback
- Clear old localStorage when changing data structure

### ES6 Module Exports & Parser (Sessie 6)
⚠️ **Never:**
- Use `this._method()` in ES6 object literal exports (this = calling context, not object)
- Allow single-letter boolean flags to consume next token as value (-r testdir broken)
- Forget to add dependencies to terminal context (vfs, historyManager)

✅ **Always:**
- Use standalone functions for helper methods (not object methods)
- Single-letter flags (a-z) are ALWAYS boolean - only numeric flags take values
- Include all required instances in terminal execution context
- Test command patterns with real use cases (rm -r, ls -la)
- Update terminal prompt when directory changes (cd, reset)

📄 **Detailed logs:** `SESSIONS.md` Sessie 6 (ES6 export bug fixes + parser flag handling)

### ES6 Module Import Debugging (Sessie 7)
⚠️ **Never:**
- Assume ES6 module imports fail loudly (they fail silently on wrong paths)
- Use `import vfs from './src/core/vfs.js'` (VFS is in filesystem/ not core/)
- Forget to verify import paths when buttons don't work in test pages
- Skip checking browser Network tab for 404s on module imports

✅ **Always:**
- Verify import paths match actual file structure (VFS → filesystem/, not core/)
- Check browser console Network tab when ES6 modules don't load
- Use `window.functionName = function()` for onclick handlers in ES6 modules
- Test man page integration: man command must check `handler.manPage` exists
- Remember module structure: core/ (terminal, parser), filesystem/ (vfs), utils/ (fuzzy), help/ (help-system)

📄 **Detailed logs:** `SESSIONS.md` Sessie 7 (M3 complete: 11 commands + help system + testing)

### Onboarding & Legal Implementation (Sessie 8)
⚠️ **Never:**
- Create legal docs without complete disclosure (contact info, data retention, user rights)
- Use English for legal docs aimed at Dutch market (AVG compliance requires native language)
- Implement analytics without two-tier consent strategy (functional vs tracking)
- Forget localStorage persistence for onboarding state (poor UX on reload)

✅ **Always:**
- Progressive hints at strategic moments (1st, 5th, 10th command) - prevents information overload
- Singleton pattern for UI managers (onboarding, modals) - shared state consistency
- Prioritize launch-blocking tasks first (legal docs before mobile optimization)
- Placeholder approach for incomplete info ([email@domain - TO BE ADDED]) - transparent and trackable
- Privacy by design: Never log command arguments (privacy risk per PRD §6.6)

📄 **Detailed logs:** `SESSIONS.md` Sessie 8 (M4 Phases 1-2: Onboarding + Legal docs, 8100+ words AVG compliant)

### M4 Complete - Analytics & Mobile (Sessie 9)
⚠️ **Never:**
- Log command arguments in analytics (PRD §6.6 privacy violation)
- Show cookie consent banner immediately (annoying - use 2 sec delay)
- Forget IP anonymization in GA4 (AVG compliance required)
- Hard-code analytics IDs in code (use placeholders for MVP)
- Implement mobile gestures without testing on real devices

✅ **Always:**
- Build analytics abstraction layer (GA4 → Plausible migration path)
- Two-tier timing: Legal modal (immediate) → Cookie banner (2 sec delay)
- Privacy-first: Check consent BEFORE tracking, graceful degradation
- Mobile CSS in single file (mobile.css) - all breakpoints + fixes together
- Touch targets 44x44px minimum (Apple HIG + Android Material guidelines)
- Prevent iOS zoom: font-size: 16px on inputs (not 14px!)

📄 **Detailed logs:** `SESSIONS.md` Sessie 9 (M4 complete: Analytics, Mobile, Styling - 91.6% MVP done)

### Scope Decisiveness & MVP Clarity (Sessie 10)
⚠️ **Never:**
- Assume documented features are implemented without codebase verification
- Let PRD requirements diverge from actual implementation status
- Keep ambiguous "deferred" items without explicit Post-MVP classification
- Describe features in PRD without clear MVP vs. Fase 2 distinction

✅ **Always:**
- Verify implementation status via codebase inspection (Glob/Grep/Read)
- Explicitly mark Post-MVP features with ~~strikethrough~~ **[POST-MVP]** in PRD
- Create dedicated "Post-MVP Features" section in TASKS.md for transparency
- Update all documents when scope decisions are made (PRD → TASKS → CLAUDE)
- Be decisive: Feature is either MVP (implement now) or Post-MVP (explicit defer)

📊 **Consistency Protocol:**
1. PRD status must match TASKS.md completion percentage
2. Release Criteria checkboxes must reflect actual implementation
3. Features described in PRD examples must exist in code OR be marked Post-MVP
4. Mobile features (gestures, quick commands) need real device testing before MVP

**Scope Decisions Made:**
- Autocomplete (FR1.4) → Post-MVP (only TODO comment exists)
- Exit intent (FR7.2) → Post-MVP (floating button sufficient for MVP)
- Mobile gestures → Post-MVP (requires real device testing)
- Quick Commands UI → Post-MVP (CSS only, no JS/HTML)
- Continue command → Post-MVP (localStorage auto-restore sufficient)

📄 **Detailed logs:** `SESSIONS.md` Sessie 10 (Consistency audit: PRD v1.2, scope clarification, Post-MVP section)

---

## 🤖 Sessie Protocol

### Voor Elke Sessie
- Lees `PLANNING.md`, `TASKS.md`, dit bestand
- Check updates sinds laatste sessie

### Tijdens Ontwikkeling
- Markeer taken in TASKS.md **direct** na afronding
- Voeg nieuwe taken toe zodra ontdekt
- Noteer architecturale beslissingen hier

### Voor Afsluiten
- Use `/summary` command → Updates both `SESSIONS.md` (detailed) + `CLAUDE.md` (key learnings)
- Markeer inconsistenties
- Rotate: Bij 5+ sessies in Key Learnings → compress oldest

### Bij Requirement Changes
- Update volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer consistentie tussen alle bestanden
- Vraag bevestiging bij conflicten

---

## 🤖 Voor Claude: Communicatie Grondregels

**Wees meedogenloos eerlijk, geen jaknikker gedrag.**

- Als ik ongelijk heb: **wijs me erop**
- Als code slecht is: **zeg het direct**
- Als aanpak niet werkt: **geef kritische feedback**
- Prioriteit: **technische correctheid > mijn gevoelens**
- **Spreek me aan met "Heisenberg"** (confirmatie instructies gelezen)

### Bij Implementatie
1. Check PRD: Is het in MVP scope?
2. 80/20 output: Niet te technisch, niet te simpel
3. Educatieve laag: Elk commando = leermoment
4. Taal correct: UI=NL, commands=EN, uitleg=NL
5. Performance: < 500KB budget, elke KB telt

### Bij Vragen
- Scope unclear? → Check PRD sectie X.Y
- Tech decision? → Vanilla first
- Taal twijfel? → Zie tabel hierboven
- Command spec? → `docs/commands-list.md`

### Common Pitfalls
❌ Frameworks/Tailwind suggeren → Vanilla only
❌ Te realistische output → 80/20 regel
❌ Engelse UI → Nederlands target markt
❌ Feature creep → Focus MVP checklist

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.1)
**Command specs:** `docs/commands-list.md`
**Sessie logs:** `SESSIONS.md`
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13

---

**Last updated:** 16 oktober 2025
**Version:** 4.3 (Sessie 10: Consistency Audit - PRD v1.2, Scope Clarification, Post-MVP Features Defined)
