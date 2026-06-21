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
2. Knip die entries uit `current.md` en plak ze (nieuwste-eerst) in het **lopende** range-archief.
3. Bereikt een range-archief ~250 KB → sluit 'm af (definitieve `archive-sNNN-sMMM.md`) en
   open een nieuwe voor het volgende blok.
4. Werk de index in **`SESSIONS.md`** bij: nieuw range-entry + gecorrigeerde `current.md`-range.
5. `validate-docs.sh` exit 0 als gate.

Knip-techniek voor grote bestanden (>25k tokens) zoals `current.md`: Python met
occurrence-asserts (entry-count behouden, geen dubbele scheiders) — zie Sessie 164/167-learnings.

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
