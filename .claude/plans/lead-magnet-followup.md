# Plan: Lead Magnet Follow-up — Meetcriteria-snapshot + Mobile-PDF Support-ticket

## Status

**Cold start hier in nieuwe sessie.** Plan B (`monetization-B-lead-magnet.md`) is technisch COMPLETE (alle 8 Definition of Done-items). Sessie 136 (18 mei 2026) voltooide Track G (Gmail-classificatie sample-pentest → Primary tab). Twee resterende open items uit het lead-magnet-werk:

1. **4-weken-meetcriteria niet gevalideerd** (Plan B §129-133): ≥20 sample downloads/week, ≥10% klik-door van welkomstmail naar Gumroad, ≥1 Gumroad sale toegeschreven aan sample-flow
2. **Mobile-PDF-prefetch-bug** (Sessie 134, `docs/sessions/current.md` regel 302-305): 5-10% mobile-users 404 op PDF-knop door Brevo tracking-token-prefetch-consumption — tier-gated mitigation-paden

Deze sessie focust op: **meet-validatie eerst, dán bug-mitigation** (Track A → Track B in die volgorde — zie cruciale "niet doen" hieronder).

---

## Eerste stappen nieuwe sessie (cold-start checklist)

1. Lees dit bestand volledig
2. Verifieer post-Sessie-136-state:
   ```bash
   git log --oneline -5
   ```
   Verwacht: top-commits bevatten Sessie 136-werk (`4002c86 docs(sessions): Sessie 136 — Brevo deliverability Sessie D + Track G voltooid` of recenter)
3. Bevestig met Heisenberg:
   - Heeft hij actieve toegang tot GA4-dashboard?
   - Heeft hij actieve toegang tot Brevo-dashboard (sample-pentest automation specifiek)?
   - Heeft hij actieve toegang tot Gumroad sales-dashboard?
   - Heeft hij ooit een Brevo support-ticket gestuurd? Zo nee: Brevo Help-portal-route uitzoeken bij Track B

---

## Context (post-Sessie 136 recap)

