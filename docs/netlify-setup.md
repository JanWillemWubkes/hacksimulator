# Netlify Setup Guide - HackSimulator.nl

**Laatst bijgewerkt:** 12 november 2025
**Status:** Pre-launch configuration

---

## 📋 Huidige Situatie

Je ziet **twee sites** in je Netlify dashboard:
1. `hacksimulator`
2. `famous-frangollo-b5a758`

Dit document helpt je om:
- ✅ Te bepalen of dit duplicates zijn of dezelfde site
- ✅ De juiste site te behouden
- ✅ Klaar te zijn voor custom domain setup

---

## 🔍 Deel 2A: Netlify Sites Audit

### Stap 1: Check Beide Sites in Dashboard

Open je Netlify dashboard en voer deze checks uit:

#### Voor Site 1: `hacksimulator`

1. Klik op de site naam in je dashboard
2. Ga naar: **Settings** → **General** → **Site details**
3. Noteer de volgende informatie:

```
Site naam: hacksimulator
Site ID: [noteer hier, bijv. a1b2c3d4-e5f6-7890-abcd-ef1234567890]
Site URL: [noteer hier, bijv. hacksimulator.netlify.app]
Deploys from: [noteer hier, bijv. GitHub - JanWillemWubkes/hacksimulator]
Production branch: [noteer hier, meestal "main"]
```

#### Voor Site 2: `famous-frangollo-b5a758`

Herhaal bovenstaande stappen:

```
Site naam: famous-frangollo-b5a758
Site ID: [noteer hier]
Site URL: [noteer hier, bijv. famous-frangollo-b5a758.netlify.app]
Deploys from: [noteer hier]
Production branch: [noteer hier]
```

---

### Stap 2: Vergelijk de Site IDs

**Scenario A: Site IDs zijn HETZELFDE**

→ **Dit is één site met twee namen (alias)**

**Wat gebeurde:**
- Je hebt de site oorspronkelijk aangemaakt met auto-generated naam `famous-frangollo-b5a758`
- Later hernoemd naar `hacksimulator`
- Netlify toont beide namen in de lijst, maar het is dezelfde site

**Actie:**
- ✅ **Geen actie nodig!** Dit is normaal gedrag
- De oude naam blijft werken als fallback URL
- Beide URLs wijzen naar dezelfde deployment

**Aanbeveling:**
- Gebruik `hacksimulator.netlify.app` in je README/docs
- Oude URL blijft werken (handig als backup)

---

**Scenario B: Site IDs zijn VERSCHILLEND**

→ **Dit zijn twee aparte sites (duplicate deployment)**

**Wat gebeurde:**
- Je hebt per ongeluk twee keer gedeployed vanuit GitHub
- Of: Je hebt handmatig een tweede site aangemaakt
- Beide sites zijn actief en consumeren deployment minuten

**Actie:**
- 🗑️ **Eén site moet verwijderd worden**

**Welke behouden?**
- ✅ **Behoud:** `hacksimulator` (custom naam, professioneler)
- ❌ **Verwijder:** `famous-frangollo-b5a758` (auto-generated naam)

**Hoe verwijderen:**
1. Ga naar de site `famous-frangollo-b5a758`
2. Settings → General → scroll helemaal naar beneden
3. Klik: **Delete site**
4. Bevestig door site naam te typen
5. Verifieer dat `hacksimulator` site nog steeds werkt

---

### Stap 3: Verifieer GitHub Integration

**Check dat je hoofdsite correct deployt:**

1. Ga naar je `hacksimulator` site in Netlify
2. Klik op: **Deploys** tab
3. Check laatste deploy:
   - ✅ Status: **Published**
   - ✅ Branch: **main**
   - ✅ Commit: [laatste commit message]

