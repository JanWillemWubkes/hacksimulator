# Session-log conventie

Canonieke regels voor het roteren/archiveren van sessie-logs. Vastgelegd Sessie 170
omdat de bestemmings-conventie ontbrak → elke bulk-rotatie strandde (155-159 t/m 169 gedeferd).

## Bestandslayout

| Bestand | Rol | Ordening |
|---|---|---|
| `current.md` | **Rolling window** — volledige detail van de meest recente sessies | nieuwste-eerst (top = hoogste sessie) |
| `archive-sNNN-sMMM.md` | **Range-archief** — afgesloten blok geroteerde sessies (NIEUW schema vanaf Sessie 170) | nieuwste-eerst binnen het blok |
| `archive-early.md`, `archive-q3-2024.md`, `archive-q4-2024.md`, `recent.md` | **Legacy, bevroren** — niet hernoemen, niet uitbreiden | — |

> ⚠️ De legacy `archive-q3-2024`/`archive-q4-2024`-namen zijn **feitelijk fout gelabeld**
> (ze bevatten 2025-sessies, niet 2024). Daarom is het datum/kwartaal-schema verlaten.
> Ze blijven bevroren als opake historische labels; gebruik ze niet als rotatie-bestemming.

## Naamgeving range-archief

`archive-sNNN-sMMM.md` — `NNN`/`MMM` zijn **3-cijferig zero-padded**, inclusieve range,
laagste→hoogste in de bestandsnaam (bv. `archive-s081-s120.md`). Zelf-documenterend en
immuun voor het kapotte datum-schema.

## Rotatie-regel (steady state)

Bij elke `/summary` waar `N % 5 == 0`:
1. Bepaal het te archiveren blok: sessies ouder dan de laatste ~10 (houd `current.md` ≈ laatste
   10-15 sessies / **<250 KB**).
2. Knip die entries uit `current.md` en plak ze (nieuwste-eerst) in een **nieuw** range-archief
   voor exact dat blok: `archive-sNNN-sMMM.md` waarin `NNN`-`MMM` de vijf geroteerde sessies zijn.
   Eén blok = één bestand; bestaande archieven worden nooit uitgebreid.
   Neem het **learnings-blok** van een sessie mee mét zijn entry: laat je het staan, dan houdt
   `current.md` een "Sessie N — learnings"-sectie terwijl entry N in het archief zit (vastgesteld
   bij Sessie 220, opnieuw geraakt bij 230).
3. Er is geen afsluit-drempel voor een range-archief. De <250 KB uit stap 1 geldt alleen voor
   `current.md`; een archief is per definitie af zodra het geschreven is.
4. Werk de index in **`SESSIONS.md`** bij: nieuw range-entry + gecorrigeerde `current.md`-range.
5. `validate-docs.sh` exit 0 als gate.

Knip-techniek voor grote bestanden (>25k tokens) zoals `current.md`: Python met
occurrence-asserts (entry-count behouden, geen dubbele scheiders) — zie Sessie 164/167-learnings.

> **Waarom één bestand per blok, en niet "vullen tot 250 KB" (gewijzigd Sessie 235).** Tot dan
> zei stap 2 *"plak in het **lopende** range-archief"* en stap 3 *"sluit af bij ~250 KB"*. De
> praktijk deed sinds `archive-s165-s169.md` iets anders: **twaalf opeenvolgende blokken van
> exact vijf**, zonder uitzondering. Gemeten bij die wijziging: het grootste blok-van-vijf is
> **81 KB** (`archive-s215-s219.md`), een derde van de drempel — die zou pas rond vijftien
> sessies per archief in beeld komen. De regel was dus dode letter, en tegelijk gevaarlijk:
> hem volgen betekent 220-224 in een bestand plakken dat `s215-s219` heet, waarmee de
> **naamgeving een leugen wordt** die elke latere lezer op het verkeerde been zet. De
> bestandsnaam is de invariant — ook als een blok ooit ongewoon groot uitvalt blijft het één
> bestand met de juiste range in zijn naam.
>
> De twee uitschieters (`archive-s081-s120.md` 151 KB en `archive-s121-s164.md` 378 KB) zijn
> de **eenmalige catch-up** van Sessie 176, geen steady state.

## Catch-up backlog — OPGELOST (Sessie 176)

De eenmalige catch-up is uitgevoerd (na Sessie 176, met de occurrence-assert-techniek):
Sessie 81-164 zijn geknipt uit `current.md` naar `archive-s081-s120.md` (31 entries) en
`archive-s121-s164.md` (47 entries); `current.md` houdt nu het rolling window **165-176**
(12 entries, ~64 KB) en de `SESSIONS.md`-index is gecorrigeerd. Vanaf hier draait de
steady-state `N%5`-regel hierboven schoon — geen backlog meer.

> De knip was byte-voor-byte geverifieerd (`prefix+keep+mid+old == origineel`, 609.005 bytes;
> header-tellingen 12/47/31 = 90). De duplicaat-genummerde entries (Sessie 160 ×3, Sessie 141 ×2)
> zitten volledig in `archive-s121-s164.md`.

## Overlap-notitie

`recent.md` (Sessie 78-82) en `current.md` (vanaf ~81) overlappen op 81-82 — pre-existing
data-artefact uit de Sessie 87-split. Bij de catch-up: laat de legacy `recent.md`-kopie staan
(bevroren) en behoud de `current.md`-kopie als de te archiveren bron; dedup niet nodig.
