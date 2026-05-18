# Plan: Brevo Deliverability tuning (Sessie C)

## Status

✅ **AFGEROND in Sessie 135 (11-13 mei 2026).** 5 van 7 stappen behaald, 2 expliciet geparkeerd:
- A. DNS Audit ✅ (SPF gefixt, MailerLite-restanten weg, Google site-verification toegevoegd)
- B. Mail-tester ≥ 8/10 ✅ (welkomstmail 8.4 / sample-pentest 8.3)
- C. Gmail Postmaster Tools ✅ (registered + verified, data 24-48u pending → Sessie D)
- D. List-Unsubscribe headers ✅ (RFC 8058 bevestigd via mail-tester)
- E. Content audit ✅ (geen spam-trigger-woorden in beide templates)
- F. Custom tracking-subdomain 🟦 SKIP (tier-gated, Brevo Free/Starter geen toegang)
- G. Gmail classificatie re-test 🟦 SKIP aspirational (geblokkeerd door eigen-blocklist op transactional channel, plus-alias-workaround faalt door Brevo anti-evasion-normalisatie)

Volledig sessie-verslag: `docs/sessions/current.md` → Sessie 135.

Open items voor Sessie D (24-48u na 13 mei):
1. Postmaster Tools data review (reputation, spam-rate baseline-snapshot)
2. DMARC `p=none` → `p=quarantine` overweging na 2-4 weken groene stats
3. Brevo blocklist unblock-UI uitzoeken voor Track G re-attempt
4. Custom tracking-subdomain tier-business-case bij Brevo support-ticket of klantfeedback

---

## Oorspronkelijk plan (referentie)

Sessie 134 (5-11 mei 2026) heeft de drag-and-drop herbouw van beide welkomstmail-templates afgerond. Welkomstmail-template (hoofd) is 100% B4 groen. Sample-pentest-template is visueel en functioneel werkend, maar de mobile-PDF-prefetch-bug overleeft als tier-limitatie (geen click-tracking-toggle in Brevo Free/Starter).

Deze sessie focust op **deliverability** — DNS-authenticatie, mail-tester score, Gmail-classificatie, en optioneel een Brevo tracking-subdomain als side-fix voor de mobile-PDF-bug.

---

## Eerste stappen nieuwe sessie (cold-start checklist)

1. Lees dit bestand volledig
2. Verifieer dat Sessie 134-state nog klopt:
   ```bash
   git log --oneline -5
   curl -sI https://hacksimulator.nl/assets/samples/pentest-playbook-sample.pdf | grep -i content-disposition
   ```
   Verwacht: top commits onveranderd sinds 11 mei 2026; PDF heeft `content-disposition: attachment`
3. Vraag user (Heisenberg) of beide Brevo-automations nog Active zijn:
   - `Welcome message` (automation ID 1) → email-stap gekoppeld aan `welkomstmail-v2-DnD`
   - `Sample Pentest — welkomstflow` (automation ID 2) → email-stap gekoppeld aan `sample-pentest-welkomstmail-v2-DnD`
4. Verifieer DNS-state vanaf command-line (zie §DNS Audit hieronder)

---

## Context

Bron-plan `brevo-drag-and-drop-herbouw.md` regel 150 stelt expliciet: *"Geen Sessie C (deliverability — DNS, SPF/DKIM/DMARC, mail-tester) — pas na deze herbouw groen"*.

Strikt is Sessie B niet 100% groen (sample-pentest mobile-PDF open issue), maar:
- De open bug is tier-limitatie + Brevo's tracking-pipeline, geen deliverability-issue
- DNS/SPF/DKIM/DMARC-tuning verandert niets aan Brevo's `r.sendibm1.com`-redirect
- **Sessie C kan dus parallel doorgaan**

Wat we al weten uit Sessie 134-screenshots (Settings → Senders, Domains & Dedicated IPs):
- Sender: `HackSimulator <contact@hacksimulator.nl>` → **Verified**
- IP: **Shared IP** (Free/Starter-tier; Dedicated IP niet beschikbaar)
- DKIM signature: `hacksimulator.nl` ✓ **green**
- DMARC: ✓ **is configured** (waarde onbekend — kan `p=none`, `p=quarantine`, of `p=reject` zijn)
- Account-tier: Free/Starter (geconfirmeerd door afwezigheid van Localization/Custom objects/Data feeds = Premium-gated)