4. Ga naar: **Site settings** → **Build & deploy** → **Continuous deployment**
5. Verifieer:
   - ✅ **Repository:** github.com/JanWillemWubkes/hacksimulator
   - ✅ **Production branch:** main
   - ✅ **Deploy contexts:** Production branch only (of All branches)

---

## 🌐 Deel 3: Custom Domain Setup (hacksimulator.nl)

### Pre-Requisites

Voordat je begint met custom domain setup:

- [ ] MVP testing is voltooid (M5 milestone complete)
- [ ] Je bent tevreden met de beta versie
- [ ] Je hebt budget voor domein registratie (€8-12/jaar)
- [ ] Je bent klaar voor "officiële" launch

---

### Stap 3.1: Domein Registratie

#### Aanbevolen Registrars (voor .nl domein)

**Optie 1: TransIP** ⭐ (Aanbevolen voor Nederlandse gebruikers)
- **Prijs:** €8-10/jaar voor .nl domein
- **Voordelen:**
  - Nederlandse support
  - SIDN registrar (officieel)
  - Gratis DNS management
  - Gratis DNSSEC
- **Website:** https://www.transip.nl/
- **Setup tijd:** 5 minuten

**Optie 2: Namecheap**
- **Prijs:** ~€10/jaar
- **Voordelen:** Internationaal bekend, goede interface
- **Nadelen:** Support in Engels, geen Nederlandse focus
- **Website:** https://www.namecheap.com/

**Optie 3: Cloudflare Registrar**
- **Prijs:** €8-10/jaar (at-cost pricing)
- **Voordelen:** Snelste DNS, gratis SSL
- **Nadelen:** Moet eerst domain elders registreren en transferren
- **Website:** https://www.cloudflare.com/products/registrar/

**Aanbeveling:** Start met **TransIP** voor gemak en Nederlandse support.

---

### Stap 3.2: Domein Kopen (TransIP Voorbeeld)

1. Ga naar: https://www.transip.nl/
2. Zoek: `hacksimulator.nl`
3. Controleer beschikbaarheid
4. Voeg toe aan winkelwagen
5. **Optionele add-ons:**
   - ✅ **WHOIS Privacy:** JA (verbergt je persoonlijke gegevens)
   - ❌ **Email hosting:** NEE (niet nodig voor MVP)
   - ✅ **DNSSEC:** JA (als gratis)
6. Afrekenen (€8-10)
7. Account activeren via email

---

### Stap 3.3: Netlify Custom Domain Configuratie

#### In Netlify Dashboard:

1. Ga naar je `hacksimulator` site
2. Klik: **Domain management** (of **Domain settings**)
3. Klik: **Add custom domain**
4. Voer in: `hacksimulator.nl`
5. Netlify checkt DNS en vraagt bevestiging
6. Klik: **Verify** → **Add domain**

#### Netlify toont nu DNS instructies:

**Je krijgt zoiets te zien:**

```
Configure DNS at your domain provider:

Option A: ALIAS/ANAME Record (Recommended)
────────────────────────────────────────
Type: ALIAS (or ANAME)
Name: @ (or leave empty)
Value: hacksimulator.netlify.app
TTL: 300 (or Automatic)

Option B: A Record (Simple)
────────────────────────────
Type: A
Name: @ (or leave empty)
Value: 75.2.60.5
TTL: 300

For www subdomain (Optional):
─────────────────────────────
Type: CNAME
Name: www
Value: hacksimulator.netlify.app
TTL: 300
```

**Noteer deze informatie!** Je hebt het nodig voor de volgende stap.

---

### Stap 3.4: DNS Configuratie bij TransIP

#### Open TransIP DNS Panel:

1. Log in op: https://www.transip.nl/cp/
2. Ga naar: **Domeinen** (linker menu)
3. Klik op: `hacksimulator.nl`
4. Klik op: **DNS** tab

#### Verwijder Standaard Records:

TransIP plaatst automatisch "parking page" records. Verwijder deze:

