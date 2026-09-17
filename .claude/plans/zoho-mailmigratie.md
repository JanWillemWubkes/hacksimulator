# Runbook: mailmigratie TransIP -> Zoho Mail Free

**Doel:** contact@hacksimulator.nl van het TransIP e-mailpakket (~EUR 8/mnd) naar Zoho Mail
Forever Free (EUR 0), zonder de site, de Brevo-nieuwsbrief of DMARC te breken.
**Opgesteld:** 12 sep 2026. **Status:** niet gestart.

TransIP-support (Seth Peters, 11 sep 2026) bevestigde: er is GEEN kleiner Email Only-pakket.
Alleen de doorstuurdienst (EUR 6,99/jr), maar die kan niet versturen vanaf contact@.

---

## Rollback-snapshot (gemeten 2026-09-12T10:21Z)

Zet dit terug als er iets misgaat. Alle TTL's zijn al 300s, dus terugdraaien werkt binnen 5 min.

```
A      hacksimulator.nl        300   75.2.60.5
MX     hacksimulator.nl        300   10 mx.transip.email.
CNAME  www                     3600  famous-frangollo-b5a758.netlify.app.
NS                             21600 ns0.transip.net / ns1.transip.nl / ns2.transip.eu
TXT    hacksimulator.nl        300   "v=spf1 a mx include:_spf.transip.email include:spf.brevo.com ~all"
TXT    hacksimulator.nl        300   "google-site-verification=5c9d-C3TYP9t-82ZtB3zw1wLrbIQ-hnevkIHuvmYLxE"
TXT    hacksimulator.nl        300   "brevo-code:11f31cbc6b109f84dd9648ad1c8f3c82"
TXT    _dmarc                  300   "v=DMARC1; p=none; rua=mailto:contact@hacksimulator.nl"
CNAME  brevo1._domainkey       300   b1.hacksimulator-nl.dkim.brevo.com.
CNAME  brevo2._domainkey       300   b2.hacksimulator-nl.dkim.brevo.com.

TransIP-mailrecords (gevonden 12 sep 2026 in de DNS-editor, niet zichtbaar via losse dig):
CNAME  autoconfig              300   autoconfig.transip.email.
CNAME  autodiscover            300   autodiscover.transip.email.
CNAME  transip-a._domainkey    3600  _dkim-A.transip.email.
CNAME  transip-b._domainkey    3600  _dkim-B.transip.email.
CNAME  transip-c._domainkey    3600  _dkim-C.transip.email.

Los aandachtspunt (geen onderdeel van deze migratie):
AAAA   *  (wildcard)           300   2a01:7c8:e100:1::50a0
```

**TTL's bij TransIP:** de editor heeft geen vrij invoerveld maar een vaste lijst
(1 Min. / 5 Min. / 1 Uur / 4 Uur / 8 Uur / 1 Dag). **"5 Min." = 300 seconden** -- dat is de
waarde die overal in dit runbook bedoeld wordt.

**Raak NOOIT aan:** de A-record, de www-CNAME, beide brevo*._domainkey-CNAMEs, de
google-site-verification-TXT en de brevo-code-TXT. Alleen MX en de SPF-TXT wijzigen.

**SPF-lookupbudget (gemeten):** nu 5/10, na de migratie 5/10. Geen risico.

---

## Fase 0 - Bestaande mail veiligstellen  [KRITIEK, doe dit eerst]

Zoho Free heeft geen IMAP, dus je kunt je oude mailarchief er later niet in importeren.
Zeg je TransIP op zonder export, dan is die mail weg.

- [ ] Thunderbird installeren (of een client naar keuze)
- [ ] TransIP-mailbox toevoegen via IMAP (gegevens staan in het TransIP-controlepaneel)
- [ ] Alle mappen laten synchroniseren, daarna rechtermuisknop op de account -> lokale mappen
- [ ] Controleren: staat alles offline op je schijf? Trek je netwerk eruit en lees een oude mail.

Alternatief voor weinig mail: forward de paar berichten die ertoe doen naar je Gmail.

---

## Fase 1 - Zoho-account aanmaken op de EU-regio

**Gemeten 12 sep 2026 in de browser.** De regio wordt bepaald door HOE JE DE SITE BINNENKOMT,
en dat effect is reproduceerbaar:

| ingang | gratis-knop wijst naar | datacenter |
|---|---|---|
| `www.zoho.com/nl/mail/zohomail-pricing.html` | `workplace.zoho.com` | **VS - fout** |
| `www.zoho.eu/mail/zohomail-pricing.html`     | `workplace.zoho.eu`  | **EU - goed** |

`www.zoho.eu` bestaat niet als eigen site: hij stuurt je door naar
`www.zoho.com/nl/mail/zohomail-pricing.html?sredirect=true`. Die **`?sredirect=true`** is het
zichtbare bewijs dat de EU-context actief is. Zonder die parameter wijzen alle knoppen naar
`.com` en land je in het Amerikaanse datacenter.

De directe signup-URL `https://workplace.zoho.eu/signup?type=org&plan=free` werkt wel als je
hem intypt. **Maar de pagina rendert traag:** je ziet eerst alleen het Zoho-logo op een crème
achtergrond, en pas na 3-5 seconden verschijnt het formulier. Blijft hij na ~15 seconden leeg,
zie dan "Lege signup-pagina" onderaan dit document.

### Stappen

- [ ] Open **`https://www.zoho.eu/mail/zohomail-pricing.html`**
- [ ] **Controleer de adresbalk:** je hoort nu op
      `www.zoho.com/nl/mail/zohomail-pricing.html?sredirect=true` te staan.
      Staat `?sredirect=true` er NIET achter? Dan klopt de regio niet -- open de zoho.eu-link
      opnieuw. Typ de `.com`-URL nooit zelf in.
- [ ] Scroll ongeveer een derde van de pagina naar beneden (net voorbij de prijzentabel met
      Workplace Standard / Mail Lite / Mail Premium) naar het blok:
      *"Altijd gratis-abonnement* - E-mailhosting voor een domein voor maximaal 5 gebruikers -
      5 GB e-mailopslag per gebruiker - IMAP/ POP/ Active Sync niet inbegrepen."*
- [ ] Klik daar op **"Nu inschrijven"**
- [ ] **Controleer dat je nu op `workplace.zoho.eu` staat.** Staat er `.com`? Ga terug en
      begin opnieuw bij de zoho.eu-link. De regio ligt vast bij het aanmaken en is daarna
      NIET meer te wijzigen.

### Het aanmeldformulier

- [ ] Laat **"Zakelijk e-mailadres"** aangevinkt staan (dat is de standaard). Kies NIET
      "Persoonlijk e-mailadres" -- dat is de variant zonder eigen domein.
- [ ] Naam invullen
- [ ] **E-mailadres: `contact@hacksimulator.nl`** -- dus je eigen domeinadres, niet je Gmail.
      Hieruit leidt Zoho af welk domein je wilt koppelen. Je TransIP-mailbox draait nog,
      dus post op dit adres komt gewoon binnen.
- [ ] Mobiel nummer (+31) -- Zoho stuurt hier een OTP naartoe; dit veld is niet optioneel
- [ ] Wachtwoord kiezen
- [ ] "Ik ga akkoord met de Servicevoorwaarden" aanvinken
- [ ] De tweede checkbox (marketingberichten) **NIET** aanvinken -- die is optioneel
- [ ] Registreren. Er volgt een OTP-stap en mogelijk een CAPTCHA; die doe je zelf.
- [ ] Na afloop inloggen op **https://mail.zoho.eu**. Blijft dat op `.eu`, dan zit je goed.
      Word je doorgestuurd naar `mail.zoho.com`, dan is de regio fout: verwijder het account
      nu het nog leeg is en begin opnieuw.

Zoho vraagt verderop mogelijk om een alternatief contactadres (`x_contact_email`). Vul daar
je Gmail in -- dat is je herstelpad als je ooit buiten contact@ gesloten raakt.

## Fase 2 - Domein verifieren  (raakt je mail nog niet)

Deze stap voegt alleen een TXT-record toe. Inkomende mail blijft gewoon bij TransIP binnenkomen.

- [ ] Admin Console -> Domains -> Verify. Kies de **TXT**-methode.
- [ ] Zoho geeft een waarde als `zoho-verification=zb########.zmverify.zoho.eu`
- [ ] TransIP -> Domeinen -> hacksimulator.nl -> DNS -> record toevoegen:
      naam `@`, type TXT, TTL 300, waarde = exact wat Zoho gaf
- [ ] Verifieren:
      `dig @8.8.8.8 TXT hacksimulator.nl +short | grep zoho`
