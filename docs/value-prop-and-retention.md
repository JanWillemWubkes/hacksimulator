# Value-Proposition & Retentie — audit + varianten

**Doel:** de "waarom kom ik hier" (hero/positionering) aanscherpen en een "waarom kom ik terug" (retentie) ontwerpen. **Bewust nog niet live gezet** — de kandidaat-hero's hieronder zijn input voor de 5-seconden-test in `demand-validation-protocol.md`, en de retentie-keuze wacht op dat signaal. Nu live gokken = dezelfde onbewezen-aanname-fout die de hele analyse aankaartte.

---

## Deel A — Value-prop audit (brutaal eerlijk)

### De huidige hero
- **Eyebrow:** "Browser-based Terminal Simulator"
- **H1:** "Leer Ethisch Hacken in een Veilige Nederlandse Terminal"
- **Subtitle:** "Oefen ethisch hacken met 40+ commands uit de praktijk en Nederlandse uitleg — in een veilige simulatie waar je alles kunt uitproberen zonder echte gevolgen."
- **CTA:** "Start Nu" + "Geen account nodig — direct beginnen"

### Wat er goed aan is
Eerlijk, duidelijk, geen overclaim. "Geen account nodig" is sterke frictie-wegnemer. NL-positionering is een echt differentiator.

### Wat zwak is (de eerlijke kritiek)
1. **Beschrijft WAT, verkoopt geen UITKOMST of gevoel.** "Leer ethisch hacken in een veilige terminal" is een categorie-omschrijving, geen hook. Waar is het verlangen? (word een hacker / van nul naar je eerste hack / leer denken als een aanvaller).
2. **Subtitle is een feature-lijst** ("40+ commands", "Nederlandse uitleg", "veilige simulatie"). Feature-opsomming overtuigt een nieuwsgierige beginner minder dan één concrete belofte.
3. **"Veilige Nederlandse Terminal" is klungelig** — drie bijvoeglijke bepalingen op een rij; leest technisch, niet aantrekkelijk.
4. **Geen proof boven de vouw.** De trust-bar staat eronder; in de eerste 5 seconden zie je geen enkel vertrouwenssignaal.
5. **"Start Nu" is generiek.** Een actie-CTA die de belofte herhaalt converteert vaak beter ("Start je eerste hack", "Open de terminal").

### Kernpunt
De hero is *correct* maar niet *magnetisch*. Voor een launch met 5 seconden aandacht is dat het verschil tussen 20% en 40% doorklik (zie `launch-success-metrics.md` §2). Dít is precies wat de 5-seconden-test moet uitwijzen — daarom test je het i.p.v. het te gokken.

---

## Deel B — 3 kandidaat-hero's om te testen

Toets deze in de WS2-sessies (Taak 1). Meet: kan de tester in 1 zin navertellen wat het is + voor wie? Welke variant scoort het hoogst op "zou ik doorklikken"?

**Variant 1 — Uitkomst/identiteit ("word een hacker")**
- H1: **"Leer hacken door het te doen — niet door erover te lezen."**
- Sub: "Open een echte terminal in je browser en voer je eerste hack uit in 2 minuten. Nederlandse uitleg bij elke stap, nul risico, geen installatie."
- CTA: "Start je eerste hack"

**Variant 2 — Frictie-nul / instap ("gewoon beginnen")**
- H1: **"De veiligste plek om ethisch hacken te leren."**
- Sub: "Een echte hacker-terminal in je browser — oefen scannen, kraken en exploiten zonder iets kapot te maken. Nederlands, gratis, geen account."
- CTA: "Open de terminal"

**Variant 3 — Doelgroep-spiegel ("voor de nieuwsgierige beginner")**
- H1: **"Altijd al willen weten hoe hacken écht werkt?"**
- Sub: "Leer het stap voor stap in een veilige terminal-simulatie. 40+ echte commands, Nederlandse uitleg, en missies die je van nul op weg helpen."
- CTA: "Begin bij stap 1"

> Elke variant is één `<h1>` + `<p class="hero-subtitle">` + CTA-tekst-wijziging in `index.html` — triviaal te implementeren zodra de test een winnaar aanwijst. Eyebrow + microcopy blijven; overweeg 1 proof-regel boven de vouw ("X missies · Y commands · geen registratie").

---

## Deel C — Retentie-haak: opties gerangschikt

Het probleem: launch-verkeer is een spike; je durabele bezit is de e-maillijst en een reden om terug te komen. Wie de fundamentals-missie afmaakt heeft nu geen sterke *pull* om morgen terug te komen.

| # | Optie | Impact | Inspanning | Fit | Oordeel |
|---|-------|--------|-----------|-----|---------|
| 1 | **"Volgende missie wacht"-pull op terugkeer** — bij terugkomst met opgeslagen voortgang: begroeting + de éne volgende stap prominent (bouwt op `progress-store` + `next.js` + `learning-path.js`) | Midden | Laag | Hoog | **Beste eerste v1** — additief, hergebruikt bestaande architectuur, vermindert "wat was ik ook alweer aan het doen"-frictie |
| 2 | **E-mail re-engagement** — "je voltooide X, dit is je volgende missie" na 2-3 dagen (Brevo bestaat al) | Hoog | Midden | Hoog | Sterkste durabele pull, maar = e-mail-automation-werk + copy, niet puur code |
| 3 | **Streak / dagelijkse-serie** — "X dagen op rij" | Midden | Midden | **Laag** | Dagelijks-terugkeer past slecht bij een leer-tool die je in bursts doet; risico op holle gamification |
| 4 | **Content-cadans** — wekelijks nieuwe challenge/missie | Hoog | **Hoog** | Hoog | Vergt content-productie, geen code; los traject |

### Aanbeveling
- **Bouw niet blind.** De validatie (WS2 Taak 5: "kom je terug? waarom?") vertelt je of retentie überhaupt het probleem is en wélke pull resoneert. Onder ~6 op de doorstuur-score is retentie niet je bottleneck — dan is het de kern-belofte.
- **Als we bouwen:** start met **optie 1** (terugkeer-pull) als kleine v1 binnen `src/gamification/` — het is additief, laag-risico en hergebruikt de bestaande resume/next-infrastructuur. **Optie 2** (e-mail) is de zwaardere maar sterkste tweede stap.

---

**Laatst bijgewerkt:** Sessie 198 (audit + varianten + opties door Claude; hero-winnaar + retentie-keuze te bepalen ná de demand-validatie-sessies — bewust niet live gegokt).