- ❌ Verwijder: A record naar TransIP parking IP
- ❌ Verwijder: AAAA record (IPv6) naar TransIP parking
- ✅ Behoud: NS records (nameservers - niet aanraken!)

#### Voeg Netlify Records Toe:

**Optie A: ALIAS Record** (Aanbevolen als TransIP dit ondersteunt)

Klik: **Record toevoegen**

```
Type: ALIAS (of ANAME als beschikbaar)
Naam: @ (laat leeg of typ @)
Waarde: hacksimulator.netlify.app
TTL: 300 (of laat op Automatisch)
```

Klik: **Opslaan**

**Optie B: A Record** (Als ALIAS niet beschikbaar)

Klik: **Record toevoegen**

```
Type: A
Naam: @ (laat leeg of typ @)
Waarde: 75.2.60.5
TTL: 300
```

Klik: **Opslaan**

**Voor www Subdomain** (Optioneel maar aanbevolen):

Klik: **Record toevoegen**

```
Type: CNAME
Naam: www
Waarde: hacksimulator.netlify.app (zonder https://)
TTL: 300
```

Klik: **Opslaan**

**Eindresultaat in TransIP DNS:**

```
Type    Naam    Waarde                          TTL
────    ────    ──────                          ───
NS      @       ns1.transip.nl                  86400
NS      @       ns2.transip.nl                  86400
ALIAS   @       hacksimulator.netlify.app       300
CNAME   www     hacksimulator.netlify.app       300
```

---

### Stap 3.5: DNS Propagatie (Wachten)

**Wat gebeurt er nu:**

1. TransIP DNS servers updaten (1-5 minuten)
2. Wereldwijde DNS cache vernieuwt (15 minuten - 48 uur)
3. Netlify detecteert DNS wijziging (5-15 minuten)
4. Netlify vraagt Let's Encrypt SSL certificaat aan (5-30 minuten)

**Gemiddelde tijd:** 30 minuten - 2 uur

**Check DNS Propagatie:**

Open terminal:

```bash
# Check of DNS wijziging zichtbaar is
dig hacksimulator.nl

# Verwachte output:
# ;; ANSWER SECTION:
# hacksimulator.nl.    300    IN    A    75.2.60.5
# (of ALIAS naar hacksimulator.netlify.app)
```

**Online Check:**
- https://dnschecker.org/
- Voer in: `hacksimulator.nl`
- Check dat wereldwijd de juiste IP/ALIAS getoond wordt

---

### Stap 3.6: SSL Certificaat (Automatisch)

**Netlify regelt dit automatisch!**

#### Check SSL Status:

1. Ga naar Netlify → je `hacksimulator` site
2. Klik: **Domain management** → **HTTPS**
3. Wacht tot status verandert:
   - ⏳ "Waiting for DNS propagation" → DNS nog niet gezien
   - ⏳ "Provisioning certificate" → Let's Encrypt aanvraag bezig
   - ✅ **"Certificate active"** → HTTPS werkt!

**Gemiddelde tijd:** 5-30 minuten na DNS propagatie

**Als SSL na 2 uur niet actief:**
1. Check DNS records opnieuw in TransIP
2. Klik in Netlify: **Verify DNS configuration**
3. Probeer: **Renew certificate** knop

---

### Stap 3.7: Redirects Configureren

Nu je custom domain werkt, configureer redirects voor beste UX:

#### Update `netlify.toml` in je Repository:

Voeg toe aan het bestaande `netlify.toml` bestand:

