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

## Openstaande backlog (Sessie 170)

`current.md` houdt feitelijk **Sessie 81-170** (~568 KB); `SESSIONS.md` claimt stale "88-160".
De 5-per-keer-regel haalt deze backlog nooit in. **Eenmalige catch-up bij volgende rotatie
(Sessie 175):** archiveer Sessie 81-164 naar range-archieven (voorstel-split:
`archive-s081-s120.md` + `archive-s121-s164.md`), houd 165+ in `current.md`, corrigeer de
`SESSIONS.md`-index. Daarna draait de steady-state-regel schoon.

> Niet uitvoeren als losse housekeeping zonder dat het in een sessie past — het is grote-bestand-
> surgery; doe het mét de occurrence-assert-techniek en de `validate-docs.sh`-gate.

## Overlap-notitie

`recent.md` (Sessie 78-82) en `current.md` (vanaf ~81) overlappen op 81-82 — pre-existing
data-artefact uit de Sessie 87-split. Bij de catch-up: laat de legacy `recent.md`-kopie staan
(bevroren) en behoud de `current.md`-kopie als de te archiveren bron; dedup niet nodig.
