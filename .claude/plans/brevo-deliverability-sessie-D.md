# Plan: Brevo Deliverability Sessie D — Postmaster Data Review + Track G Re-attempt

## Status

**Cold start hier in nieuwe sessie.** Sessie 135 (11-13 mei 2026) heeft de Brevo deliverability-baseline gelegd: SPF-cleanup compleet (MailerLite-restanten weg, `include:spf.brevo.com` toegevoegd, 4-maanden silent softfail beëindigd), Postmaster Tools geregistreerd + verified, mail-tester baseline 8.4 (welkomstmail-v2-DnD) + 8.3 (sample-pentest-welkomstmail-v2-DnD). 5 van 7 stappen ✅, 2 geparkeerd.

Deze sessie focust op **post-baseline-werk**: Postmaster reputation-snapshot, eventuele DMARC-policy-bump, Track G re-attempt na blocklist-resolve.

---

## Eerste stappen nieuwe sessie (cold-start checklist)

1. Lees dit bestand volledig
2. Verifieer dat Sessie 135-state nog klopt:
   ```bash
   git log --oneline -5
   dig @8.8.8.8 TXT hacksimulator.nl +short
   dig @8.8.8.8 TXT _dmarc.hacksimulator.nl +short
   ```
   Verwacht:
   - Top commit `f278dbd docs(sessions): Sessie 135 — Brevo deliverability tuning afgerond`
   - SPF bevat `include:spf.brevo.com`, geen `_spf.mlsend.com`
   - DMARC `p=none`
3. Vraag Heisenberg:
   - Is Postmaster Tools dashboard data binnengekomen? (data komt 24-48u na verify; verify was op 11 mei avond → data zou vanaf 13-14 mei beschikbaar moeten zijn)
   - Is de Brevo blocklist-unblock-UI inmiddels uitgezocht voor `jan.willem.wubkes@gmail.com` op transactional channel?

---

## Context (Sessie 135-recap voor cold-start)

Belangrijkste outcomes uit Sessie 135 (volledig in `docs/sessions/current.md`):

**DNS-state (geverifieerd via 3 resolvers):**
- SPF: `v=spf1 a mx include:_spf.transip.email include:spf.brevo.com ~all`
- DKIM: `brevo._domainkey` + `brevo2._domainkey` CNAMEs, dual-RSA, valid
- DMARC: `v=DMARC1; p=none; rua=mailto:contact@hacksimulator.nl`
- Google site-verification TXT actief
- MailerLite-restanten compleet weg (SPF-include + apex TXT + `litesrv._domainkey` CNAME)

**Mail-tester scores:**
- Welkomstmail-v2-DnD: 8.4/10
- Sample-pentest-welkomstmail-v2-DnD: 8.3/10
- Niet-fixable verliezen (tier-gated): `HEADER_FROM_DIFFERENT_DOMAINS -0.25` + tracking pixel alt `-0.5` + Hostkarma blacklist `-1.0`. Effectieve ceiling op Free/Starter: ~8.4-8.5.

**Track G-blocker (Sessie 135):**
- `jan.willem.wubkes@gmail.com` staat op Brevo transactional-channel-blocklist (reason: `blocked : due to unsubscribed user`)
- Root cause: vermoedelijk Unsubscribe-link-klik tijdens Sessie 133/134 template-validatie
- Plus-alias workaround (`+suffix@gmail.com`) faalt door Brevo anti-evasion-normalisatie
- Unblock-UI verstopt achter Brevo's dual-channel-model (zie `~/.claude/projects/-home-willem-projecten-hacksimulator/memory/reference_brevo_blocklist.md`)

---

## Sessie D scope

### Hoofdtaak 1: Postmaster Tools reputation-snapshot (verplicht)

