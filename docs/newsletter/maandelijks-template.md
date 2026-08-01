# Maandelijks Newsletter Template — Brevo

**Type:** Regular campaign (maandelijks)
**Platform:** Brevo (migratie van MailerLite: Sessie 165, juni 2026)
**Editor:** **Import HTML** — NIET de drag-and-drop editor (die sloopt de dark-mode media
queries en de Outlook-conditionals; zie `brevo-setup-sample-pentest.md`)
**Verzenddag:** Eerste dinsdag van de maand (beste open rates voor B2C NL)
**Verzendtijd:** 10:00 CET
**Lijst:** `hacksimulator-main`

---

## Vast Format (elke maand invullen)

### Onderwerpregel formaat
"[Pakkende tip/onderwerp in max 50 tekens]"

Geen maandprefix — subscribers zien de datum al in hun inbox. Houd het kort en creëer nieuwsgierigheid.

Voorbeelden:
- "Eén commando onthult een heel netwerk"
- "Waarom poort 443 belangrijker is dan je denkt"
- "Je eerste SQL injection (legaal)"

**Preview tekst:** Eerste zin van de Tip van de Maand sectie.

---

## Email Structuur

### [1] Terminal Header (vast)
```
$ cat nieuwsbrief-[maand]-2026.txt
> Loading...
```
Kleur: #9fef00 (neon groen), font: monospace, 13px

---

### [1.5] Intro (vast)

**Heading (vast, elke editie hetzelfde):**
> **Welkom bij je maandelijkse dosis cybersecurity.**

**Tekst (variabel per editie):**
> [1-2 zinnen context over wat er in deze editie staat. Bij de eerste editie:
> introductie van de nieuwsbrief. Bij latere edities: korte teaser van de tip.]

---

### [2] Tip van de Maand (hoofdcontent)

**Format:**
> **[Titel van de tip]**
>
> [2-3 alinea's, 150-250 woorden. Praktisch, actionable, beginner-friendly.
> Eindig altijd met een concrete "probeer dit zelf" actie.]
>
> **Probeer het zelf:** Open de simulator en typ `[commando]`
> [BUTTON: Open de simulator →]

**Toon:** Zoals een blogpost, maar korter. "je", bemoedigend, context geven.

**Voorbeelden van onderwerpen:**
- "Wat vertelt een open poort over een systeem?"
- "3 manieren om een sterk wachtwoord te herkennen"
- "Wat gebeurt er eigenlijk als je `ping` typt?"
- "De 5 belangrijkste Linux commando's voor beginners"

---

### [3] Nieuws / Updates (kort)

**Format:**
> **Wat is er nieuw?**
>
> - [Nieuw blogpost / feature / update — 1 regel + link]
> - [Eventueel tweede item]

Maximaal 2-3 bullets. Als er geen nieuws is, laat deze sectie weg.

---

### [4] Aanbeveling (eigen product)

**Format:**
> **Download: [Cheatsheet naam]**
>
> [1-2 zinnen over wat het is en voor wie]
>
> [BUTTON: Download (gratis / €2.50) →]
> Link: Gumroad product URL

**Toon:** Geen harde sell. "Misschien handig" vibe.

Als er geen nieuw product is, verwijs naar een bestaande cheatsheet of laat weg.

---

### [5] Footer (vast)

```
---
HackSimulator.nl — Leer ethisch hacken in je browser

Je ontvangt deze mail omdat je je hebt aangemeld via hacksimulator.nl.
[Uitschrijven] · [Privacybeleid] · [Bekijk in browser]
```

**Conventie (vastgelegd 01 aug 2026): één footer, in de HTML.** De uitschrijf- en mirror-link
horen in deze gestileerde footerregel, binnen de donkere kaart — niet in een los Brevo-blok
eronder. Zo blijft de mail één geheel in het HackSimulator-uiterlijk.

- In de HTML: `<a href="{{ unsubscribe }}">` en `<a href="{{ mirror }}">` (Brevo-syntax,
  spaties binnen de accolades)
- In Brevo: géén extra native footer-blok onder de HTML toevoegen. Staat er al één, verwijder
  hem. Weigert Brevo dat, dan eist hij zijn eigen blok en laat je het staan

**Status 01 aug 2026: beide welkomst-automations volgen deze conventie.** Automation 1
(`welkomstmail.html`) en automation 2 (`welkomstmail-sample-pentest.html`) hebben allebei de
uitschrijf- en mirror-link in het HTML-blok staan; het losse Brevo-footerblok is bij beide
verwijderd en de links zijn na de wijziging getest. De repo-bestanden en Brevo lopen dus
gelijk — houd dat zo bij een volgende import.