DNS-host: TransIP (per Sessie 126).

---

## Sessie C scope

### A. DNS Audit (verplicht)

Verifieer dat alle drie de email-auth records correct staan ingericht in TransIP-DNS voor `hacksimulator.nl`:

```bash
# SPF — moet include:spf.brevo.com bevatten
dig TXT hacksimulator.nl +short

# DKIM — Brevo-selector, exacte naam te vinden in Brevo dashboard
dig TXT mail._domainkey.hacksimulator.nl +short
# of de specifieke selector die Brevo aangeeft

# DMARC — policy + reporting addresses
dig TXT _dmarc.hacksimulator.nl +short
```

Verifieer dezelfde gegevens via **MXToolbox** (`mxtoolbox.com/SuperTool.aspx`) — niet-cached, autoritatief.

**Doel:**
- SPF: één enkel `v=spf1` record met `include:spf.brevo.com -all` (of `~all`)
- DKIM: één geldige public key entry op de juiste selector
- DMARC: minimaal `v=DMARC1; p=quarantine; rua=mailto:dmarc@hacksimulator.nl` (of `p=reject` als ambitie)

### B. Mail-tester score (verplicht)

1. Ga naar `mail-tester.com`, kopieer het unieke test-adres
2. Verzend een testmail vanaf Brevo (gebruik "Send test" in de campaign-builder met de welkomstmail-template)
3. Klik op de score-link → krijg een rapport 0-10 met diagnose
4. **Doel: ≥ 8/10** voor beide templates (welkomstmail-v2-DnD + sample-pentest-v2-DnD)
5. Documenteer alle red flags (specifieke spam-triggers, header-issues, content-flags) en fix per item

Veelvoorkomende mail-tester-warnings + fixes:
- `Authentication-Results: spf=fail` → SPF record fix
- `DKIM signature missing` → DKIM record verifiëren
- `List-Unsubscribe header missing` → Brevo settings check
- `Image-to-text ratio too high` → minder images of meer tekst
- `Spam trigger words` → tekst aanpassen (woorden zoals "gratis", "klik nu", etc.)

### C. Gmail Postmaster Tools (verplicht)

1. Ga naar `postmaster.google.com`
2. Registreer `hacksimulator.nl` als sender-domain
3. Verifieer eigendom via TXT-record in TransIP-DNS
4. Wacht 24-48u op data-collectie, daarna check:
   - **Spam rate** dashboard
   - **Domain reputation**
   - **IP reputation** (mogelijk leeg op Shared IP — Brevo IP gedeeld met andere senders)
   - **Authentication** stats (SPF/DKIM/DMARC pass-percentages)

### D. List-Unsubscribe headers (verplicht)

