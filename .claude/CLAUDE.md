# CLAUDE.md - HackSimulator.nl

**Project:** Browser-based terminal simulator voor ethisch hacken leren
**Status:** MVP Development
**PRD:** `docs/prd.md` v1.1 | **Commands:** `docs/commands-list.md`

---

## 🎯 In 30 Seconden

**Wat:** Veilige terminal simulator waar Nederlandse beginners ethisch hacken leren
**Hoe:** Vanilla JS + CSS, client-side only, 30+ gesimuleerde commands
**Voor wie:** Nieuwsgierige beginners (15-25 jaar) zonder tech achtergrond
**Taal:** UI Nederlands, commands Engels, uitleg Nederlands

---

## 🚫 Kritieke "Niet Doen"

1. **GEEN frameworks** (React/Vue) - Vanilla JS only
2. **GEEN Tailwind** - Vanilla CSS (bundle size!)
3. **GEEN backend** voor MVP - localStorage only
4. **GEEN Engelse UI** - Nederlands voor target markt
5. **GEEN realistische output** - 80/20 regel (simpel maar authentiek)
6. **GEEN command args loggen** - privacy risk

---

## ✅ Tech Stack & Decisions

```
Frontend:    Vanilla JavaScript ES6+
Styling:     Vanilla CSS + CSS Variables
Storage:     localStorage (5MB max)
Analytics:   GA4 → Plausible (post-MVP)
Bundle:      < 500KB hard limit
Load time:   < 3 sec on 4G
```

**Waarom Vanilla?**
- Terminal UI is simpel (geen complex state management)
- Bundle size kritisch (Tailwind = 20-50KB overhead)
- Code moet begrijpelijk voor learners (educatief project)

---

## 📦 MVP Scope (30 Commands)

**System (7):** clear, help, man, history, echo, date, whoami
**Filesystem (11):** ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, find, grep
**Network (6):** ping, nmap, ifconfig, netstat, whois, traceroute
**Security (5):** hashcat, hydra, sqlmap, metasploit, nikto
**Special (1):** reset (restore filesystem)

**NIET in MVP:** Accounts, backend, tutorials, certificaten, sociale features

---

## 🎨 Command Output Principe: "80/20 Realisme"

**Doel:** Realistisch genoeg om te leren, simpel genoeg om te begrijpen

### ✅ Goed (nmap example)
```bash
$ nmap 192.168.1.1
Scanning for open ports...

PORT    STATE   SERVICE
22/tcp  OPEN    SSH       ← Secure Shell (externe toegang)
80/tcp  OPEN    HTTP      ← Webserver

Scan voltooid. 2 open poorten gevonden.

💡 BEVEILIGINGSTIP: Open poorten zijn aanvalsvectoren.
   Controleer altijd welke services draaien.
```

### ❌ Te Technisch
```
Starting Nmap 7.94 at 2024-12-10 14:30 CET
Initiating SYN Stealth Scan...
Discovered open port 22/tcp on 192.168.1.1
Nmap scan report for 192.168.1.1
Host is up (0.0012s latency)...
[50+ lines]
```

### ❌ Te Simpel
```
Port 22: open
Port 80: open
```

**Formule:**
- **Output:** Engels (authentiek)
- **Inline uitleg:** `←` pijltjes met Nederlandse context
- **Tip:** Nederlands (💡 educatief)
- **Warning:** Nederlands (⚠️ bij offensive tools)

---

## 🌐 Taal Strategie

| Component | Taal | Waarom |
|-----------|------|--------|
| UI teksten | 🇳🇱 Nederlands | Target markt vertrouwen |
| Command syntax | 🇬🇧 Engels | Authentiek (echte tools) |
| Error messages | 🇬🇧+🇳🇱 | Error EN + NL uitleg |
| Help/man pages | 🇳🇱 Nederlands | Leermateriaal toegankelijk |
| Tips & hints | 🇳🇱 Nederlands | Educatieve context |
| Legal disclaimers | 🇳🇱 Nederlands | AVG verplichting |

---

## 🎓 Educational Principes

**Elk commando = leermoment**

### Error handling = educatief
```bash
$ cat /etc/shadow
Permission denied: /etc/shadow

🔒 BEVEILIGING: Dit bestand bevat password hashes.
   Op echte systemen kan alleen root dit lezen.
🎯 Probeer: cat /etc/passwd (wel leesbaar)
```

### Security tool = waarschuwing
```bash
$ hydra target.com
⚠️ WAARSCHUWING: Brute force is illegaal zonder toestemming.
   In simulator: VEILIG ✓
   In echte wereld: TOESTEMMING VEREIST

Simulatie voortzetten? [j/n]
```

### 3-Tier Help System
1. **Instant:** Fuzzy match typos → "Bedoelde je: nmap?"
2. **Progressive:** Na 2e fout → Extended hint met voorbeeld
3. **Full:** `man [cmd]` → Complete Nederlandse uitleg

