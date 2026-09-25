---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html

**Scope:** de landingspagina. Niet terminal.html, niet src/commands, niet de simulator zelf.
**Visitor mode:** Persuade.

**Publiek:** de absolute beginner die nog nooit een terminal opende, plus de
carriereswitcher die wil weten of security bij hem past. Nederlandstalig, en afgehaakt
op Engels.
**Taak van de bezoeker:** begrijpen wat dit is en de simulator openen.
**Bewijs dat we hebben:** een werkende terminal met echte 80/20-output, 41 commando's,
openbare broncode, natelbare cijfers. Geen testimonials, geen gebruikersaantallen,
geen benchmarks — die mogen niet verzonnen worden.
**Bindende beperkingen:** vanilla JS/CSS, geen buildstap, geen framework. Geen
`!important` in styles/. WCAG AAA-contrast in beide thema's. Geen emoji. Geen dark
patterns.
**Voelt fout (eigenaar, 24 sep 2026):** hackerkostuum, te schools of kinderlijk, te
intimiderend. Niets anders ligt vast: "als iets beter kan, mag het aangepast worden."

---

## Direction contract

**THESIS.** De pagina is een affiche op een zichtbaar raster, in de traditie van Total
Design: de terminal is een module in dat raster, en de Nederlandse uitleg staat per
outputregel exact ernaast, op dezelfde rasterrij. Geweigerd worden de categoriestandaard
(donkere hero, neon, terminalscreenshot, featuretegels) en het voorspelbare tegendeel
(pastel edtech met illustraties).

**OWN-WORLD.** Licht papier (gebroken wit) als grond, zwarte inkt, en precies een
signaalrood dat uitsluitend betekent "hier ben jij aan zet". Een zichtbaar 12-koloms
raster met 1px-haarlijnen; geen schaduwen, geen verlopen, geen afgeronde kaarten.
Toestanden spreken via inversie (zwart blok, papieren letter), niet via extra kleur. De
terminal is een donker blok op het papier en behoudt binnen zijn rand zijn eigen
betekeniskleuren (prompt, tip, fout); dat is inhoud, geen decoratie. Koppen in een
neo-grotesk op afficheschaal, opgebouwd op het raster; JetBrains Mono alleen binnen de
terminal en voor indexnummers. Expliciet niet: scanlines, glow, groen-op-zwart, matrixregen,
mascottes, badges op de voorgrond.

**STORY.** De bezoeker leest eerst wat dit is, ziet dan in hetzelfde scherm een echte
terminal waarvan elke regel in het Nederlands wordt uitgelegd, begrijpt via het netwerkdiagram wat een scan eigenlijk doet,
gelooft dat hij hier niets kan breken, en opent de simulator. Wie twijfelt tikt eerst een
commando en ziet het diagram antwoorden.

**FIRST VIEWPORT.** Maximaal 1400px, 12 kolommen, haarlijnen zichtbaar. Bovenaan de kop
op afficheschaal over negen kolommen: het instappunt en het beeld van het affiche. Vanaf
1280px staat de enige rode actie, "Start de simulator" met "geen account nodig", in de
laatste drie kolommen op de onderste kopregel, en de ondertitel onder de kop; daaronder
alles onder elkaar. Dan links de terminalmodule over zeven kolommen met de nmap-uitvoer,
rechts daarvan op dezelfde rasterrijen de Nederlandse glos per regel. Direct onder de
invoerregel de zes commandochips als knoppen (inktkader, index 01-06, herkomstlabel),
met "Probeer:" en de proefversiezin erboven. Als laatste het netwerkdiagram in één zin:
jouw machine, een scan-pijl, en het routerblok met de twaalf poorten als sleuven erin;
één onderschrift zegt dat een gevulde poort open staat. Onder 768px: een kolom, glos
onder zijn regel, de scan-pijl verticaal.
Herzien in sessie 2b (25 sep 2026): de kop stond eerst onderaan als ondertiteling. Gemeten
gevolg: zeven lagen van gelijk gewicht, kop en actie tegen de onderrand (761-888 op
1440x900, y=947 op 375px), en diagram en chips in dezelfde celvorm met dezelfde
vierkantjes, zodat ze als één tabel lazen.

**FORM.** Vervanging van de visuele wereld (redesign), geen verfijning van de vorige.
Kandidaat 3 van 7 op de eigen lijst ("Crouwel / Total Design"), toegewezen door de loting;
seed key 88f43840. Code-led: er is geen beeldgeneratie, dus geen comp; de ambitie staat in
FIRST VIEWPORT en in de signatuurinteractie hieronder. Verbeteringen uit de ronde, elk als
eigen regel:
- van de netwerkstad: het onzichtbare netwerk zichtbaar maken, in de grammatica van het raster.
- van de 1-bit desktop: toestanden via inversie in plaats van kleur.
- van de nachtvlucht-instrumenten: elke rastermodule draagt een bewering, in vaste leesvolgorde.
- van de zeefdruk-overdruk: exacte registratie van glos op outputregel, zelfde basislijn.
- van de schaduwbazaar: een herkomstlabel per commando (categorie en niveau).
- van de glazuurplank: leerpadlessen als genummerde specimenkaarten met mono-index.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

---

## Memorabel moment

Je tikt `nmap 192.168.1.1`. Links rolt de poortuitvoer uit, rechts verschijnt per regel de
Nederlandse uitleg op dezelfde rij, en in het diagram eronder springen drie uitsparingen in
het hostblok invers open: 53, 80, 443. Het netwerk dat je niet kon zien, staat nu op papier.

## Signatuurinteractie

De registratie: outputregel, glos en diagramuitsparing lichten als een rij tegelijk op. Een
beweging per commando, geen typanimatie, en `prefers-reduced-motion` toont de eindstand.

## Nog niet besloten

- De exacte neo-grotesk voor de koppen: kiezen in `typeset`, buiten de lijst met versleten
  standaardkeuzes uit new-work.md. Atkinson Hyperlegible Next blijft kandidaat voor
  lopende tekst vanwege het functionele argument (verwarbare tekens uit elkaar houden).
- De exacte rode waarde: moet AAA halen als knopvlak met papieren letter en als tekst op
  papier. Meten, niet schatten.
- Het donkere thema: het geïnverteerde affiche (inkt als grond, papier als letter). Blijft
  verplicht, want de themaschakelaar bestaat sitebreed.
- De vorige bouw (terminal-hero, lime-accent, mono-koppen, commit 8b33014) is bewijs van
  wat werkte, geen autoriteit: behouden wat inhoud is (demo, chips, copy), de look vervalt.
