---
paths:
  - "tests/e2e/**/*.js"
  - "scripts/**"
---

# Meet- en guarddiscipline

Hoe je bewijst dat iets werkt, en hoe een guard verdampt zonder dat iemand het merkt.
De §-nummers komen uit de oude `architecture-patterns.md` en zijn ongewijzigd.

## 0. Staande regels

- **Er is GEEN baseline van bekende testfalers.** Rood = regressie. Een onopgeloste conditie
  hoort als assertie in een test (die meldt terug), niet als notitie (die verdampt).
- **Kies mutanten die op VERSCHILLENDE asserties falen** en controleer wélke vuurde — niet
  alleen hoeveel tests rood werden. Identieke faalpatronen betekenen dat er asserties te veel zijn.
- **Geef elke guard een zelfbewakende tak.** Een check die nooit kán falen is niet te
  onderscheiden van een kapotte check. Faal ook op een lege populatie.
- **Bepaal een testtimeout op een meting**, niet op een gevoel. Een timeout die je op de
  gemeten waarde plakt, wordt de volgende flaky test.
- **Meet, reken niet.** Eén `test()` in een dubbele `for`-lus genereert er negen. Tel met
  `grep -rE "^\s*test\("`, niet met wat je denkt te hebben geschreven.

---

## 6. Third-party verwijderen: twee servers, niet één meting (Sessie 208)

Bij het weghalen van een externe afhankelijkheid bewijst een nulmeting achteraf niets — "0 verzoeken"
is óók de uitkomst van een kapotte meting. Zet de oude code ernaast:

```bash
git archive HEAD | tar -x -C /tmp/pre-change
python3 scripts/nostore-server.py 8898 /tmp/pre-change &   # oud
python3 scripts/nostore-server.py 8899 $(pwd) &            # nieuw
```

Draai daarna dezelfde meting tegen beide poorten. Bij de AdSense-verwijdering gaf dat
**2 advertentieverzoeken + 3 ad-units vóór, 0 + 0 ná** — pas dáármee is de nulmeting bewijs.

**Consent-state migreren = meestal niet nodig.** Laat het opgeslagen JSON-formaat intact en stop
alleen met het schrijven van de verdwenen sleutel. `hasConsent('analytics')` blijft dan werken voor
iedereen die al toestemming gaf: geen banner-herhaling, geen verloren keuzes. Verifieer wel álle
toestandsvarianten live (vers / oude vorm / legacy-string / geweigerd) — "geen migratie nodig" is
een aanname tot je het gemeten hebt.

---

## 17. Een rusttoestand-sweep laat de helft van je kleuren ongemeten (Sessie 227)

Contrastspecs meten wat `getComputedStyle` op een element teruggeeft. Dat is per definitie de
**rusttoestand** — dus `:hover`, `:focus-visible` en `:active` worden nooit aangeraakt. Vier
defecten die in Sessie 227 boven kwamen zaten precies daar, en drie ervan waren **onder AA**:

```
.btn-secondary:hover        --color-ui-primary als TEKST   2,61-2,77 (light)   onder AA
.gids-sample-link:hover     --color-cta-primary            2,76                onder AA
--color-link-hover (dark)   #58a6ff op --color-bg-modal    6,85                onder AAA
```

De `.gids-sample-link` is het scherpste voorbeeld: Sessie 221 repareerde daar de **rust**-kleur
naar `--color-accent-text` (8,07:1) en liet de hover op het oude merkgroen staan. Twee sessies
lang groen, want geen enkele spec keek.

**Simuleer de hover niet** — een muis-hover per element over 16 pagina's maakt de suite
onwerkbaar. Toets in plaats daarvan de **token-matrix**: verzamel tijdens de element-sweep de
verzameling effectieve achtergronden waar het token feitelijk op landt, en zet élk verwant
token daar tegenaan.