---

## 💾 Filesystem Behavior

**Session-persistent via localStorage:**
```bash
# Wijzigingen blijven tijdens sessie
$ rm passwords.txt
$ ls
# Bestand is weg

# Browser sluiten + heropen
=== Welkom terug! ===
Type 'continue' (herstel sessie) of 'reset' (fresh start)

$ reset
Systeem hersteld naar oorspronkelijke staat.
```

**Structure:** Zie PRD Bijlage B (home/user, etc/, var/log, tmp)

---

## 🎯 Tone of Voice: "Friendly Expert"

**DO:**
- "je" (niet "u")
- Bemoedigend: "Goed bezig!", "Nice!"
- Context geven: "Dit is belangrijk omdat..."
- Actieve taal

**DON'T:**
- Neerbuigend: "Dat had je moeten weten"
- Te technisch zonder uitleg
- Aannames over kennis
- Te formeel: "U dient te..."

**Emoji:** Max 1 per bericht (💡🔒⚠️✅❌🎯)

---

## 📊 Success Metrics (KPIs)

**Primair:** Sessieduur (target: 2+ min voor MVP)
**Secundair:** Commands per sessie (target: 5+)
**Tertiair:** Return rate (target: 10%+ binnen 7 dagen)

**🚩 Rode Vlaggen:**
- Week 2: Sessieduur < 30 sec → **UX crisis**
- Maand 3: < 3 commands gemiddeld → **Onboarding faalt**
- Maand 4: Mobile bounce > 90% → **Mobile broken**

---

## 🔒 Privacy & Legal

**Analytics:**
- MVP: GA4 (gratis) met IP anonymization
- Post-MVP: Plausible (€9/mnd, privacy-first)

**Tracken:** ✅ Session duration, command counts, device type
**NIET tracken:** ❌ Command arguments, keystrokes, PII

**Disclaimers:** Multi-layer
1. Homepage: Prominent "Educatief doel alleen"
2. Modal first use: Juridische kennisgeving (acceptatie)
3. Footer: Links naar voorwaarden
4. Per offensive tool: Waarschuwing + "doorgaan? [j/n]"

**Vereist:** Privacy Policy, Gebruiksvoorwaarden, Cookie Policy (Nederlands, AVG)

---

## 📋 Command Implementation Checklist

Bij nieuwe command toevoegen:
- [ ] Realistic maar simplified output (80/20)
- [ ] Error handling met educatieve feedback
- [ ] Fuzzy matching voor typefouten
- [ ] Help tekst (Nederlands)
- [ ] Man page (Nederlands)
- [ ] Educatieve tip (bij security tools)
- [ ] Juridische warning (bij offensive tools)
- [ ] Mobile-friendly (max 40 chars breed)
- [ ] Getest op 3 devices

---

## ✅ MVP Release Criteria

**Functioneel:**
- [ ] 30+ commands werkend (commands-list.md)
- [ ] 3-tier help system
- [ ] Onboarding (welkomst + hints)
- [ ] Filesystem + reset

**Technisch:**
- [ ] < 3 sec load (4G)
- [ ] < 500KB bundle
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive

**Legal:**
- [ ] Multi-layer disclaimers
- [ ] Privacy Policy + ToS
- [ ] Cookie consent
- [ ] Alle UI Nederlands

---

## 🤖 Sessie Onderhoud Instructies

### Voor Elke Sessie
- Lees altijd PLANNING.md, TASKS.md, en dit bestand voordat je begint
- Check of framework bestanden zijn bijgewerkt sinds laatste sessie

### Tijdens Ontwikkeling
- Markeer voltooide taken in TASKS.md direct na afronding
- Voeg nieuw ontdekte taken toe aan TASKS.md zodra ze ontstaan
- Noteer architecturale beslissingen of patronen in dit bestand

### Voor het Afsluiten van Sessies
- Update dit bestand met sessie samenvatting wanneer gevraagd
- Markeer inconsistenties tussen framework bestanden
- Noteer geleerde lessen of ontdekte patronen

### Wanneer Requirements Veranderen
- Update bestanden in deze volgorde: `docs/prd.md` → `PLANNING.md` → `TASKS.md` → `CLAUDE.md`
- Verifieer altijd consistentie tussen alle vier bestanden voor je wijzigingen implementeert
- Vraag expliciete bevestiging voor je doorgaat bij conflicterende instructies

### Kwaliteitscontroles
- Als instructies tegenstrijdig lijken tussen bestanden, vraag om verduidelijking
- Stel framework updates voor wanneer je ontbrekende context opmerkt
- Prioriteer PLANNING.md voor technische beslissingen, TASKS.md voor huidige prioriteiten

---

## 🤖 Voor Claude Sessies

