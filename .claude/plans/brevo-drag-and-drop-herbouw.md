# Plan: Brevo template herbouw via drag-and-drop editor

## Status

**Cold start hier in nieuwe sessie.** Vorige sessie (4 mei 2026) heeft de server-side fixes afgerond. Open issues zijn puur Brevo-dashboard-werk.

---

## Eerste stappen nieuwe sessie (cold-start checklist)

1. Lees dit bestand volledig
2. Verifieer server-side state nog klopt:
   ```bash
   git log --oneline -5
   curl -sI https://hacksimulator.nl/assets/samples/pentest-playbook-sample.pdf | grep -i content-disposition
   curl -sI https://hacksimulator.nl/privacy.html | grep -iE "(HTTP|location)"
   ```
   Verwacht: top 4 commits zijn `ee2bec8` `38ad10b` `ac047f3` `38554e0` (of nieuwer); PDF heeft `content-disposition: attachment`; privacy = 301 → /assets/legal/privacy.html
3. Vraag user naar status van eerdere stappen — heeft ze al een drag-and-drop template aangemaakt? Als ja → skip naar §Verificatie

---

## Context

Hacksimulator gebruikt Brevo voor twee Form-submitted automation-mails:
- **Welkomstmail** (hoofd-newsletter) — `docs/newsletter/welkomstmail.html`
- **Sample-pentest welkomstmail** (lead-magnet) — `docs/newsletter/welkomstmail-sample-pentest.html`

Beide templates zijn momenteel in Brevo's **classic rich-text editor** opgeslagen. Tijdens user-testing op 30-apr en 2-mei bleken twee hardnekkige bugs aan Brevo-zijde:

1. **Unsubscribe + "Bekijk in browser"-links werken niet (404).** Oorzaak: classic editor URL-encoded `{`, `}`, `$` in href-velden, waardoor `{$unsubscribe}` wordt `%7B%24unsubscribe%7D` — geen valide Brevo placeholder meer.
2. **PDF download faalt op mobiel (Brevo "page not found").** Oorzaak: Brevo's tracking-tokens zijn één-malig of tijds-gebonden. Gmail-mobile prefetcht alle links voor security-scans, consumeerd het token, dan klikt user → 404. Op laptop werkt het soms wel (eerste klik), soms niet (verlopen).

Server-side is alles geverifieerd correct: `Content-Disposition: attachment` is live, PDF-content is correct ("Vanaf €5"), redirect-chain van Brevo-tracker → Netlify werkt zoals verwacht (mijn curl-test bewees dit).

**Conclusie vorige sessie**: classic-editor patchen is een doodlopend pad. Drag-and-drop herbouw is de robuuste route.

---

## Server-side status (klaar — niets meer te doen)