```toml
# Redirect www naar apex domain (www.hacksimulator.nl → hacksimulator.nl)
[[redirects]]
  from = "https://www.hacksimulator.nl/*"
  to = "https://hacksimulator.nl/:splat"
  status = 301
  force = true

# Redirect HTTP naar HTTPS (force SSL)
[[redirects]]
  from = "http://hacksimulator.nl/*"
  to = "https://hacksimulator.nl/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.hacksimulator.nl/*"
  to = "https://hacksimulator.nl/:splat"
  status = 301
  force = true

# Optional: Redirect oude Netlify subdomain naar custom domain
# Schakel dit IN als je wilt dat oude links automatisch redirecten
# [[redirects]]
#   from = "https://famous-frangollo-b5a758.netlify.app/*"
#   to = "https://hacksimulator.nl/:splat"
#   status = 301
#   force = true

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    # Force HTTPS for 1 jaar
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

    # Prevent clickjacking
    X-Frame-Options = "DENY"

    # Prevent MIME sniffing
    X-Content-Type-Options = "nosniff"
```

**Commit & Push:**

```bash
git add netlify.toml
git commit -m "Add custom domain redirects and security headers"
git push
```

Netlify zal automatisch re-deployen en de redirects activeren.

---

### Stap 3.8: URLs Updaten in Project

**Update README.md:**

Verander:
```markdown
**🚀 Live Demo:** [https://famous-frangollo-b5a758.netlify.app/](https://famous-frangollo-b5a758.netlify.app/)
```

Naar:
```markdown
**🚀 Live Site:** [https://hacksimulator.nl](https://hacksimulator.nl)
```

Ook update de Development Status sectie:
```markdown
| 🔜 **Coming** | Custom domain (hacksimulator.nl) |
```

Naar:
```markdown
| ✅ **Live** | Custom domain (hacksimulator.nl) |
```

**Update package.json:**

```json
{
  "homepage": "https://hacksimulator.nl",
  "repository": {
    "type": "git",
    "url": "https://github.com/JanWillemWubkes/hacksimulator.git"
  }
}
```

**Update GitHub Repository Settings:**

1. Ga naar: https://github.com/JanWillemWubkes/hacksimulator
2. Klik: **Settings** (repo settings, niet account)
3. Scroll naar: **About** sectie (rechtsboven op main repo page)
4. Klik: ⚙️ (edit button)
5. Update **Website:** `https://hacksimulator.nl`
6. Klik: **Save changes**

**Commit alle changes:**

```bash
git add README.md package.json
git commit -m "Update URLs to custom domain hacksimulator.nl"
git push
```

---

### Stap 3.9: Testing Checklist

Test alle URLs en redirects:

#### Primary Domain:
- [ ] `http://hacksimulator.nl` → redirects naar `https://hacksimulator.nl` ✅
- [ ] `https://hacksimulator.nl` → werkt ✅
- [ ] SSL certificaat is geldig (groen slotje in browser) ✅

#### WWW Subdomain:
- [ ] `http://www.hacksimulator.nl` → redirects naar `https://hacksimulator.nl` ✅
- [ ] `https://www.hacksimulator.nl` → redirects naar `https://hacksimulator.nl` ✅

#### Old Netlify Subdomain (Optioneel):
- [ ] `https://famous-frangollo-b5a758.netlify.app` → works (fallback URL) ✅
- [ ] Of: redirects naar custom domain (als redirect geconfigureerd) ✅

#### Functionaliteit:
- [ ] Site laadt correct ✅
- [ ] Terminal werkt ✅
- [ ] Commands werken ✅
- [ ] Dark/Light mode toggle werkt ✅
- [ ] Legal pages (Privacy, Terms, Cookies) werken ✅

#### Performance:
- [ ] Lighthouse score > 85 (run in incognito) ✅
- [ ] Load time < 3 seconden ✅

---

### Stap 3.10: Search Console & Analytics (Optioneel)

**Google Search Console:**

1. Ga naar: https://search.google.com/search-console
2. Voeg property toe: `hacksimulator.nl`
3. Verificatie methode: **DNS** (via TransIP TXT record)
4. Submit sitemap: `https://hacksimulator.nl/sitemap.xml` (maak deze later)

**Google Analytics:**

1. Vervang `G-XXXXXXXXXX` in `src/analytics/tracker.js`
2. Test dat analytics werkt: Real-time rapport in GA4

