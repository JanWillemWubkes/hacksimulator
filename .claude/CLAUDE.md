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

**Last updated:** 14 oktober 2025
**Version:** 3.2 (Sessie 5: M0+M1 completed - localStorage learnings added)