| Commit | Wat |
|---|---|
| `38ad10b` | Welkomstmail bug-cluster: blog-URLs, prijsclaim, mobile inline-code overlap |
| `ee2bec8` | Netlify redirects: /privacy.html, /terms.html, /cookies.html → /assets/legal/* (301) |
| `ac047f3` | `_headers`: force download voor `/assets/samples/*` via `Content-Disposition: attachment` |
| `38554e0` | Sample-PDF: prijs €0 → €5 (Typst source + recompile) |

Alle gepusht naar `origin/main`. Netlify deployed.

---

## Brevo-state (huidige toestand vóór herbouw)

**Wat user heeft gedaan in vorige sessie:**
- Templates handmatig in HTML geupload (classic editor) — werkte voor blog-links, privacy, prijs
- Unsubscribe + "Bekijk in browser"-links handmatig uit templates verwijderd na URL-encoding-pogingen
- **Default campaign settings** geconfigureerd op `my.brevo.com/advanced/config`: header/footer met `{hier}`, "Add View in browser link to all campaigns" = Yes

**KRITIEK**: die Default Campaign Settings gelden **alleen voor campaigns**, NIET voor automations. Mag blijven staan (schaadt niet) maar lost het probleem niet op. De welkomstmail wordt via Form-submitted automations verzonden, die hebben eigen template-binding.

---

## Plan: Drag-and-drop herbouw

### Hybrid-aanpak (aanbevolen — bewaart styling 100%)

In plaats van de HTML te laten converteren naar drag-and-drop blocks (waar terminal-aesthetic styling sneuvelt), gebruik **één Custom HTML / Code block** dat de hele bestaande HTML rendert + **één Footer-block** voor de unsubscribe-link.

#### Per template (welkomstmail + sample-pentest welkomstmail):

**Stap 1: Voorbereiden HTML voor import**
- Open `docs/newsletter/welkomstmail.html` resp. `welkomstmail-sample-pentest.html`
- Verwijder lokaal de footer-regel met `{$unsubscribe}` en `{$url}` (regel 158 resp. 184) — het Footer-block in Brevo gaat dit overnemen
- Behoud wel de "Privacybeleid" link (hardcoded URL, niet via Brevo)
- *Niet committen* — dit is alleen voor de Brevo-paste

**Stap 2: Brevo template aanmaken**
1. Brevo → Campaigns → Templates → **Create a new template**
2. Kies **Drag-and-drop editor** (NIET classic / rich-text)
3. Geef template een herkenbare naam: `welkomstmail-v2-DnD` resp. `sample-pentest-welkomstmail-v2-DnD`

**Stap 3: HTML-block plaatsen**
1. Sleep een **"HTML"** of **"Code"** block uit de zijbalk naar de template-canvas
2. Plak de aangepaste HTML uit Stap 1 hierin
3. Klik buiten het block — preview rendert je terminal-aesthetic exact zoals lokaal

**Stap 4: Footer-block toevoegen**
1. Sleep een **"Footer"** block onder het HTML-block
2. Brevo voegt automatisch unsubscribe + "View in browser" toe in correct gerenderde syntax
3. Pas styling aan zodat het qua kleur (#161b22 of vergelijkbaar) en font (Courier New) past bij de rest
4. Optioneel: pas tekst aan ("Uitschrijven" / "Bekijk in browser")

**Stap 5: PDF-download tracking uitschakelen (alleen sample-template)**
1. Klik op de **"Bekijk Volledig Playbook →"**-knop in het HTML-block (of wherever de PDF-download CTA staat)
2. In het link-edit-paneel rechts: zoek toggle **"Track clicks"** of **"Click tracking"** → zet UIT
3. Hierdoor wordt de directe URL gestuurd zonder Brevo-wrap — geen tokens meer, geen mobile prefetching-issues

**Stap 6: Save**
- Save template
- Note de nieuwe template-ID's (zichtbaar in URL of template-list)

**Stap 7: Automations koppelen aan nieuwe templates**
1. Brevo → Automations → open Form-submitted automation
2. Klik email-stap → "Edit email" of "Change template"
3. Selecteer de nieuwe `*-v2-DnD` template
4. Save automation

**Stap 8: Test**
1. Send test naar `jan.willem.wubkes@gmail.com`
2. Controleer in Gmail-web + Gmail-mobile
3. Doorloop B4-checklist hieronder

---

## B4 verificatie-checklist (per template)

**Welkomstmail (hoofd-newsletter):**
- [ ] Privacybeleid-link → werkt (via 301)
- [ ] Uitschrijven (uit Footer-block) → opent Brevo unsubscribe-flow
- [ ] "Bekijk in browser" (uit Footer-block) → opent web-versie
- [ ] 3 blog-links: `wat-is-ethisch-hacken`, `terminal-basics`, `ethisch-hacker-worden` → openen blogposts
- [ ] Mobiel (Gmail iOS/Android): inline code (`ping`, `whois`, `traceroute`) niet overlappend
- [ ] Visueel: terminal-aesthetic intact (dark bg, Courier New, ASCII-art)

**Sample-pentest welkomstmail:**
- [ ] Privacybeleid + uitschrijven + browser-view zoals boven
- [ ] **Download-PDF-knop** → start direct PDF-download op mobiel **en** desktop
- [ ] PDF-content: footer toont "Vanaf €5 (pay-what-you-want)"
- [ ] Geen "page not found" errors meer (tracking is uit voor download-link)
- [ ] Mobiel: PDF download naar Files-app (iOS) / Downloads (Android)

**Cross-cutting:**
- [ ] Gmail-classifier: welkomstmail → Promotions of Primary?
- [ ] Sample-mail → Primary

---

## Kritieke bestanden

- `docs/newsletter/welkomstmail.html` — copy-source (regel 158 = footer met unsubscribe-regel om weg te halen vóór paste)
- `docs/newsletter/welkomstmail-sample-pentest.html` — copy-source (regel 184 idem)
- *Geen code-edits nodig in deze sessie tenzij testen iets onverwachts onthullen*

---

## Wat NIET in scope

- Geen retroactieve correctie van reeds-verzonden mails
- Geen Sessie C (deliverability — DNS, SPF/DKIM/DMARC, mail-tester) — pas na deze herbouw groen
- Geen wijzigingen aan Default Campaign Settings (mag blijven staan, irrelevant voor automations)
- Geen aanpassingen aan repo-HTML voor moderne Brevo-syntax — bron-HTML blijft portable

---

## Cruciale "niet doen"

⚠️ **NIET de classic-editor templates verwijderen** vóór de nieuwe drag-and-drop versie is bevestigd werkend. Anders breekt de automation-flow tijdens de transitie.

⚠️ **NIET vergeten** stap 7 (automation koppelen) — anders blijft Brevo de oude classic-template gebruiken ondanks dat de nieuwe DnD-template bestaat.

⚠️ **NIET de Privacybeleid-link via Brevo's Footer-block proberen op te lossen** — Footer-block voegt alleen unsubscribe + browser-view toe. Privacy blijft hardcoded URL in HTML.

---

## Fallback als drag-and-drop herbouw niet werkt

Onwaarschijnlijk maar mogelijk: Brevo's drag-and-drop importeert de Custom HTML-block niet correct, of Footer-block kan niet gestyled worden om bij terminal-aesthetic te passen. In dat geval:

1. **Plan B**: schakel link-tracking *globaal uit* voor de email-stap in de classic-editor automation. Dit lost mobile-PDF op (geen tracking-token = geen expiry). Voor unsubscribe + browser-view: ga met de hand een Brevo-support-ticket inschieten met vraag "hoe insert ik werkende `{$unsubscribe}` in een classic-editor automation-template?"
2. **Plan C**: switch hele email-flow naar Brevo's Transactional API. Te veel werk voor MVP — niet aanraden tenzij alles anders faalt.

---

## Communicatie-stijl

- User heet **Heisenberg** (per CLAUDE.md sessie-protocol)
- Wees **meedogenloos eerlijk** — geen jaknikker-gedrag. Als drag-and-drop herbouw langer duurt dan verwacht, zeg dat. Als een Brevo-feature niet bestaat in haar plan-niveau, zeg dat.
- Voorkom 6+ bericht-rondes in details — geef per stap genoeg context dat user kan handelen zonder te moeten doorvragen.

---

## End-to-end success-criteria

Sessie compleet als:
1. Beide templates herbouwd in drag-and-drop editor met Custom HTML-block + Footer-block
2. Beide automations gekoppeld aan de nieuwe templates
3. Twee testmails verstuurd (één per automation), alle B4-vinkjes groen op desktop **en** Gmail-mobile
4. Mobiele PDF-download werkt bij eerste klik na verzending (geen 404)
5. PDF-content toont "Vanaf €5"
6. Visuele terminal-aesthetic intact in beide rendered mails

Pas dán is de Plan B Lead Magnet (Sessie 132/133) écht complete + Sessie B (Brevo mail-bugs) afgesloten.