- [ ] Terug in Zoho: "Verify". Wacht tot het groen is.

---

## Fase 3 - Adressen inrichten  (moet VOOR de MX-wissel)

Zet je MX om zonder dat `contact@hacksimulator.nl` bestaat, dan bouncet ALLE inkomende mail
naar dat adres met een harde 550 -- geen retry, geen wachtrij, definitief weg.

**Gewijzigd t.o.v. de eerste versie van dit runbook.** Daar stonden contact@ en dmarc@ als
twee aparte gebruikers. Beter is een superuser met aliassen: Zoho staat 30 e-mailaliassen
per postvak toe, ook op het gratis plan, en aliassen tellen niet mee voor de limiet van
5 gebruikers.

Opzet:

```
gebruiker (superuser)   <eigenaar>@hacksimulator.nl   <- login + admin
  alias                 contact@hacksimulator.nl     <- publiek adres, mailto-links, Brevo
  alias                 dmarc@hacksimulator.nl       <- rapportages
```

Waarom beter: één postvak om te lezen in plaats van drie losse webmails, je admin-account
staat los van het publieke adres (dus je kunt contact@ later wijzigen zonder je beheerder
kwijt te raken), en je houdt vier gebruikersplekken vrij.

Exacte route (geverifieerd tegen Zoho's KB, 12 sep 2026):

    Ga naar Beheerderscconsole (linksonder in de wizard)
      -> Gebruikers            [Users]
      -> klik op je gebruiker
      -> Postvakinstellingen   [Mailbox Settings]
      -> E-mailalias           [Email Alias]
      -> Toevoegen             [Add]
      -> aliasnaam invullen, domein hacksimulator.nl kiezen
      -> "Instellen als postvakadres" NIET aanvinken
      -> Toevoegen

- [x] `contact@hacksimulator.nl` staat er al (de `+1`-badge in de gebruikerslijst)
- [ ] `dmarc@hacksimulator.nl` toevoegen als alias via bovenstaande route
- [ ] Filter aanmaken (Instellingen -> Filters): afzender bevat `dmarc` of onderwerp bevat
      `Report domain` -> verplaats naar map "DMARC". Anders lopen de dagelijkse XML-bijlagen
      door je gewone post.
- [ ] Inloggen op https://mail.zoho.eu en controleren dat je de aliassen ziet staan

De wizard-stap "Groepen instellen" kun je overslaan -- groepen zijn gedeelde postvakken voor
teams, die heb je niet nodig.
## Fase 4 - DNS omzetten  (hier gaat de mail daadwerkelijk over)

Doe dit op een moment dat je een uur kunt kijken. Alle TTL's staan op 300s.

**4a. MX vervangen** -- TransIP DNS, verwijder `10 mx.transip.email.` en zet erin
(exacte waarden staan in Zoho Admin Console -> Tools & Configurations; deze verwacht je
voor de EU-regio, controleer ze daar):

```
@   MX   300   10   mx.zoho.eu.
@   MX   300   20   mx2.zoho.eu.
@   MX   300   50   mx3.zoho.eu.
```

**4b. SPF aanpassen** -- wijzig ALLEEN de include, laat de rest van de regel staan:

```
van:  v=spf1 a mx include:_spf.transip.email include:spf.brevo.com ~all
naar: v=spf1 a mx include:zoho.eu include:spf.brevo.com ~all
```

`include:spf.brevo.com` moet blijven staan, anders breekt je nieuwsbrief.
Houd `~all` (softfail); maak er geen `-all` van tijdens een migratie.

**4c. DKIM van Zoho** -- Admin Console -> Email Authentication -> DKIM -> selector aanmaken.
Zoho geeft een selector (vaak `zoho`) plus een lange TXT-waarde. Toevoegen als:
naam `zoho._domainkey`, type TXT, TTL 5 Min. Daarna in Zoho op "Verify" klikken.

**4d. TransIP-mailrecords opruimen** -- pas NA fase 5 en 8, als alles bewezen werkt.
Deze vijf wijzen mailclients en DKIM-validators naar een mailbox die niet meer bestaat:

- [ ] `autoconfig`   CNAME -> autoconfig.transip.email.
- [ ] `autodiscover` CNAME -> autodiscover.transip.email.
- [ ] `transip-a._domainkey` CNAME -> _dkim-A.transip.email.
- [ ] `transip-b._domainkey` CNAME -> _dkim-B.transip.email.
- [ ] `transip-c._domainkey` CNAME -> _dkim-C.transip.email.

Ze zijn niet schadelijk -- een DKIM-record autoriseert alleen, het verplicht niets, en een
autoconfig-record wordt genegeerd als je geen client instelt. Het is opruimen, geen reparatie.
Doe het als aparte stap, niet tegelijk met de MX-wissel: dan weet je bij een probleem welke
wijziging het veroorzaakte.

---

## Fase 5 - Verifieren  (niet "het lijkt te werken")

- [ ] Records kloppen:
```bash
dig @8.8.8.8 MX hacksimulator.nl +short
dig @8.8.8.8 TXT hacksimulator.nl +short | grep spf1
dig @8.8.8.8 TXT zoho._domainkey.hacksimulator.nl +short
dig @8.8.8.8 CNAME brevo1._domainkey.hacksimulator.nl +short
dig @8.8.8.8 A hacksimulator.nl +short
```
      Verwacht: 3x zoho.eu | spf1 met zoho.eu EN spf.brevo.com | DKIM-sleutel |
      brevo-CNAME ongewijzigd | 75.2.60.5

- [ ] **Ontvangen:** stuur vanaf je Gmail een mail naar contact@hacksimulator.nl.
      Komt binnen op mail.zoho.eu.
- [ ] **Versturen:** antwoord vanuit Zoho naar je Gmail. Controleer in Gmail
      "Origineel weergeven": SPF=PASS, DKIM=PASS, DMARC=PASS.
- [ ] **Site:** https://hacksimulator.nl/ laadt nog. (Zou moeten -- je raakte de A niet aan.)

---

## Fase 6 - Brevo controleren

- [ ] Brevo -> Senders: staat `contact@hacksimulator.nl` nog op **Verified**?
- [ ] Brevo -> Domains: staat hacksimulator.nl nog geauthenticeerd (DKIM groen)?
- [ ] Stuur een testcampagne naar je eigen Gmail; check SPF/DKIM/DMARC op PASS.

Gaat hier iets mis, dan is de SPF-regel de eerste verdachte: staat `include:spf.brevo.com`
er nog in?

---

## Fase 7 - DMARC-reports naar een eigen adres

Je `rua` wijst nu naar contact@, wat dagelijkse XML-bijlagen in een 5GB-mailbox betekent.
Dit stond al als voornemen in `.claude/plans/brevo-deliverability-sessie-D.md:90`.

- [ ] `_dmarc` TXT wijzigen naar:
      `v=DMARC1; p=none; rua=mailto:dmarc@hacksimulator.nl`
- [ ] `dig @8.8.8.8 TXT _dmarc.hacksimulator.nl +short`
- [ ] Na een paar dagen: komen er reports binnen op dmarc@?
- [ ] Rapporten samenvatten met `python3 .claude/plans/dmarc-rapport.py <map>`
      (leest .xml/.xml.gz/.zip, groepeert op DMARC-uitkomst i.p.v. op een lijst
      bekende IP's, en zegt expliciet FOUT bij een lege populatie)

### Naar p=quarantine

Pas als de parser `=> Klaar voor p=quarantine; pct=25` meldt: geen falende bronnen,
minstens 7 dagen dekking, minstens 2 rapporterende providers. Ga dan gefaseerd:

```
v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@hacksimulator.nl   <- week 1
v=DMARC1; p=quarantine; pct=50; rua=mailto:dmarc@hacksimulator.nl   <- week 2
v=DMARC1; p=quarantine;         rua=mailto:dmarc@hacksimulator.nl   <- week 3 (=100%)
```

Let op de blinde vlek: rapporten tonen alleen wat er daadwerkelijk verstuurd is.
Zonder Brevo-campagne in de meetperiode staat dat pad niet in de data, en stel je
scherp op onvolledig bewijs.

---

## Fase 8 - Pas NU opzeggen bij TransIP

Niet eerder. Zolang je oude pakket loopt, kun je binnen 5 minuten terug.

- [ ] Wacht minimaal 3-5 dagen nadat fase 5 volledig groen was
- [ ] Mail Seth Peters terug: je wilt het E-mail Only-pakket opzeggen, domeinnaam behouden,
      en GEEN doorstuurdienst (die heb je niet nodig -- je mail loopt via Zoho)
- [ ] **Na de downgrade opnieuw meten.** Een pakketwijziging kan DNS-records terugzetten:
```bash
dig @8.8.8.8 MX hacksimulator.nl +short
dig @8.8.8.8 TXT hacksimulator.nl +short | grep spf1
```
      Wijst de MX weer naar TransIP? Zet hem meteen terug naar zoho.eu.
- [ ] Stuur nog een testmail naar contact@ om te bevestigen dat ontvangen blijft werken

---

## Fase 9 - Documentatie bijwerken

- [ ] `assets/legal/privacy.html` -- verwerkerstabel: Zoho toevoegen (mailhosting,
      EU-datacenter Nederland, link naar Zoho's privacybeleid). De mailprovider ontbrak
      daar al; dit is het moment om dat gat te dichten.
      Geen wijziging nodig aan de paragraaf internationale doorgifte: EU-datacenter.
- [ ] `TASKS.md` -- de regel over Gmail forwarding klopt niet meer
- [ ] Validatiegate draaien voor je commit:
```bash
bash scripts/validate-docs.sh --deep && ./scripts/validate-blogs.sh
```

---

## Bekende beperkingen van deze opstelling

- **Geen IMAP/POP/SMTP** op Zoho Free. contact@ lees en schrijf je in de Zoho-webmail
  (mail.zoho.eu) of de Zoho Mail-app. Geen Thunderbird, geen Gmail-app.
- 5 GB per postvak, 5 adressen, 1 domein.
- Wil je later toch IMAP: **Zoho Mail Lite EUR 0,90/gebruiker/maand, jaarlijks gefactureerd
  = EUR 10,80/jaar** (prijs gemeten op de NL-prijzenpagina, 12 sep 2026). Dat is een upgrade
  binnen hetzelfde account, geen nieuwe migratie -- en goedkoper dan mailbox.org (~EUR 12/jr).


---

## Lege signup-pagina (troubleshooting)

Symptoom: `workplace.zoho.eu/signup` toont alleen het Zoho-logo op een crème achtergrond,
geen formulier. De pagina bouwt zichzelf met JavaScript op en heeft 3-5 seconden nodig.
In de console staan een 403 en een 400 -- die zijn NIET fataal, die zie je ook bij een
geslaagde load.

Diagnose in volgorde van waarschijnlijkheid:

1. **Te vroeg gekeken.** Ctrl+Shift+R (harde herlaad), daarna 10-15 seconden wachten
   zonder te klikken.
2. **Browser-extensie blokkeert scripts.** Open dezelfde URL in een incognitovenster
   (Ctrl+Shift+N) -- daar staan extensies standaard uit.
   - Werkt het daar wel? Dan blokkeert een adblocker/privacy-extensie Zoho. Zet die uit
     voor `zoho.eu` en `zohostatic.eu`, of maak het account gewoon af in incognito.
   - Werkt het daar ook niet? Ga door naar 3.
3. **Kijk wat er echt misgaat.** F12 -> tabblad Console. Rode regels met `net::ERR_BLOCKED`
   of `blocked by client` = een extensie. Andere fouten: noteer ze.

De regio blijft in alle gevallen goed zolang de adresbalk `workplace.zoho.eu` toont --
incognito verandert daar niets aan, want de regio zit in de host van het formulier zelf,
niet in een cookie.

---

## Losse bevinding: wildcard AAAA-record

In de TransIP DNS-editor staat een wildcard dat via losse `dig`-queries niet opvalt:

```
*   AAAA   5 Min.   2a01:7c8:e100:1::50a0
```

Gemeten: `willekeurig-subdomein-test.hacksimulator.nl` resolvet naar dat IPv6-adres, dus
**elk** subdomein dat je niet expliciet hebt gedefinieerd wijst naar TransIP-infrastructuur.

Dit staat los van de mailmigratie en hoeft er niet voor gewijzigd te worden. Maar zodra je
het TransIP-pakket opzegt, wijst je domein naar infrastructuur die niet meer van jou is.
Voor een site over ethisch hacken is dat een ongelukkig detail: `willekeurig.hacksimulator.nl`
blijft dan resolven naar een adres waar jij niets meer te zeggen hebt.

Overweging voor een latere sessie: het wildcard verwijderen, of vervangen door een record
dat naar Netlify wijst. Eerst uitzoeken of er iets op leunt -- `www` heeft een eigen CNAME,
dus waarschijnlijk niet, maar dat is een bewering tot je het meet.