1. Open `https://postmaster.google.com/`
2. Selecteer domain `hacksimulator.nl`
3. Bekijk dashboards (kunnen leeg zijn bij lage mail-volumes — dat is informatief op zichzelf):
   - **Spam rate** — % van outbound mail dat als spam gemeld is door Gmail-recipients
   - **Domain reputation** — High / Medium / Low / Bad classificatie
   - **IP reputation** — voor Brevo's shared IP `77.32.148.28` (kan leeg blijven omdat shared-IP-reputation vaak niet aggregeerd voor sub-senders)
   - **Authentication** — SPF / DKIM / DMARC pass-percentages (verwacht: 100% na Sessie 135 SPF-fix)
   - **Encryption** — TLS-percentages (Brevo gebruikt opportunistic TLS, verwacht hoog)
   - **Delivery errors** — bouncing-redenen

4. Documenteer screenshots als baseline in `docs/sessions/current.md` Sessie 136-entry

**Wat te verwachten bij lage volumes:**
- Spam rate en domain reputation kunnen "Not enough data" tonen — dat betekent <1000 outbound mails per dag. Onze nieuwsbrief verzendt naar (op moment van schrijven) ~paar tientallen contacten, dus dit is realistisch.
- Authentication-stats zijn meestal wel zichtbaar bij lager volume omdat het per-mail aggregaten zijn

### Hoofdtaak 2: DMARC-policy-bump-overweging (analytisch)

Huidige policy: `p=none` (monitoring-mode).

**Criteria voor `p=quarantine`-promotion:**
- Postmaster Authentication-stats SPF + DKIM beide ≥ 99% pass-rate
- Geen RUA-reports met onverwachte sender-IPs (check `contact@hacksimulator.nl` mailbox op DMARC-reports van Google/Microsoft/Yahoo — typisch dagelijkse XML-bijlagen)
- Geen klantfeedback over mail-niet-aangekomen

**Risico's van `p=quarantine`:**
- Bij sender-IP mis-config bij Brevo (zeldzaam maar mogelijk) → mails naar quarantine (junk-folder)
- Bij legitieme third-party-sender (bv. een notificatie-script vanaf eigen server) → mail wordt junked
- Niet-omkeerbaar binnen seconden — als je `p=quarantine` zet en het breekt iets, fix vereist een nieuwe DNS-edit + propagatie

**Conservatieve aanbeveling:** wachten 2-4 weken na Sessie 135 (= ten vroegste eind mei 2026) vóór promotion. Sessie D te vroeg.

**Alternatief voor Sessie D:** RUA reports inrichten naar een **eigen mailbox** (bv. nieuwe alias `dmarc-reports@hacksimulator.nl`) i.p.v. `contact@` — dat houdt de hoofdmailbox schoon en maakt analyse makkelijker. DNS-edit: DMARC-record updaten met nieuwe rua-mailto.

### Hoofdtaak 3: Brevo blocklist unblock + Track G re-attempt (optioneel)

**Stap 1: Unblock-UI lokaliseren**

Per memory `reference_brevo_blocklist.md`: dual-channel-model met verstopte unblock-actie. Mogelijke routes om te proberen:
- Contacts → zoek `jan.willem.wubkes@gmail.com` → klik contact → contact-detail-pagina
- Bij `Channels (1)` sectie: klik op de **dropdown** naast "Transactional emails" (niet de status-tag)
- Of: klik op "More" menu (3-dots) rechtsboven → zoek "Resubscribe" / "Unblock" / "Remove from blocklist"
- Of: tab "History" → laatste blocked-event → mogelijk "Restore"-knop

Als geen unblock-UI te vinden: Brevo Help Docs raadplegen of support-ticket overwegen.

**Stap 2: Verstuur testmails**

Na unblock — verstuur via Brevo Send Test naar `jan.willem.wubkes@gmail.com`:
1. `welkomstmail-v2-DnD` template
2. `sample-pentest-welkomstmail-v2-DnD` template

**Stap 3: Documenteer Gmail-classificatie**

Per testmail in Gmail:
- Welk tab? (Primary / Promotions / Updates / Spam / All Mail)
- Screenshot maken

