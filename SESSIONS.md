# HackSimulator.nl - Development Sessions

**Doel:** Development session logs voor tracking progress, architectural decisions, en lessons learned.

**Structure:** Split into archives for better performance and maintainability (Sessie 87 - 16 december 2025)

---

## 📂 Session Archives

### [Current Sessions (82-84)](docs/sessions/CURRENT.md) - Full Detail
**Sessies:** 84, 83, 82
**Period:** 10-15 december 2025
**Topics:**
- Doelgroep repositioning (age-restrictive → skill-based)
- Mobile minimalist rendering & ASCII alignment fixes
- Responsive optimization

---

### [Recent Sessions (78-81)](docs/sessions/RECENT.md) - Full Detail
**Sessies:** 81, 79, 78
**Period:** 7-9 december 2025
**Topics:**
- Android ASCII box rendering fixes
- Responsive ASCII boxes & mobile layout
- Cache strategy optimization (1 year → 1 hour)

**Note:** Sessie 80 merged into Sessie 79 (laptop crash recovery)

---

### [Archive Q4 2024 (51-76)](docs/sessions/ARCHIVE-Q4-2024.md) - Compressed
**Sessies:** 74, 66, 59, 58, 56, 55, 54, 53, 52, 51... (compressed format)
**Period:** 18 november - 6 december 2025
**Topics:**
- PayPal donate configuration
- Mobile optimization (P0+P1 fixes)
- Hybrid color scheme (HTB neon prompt)
- Navbar & button styling overhauls
- WCAG AA compliance improvements
- Semantic HTML patterns

**Note:** Some sessions (60-73, 75-76) compressed into related sessions for brevity

---

### [Archive Q3 2024 (35-50)](docs/sessions/ARCHIVE-Q3-2024.md) - Early Foundations
**Sessies:** 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35
**Period:** 5-17 november 2025
**Topics:**
- Blog CTA UX overhaul
- Button hierarchy patterns
- Dark Frame Pattern establishment
- Dropdown perfectie (border reserve pattern)
- Command discovery modal UX
- Modal blur/overlay optimizations
- Architectural patterns foundations

---

### [Archive Early Sessions (2-34)](docs/sessions/ARCHIVE-EARLY.md) - Historical Record
**Sessies:** 34, 33, 32, 31... down to Sessie 2
**Period:** 14 oktober - 5 november 2025
**Topics:**
- Tab autocomplete & Ctrl+R history search
- Modal system 3-layer architecture
- Cache busting strategies
- Event delegation patterns
- Terminal core implementation
- Virtual filesystem setup
- Early MVP development

**Note:** First 34 sessions establish core architecture and foundational patterns

---

## 📊 Session Overview

**Total Sessions:** 84 (as of 15 december 2025)
**Current Session:** 87 (Codebase cleanup)
**Sessions with full documentation:** 78-84 (7 sessions)
**Sessions compressed:** 2-77 (various compression levels)

**Structure rationale:**
- **Last 7 sessions:** Full detail for context & recent learnings
- **Sessions 51-77:** Compressed to key insights & architectural patterns
- **Sessions 35-50:** Foundation period - architectural decisions documented
- **Sessions 2-34:** Historical archive - core MVP development

---

## 🔄 Maintenance Protocol

**Quarterly (every ~20 sessions):**
1. Move oldest "CURRENT" sessions (82-84) → RECENT
2. Compress oldest "RECENT" sessions (78-81) → relevant archive
3. Keep CURRENT.md lean (max 5 sessions full detail)

**After each session:**
1. Add session summary to CURRENT.md (full detail)
2. Update "Total Sessions" count in this navigation file
3. Every 5 sessions: Review compression of sessions 20+ old

**Next rotation:** Sessie 90 (estimated late december 2025)

---

## 📚 Quick Reference

**Looking for specific patterns?** Use these guides:
- **Architectural Patterns:** See CURRENT.md §Architectural Patterns section (rotates every 5 sessions)
- **Common Issues:** See PLANNING.md §Troubleshooting
- **Recent Learnings:** See .claude/CLAUDE.md §Recent Critical Learnings (last 5 sessions)

**For historical architectural decisions:**
- Dark Frame Pattern → Archive Q3 2024, Sessie 44
- 3-Layer Modal System → Archive Early, Sessie 33
- Cache Busting Strategy → RECENT.md, Sessie 78
- Mobile Responsive Patterns → CURRENT.md, Sessies 81-83

---

**Last updated:** 16 december 2025 (Sessie 87 - Codebase Cleanup)
**Next update:** Sessie 88 or when CURRENT sessions exceed 5

**File structure established:** Sessie 87 (612KB monolith → 5 modular files for performance)
