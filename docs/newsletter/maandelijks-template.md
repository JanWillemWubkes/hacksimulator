# Maandelijks Newsletter Template — Mailchimp

**Type:** Regular campaign (maandelijks)
**Verzenddag:** Eerste dinsdag van de maand (beste open rates voor B2C NL)
**Verzendtijd:** 10:00 CET

---

## Vast Format (elke maand invullen)

### Onderwerpregel formaat
"[Maand] — [Pakkende tip/onderwerp in max 50 tekens]"

Voorbeelden:
- "April — 3 nmap trucs die beginners missen"
- "Mei — Waarom poort 443 belangrijker is dan je denkt"
- "Juni — Je eerste SQL injection (legaal)"

**Preview tekst:** Eerste zin van de Tip van de Maand sectie.

---

## Email Structuur

### [1] Terminal Header (vast)
```
$ cat nieuwsbrief-[maand]-2026.txt
> Loading...
```
Kleur: #3fb950 (groen), font: monospace, 13px

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

---

## Design

Zelfde stijl als welkomstmail:
- Achtergrond: #0d1117 (outer) / #161b22 (inner)
- Tekst: #c9d1d9 (headings) / #8b949e (body)
- Links: #79c0ff
- Buttons: #004494 met #ffffff tekst
- Font: Courier New / monospace, 15px
- Max breedte: 600px

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
- [ ] Preview tekst ingevuld (niet standaard Mailchimp tekst)
- [ ] Alle links getest (terminal, blog, cheatsheet)
- [ ] Mobiel preview gecheckt in Mailchimp
- [ ] Uitschrijflink werkt
- [ ] Verzendtijd: 10:00 CET, eerste dinsdag