### Bij implementatie:
1. **Check PRD eerst:** Is het in MVP scope?
2. **80/20 output:** Niet te technisch, niet te simpel
3. **Educatieve laag:** Elke actie = leermoment
4. **Taal correct:** UI=NL, commands=EN, uitleg=NL
5. **Performance:** Elke KB telt (< 500KB budget)

### Bij vragen:
- **Scope unclear?** → Check PRD sectie X.Y
- **Tech decision?** → Vanilla first, motiveer als anders nodig
- **Taal twijfel?** → Zie tabel hierboven
- **Command spec?** → Check commands-list.md

### Common pitfalls:
❌ Frameworks suggeren → Vanilla only
❌ Te realistische output → 80/20 regel
❌ Engelse UI teksten → Nederlands target markt
❌ Feature scope creep → Focus MVP checklist

---

## 📚 Referenties

**Volledige details:** `docs/prd.md` (v1.1)
**Command specs:** `docs/commands-list.md`
**Filesystem structure:** PRD Bijlage B
**Tech rationale:** PRD §13 (Technische Randvoorwaarden)

---

---

## 📝 Sessie Samenvattingen

### Sessie 2: CSS Input Visibility Fix (14 oktober 2025)

**Doel:** Input veld zichtbaar maken na reset naar M0 state

**Probleem:**
Na terugdraaien naar initial project setup (commit `fef0dd3`) was het terminal input veld **volledig onzichtbaar** door:
1. `background: transparent` op zwarte achtergrond
2. `caret-color: transparent` (onzichtbare cursor)
3. Footer met `position: fixed` + `z-index: 10` lag over input veld heen
4. `body` had `overflow: hidden` (footer niet bereikbaar)

**Oplossing: 3 commits**

✅ **Commit 1: Input visibility** (`2b26515`)
- `background: transparent` → `background-color: #000000`
- `caret-color: transparent` → `caret-color: #00ff00`
- Added `border: 1px solid #00ff00` (groene border)
- Added `padding: 4px`
- Hardcoded colors (#00ff00) instead of CSS variables
- Placeholder color: `#00aa00` with `opacity: 0.8`

✅ **Commit 2: Footer overlap** (`28dad91`)
- Footer `position: fixed` → `position: static`
- Removed `z-index: var(--z-footer)`
- Added `margin-top: var(--spacing-lg)`
- Footer no longer covers input field

✅ **Commit 3: Scrollable layout** (`b749755`)
- Body: removed `height: 100%` + `overflow: hidden`
- Body: added `min-height: 100vh` + `display: flex` + `flex-direction: column`
- Terminal container: `height: 100vh` → `flex: 1`
- Added `width: 100%` to terminal container
- Footer now always visible and accessible

**Huidige staat:**
- ✅ Input veld **ZICHTBAAR** met groene border en cursor
- ✅ Prompt `user@hacksim:~$` zichtbaar
- ✅ Placeholder "Type 'help' om te beginnen..." zichtbaar
- ✅ Footer zichtbaar onderaan pagina
- ✅ Pagina scrollbaar (indien content groter dan viewport)
- ❌ **GEEN functionaliteit** - typen doet nog niets (geen JavaScript commands)

**Geleerde lessen:**

⚠️ **CSS Transparency Issues:**
1. **NOOIT `transparent` background** op terminal input in dark theme
2. **NOOIT `transparent` caret-color** - cursor moet altijd zichtbaar zijn
3. **TEST input visibility EERST** voordat je complexe JavaScript bouwt
4. **Gebruik borders** voor extra visibility (1px solid helpt debugging)

⚠️ **Layout Issues:**
1. **Fixed positioning** blokkeert input fields - gebruik `static` of `relative`
2. **Z-index conflicts** zijn moeilijk te debuggen - houd layers simpel
3. **overflow: hidden** op body voorkomt scrollen - gebruik flexbox layout
4. **Test footer visibility** - moet altijd bereikbaar zijn

🎯 **Best Practices:**
1. Hardcode colors tijdens debugging (#00ff00 werkt altijd)
2. Use borders voor visibility testing (1px solid green)
3. Flexbox layout: `body { display: flex; flex-direction: column; min-height: 100vh }`
4. Terminal container: `flex: 1` vult beschikbare ruimte

**Volgende stappen:**
Nu de UI zichtbaar is, kunnen we **simpele JavaScript** toevoegen om commands werkend te maken:
1. Enter key listener op input veld
2. Echo command in output area
3. Basic command parser (split by space)
4. 3-5 test commands (help, clear, echo)
5. **GEEN complexe Terminal Engine** - start ultra simpel

**Files gewijzigd:**
- `styles/terminal.css` - Input styling + custom cursor disabled
- `styles/main.css` - Body layout + footer positioning

**Voortgang:** M0 basis staat, klaar voor ultra-simpele JavaScript implementatie

---

**Last updated:** 14 oktober 2025
**Version:** 2.1 (with session 2 log)
