# Beta Testing Protocol — M6 Tutorial System

**Doel:** Valideer 3 tutorial-scenarios (recon, webvuln, privesc) met ≥3 onafhankelijke testers in een gestructureerde walkthrough en verzamel feedback over completion-rate, hint-gebruik en UX-blockers.

**Status:** Protocol gedocumenteerd Sessie 156 (9 jun 2026). Werkelijke executie = Heisenberg-out-of-Claude actie.

---

## 1. Rekruteringsbronnen

| Bron | Doelgroep | Notitie |
|------|-----------|---------|
| Reddit r/NetSec NL of r/Nederlands | Security-geïnteresseerde Nederlanders | Post met directe link + tijdsinvestering ~30 min |
| LinkedIn (security professionals NL netwerk) | Junior pentesters, SOC-analisten | Direct message naar 2e-graads contacten |
| X / Bluesky (cybersec NL community) | Ethical hackers, infosec hobbyisten | Vraag retweets via NL infosec community accounts |
| Lokale CTF-groepen of pentest-meetups | Studenten, junior practitioners | Persoonlijke uitnodiging via meetup-organisator |

**Doel-mix:** minimaal 1 beginnerssegment (geen security-achtergrond) + 1 gemiddeld segment (junior) + 1 gevorderd segment (senior pentester voor UX-feedback). Voorkomt mono-perspectief.

---

## 2. Walkthrough script per scenario (~30 min totaal)

### Pre-test (5 min)
- Tester ontvangt link `https://hacksimulator.nl/terminal.html` + briefcontext (geen spoilers van scenario-inhoud)
- Browser: bij voorkeur desktop + secundair mobile observatie
- Communicatie: think-aloud-protocol (tester verbaliseert wat hij/zij doet)

### Scenario 1 — Recon (10 min)
- Tester typt `tutorial` → toont scenario-lijst
- Tester typt `tutorial recon` → start reconnaissance
- Per step observeren:
  - **Typt tester correct commando?** (`ping`, `nmap`, `whois`, `traceroute`)
  - **Vraagt hint?** Aantal `hint`-aanvragen per step
  - **Long-press gesture op mobile?** (Sessie 156 nieuwe feature) — werkt het?
- Noteer: completion-status (✓/✗), aantal hint-aanvragen, struikel-stappen

### Scenario 2 — Web vulnerabilities (10 min)
- Tester typt `tutorial webvuln`
- Steps: `nmap`, `nikto`, `sqlmap`, `hashcat`
- Observeer: hoe reageert tester op offensive-tool warnings (`[!]` consent-prompts)?
- Noteer: completion + UX-blockers + bezwaren tegen `j/n`-confirmaties

### Scenario 3 — Privesc (10 min)
- Tester typt `tutorial privesc`
- Steps: `cat /etc/passwd`, `ls -la /home`, `cat /var/log/auth.log`, `cat ~/.bash_history`
- Observeer: VFS-interactie (gebruikt `cd` of full paths?)
- Noteer: completion + Linux-context-begrip

---

## 3. Feedback-form

**Optie A (aanbevolen):** bestaande `src/ui/contact-form.js` met dedicated `subject="tutorial-beta-feedback"` parameter — submitt naar `contact@hacksimulator.nl` Gmail forwarding.

**Optie B:** Google Form met 5 vragen:
1. Ease-of-use 1-5 per scenario
2. Completion-tijd per scenario (minuten)
3. Belangrijkste struikel-step (open tekst)
4. Suggestie voor verbetering (open tekst)
5. Retentie-bereidheid: zou je terugkomen voor follow-up tutorial? (ja/nee/misschien)

**Aanbevolen:** Optie B in vroege beta-fase (snel, geen development-overhead), Optie A bij Phase 2 als tutorials inhoudelijk stabiel zijn.

---

## 4. Success-criteria

| Metric | Threshold | Bron |
|--------|-----------|------|
| Completion-rate per scenario | ≥40% | TASKS.md M6 success criteria regel 780 |
| `tutorial_completed` analytics-event vuurde | 100% bij tester-self-report-completion | Plausible / GA4 dashboard |
| Critical UX-blockers | 0 (steps waar >50% testers stuck) | Beta-test log analyse |
| Hint-aanvragen-mediaan per step | ≤2 | hint.js tier-1 = 2 attempts threshold |
| Long-press gesture werkt cross-device | iOS + Android beide functioneel | Sessie 156 gesture-implementatie |

**Niet-criteria** (bewuste keuze):
- Geen NPS/satisfaction-score — te subjectief in early-beta
- Geen retention-meting op product-level (alleen tutorial-level bereidheid)

---

## 5. Retentie-meting (7-dag follow-up)

- Brevo email-template `"Hoe ging je vervolgleren?"` (NL, "je"-vorm consistent met tone-of-voice)
- 3-vragen survey:
  1. Welk scenario heb je herhaald of welke vervolgactie ondernomen?
  2. Wat is je belangrijkste blokker (geen vervolg ondernomen)?
  3. Welke follow-up-content zou je willen zien?
- Resultaat geannoteerd in Brevo automation-list `tutorial-beta-followup` voor segmentatie
- Trigger: 7 dagen na initial beta-test (via Brevo scheduled email)

---

## 6. Closure-criteria voor TASKS.md regel 928 reopening

Beta protocol is **gedocumenteerd-gesloten** Sessie 156. Heropening van TASKS.md regel 928 als follow-up-task vereist:

1. **≥3 onafhankelijke testers** met afgeronde walkthrough (niet alleen tester #1 = Heisenberg zelf)
2. **≥2 voltooide scenarios per tester** (1 scenario = onvoldoende data-density)
3. **Critical UX-blockers** geïdentificeerd → gefixt OR gedocumenteerd in Phase 2+ backlog met estimate
4. **Tutorial_completed analytics-event** data-bevestigd via Plausible/GA4

Bij heropening: voeg toe in `TASKS.md` M6 of als M6+ post-MVP-feature, niet als M6-closure-blocker. M6 milestone-percentage blijft 100% (closure-via-protocol-doc is final outcome voor Sessie 156).

---

## 7. Heisenberg-out-of-Claude executie-checklist

Wanneer Heisenberg ≥3 testers heeft geworven:

- [ ] Tester #1 walkthrough + feedback (~30 min)
- [ ] Tester #2 walkthrough + feedback (~30 min)
- [ ] Tester #3 walkthrough + feedback (~30 min)
- [ ] Aggregeren completion-rates per scenario
- [ ] Identificeer critical UX-blockers (>50% testers stuck)
- [ ] 7-dag retention-email via Brevo
- [ ] Beslissing: TASKS.md heropenen ja/nee + rationale documenteren
- [ ] Eventueel follow-up sessie voor UX-blockers-fixes

---

**Document-versie:** 1.0 (Sessie 156, 9 jun 2026)
**Wijziging-log:** Initial creation Sessie 156 als M6 task-closure-protocol per Heisenberg Q2 expert-decision "Documenteer protocol + close (Recommended)".