---

## 🎉 Launch Checklist

Alles klaar voor officiële launch? Check deze lijst:

### Pre-Launch:
- [ ] MVP testing voltooid (M5 milestone)
- [ ] Alle P0 bugs gefixt
- [ ] Cross-browser testing gedaan (Chrome, Firefox, Safari)
- [ ] Mobile testing gedaan (iPhone, Android)
- [ ] Legal pages compleet (Privacy, Terms, Cookies)
- [ ] Analytics geconfigureerd
- [ ] Contact email ingesteld (voor Code of Conduct)

### Domain Setup:
- [ ] Domein geregistreerd (hacksimulator.nl)
- [ ] DNS geconfigureerd in TransIP
- [ ] SSL certificaat actief in Netlify
- [ ] Redirects geconfigureerd (www → apex, http → https)
- [ ] URLs geüpdatet in README, package.json, GitHub

### Launch Announcement:
- [ ] README "Work in Progress" badge verwijderd
- [ ] GitHub Release v1.0.0 aangemaakt
- [ ] Announcement post geschreven
- [ ] Delen op: Reddit, Hacker News, LinkedIn, Twitter

---

## 🆘 Troubleshooting

### DNS Werkt Niet Na 24 Uur

**Symptoom:** `hacksimulator.nl` opent niet, "Server not found"

**Oplossing:**
1. Check DNS records in TransIP (typ exact zoals instructies)
2. Run: `dig hacksimulator.nl` → moet IP of ALIAS tonen
3. Check nameservers: `dig hacksimulator.nl NS` → moet TransIP nameservers tonen
4. Als NS records verkeerd: Wacht 48 uur (registrar propagatie)

### SSL Certificaat Provisioning Faalt

**Symptoom:** "Certificate provisioning failed" in Netlify

**Oplossing:**
1. Verifieer DNS records 100% correct zijn (geen types, exacte waardes)
2. Wacht 1 uur → Probeer: **Verify DNS configuration** in Netlify
3. Als blijft falen: Verwijder custom domain in Netlify → voeg opnieuw toe
4. Check CAA record in DNS: Moet Let's Encrypt toestaan (of geen CAA record)

### Site Laadt Niet Met Custom Domain

**Symptoom:** DNS werkt, SSL werkt, maar site toont error/leeg

**Oplossing:**
1. Check Netlify deploy log: Laatste deploy succesvol?
2. Check `netlify.toml` publish directory: `publish = "."`
3. Check index.html in root directory (niet in subdirectory)
4. Trigger manual deploy: Netlify → Deploys → "Trigger deploy"

### Redirects Werken Niet

**Symptoom:** www.hacksimulator.nl opent maar redirects niet

**Oplossing:**
1. Check `netlify.toml` syntax (gebruik YAML validator)
2. Check deploy log: "Processing redirects rules" moet succesvol zijn
3. Hard refresh browser: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
4. Test in incognito mode (cache bypass)

---

## 📚 Referenties

**Netlify Docs:**
- Custom Domains: https://docs.netlify.com/domains-https/custom-domains/
- Redirects: https://docs.netlify.com/routing/redirects/
- HTTPS/SSL: https://docs.netlify.com/domains-https/https-ssl/

**TransIP Docs:**
- DNS Beheer: https://www.transip.nl/knowledgebase/artikel/49-dns-records-wijzigen/
- DNSSEC: https://www.transip.nl/knowledgebase/artikel/110-dnssec-activeren/

**DNS Tools:**
- DNS Propagation Checker: https://dnschecker.org/
- DNS Lookup: https://mxtoolbox.com/SuperTool.aspx
- SSL Checker: https://www.ssllabs.com/ssltest/

---

**Laatste Update:** 12 november 2025
**Versie:** 1.0
**Maintainer:** Jan Willem (HackSimulator.nl)