**Doel:**
- Welkomstmail → Promotions (acceptabel, geen aspirational)
- Sample-pentest → **Primary** (plan-success-criterium 6, aspirational)

### Hoofdtaak 4: Custom tracking-subdomain tier-analyse (alleen als budget-vraag opkomt)

Niet uitvoeren tenzij Heisenberg expliciet vraagt:
- Brevo tier-pricing review (Free → Lite → Pro → Business)
- Wat krijgen we per tier? (custom tracking-subdomain, dedicated IP, advanced analytics, etc.)
- ROI-overweging gegeven huidige nieuwsbrief-volume

---

## Wat NIET in scope

- Code-wijzigingen (deze sessie is volledig DNS/Brevo-dashboard/Postmaster)
- Template-edits (welkomstmail-v2-DnD + sample-pentest-v2-DnD blijven onaangetast)
- Nieuwe automations of forms
- Migratie naar ander mail-platform

---

## Cruciale "niet doen"

⚠️ **NIET** DMARC `p=quarantine` of `p=reject` zetten zonder eerst 2-4 weken Postmaster Authentication-stats te bekijken — `p=none` is bewust monitoring-only, te vroege escalatie kan legitieme mails laten bouncen.

⚠️ **NIET** SPF/DKIM-records aanraken zonder concrete reden — alles is groen, elke wijziging risico op regressie.

⚠️ **NIET** `jan.willem.wubkes@gmail.com` unblocken zonder vóóraf te valideren dat de unblock-UI gedocumenteerd is — als de UI weer verloren raakt, kunnen we niet snel reverten.

⚠️ **NIET** assume dat lege Postmaster-dashboards = probleem — bij lage outbound-volumes (zoals het onze) is "Not enough data" een neutraal-positief signaal, geen rode vlag.

---

## Communicatie-stijl

- User heet **Heisenberg** (per CLAUDE.md sessie-protocol)
- Wees **meedogenloos eerlijk** — geen jaknikker-gedrag
- Bij DNS-edit (DMARC RUA-mailto change): "Home-key-truc" + 3-resolver verificatie zoals Sessie 135 (zie `feedback_validate_tooling_assumptions.md` + Sessie 135 learnings in CLAUDE.md)
- Bij delivery-issue: **EERST** Brevo Transactional → Logs check op `Blocked`-status, dán pas DNS-debug

---

## Referenties

- Sessie 135 detail: `docs/sessions/current.md` (top entry)
- Sessie 135 plan-bestand (afgerond): `.claude/plans/brevo-deliverability-sessie-C.md`
- Memory references:
  - `~/.claude/projects/-home-willem-projecten-hacksimulator/memory/reference_brevo_blocklist.md` (Brevo blocklist patroon)
  - `~/.claude/projects/-home-willem-projecten-hacksimulator/memory/reference_brevo_tracking_tier.md` (tier-limitatie context)
  - `~/.claude/projects/-home-willem-projecten-hacksimulator/memory/feedback_validate_tooling_assumptions.md` (30-sec UI-check pattern)
- DNS-tools: `https://postmaster.google.com/`, `https://mxtoolbox.com/SuperTool.aspx`, `https://www.transip.nl/cp/domain/hacksimulator.nl/dns/`
- Brevo dashboard: `https://app.brevo.com/`

---

## Success-criteria

Sessie D compleet als:

1. Postmaster Tools dashboard screenshots opgeslagen als baseline (of "no data yet" gedocumenteerd als 24-48u te vroeg)
2. Authentication-stats SPF + DKIM gecontroleerd (verwacht 100%)
3. DMARC-policy-bump beslissing genomen (go/no-go met datum-target)
4. Track G hetzij:
   - Voltooid (Gmail-classificatie gedocumenteerd) — als blocklist-unblock lukte
   - Expliciet geparkeerd met Brevo support-ticket-overweging als alternatief pad
5. Geen nieuwe blockers; sessie afsluitbaar zonder open vragen voor Sessie E