- **Plan B (lead magnet):** 8/8 Definition of Done-items afgerond, technisch volledig live sinds Sessie 133 (26 april 2026)
- **Sessie 134 (5-11 mei):** Welkomstmail + sample-pentest welkomstmail herbouwd in Brevo Drag-and-Drop editor. Welkomstmail 100% groen; sample-pentest mobile-PDF-bug onopgelost (tier-limitatie)
- **Sessie 135 (11-13 mei):** Deliverability tuning — DNS-cleanup (SPF MailerLite-restanten weg, `include:spf.brevo.com` toegevoegd, 4-maand silent softfail beëindigd), mail-tester 8.4/8.3, Postmaster verified
- **Sessie 136 (18 mei):** Track G voltooid — sample-pentest welkomstmail in Gmail Primary-tab (aspirational behaald). Brevo unblock-UI Route A vastgelegd in memory `reference_brevo_blocklist.md` met nieuw mental model "per-sender approval ≠ binaire blocklist"
- **Open issue 1 — 4-weken-meetcriteria:** Plan B §Meetcriteria, niet door Claude meetbaar (vereist Heisenberg's dashboard-toegang tot GA4 + Brevo + Gumroad). Sample-pentest landing live sinds 26 april = ruim 4 weken voor datum-cutoff 20 mei 2026
- **Open issue 2 — Mobile-PDF-prefetch-bug:** Sessie 134-log regel 302-305 + 233-234. Root cause Brevo's `r.sendibm1.com/?u=...&i=<token>` redirect: Gmail-mobile prefetcht alle links → token-consumed pre-user-click → 404. Memory `reference_brevo_tracking_tier.md`: Free/Starter heeft GEEN per-link click-tracking-toggle. Mitigation-paden: Brevo support-ticket / tier-upgrade / custom tracking-subdomain

---

## Sessie scope

### Track A — Meetcriteria-snapshot (analytics review)

**Doel:** valideren of Plan B §Meetcriteria (4 weken post-launch) gehaald wordt en Plan B-status definitief vaststellen.

**Drie data-bronnen, sequentieel:**

#### A1. GA4 events (https://analytics.google.com/)
- Login → property `hacksimulator.nl` → Reports → Engagement → Events
- Filter periode: 26 april - 20 mei 2026 (~4 weken sinds Plan B Sessie 133 launch)
- Twee events tellen:
  - **`lead_magnet_signup`** — totaal events + per `location` parameter (`sample_pentest`)
  - **`lead_magnet_cta_click`** — totaal events + per `location` parameter (`nmap-blog-top`, `cybersec-tools-mid`, `gidsen-secondary`)
- Bereken: signups/week (totaal / 4)
- Screenshot exports: `.playwright-mcp/ga4-lead-magnet-events.png`

#### A2. Brevo automation-stats (https://app.brevo.com/)
- Automations → "Sample Pentest" → Stats-tab (of analytics-view)
- Metrics noteren:
  - Contacts entered (= aantal sample-form-submits laatste 4 weken)
  - Welkomstmail open-rate
  - Welkomstmail click-rate (click op welke knop?)
  - Specifiek: click-rate op "Download Sample (PDF)" link vs "Bekijk Volledig Playbook" Gumroad-CTA
- Belangrijk: na Sessie 136 Primary-classificatie zou open-rate hoger moeten zijn dan pre-Sessie-135 baseline — als Heisenberg historische data heeft: vergelijken
- Screenshot: `.playwright-mcp/brevo-sample-automation-stats.png`

#### A3. Gumroad sales (https://app.gumroad.com/dashboard)
- Login → Sales-tab → filter laatste 4 weken
- Per sale openen: bekijk source / referrer / UTM-params
- Tel: sales met referrer-trail die naar sample-pentest welkomstmail-link wijst (Gumroad `wmvpx` product = volledig Pentest Playbook)
- Screenshot: `.playwright-mcp/gumroad-sales-4weken.png`

#### A4. Beslis-tree (resultaat per criterium)

| Plan B-criterium | Gemeten waarde | Status |
|------------------|----------------|--------|
| ≥20 sample downloads/week | (uit A1 of A2) | ✅ / ⚠️ / ❌ |
| ≥10% klik-door welkomstmail → Gumroad | (uit A2) | ✅ / ⚠️ / ❌ |
| ≥1 Gumroad sale via sample-flow | (uit A3) | ✅ / ⚠️ / ❌ |

**Drie scenarios:**

- **Alle 3 behaald:** Plan B officieel "production-validated" → markeer in plan-file + CLAUDE.md learning + overwogen Plan C of D als next
- **1-2 behaald:** identificeer leak (geen signups? lage CTR? geen Gumroad-conversie?) → mini-plan voor verbetering in Sessie 138
- **0 behaald:** diepere review — tracking-pipeline-werk? CTA-placement? mail-content-onderzoek? Mogelijk Plan B-revisie vereist

### Track B — Mobile-PDF Brevo support-ticket (alleen als Track A's click-rate ≥10%)

**Doel:** Brevo-support inschieten voor per-link click-tracking-uitschakeling op PDF-button in sample-pentest welkomstmail.

**Voorwaarde (cruciale "niet doen" hieronder):** alleen uitvoeren als Track A toont dat de welkomstmail materieel geklikt wordt (≥10% CTR op de PDF-link). Bij lage CTR is de bug irrelevant en kost de support-tijd niets op.

**Ticket-tekst voorbereiden:**

```
Subject: Request to disable click-tracking for a specific link in transactional welcome email

Account: HackSimulator (Free/Starter tier)
Domain: hacksimulator.nl
Automation: "Sample Pentest" (form-submitted trigger)
Template: sample-pentest-welkomstmail-v2-DnD

Issue:
The welcome email contains a Button-block linking to a static-hosted PDF
download. Brevo wraps this link via the click-tracking redirect
(r.sendibm1.com/?u=<target>&i=<unique-token>). When Gmail mobile clients
fetch the email, the security pre-scanner consumes the unique tracking
token. The actual end-user click then receives a 404 because the token
has already been "spent".

Impact: estimated 5-10% of mobile recipients experience a 404 on the PDF
download button. Click-tracking provides no value for this specific link
because the destination is a static asset, not a campaign URL.

Request:
Please disable click-tracking for the "Download Sample (PDF)" link in
this specific template, OR provide a way to do this via the UI for our
account tier. Alternatively: please confirm that this is only available
on Pro/Business tier so I can make an upgrade-vs-acceptance decision.

Additional context:
- The Drag-and-Drop editor does not expose a per-link click-tracking
  toggle in Button-block settings, Title/Text-block link-edit-paneel,
  Additional Settings of the automation email-step, or globally in
  Settings → SMTP & API / Senders & Domains
- DNS state is clean (SPF, DKIM dual, DMARC p=none all verified)
- Mail-tester score 8.3/10 for this template
- Postmaster Tools verified

Thank you.
```

**Stappen:**

1. Open Brevo Help-portal — meest betrouwbaar via Brevo-dashboard rechtsboven → `?` of "Help" icoon → "Contact support" (verifieer route in sessie)
2. Login + categorie kiezen (Technical / Feature request)
3. Paste ticket-tekst, attach 1-2 screenshots (automation-edit-paneel ZONDER toggle, en Drag-and-Drop Button-block-settings ZONDER toggle)
4. Verzenden
5. Note ticket-ID + acknowledgement-bevestiging in Sessie 137-log

**Verwachte response-tijd:** dagen-tot-weken (Brevo Free-tier support is geen 24u-SLA). Status na Track B = "awaiting Brevo response" — follow-up in Sessie 138+ zodra response binnen.

### Track C — Optioneel: Plan B closure-formaliteit (als Track A positief)

Als Track A alle 3 metrics groen:
1. Update `monetization-B-lead-magnet.md` met regel onderaan: `**Production-validated:** 20 mei 2026 (Sessie 137) — alle 3 meetcriteria behaald, zie sessie-log`
2. CLAUDE.md learning toevoegen onder Sessie 137-entry over wat de validatie precies opleverde

---

## Wat NIET in scope

- Plan C (content-seo) of Plan D (bundle-social-proof) starten — wacht op Plan B-validatie
- Code-wijzigingen aan tracking-pipeline of CTA-placements — eerst meten, dán pas eventueel verbeteren
- Brevo tier-upgrade definitieve beslissing — alleen analyse, geen aankoop (vereist aparte cost-vs-impact-sessie met concrete prijspunt + ROI)
- DMARC `p=quarantine`-promotion — Sessie 136 deferred tot Postmaster Authentication-data zichtbaar (~juni)
- Postmaster Tools re-check — afzonderlijke task in latere sessie, niet vermengen met dit lead-magnet-werk

---

## Cruciale "niet doen"

⚠️ **NIET Brevo-support-ticket inschieten vóór GA4-data uit Track A1.** Als blijkt dat de welkomstmail nooit geklikt wordt (open-rate <10% of CTR <5%), is de PDF-bug economisch irrelevant en is de support-tijd-investering verspild. Eerst meten, dán beslissen.

⚠️ **NIET Gumroad-sales-data interpreteren als enige bewijs voor lead-magnet success** — referrer-attribution in Gumroad kan onbetrouwbaar zijn (UTM-stripping in checkout, cookie-bypass bij mobile-switch). Combineer altijd met GA4 + Brevo data voor robuust beeld.

⚠️ **NIET Plan B "afsluiten" zonder de meetcriteria-bevinding in CLAUDE.md learnings te zetten** — anders verlies je de business-validatie-context in toekomstige sessies; "Plan B is groen" is een claim die moet kunnen worden teruggevonden bij Plan C/D-keuze.

⚠️ **NIET ticket-tekst aanpassen tijdens type-werk** zonder kopie buiten Brevo-UI te bewaren — Brevo Help-portal heeft geen auto-save, bij sessie-timeout ben je je werk kwijt. Schrijf ticket-tekst eerst lokaal of in een tekst-editor.

---

## Communicatie-stijl

- User heet **Heisenberg**
- Wees **meedogenloos eerlijk** — als meetcriteria niet gehaald: zeg het direct, niet wegmasseren of relativeren
- Bij data-discrepantie tussen GA4 en Brevo (bv. GA4 toont 15 signups, Brevo toont 12 contacts entered): documenteer beide cijfers + mogelijke verklaringen (tracking-loss, consent-block, etc.), kies niet één bron als "waarheid"
- Bij Gumroad-attribution-ambiguïteit: noteer "X sales waarvan Y waarschijnlijk sample-pentest-attributable" met je redenering

---

## Referenties

- Plan B bron: `.claude/plans/monetization-B-lead-magnet.md` (§ Meetcriteria regel 129-133)
- Sessie 134 mobile-PDF-bug detail: `docs/sessions/current.md` regel 302-305 + 233-234 (oorzaak + impact + waarom alleen PDF-link)
- Sessie 136 outcome: `docs/sessions/current.md` (top-entry, Track G + Brevo unblock-UI)
- Memory: `reference_brevo_tracking_tier.md` (tier-limitatie context)
- Memory: `reference_brevo_blocklist.md` (Sessie 136 architecturaal inzicht)
- Memory: `feedback_validate_tooling_assumptions.md` (30-sec UI-check pattern — relevant bij Brevo Help-portal-discovery)
- Dashboards:
  - GA4: `https://analytics.google.com/`
  - Brevo: `https://app.brevo.com/`
  - Gumroad: `https://app.gumroad.com/dashboard`
  - Brevo Help-portal: route uitzoeken via dashboard rechtsboven `?` of "Help"

---

## Success-criteria

Sessie compleet als:

1. **Track A:** alle 3 metrics gemeten + Sessie-log-entry met conclusie per criterium (behaald / niet behaald / nog niet genoeg data)
2. **Track B:** ofwel ticket verstuurd met ticket-ID + acknowledgement in log, OFWEL expliciet besloten "niet sturen" met rationale uit Track A
3. **Plan B-status:** duidelijk geformuleerd als production-validated / verbeter-plan-nodig / no-go-on-mobile-bug
4. Geen open vragen voor de volgende sessie; sluit af met `/summary`