```js
const achtergronden = new Set();
achtergronden.add(effBg(document.body));           // ondergrens: de paginakleur zelf
for (const el of kandidaten) achtergronden.add(effBg(el));

for (const naam of ['--color-link', '--color-link-hover'])
  for (const bg of achtergronden)
    if (ratio(token(naam), bg) < 7) overtreders.push(`${naam} op ${bg}`);
```

Die ondergrens is niet cosmetisch: vier pagina's (contact + de drie sample-pagina's) dragen in
light **nul** elementen met een link-token — hun links staan op knopstijlen, en de navbar is
Dark Frame met een eigen token. Zonder de body-achtergrond zou de matrix daar niets toetsen.

**De mutant die dit bewijst faalt anders dan de rest.** `--color-link-hover` in dark
terugzetten gaf *4 rood, 12 groen*, en die 4 uitsluitend op de token-matrix — de element-sweep
bleef groen, want een hover-kleur komt in rust nergens voor.

---

## 18. Bevries transities voordat je meet; wachten is geen oplossing (Sessie 227)

§15 zegt al dat een lopende transitie een tussenframe oplevert. De remedie die daar (en in
Sessie 226) stond — "wacht ~700 ms" — is **niet betrouwbaar**. Gemeten op dezelfde pagina, met
dezelfde wachttijd, twee opeenvolgende runs:

```
run A   .related-category (light)   7,88:1  op rgb(242,249,255)   ← badge over de WITTE kaart
run B   .related-category (light)   1,70:1  op rgb(32,44,56)      ← badge over de DONKERE kaart
```

En het aantal gemeten elementen wisselde mee (106 vs 110 op één pagina). De oorzaak is niet de
kleurtransitie maar de fade-ins uit `animations.css`: die bepalen wanneer een kaart zijn
eindstaat heeft, en dat hangt van timing af die je niet in de hand hebt. Een guard die soms
1,70 meet gaat willekeurig rood — en wordt dan weggeklikt.

Haal de race wég in plaats van hem te overleven:

```js
await page.addStyleTag({ content:
  `*, *::before, *::after { transition: none !important; animation: none !important; }` });
```

`getComputedStyle` geeft daarna per definitie de eindwaarde. Drie runs erna byte-identiek.
`!important` is hier het juiste gereedschap — dit is een **meetinstrument** dat auteur-CSS
moet verslaan, geen productiecode (vgl. de vuistregel om `!important` in `styles/` te mijden).

> Diagnostisch signaal, uit §10 en hier bevestigd: komt een gemeten kleur **of achtergrond**
> met geen enkel token overeen, dan meet je een tussenframe. Let op dat het ook de
> ACHTERGROND kan zijn die achterloopt, niet alleen de tekstkleur — dat kostte hier een
> verkeerde diagnose ("de fix heeft iets gesloopt") voordat een directe inspectie 7,88 gaf.

---

## 19. Een guard die op een tokenlijst filtert, bewaakt geen klasse (Sessie 228)

