# Demand-Validatie Protocol — HackSimulator.nl

**Doel:** het ontbrekende externe signaal ophalen vóór je de één-schot-launch verschiet. Het hele product is gebouwd en getest door de maker + AI; nul vreemden hebben het koud gebruikt. Dit protocol haalt in ~een dagdeel het antwoord op de drie vragen die de launch maken of breken:

1. **Snappen ze in 5 seconden wat het is** en waarom het voor hén is?
2. **Bereiken ze een eerste "win"** zonder hulp — of haken ze af, en wáár?
3. **Zouden ze het doorsturen** naar een vriend? (De enige echte word-of-mouth-test.)

> **Brutaal eerlijk:** 5 goede sessies zijn meer waard dan 50 polish-commits. Als 3 van de 5 testers vastlopen op dezelfde plek, weet je wat de launch gaat doen — en kun je het fixen vóórdat je verkeer verschiet. Dit is de goedkoopste de-risking die er is.

---

## Wie & hoeveel
- **5 tot 10 mensen** uit de doelgroep: NL, ~15-25 jaar, **beginner** in de terminal/cybersecurity (géén developers, géén mensen die het al kennen). Vrienden-van-vrienden mag, zolang ze de sim niet eerder zagen.
- 5 is genoeg om de grootste problemen te zien (na ~5 sessies herhalen de bevindingen zich meestal).

## Hoe (setup, ~15 min per sessie)
- **Schouder-mee** (naast ze zitten) óf **scherm-opname + hardop-denken** (bv. via een call waarin ze hun scherm delen en meepraten).
- Geef ze **één instructie vooraf:** *"Denk hardop. Zeg alles wat je ziet, denkt en verwacht. Er is geen fout antwoord — als iets onduidelijk is, ligt dat aan ons, niet aan jou."*
- **Jij zegt verder niets** en helpt niet, tenzij ze echt muurvast zitten (>30 sec) — noteer dán dat je moest ingrijpen (dat is een bevinding).
- Start op een **schoon apparaat/incognito** (geen eerdere localStorage/consent-state), op de URL die je in de launch gaat delen (homepage: `hacksimulator.nl`).

---

## De taken (cold-start-journey)

Geef per taak alleen de vetgedrukte opdracht. Noteer per taak het **drop-off-punt** = waar ze twijfelen, verkeerd klikken, of stoppen.

### Taak 1 — De 5-seconden-test (positionering)
**"Kijk 5 seconden naar deze pagina en zeg dan: wat is dit, en voor wie?"** (daarna pas scrollen)
- Observeer: noemen ze "ethisch hacken leren / oefenen in een terminal"? Of raden ze verkeerd?
- 🚩 Drop-off: als ze het niet kunnen benoemen → de **hero/value-prop landt niet**.

### Taak 2 — De eerste stap zetten (top-of-funnel)
**"Stel je wil dit uitproberen. Wat zou je doen?"**
- Observeer: klikken ze op de juiste "start"-knop? Welke (hero/mid/leerpad)? Aarzelen ze tussen opties?
- 🚩 Drop-off: als ze niet weten waar te klikken of de verkeerde knop kiezen → **CTA-hiërarchie onduidelijk**.

### Taak 3 — De eerste "win" (activation)
**"Je zit nu in de terminal. Doe iets — wat dan ook — en vertel wat er gebeurt."**
- Observeer: durven ze te typen? Volgen ze de onboarding/tutorial-prompt? Krijgen ze een succeservaring (een command dat werkt + begrijpelijke output)?
- 🚩 Drop-off: als ze niet weten wát te typen, of de output niet snappen → **first-run/onboarding faalt**. Dit is de belangrijkste taak.

### Taak 4 — Een missie afmaken (kern-loop)
**"Probeer de eerste begeleide missie/tutorial af te ronden."**
- Observeer: komen ze door alle stappen? Waar haken ze af? Vinden ze het te lang / te makkelijk / te moeilijk? Snappen ze de hints?
- 🚩 Drop-off: noteer de exacte stap waarop ze zouden stoppen als jij er niet bij zat.

### Taak 5 — De deel- & terugkeer-intentie (retentie + word-of-mouth)
**Vraag (niet doen, alleen vragen):** *"Zou je hier morgen naar terugkomen? En zou je dit naar een vriend sturen die wil leren hacken? Waarom (niet)?"*
- Dit is de eerlijkste vraag van allemaal. Let op de **aarzeling** meer dan op het beleefde "ja".

---

## Na afloop — 5 vragen (kort, geen enquête)
1. **In één zin: wat doet HackSimulator?** (test of de positionering bleef hangen)
2. **Wat was het meest verwarrende moment?**
3. **Op een schaal 1-10: hoe waarschijnlijk stuur je dit naar een vriend?** (en waarom dat getal?)
4. **Wat zou je toevoegen of weglaten om het 2 punten hoger te maken?**
5. **Wat verwachtte je dat er zou gebeuren, dat níét gebeurde?**

---

## Resultaten-template (per tester)

```
Tester #  | leeftijd | ervaring (beginner/wat/veel)
5-sec-test (Taak 1): kon het benoemen? [ja/nee] — wat zei die?
Drop-off-punt(en):   [taak + exacte plek waar twijfel/afhaken was]
Bereikte activation (Taak 3)? [ja/nee] — met welk command?
Voltooide missie (Taak 4)? [ja/nee] — zo nee, gestopt bij stap:
Doorstuur-score (1-10):  __  — reden:
Grootste quote (letterlijk):
Moest ik ingrijpen? [ja/nee] — waarbij:
```

**Samenvatting over alle testers (dit is wat telt):**
- Welk drop-off-punt kwam bij **≥3 testers** terug? → dát fix je eerst.
- Gemiddelde doorstuur-score. Onder ~6 = de kern-belofte overtuigt nog niet; boven ~8 = klaar om verkeer te sturen.
- Konden ≥4 van 5 de 5-seconden-test? Zo nee → herschrijf de hero vóór launch (dit voedt Workstream 3).

---

## Waar vind je 5-10 NL-beginners (met het taalplafond meegewogen)
Het product is NL-facing, dus richt je op NL-kanalen — niet op globale Engelse:
- **Directe kring:** vrienden/familie/kennissen 15-25 die "wel eens wilden weten hoe hacken werkt". 3-4 hier is zo geregeld en levert de scherpste hardop-denk-sessies (je zit ernaast).
- **NL-communities:** Discord-servers rond gaming/tech/security-studenten, mbo/hbo ICT-klasgenoten, een informaticadocent die 2 leerlingen laat proberen.
- **Reddit:** r/nederlands, r/GoT (mbo/hbo), niche NL-tech-subs — maar liever 1-op-1 dan een open oproep (open oproepen trekken de al-kenners, precies wie je níét wil).
- **Vermijd** voor déze test: Hacker News, r/netsec, security-Twitter — dat is je publiek níét (te ervaren, te Engels) en vertekent het signaal.

---

**Laatst bijgewerkt:** Sessie 198 (protocol opgesteld door Claude; uitvoering — sessies draaien + template invullen — door Heisenberg. Daarna samen interpreteren → voedt Workstream 3 value-prop/retentie).
