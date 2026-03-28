# Welkomstmail — Mailchimp Automation

**Type:** Welcome email (Mailchimp: Customer Journey → Welcome series)
**Trigger:** Nieuwe subscriber via signup form of Gumroad PWYW download
**Vertraging:** Direct (0 minuten na bevestiging)

---

## Onderwerpregel

**Primair:** Welkom bij HackSimulator — hier begin je
**Alternatief A/B test:** Je eerste stap in cybersecurity begint hier

**Preview tekst:** Je hebt je aangemeld voor gratis cybersecurity tips. Dit is wat je kunt verwachten.

---

## Email Body

### Header
[HackSimulator.nl logo of tekst-logo in terminal-stijl]

---

### Body Copy

**Hé, welkom!**

Goed dat je erbij bent. Je hebt je aangemeld voor de HackSimulator nieuwsbrief — en daarmee de eerste stap gezet in de wereld van cybersecurity.

**Wat kun je verwachten?**

- Maandelijks een mail met een concrete cybersecurity tip
- Aankondigingen van nieuwe tutorials en cheatsheets
- Geen spam. Nooit. Opzeggen kan altijd met één klik.

**Direct aan de slag?**

De snelste manier om te beginnen is de terminal openen en je eerste commando typen:

[BUTTON: Start de simulator →]
Link: https://hacksimulator.nl/terminal.html

Typ `help` als je niet weet waar je moet beginnen — de simulator begeleidt je stap voor stap.

**Nog meer leren?**

Op het blog vind je uitleg over ethisch hacken, netwerk scanning, en meer:

- Wat is Ethisch Hacken? → https://hacksimulator.nl/blog/ethisch-hacken.html
- Terminal Commands voor Beginners → https://hacksimulator.nl/blog/terminal-commands.html
- Hoe Word je Ethisch Hacker? → https://hacksimulator.nl/blog/carriere-ethisch-hacker.html

---

### Footer

**HackSimulator.nl** — Leer ethisch hacken in je browser

Je ontvangt deze mail omdat je je hebt aangemeld via hacksimulator.nl.
[Uitschrijven] · [Privacybeleid]

---

## Design Instructies (Mailchimp Editor)

### Achtergrondkleuren
- **Email achtergrond (outer):** #0d1117 (donker, matches site)
- **Content blok (inner):** #161b22 (iets lichter, secondary bg)
- **Button:** #004494 (azure blauw, matches site buttons)
- **Button hover:** #003d85
- **Button tekst:** #ffffff

### Tekstkleuren
- **Heading tekst:** #c9d1d9 (soft white)
- **Body tekst:** #8b949e (muted grey)
- **Links:** #79c0ff (muted blue)
- **"Hé, welkom!" heading:** #c9d1d9

### Font
- **Primair:** 'Courier New', Courier, monospace (terminal look — werkt in alle email clients)
- **Alternatief (als Mailchimp het ondersteunt):** Google Fonts → JetBrains Mono
- **Body font-size:** 15px
- **Heading font-size:** 22px
- **Line-height:** 1.6

### Layout
- **Max breedte:** 600px (email standaard)
- **Padding content blok:** 32px
- **Border-radius content blok:** 8px
- **Geen afbeeldingen nodig** — pure tekst met terminal-aesthetic
- **Button:** full-width op mobile, 200px op desktop, border-radius 6px, padding 14px 28px

### Optioneel: Terminal-touch
Een subtiel "terminal prompt" effect in de header:
```
$ ./welkom.sh
> Verbinden met HackSimulator.nl...
> Verbinding succesvol. Welkom, hacker.
```
Font: monospace, kleur: #3fb950 (groen, success color), font-size: 13px
Dit geeft direct de sfeer van de site weer.
