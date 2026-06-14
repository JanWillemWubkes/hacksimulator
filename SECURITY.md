# Beveiligingsbeleid — HackSimulator.nl

HackSimulator.nl is een browsergebaseerde, client-side terminal-simulator om ethisch hacken te
leren. Er is geen backend: de site draait volledig in je browser en bewaart data lokaal
(localStorage). We stellen verantwoorde meldingen van beveiligingsproblemen op prijs.

## Een kwetsbaarheid melden

Mail je bevinding naar **contact@hacksimulator.nl**. Vermeld waar mogelijk:

- een beschrijving van het probleem en de impact;
- stappen om het te reproduceren (URL, command, browser/versie);
- eventuele proof-of-concept.

We bevestigen ontvangst en houden je op de hoogte van de afhandeling. Geef ons redelijke tijd om
een probleem op te lossen voordat je het openbaar maakt.

## Scope

In scope:

- de website en simulator op `hacksimulator.nl` (HTML/CSS/JS in deze repository);
- configuratie die we zelf beheren (CSP en andere HTTP-headers, redirects).

Buiten scope:

- diensten van derden die we integreren (Google AdSense/Analytics, Brevo, Gumroad, Ko-fi,
  Netlify) — meld die bij de betreffende partij;
- het feit dat publieke identifiers (bijv. AdSense-/Analytics-ID's) zichtbaar zijn; die horen
  publiek te zijn;
- social engineering, spam of fysieke aanvallen.

Let op: de simulator bootst hacking-commands na voor educatieve doeleinden. De getoonde "tools"
voeren geen echte aanvallen uit; gesimuleerd gedrag is geen kwetsbaarheid.

## Geen geldprijzen

Dit is een klein, onafhankelijk project. We bieden geen bug-bounty of vergoeding, maar erkennen
melders graag (met toestemming) als dank.

## Talen

Je mag melden in het Nederlands of Engels.