---

## Design

Zelfde stijl als welkomstmail:
- Achtergrond: #0d1117 (outer) / #161b22 (inner)
- Tekst: #c9d1d9 (headings) / #8b949e (body)
- Links: #79c0ff
- Buttons: #9fef00 met #0d1117 tekst
- Font: Courier New / monospace, 15px
- Max breedte: 600px

---

## Base CSS Block (kopieer naar elke nieuwe email)

Het `<style>` blok in de `<head>` is identiek voor alle emails.
Kopieer dit blok exact uit de meest recente nieuwsbrief (`nieuwsbrief-juli-2026.html`).

Het blok bevat:
- `@media (prefers-color-scheme: dark)` — dark mode overrides (11 klassen)
- `u + .body` — Gmail dark mode prevention (11 klassen)
- `[data-ogsc]` — Outlook.com dark mode overrides (12 klassen)
- `@media (max-width: 600px)` — responsive regels + mobiele header/code block

**Wijzig deze klassen NIET per email.** Ze beschermen de HackSimulator kleuren tegen automatische dark mode inversie door email clients.

### Twee code-klassen, nooit één

- `.code-block` — het blok-codevenster (`<td>`), krijgt op mobiel `padding: 12px 14px`
- `.code-inline` — een code-chip midden in een zin (`<code>`), krijgt op mobiel `padding: 1px 4px`

Gebruik nooit dezelfde klasse voor beide. Verticale padding vergroot bij een inline element
de regelhoogte niet, alleen het gekleurde vlak: met de blok-padding wordt een chip 38px hoog
in een regel van 24px en snijdt hij door de regels erboven en eronder (Sessie 206).

### Donkere tekst op de groene balk/knop

De donkere tekstkleur staat altijd sámen met `background-color:#9fef00` op hetzelfde element
(zowel inline als in de `.header-text`/`.btn-text` klasseregels). De Gmail-app herschrijft in
dark mode losse tekstfragmenten zonder eigen achtergrond naar wit — een lokaal kloppend
kleurenpaar voorkomt dat. Haal die achtergrond er niet af.

---

## Content Kalender (eerste 3 maanden)

| Maand | Tip van de Maand | Aanbeveling |
|-------|-----------------|-------------|
| April 2026 | "Wat vertelt nmap over een netwerk?" | Nmap Cheatsheet (als klaar) |
| Mei 2026 | "Linux bestanden: lezen, zoeken, begrijpen" | Linux Terminal Cheatsheet |
| Juni 2026 | "SQL injection: hoe werkt het (en hoe voorkom je het)?" | SQL Injection Cheatsheet |

---

## Checklist voor verzending

- [ ] Onderwerpregel < 60 tekens
- [ ] Preview tekst ingevuld (de verborgen preheader-div bovenaan de HTML)
- [ ] Alle links getest (terminal, blog, cheatsheet)
- [ ] UTM parameters op alle links (`?utm_source=newsletter&utm_medium=email&utm_campaign=[maand]-[jaar]`)
- [ ] Via **Import HTML** geplaatst, niet via de drag-and-drop editor
- [ ] Mobiel preview gecheckt in Brevo
- [ ] Uitschrijflink werkt (`{{ unsubscribe }}`) — echt aanklikken in de test-mail
- [ ] Eén footer: de gestileerde regel in de HTML, géén los Brevo-blok eronder
- [ ] Verzendtijd: 10:00 CET, eerste dinsdag
- [ ] Test-email verstuurd naar eigen adres
- [ ] Test-email geopend op telefoon in **dark mode** (Gmail-app) — donkere tekst op de
      groene balk/knop, code-chips binnen hun regel

### Brevo variabelen
- Uitschrijven: `{{ unsubscribe }}`
- Bekijk in browser (mirror): `{{ mirror }}`
- Voornaam: `{{ contact.FIRSTNAME }}` (optioneel)

Let op de spaties binnen de accolades — dat is Brevo Template Language. De oude
MailerLite-vorm (`{$unsubscribe}`, `{$url}`) wordt door Brevo **niet** vervangen en blijft
letterlijk als href staan. De april-2026-nieuwsbrief in deze map draagt die oude syntax nog;
dat is historisch correct (verstuurd vóór de migratie), geen model om van te kopiëren.