§17 loste "de rusttoestand-sweep ziet geen hover" op met een token-**matrix**. Dat werkte —
maar de matrix filterde zelf op vijf tokennamen, en dat is dezelfde fout één laag hoger.
Drie sessies achter elkaar (226, 227, #72) repareerden telkens de vindplaats die toevallig
in de lijst stond. Ongefilterd gemeten waren het **152 element-toestanden onder AA en 378
onder AAA, over 18 kleurwaarden**.

**Draai de populatie om.** Meet élk element dat zelf een tekstnode rendert, en laat de
uitzonderingen zich verantwoorden:

```js
for (const el of document.querySelectorAll('*')) {
  if (!eigenTekst(el)) continue;                 // container die alleen doorgeeft telt niet
  if (el.getClientRects().length === 0) { uitgesloten.push('geen-rects'); continue; }
  if (effOpacity(el) === 0)             { uitgesloten.push('opacity-0');  continue; }
  const rauw = parse(getComputedStyle(el).color);
  if (!rauw || rauw.a === 0)            { uitgesloten.push('transparant'); continue; }
  // alpha < 1 landt ÓP de achtergrond; ratio() negeert alpha
  const kleur = rauw.a < 1 ? over(rauw, effBg(el)) : rauw;
  …
}
// En asserteer de uitsluitingen: een sweep die stil overslaat kan een defect wegfilteren.
expect(uitgesloten.filter(u => !TOEGESTAAN.has(u.reden))).toEqual([]);
```

### Vier meetgaten, elk met een gemeten voorbeeld

| gat | wat er gebeurt | wat het kostte |
|---|---|---|
| **tokenfilter** | wat niet in de lijst staat, wordt niet gemeten | `--color-footer-link` #c9d1d9 op de witte cookiebanner: **1,54:1**, op élke pagina |
| **geen scroll** | `opacity: 0` tot een observer `.visible` zet | de hele `.level-badge`-groep — met de laagste waarde van de site (**1,74:1**) |
| **één viewport** | de large-text-lat kantelt met de basisfont | blog-`<strong>` is LARGE op desktop (lat 4,5, haalt 6,70) en normaal op mobiel (lat 7,0): **115 falers alleen mobiel**, 54 alleen desktop |
| **alleen rust** | sommige tokens renderen pas ná interactie | `--color-warning` 2,60 en `--color-info` 4,89 in `.tip-box`/`.terminal-output-warning`; en een `<input>` heeft géén tekstnode, dus de getypte prompttekst (1,96:1) is onzichtbaar voor `eigenTekst()` |

Groepeer bevindingen op **kleurwaarde**, niet op tokennaam: #a1a8b0 is tegelijk
`--color-text-dim`, `--color-ui-secondary` én `--color-text-muted`, dus per token
rapporteren verdeelt één defect over drie regels en verbergt de omvang.

### Een uitzondering is een assertie, geen notitie

`--color-cta-primary` haalt AAA niet als tekst (6,71 op #f8f8f8) en dát is correct — het is
een oppervlak. Schrijf dan niet "niet als tekst gebruiken" maar:

```js
// NUL elementen mogen tekst in deze kleur renderen.
expect(rijen.filter(r => r.kleur === tokenWaarde('--color-cta-primary'))).toEqual([]);
```

Die assertie ving in de mutantenreeks wat géén contrastdrempel vangt: `.gids-price` terug op
het oppervlak-token geeft **1 failed / 30 passed**, terwijl de sweep groen blijft omdat
#166534 daar 7,07:1 haalt. Zonder haar is de regel ononderscheidbaar van geen regel.

Geef de uitzondering-op-de-uitzondering er één bij. In dark valt `--color-cta-primary` samen
met `--color-accent-text` (allebei #9fef00), dus kleurvergelijking kan ze daar niet
onderscheiden en de check slaat over — vastgelegd in `gelijkInThema` en geasserteerd, zodat
hij vanzelf weer aangaat zodra de waarden uit elkaar lopen.

### Twee meetvallen die hierbij horen

- **`getComputedStyle` liegt niet, maar meet ook onzichtbare dingen.** Een element met
  `opacity: 0` levert gewoon een kleur — 54 valse metingen, waaronder een "defect" van
  1,00:1 op de thema-indicator.
- **Een themawissel is meer dan `data-theme`.** `navbar.js:290` verplaatst óók de
  `.active`-klasse van de toggle. Zet je alleen het attribuut, dan meet je een combinatie
  die op de echte site niet bestaat. `zetThema()` synchroniseert dat sinds Sessie 228.

> Vuistregel: als je guard een **lijst** als populatie heeft, bewaakt hij die lijst — niet
> het probleem. Vraag bij elke nieuwe guard: wat is hier de klasse, en wat is de goedkoopste
> manier om de héle klasse te meten in plaats van de exemplaren die ik nu toevallig ken?