Verzend testmail → bekijk in Gmail-web → "Show original" → check raw headers voor:
```
List-Unsubscribe: <mailto:unsubscribe@...>, <https://...>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

Beide regels moeten aanwezig zijn voor Gmail's "Easy unsubscribe" feature. Brevo zou dit automatisch moeten injecteren bij DnD-templates met `Unsubscribe link (global)` placeholder, maar verifiëren.

### E. Content audit (verplicht)

Per template een handmatige spam-trigger-scan:
- Welkomstmail (hoofd): geen issues verwacht — terminal-aesthetic, geen marketing-jargon
- Sample-pentest: check op pay-what-you-want-zin ("pay-what-you-want vanaf €5") — "gratis" + "betalen" combinatie kan flag triggeren

### F. Optioneel: custom tracking-subdomain (Pro/Business-tier check)

Brevo biedt in betaalde tiers de mogelijkheid om de standaard `r.sendibm1.com`-redirects te vervangen door een eigen subdomain (bijv. `r.hacksimulator.nl`). Dit:
- Verbetert deliverability (eigen domain = eigen reputation)
- Kan side-effect-fix zijn voor mobile-PDF-prefetch-bug (Gmail prefetch behandelt eigen domains soms anders)
- Vereist DNS-CNAME-config in TransIP

**Eerst checken**: in welke Brevo-tier is deze feature beschikbaar? Documenteer kosten vs. verwachte impact.

### G. Re-test in Gmail

Na alle fixes uit A-E:
1. Verzend testmails naar `jan.willem.wubkes@gmail.com`
2. Check Gmail-classificatie:
   - Welkomstmail → blijft Promotions (verwacht, acceptabel)
   - Sample-pentest → hopelijk Primary (was lead-magnet B4-criterium)
3. Mail-tester opnieuw → score moet ≥ 8 zijn

---

## Wat NIET in scope

- Mobile-PDF-prefetch-bug oplossen als hoofddoel (apart traject: Brevo support-ticket of tier-upgrade)
- Content-wijzigingen aan templates (geen visuele edits — alleen tekst-tweaks als content-audit het vereist)
- Nieuwe automations of forms aanmaken
- Migratie naar andere mail-platform
- Brevo Transactional API switch (Plan-Plan-C uit bron-plan)

---

## Cruciale "niet doen"

⚠️ **NIET** SPF-records mergen — moet ÉÉN `v=spf1` record blijven (meerdere TXT met `v=spf1` = automatic fail).

⚠️ **NIET** DMARC direct op `p=reject` zetten zonder eerst monitoring (`p=none` + RUA reports) — kan legitieme mails doen bouncen.

⚠️ **NIET** DKIM-selector wijzigen zonder eerst Brevo-dashboard te raadplegen voor de juiste selector-naam.

⚠️ **NIET** tracking-subdomain configureren zonder eerst tier-eligibility te verifiëren — DNS-CNAME zonder Brevo-activatie levert dead-end op.

---

## Success-criteria

Sessie C compleet als:

1. SPF + DKIM + DMARC alle drie ✓ green op MXToolbox
2. Mail-tester score ≥ 8/10 voor beide templates (welkomstmail + sample-pentest)
3. Gmail Postmaster Tools geregistreerd + verificatie voltooid (data komt later)
4. List-Unsubscribe + List-Unsubscribe-Post headers aanwezig in alle Brevo-mails
5. Geen content-spam-triggers in beide templates
6. **Aspirational**: sample-pentest welkomstmail landt in Gmail **Primary** tab
7. Documentatie in CLAUDE.md: deliverability-baseline (DNS-records, scores, screenshots)

---

## Communicatie-stijl

- User heet **Heisenberg** (per CLAUDE.md sessie-protocol)
- Wees **meedogenloos eerlijk** — geen jaknikker-gedrag
- DNS-werk vereist precisie: dubbelcheck via twee bronnen (dig + MXToolbox) voordat je een record als "✓" markeert
- Bij elke DNS-edit in TransIP: **screenshot vragen** vóór save om typos te catchen
- Vermijd 6+ bericht-rondes — geef per stap genoeg context dat Heisenberg kan handelen zonder doorvragen

---

## Open-issue handling

De mobile-PDF-bug uit Sessie 134 is **niet primair doel** maar wel **side-track**:

- Als custom tracking-subdomain in jouw tier beschikbaar blijkt: configuratie kan parallel met SPF/DKIM-werk meelopen
- Als Brevo support-ticket-route gekozen: documenteer waarom (tier-limitatie + 5-10% impact) in de ticket-tekst
- Anders: parkeer voor later, geen tijd verspillen in deze sessie

---

## Referenties

- Bron-plan Sessie B: `.claude/plans/brevo-drag-and-drop-herbouw.md`
- Sessie 134 outcome: `docs/sessions/current.md` (sectie "Sessie 134: Brevo Drag-and-Drop Herbouw")
- Brevo-tier-limitaties (memory): `~/.claude/projects/-home-willem-projecten-hacksimulator/memory/reference_brevo_tracking_tier.md`
- TransIP DNS-management: `https://www.transip.nl/cp/domain/hacksimulator.nl/dns/`
- Brevo dashboard: `https://app.brevo.com/`
- DNS-tools: `https://mxtoolbox.com/SuperTool.aspx`, `https://mail-tester.com/`, `https://postmaster.google.com/`
