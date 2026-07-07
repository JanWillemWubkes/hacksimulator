# Launch Success Metrics — HackSimulator.nl

**Doel:** vóór de launch vastleggen wat "geslaagd" betekent, welke GA4-events dat meten, en hoe je het op de dag afleest. Zonder dit is een launch een verkeersspike die je niet kunt interpreteren.

**Status:** funnel-events zijn in de code bedraad + geverifieerd (Sessie 198). GA4-goals nog handmatig te configureren (zie §4). GA4 Measurement ID: `G-7F792VS6CE`.

> **Brutaal eerlijk over de streefgetallen (§2):** dit zijn *hypotheses*, geen beloftes. Je hebt nul baseline. De échte waarde van de launch is niet "de targets halen" maar **de conversie-percentages leren kennen** zodat je weet wáár de funnel lekt. Behandel elk getal als "als het hier ver onder zit, is dát de les."

---

## 1. De funnel + welk event het meet

| # | Funnel-stap | GA4-event | Bron in code |
|---|-------------|-----------|--------------|
| 0 | Homepage bezocht | `page_view` (auto) | GA4 `send_page_view` |
| 1 | Doorklik naar terminal | `terminal_cta_click` (param `location`: hero/mid/final/leerpad_*) | `cta-tracking.js` |
| 2 | Terminal bereikt | `page_view` op `/terminal.html` (auto) | GA4 |
| 3 | **Activation** — eerste command | `terminal_activated` (once/sessie) | `terminal.js` |
| 4 | Tutorial voltooid | `tutorial` (action=`completed`) | `tutorial-manager.js` |
| 5 | Challenge voltooid | `gamification` (action=`challenge_completed`) | `challenge-manager.js` |
| 6 | **E-mail afgegeven** (durabel bezit) | `newsletter_signup` / `lead_magnet_signup` | `newsletter-tracking.js` |
| — | Betaald product-CTA | `product_cta_click` | `cta-tracking.js` |

De twee die deze sessie zijn toegevoegd (stap 1 en 3) waren de ontbrekende schakels: zonder stap 1 kon je de homepage-conversie niet meten, zonder stap 3 niet of bezoekers de terminal echt *gebruikten*.

---

## 2. Streefgetallen (hypotheses — calibreer na dag 1)

Voor een kleine NL-launch (honderden, geen duizenden bezoekers). Percentages t.o.v. de vorige stap:

| Overgang | Conservatief | Goed | Uitstekend | Wat het je vertelt |
|----------|-------------|------|-----------|--------------------|
| Homepage → terminal-click (1) | 20% | 35% | 50%+ | Landt de **value-prop** in 5 sec? Laag = hero/copy-probleem |
| Terminal bereikt → activation (3) | 40% | 60% | 75%+ | Snappen ze **wat te doen**? Laag = onboarding/first-run-probleem |
| Activation → tutorial completed (4) | 15% | 30% | 45%+ | Is de eerste missie **de moeite/te lang**? |
| Bezoeker → e-mail (6) | 1% | 3% | 6%+ | Je enige **durabele** launch-opbrengst |

**North-star voor deze launch:** *activation-rate* (stap 3 / stap 2). Dat is de zuiverste "vonden vreemden het de moeite waard om íéts te doen". Alles onder ~40% betekent: het product boeit, maar de eerste 30 seconden falen — fix dát vóór je meer verkeer stuurt.

---

## 3. Absolute minimum-doelen (dag 1)

Niet-percentages, maar "is de launch een teken van leven":
- **≥ 1 e-mail-signup van een vreemde** (niet jij/bekenden) = eerste durabele bewijs.
- **≥ 1 voltooide tutorial van een `new` user** = iemand kwam door de kern-loop.
- **terminal_cta_click uit ≥ 2 verschillende `location`s** = de pagina wordt echt gescand, niet alleen de hero.

Als zelfs dit uitblijft bij noemenswaardig verkeer → het is een **distributie- of positioneringsprobleem**, geen productprobleem.

---

## 4. GA4-configuratie (handmatig, vóór launch)

In GA4 (`G-7F792VS6CE`):
1. **Mark as conversions** (Admin → Events → toggle "Mark as key event"): `terminal_activated`, `tutorial` (of maak een key-event op `action=completed`), `newsletter_signup`, `lead_magnet_signup`.
2. **Funnel-exploration** (Explore → Funnel exploration) met stappen: `page_view` (homepage) → `terminal_cta_click` → `page_view` (/terminal.html) → `terminal_activated` → `tutorial` completed → signup. Zet "Show elapsed time" aan.
3. **Custom dimension** op event-param `location` (voor `terminal_cta_click`) en `user_type` — zodat je per CTA-plek en new/returning kunt uitsplitsen. (Admin → Custom definitions → Create custom dimension, scope Event.)
4. **Launch-annotatie** op het launch-moment (Reports → set annotation) voor schone voor/na-vergelijking.
5. **DebugView-check vóór launch:** open de site met de GA4 DebugView open (of de GA Debugger-extensie) en loop de funnel één keer door — bevestig dat elk event uit §1 binnenkomt met de juiste params. (De code-self-test bewees de events vuren; DebugView bewijst dat ze in jóúw property landen.)

---

## 5. Wat NIET meten (bewust)
- Command-argumenten (privacy, PRD §6.6 — code logt alleen command-*namen*).
- Vanity-metrics als "totaal page_views" als losse succesmaat — zonder de conversie-stappen zegt het niets.

---

## 6. Read-order op launch-dag
1. **Real-Time** (eerste uren): vuurt er überhaupt iets? `terminal_activated` verschijnt = mensen dóén iets.
2. **Einde dag 1**: de 4 conversie-percentages uit §2 + de 3 minimum-doelen uit §3.
3. **Dag 2-3**: welke `terminal_cta_click.location` het beste converteert (waar op de pagina mensen klikken) + new-vs-returning activation.
4. **Beslis**: laagste conversie-stap = je volgende werk. Niet meer bouwen aan wat al converteert.

---

**Laatst bijgewerkt:** Sessie 198 (funnel-events bedraad + geverifieerd; GA4-goals nog te configureren door Heisenberg).
