# Brevo-setup — lead magnet "Juridische Gids sample"

**Status:** pagina en PDF staan live; de Brevo-kant vraagt één handmatige keuze van Heisenberg.

---

## Wat er al werkt (zonder actie)

`sample-juridisch.html` gebruikt **hetzelfde Brevo-formulier** als `sample-pentest.html` — dezelfde
`action`-URL, dezelfde lijst. Dat is bewust:

- Je hoeft in Brevo **niets** aan te maken om de pagina te laten werken.
- De bezoeker krijgt de PDF direct na verzenden te zien (same-origin download in het
  success-panel), dus de download hangt niet af van de mail.
- Eén nieuwsbrieflijst blijft één lijst — geen versnipperde publiek-segmentatie bij dit volume.

De download zelf loopt via `/assets/samples/juridische-gids-sample.pdf`, gebouwd uit
`docs/products/juridische-gids-sample.typ` met `./build-pdfs.sh`.

---

## Het haakje: de welkomstmail klopt niet voor deze instroom

`welkomstmail-sample-pentest.html` is geschreven voor de pentest-sample. Wie zich nu via de
**juridische** pagina inschrijft, krijgt een mail die begint met *"Hieronder vind je het gratis
sample van Je Eerste Pentest"* — en een link naar de verkeerde PDF.

De bezoeker heeft zijn PDF op dat moment al (via het success-panel), dus er gaat niets verloren.
Maar de mail belooft iets anders dan hij aanvroeg, en dat is precies het soort detail dat
vertrouwen kost.

### Drie opties, in volgorde van moeite

| # | Aanpak | Moeite | Nadeel |
|---|---|---|---|
| 1 | **Welkomstmail neutraal maken** — noem beide samples met beide downloadlinks | ~15 min, één keer | Iets minder gericht |
| 2 | **Tweede Brevo-formulier + automation** met een eigen welkomstmail | ~45 min | Twee formulieren onderhouden |
| 3 | Niets doen | 0 | Mail belooft het verkeerde |

**Advies: optie 1.** Bij dit volume weegt één kloppende mail zwaarder dan twee gerichte, en het
schaalt vanzelf mee als er ooit een derde sample bij komt.

Concreet voor optie 1: in `welkomstmail-sample-pentest.html` de zin op regel 92 en de preheader
op regel 68 verbreden naar "je gratis sample", en onder de bestaande downloadknop een tweede
knop zetten naar `/assets/samples/juridische-gids-sample.pdf`. Daarna in Brevo de campagne
opnieuw opslaan als template — een **verzonden** campagne kun je niet meer bewerken (zie
Sessie 206).

---

## Meetpunten

De pagina vuurt dezelfde events als de pentest-variant, met eigen labels zodat je ze kunt
scheiden in GA4:

| Event / attribuut | Waarde |
|---|---|
| `data-newsletter-location` | `sample_juridisch` |
| `data-lead-download` | `juridisch` |
| `data-cta-location` (success-panel) | `sample_juridisch_success_panel` |
| `data-cta-location` (cross-sell) | `sample_juridisch_crosssell` |
| `data-lead-magnet` (vanaf gidsen.html) | `juridisch_sample` |

**Wat dit moet uitwijzen:** het pentest-playbook is het enige product met een eigen funnel, en
het enige dat los verkocht. De juridische gids is inhoudelijk het sterkste product en had géén
funnel. Als hij met dezelfde behandeling nog steeds niet verkoopt, weet je dat het aan het
onderwerp ligt en niet aan de toeleiding — dat is de hele reden dat deze pagina bestaat.

Vergelijk na ~2 weken: inschrijvingen per `data-newsletter-location`, en Gumroad-verkopen van
`yzdtfx` vóór en ná.
