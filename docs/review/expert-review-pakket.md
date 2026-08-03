# Expert-review: kloppen deze beweringen?

**Gegenereerd op:** 2026-08-03 · **Bron:** `scripts/build-review-package.mjs` (opnieuw te genereren met één commando)

---

## Waar je naar kijkt

[HackSimulator.nl](https://hacksimulator.nl/) is een gratis Nederlandstalige oefenterminal waarin
beginners ethisch hacken leren. Alle output is gesimuleerd; er wordt nooit een echt systeem geraakt.

**Het eerlijke verhaal:** ik ben zelf geen securityprofessional. Ik heb dit project samen met AI
gebouwd. De techniek is getest, maar of de *inhoud* klopt kan ik niet zelf beoordelen — en dat is
precies wat leerlingen wél van me aannemen. Daarom deze vraag.

**Wat ik van je vraag:** loop de lijst hieronder door en kruis per regel aan. Je hoeft niets te
herschrijven; "klopt niet" met een half zinnetje is genoeg. Sla gerust over wat buiten je vakgebied
valt — een deels ingevulde lijst is oneindig veel waardevoller dan geen lijst.

**Ik zoek fouten, geen complimenten.** Liever één keer streng dan tien beleefde lezers.

**Twee soorten inhoud, in volgorde van belang:**

1. **169 beweringen uit de commando's** — de dichtste concentratie technische claims in
   het product. Security-tools staan bovenaan. Elke regel is gelabeld: `output` = wat de leerling
   ziet als het commando draait, `handleiding` = wat `man <command>` toont.
2. **56 begripsdefinities** uit de openbare woordenlijst — de pagina die het
   vaakst als naslag wordt gelinkt.

---

## Deel 1 — Beweringen uit de handleidingen


### Security-tools — hoogste prioriteit

#### `hash-benchmarks` — <sub>src/commands/security/hash-benchmarks.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r39</sub> label: '~164 miljard/sec
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r44</sub> label: '~50 miljard/sec
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r49</sub> label: '~22 miljard/sec

#### `hashcat` — <sub>src/commands/security/hashcat.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r50</sub> Password cracking is ALLEEN LEGAAL op systemen waar je
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r103</sub> [!] Hash not found in demo database
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r105</sub> [TIP] Deze simulator heeft een beperkte database met ALLEEN zwakke passwords.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r107</sub> • Wordlists (rockyou.txt = 14 miljoen wachtwoorden)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r110</sub> • GPU acceleration (miljarden hashes per seconde)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r112</sub> [!]  Security tip: Gebruik sterke, unieke wachtwoorden!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r132</sub> ← Miljoen hashes per seconde
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r147</sub> [!] BESCHERM JEZELF:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r198</sub> • Computers zijn SNEL (miljarden pogingen per seconde)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r227</sub> [!]  ALLEEN LEGAAL met expliciete toestemming!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r241</sub> In Nederland strafbaar als computervredebreuk (art. 138ab Sr).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r245</sub> • LinkedIn (2012)    → 117 miljoen SHA1 hashes (geen salt)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r246</sub> • Adobe (2013)       → 153 miljoen zwak encrypted passwords
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r247</sub> • RockYou (2009)     → 32 miljoen plaintext passwords
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r248</sub> • Collection #1      → 773 miljoen inloggegevens (hergebruikt op andere sites)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r288</sub> [TIP] Wil je weten wat legaal is en wat niet?

#### `hydra` — <sub>src/commands/security/hydra.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r63</sub> Brute force aanvallen zonder toestemming zijn ILLEGAAL.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r64</sub> Dit is een strafbaar feit onder de Computercriminaliteit wet.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r66</sub> Strafbaar: computervredebreuk (art. 138ab Sr)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r112</sub> [TIP] Target moet protocol bevatten. Gebruik:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r126</sub> [TIP] Deze simulator heeft beperkte demo targets:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r131</sub> [!]  In echte scenario's:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r174</sub> 5. **Snelheid**: Hydra probeert 16 passwords per seconde (of meer)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r177</sub> [✓] Sterke, unieke wachtwoorden (min 16 karakters)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r178</sub> [✓] Rate limiting (max 3 pogingen per 5 minuten)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r224</sub> • Services zijn snel (honderden pogingen per seconde mogelijk)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r227</sub> • Rate limiting: Max 3 pogingen per 5 min
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r264</sub> [X] Illegaal gebruik:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r270</sub> In Nederland strafbaar als computervredebreuk (art. 138ab Sr).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r295</sub> - Max 3-5 pogingen per 5 minuten
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r361</sub> [TIP] Wil je weten wat legaal is en wat niet?

#### `metasploit` — <sub>src/commands/security/metasploit.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r23</sub> Metasploit is ALLEEN LEGAAL met expliciete schriftelijke
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r24</sub> toestemming. Ongeautoriseerd gebruik = strafbaar feit.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r26</sub> Strafbaar: computervredebreuk (art. 138ab Sr)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r85</sub> [*] Verbinden met 192.168.1.100 via poort 445 (SMB)...
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r89</sub> [!] SIMULATIE GESTOPT — dit is een veilig, nagemaakt voorbeeld.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r102</sub> [TIP] Zo bescherm je je: update systemen op tijd, zet ongebruikte
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r156</sub> [*] BlueKeep (CVE-2019-0708):
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r160</sub> • 1 miljoen+ kwetsbare systemen gevonden
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r162</sub> [*] Log4Shell (CVE-2021-44228):
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r164</sub> • CVSS score 10.0 (maximum)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r167</sub> • Metasploit module beschikbaar binnen 24 uur
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r210</sub> In Nederland strafbaar als computervredebreuk (art. 138ab Sr).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r265</sub> • Gemiddelde tijd voor exploit: 15 dagen na disclosure
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r266</sub> • Window of vulnerability: 85 dagen
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r273</sub> [TIP] Wil je weten wat legaal is en wat niet?

#### `nikto` — <sub>src/commands/security/nikto.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r30</sub> Scannen van websites zonder toestemming is ILLEGAAL.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r33</sub> Strafbaar: computervredebreuk (art. 138ab Sr)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r79</sub> [TIP] URL moet http:// of https:// bevatten
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r105</sub> [!]  KRITIEKE BEVINDINGEN:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r174</sub> [!]  PRIORITEIT: Fix HIGH severity issues eerst!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r268</sub> • $3 miljoen data breach resultaat
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r348</sub> [!]  Wat Nikto NIET doet:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r368</sub> In Nederland strafbaar als computervredebreuk (art. 138ab Sr).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r373</sub> [TIP] Wil je leren hoe je deze tools in een echte pentest gebruikt?

#### `sqlmap` — <sub>src/commands/security/sqlmap.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r30</sub> SQL injection testing zonder toestemming is ILLEGAAL.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r31</sub> Ongeautoriseerde toegang tot databases = strafbaar feit.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r33</sub> Strafbaar: computervredebreuk (art. 138ab Sr)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r79</sub> [TIP] URL moet beginnen met http:// of https://
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r112</sub> [TIP] Probeer een URL met query parameters:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r238</sub> • £77 miljoen kosten (reputatie damage)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r241</sub> • 130 miljoen credit card nummers
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r242</sub> • $140 miljoen in settlements
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r246</sub> • 77 miljoen accounts gecompromitteerd
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r324</sub> → Zie je alle data? = KWETSBAAR
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r326</sub> → 5 seconden delay? = KWETSBAAR
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r331</sub> • OWASP ZAP (gratis)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r351</sub> [!] Nederlandse wet (computervredebreuk, art. 138ab Sr):
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r365</sub> In Nederland strafbaar als computervredebreuk (art. 138ab Sr).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r370</sub> [TIP] Wil je leren hoe je deze tools in een echte pentest gebruikt?

### Netwerk-commando's

#### `ifconfig` — <sub>src/commands/network/ifconfig.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r19</sub> RX packets 15234  bytes 12847291 (12.8 MB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r20</sub> TX packets 9821   bytes 1834724 (1.8 MB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r25</sub> RX packets 1043  bytes 89234 (89.2 KB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r26</sub> TX packets 1043  bytes 89234 (89.2 KB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r33</sub> RX packets 8923  bytes 9234812 (9.2 MB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r34</sub> TX packets 7234  bytes 892341 (892.3 KB)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r36</sub> [TIP] Belangrijke velden:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r98</sub> • 255.255.255.0   → /24 netwerk (254 hosts mogelijk)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r99</sub> • 255.255.0.0     → /16 netwerk (65534 hosts mogelijk)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r100</sub> • 255.0.0.0       → /8 netwerk (16 miljoen hosts)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r108</sub> • Eerste 3 bytes = vendor ID (manufacturer)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r117</sub> [!] Security implicaties:

#### `netstat` — <sub>src/commands/network/netstat.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r30</sub> [TIP] LISTEN = server wacht op inkomende verbindingen
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r70</sub> • 0.0.0.0:80         → Luister op alle interfaces, poort 80
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r71</sub> • 127.0.0.1:5432     → Alleen localhost, poort 5432
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r72</sub> • 192.168.1.100:443  → Specifiek IP, poort 443
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r91</sub> [!]  TIME_WAIT state:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r108</sub> • Port 3000 in gebruik? → Andere dev server draait al

#### `nmap` — <sub>src/commands/network/nmap.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r160</sub> output += `\n\n[TIP] Deze server is goed beveiligd! Alleen HTTPS open = minimaal aanvalsoppervlak.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r162</sub> output += `\n\n[TIP] Veel open poorten = meer ingangen voor aanvallers. Elke service kan beveiligingslekken hebben.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r164</sub> output += `\n\n[TIP] SSH (22) open = je kunt inloggen proberen. Probeer 'hydra' voor brute force (demo).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r166</sub> output += `\n\n[TIP] Open poorten zijn entry points. Pentester checkt elke service op kwetsbaarheden.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r171</sub> output += `\n\n[!]  SECURITY: Database poort open naar buiten = risico! Zou restricted moeten zijn.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r239</sub> [!]  Ethische waarschuwing:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r240</sub> Port scanning zonder toestemming is in veel landen ILLEGAAL.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r244</sub> • Willekeurige servers op internet? → ILLEGAAL!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r266</sub> [!] Security audit:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r276</sub> → ILLEGAAL! Scan alleen je eigen systemen
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r291</sub> [TIP] Wil je leren hoe je deze tools in een echte pentest gebruikt?

#### `ping` — <sub>src/commands/network/ping.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r72</sub> output += `\n\n[TIP] localhost (127.0.0.1) is altijd je eigen machine. 0ms response = geen netwerk nodig!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r74</sub> output += `\n\n[TIP] 192.168.x.x zijn private IP adressen (lokaal netwerk). Lage ping = goede verbinding.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r76</sub> output += `\n\n[TIP] Publieke DNS servers zijn ideaal om internetverbinding te testen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r78</sub> output += `\n\n[TIP] Lage ping (<50ms) = goede verbinding. Hoge ping (>100ms) kan problemen veroorzaken.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r109</sub> Test je eigen machine (altijd 0ms response)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r126</sub> • 0-30ms    → Excellent (lokaal netwerk of nabije server)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r127</sub> • 30-100ms  → Goed (normale internet verbinding)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r128</sub> • 100-300ms → Acceptabel (verre server of trage verbinding)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r129</sub> • >300ms    → Slecht (problemen, of zeer verre server)
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r131</sub> [!] Security context:

#### `traceroute` — <sub>src/commands/network/traceroute.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r82</sub> output += `\n[TIP] localhost = 0 hops, geen netwerk nodig (loopback interface).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r84</sub> output += `\n[TIP] * betekent hop antwoordt niet (firewall, of ICMP blocked).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r126</sub> [!]  Special cases:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r145</sub> • Grote tijd sprong (10ms → 100ms) = lange afstand of congestion
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r149</sub> [!] Security / Privacy:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r165</sub> → Hop 5: 200ms (probleem zit hier!)

#### `whois` — <sub>src/commands/network/whois.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r74</sub> [TIP] Probeer bekende domains:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r97</sub> output += `\n[TIP] .nl domains worden beheerd door SIDN (Nederlandse registry).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r99</sub> output += `\n[TIP] MarkMonitor is een premium registrar gebruikt door grote bedrijven.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r101</sub> output += `\n[TIP] Whois data is publiek - privacy protection kan je info verbergen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r159</sub> [!]  GDPR Impact:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r181</sub> • Domain pas geregistreerd (< 6 maanden)? → Suspicieus
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r197</sub> → Kan 24-48 uur duren voordat whois data beschikbaar is
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r211</sub> • Port 43 (whois protocol)

### Bestandssysteem-commando's

#### `cat` — <sub>src/commands/filesystem/cat.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r121</sub> [!] Permissies:

#### `find` — <sub>src/commands/filesystem/find.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r126</sub> [!] In deze simulator:

#### `ls` — <sub>src/commands/filesystem/ls.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r158</sub> [!] De permissies kolom toont wie het bestand kan lezen/schrijven/uitvoeren

#### `mkdir` — <sub>src/commands/filesystem/mkdir.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r97</sub> [!] Permissies:

#### `mv` — <sub>src/commands/filesystem/mv.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r121</sub> [!] Safety features:

#### `rm` — <sub>src/commands/filesystem/rm.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r105</sub> [!] GEVAARLIJK COMMANDO!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r109</sub> [!] Safety features in deze simulator:
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r119</sub> [!] In real pentesting:

#### `touch` — <sub>src/commands/filesystem/touch.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r91</sub> [!] Permissies:

### Systeem- en leerpad-commando's

#### `achievements` — <sub>src/commands/system/achievements.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r24</sub> output += '\n\n[TIP] Gebruik \'achievements unlocked\' om alleen je verdiende badges te zien.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r25</sub> output += '\n[TIP] Gebruik \'achievements rarity rare\' om te filteren op zeldzaamheid.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r34</sub> '[TIP] Voer commando\'s uit en voltooi challenges om badges te verdienen!\n' +
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r35</sub> '[TIP] Typ \'achievements\' om te zien welke badges beschikbaar zijn.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r47</sub> '[TIP] Hogere rarities zijn moeilijker te verdienen!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r65</sub> '[TIP] Typ \'achievements\' voor een overzicht van alle badges.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r87</sub> "        [!] EPIC        Indrukwekkende prestaties (2 badges)\n" +

#### `certificates` — <sub>src/commands/system/certificates.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r139</sub> '[TIP] Typ \'challenge start ' + challengeId + '\' om de challenge te starten!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r157</sub> output += '\n\n[TIP] Typ \'certificates download ' + challengeId + '\' om te downloaden.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r158</sub> output += '\n[TIP] Typ \'certificates copy ' + challengeId + '\' om naar klembord te kopiëren.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r168</sub> '[TIP] Voltooi challenges om certificaten te verdienen!\n' +
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r169</sub> '[TIP] Typ \'challenge\' om beschikbare challenges te zien.

#### `challenge` — <sub>src/commands/system/challenge.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r69</sub> '[TIP] Het certificaten systeem heeft een eigen commando: \'certificates\'
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r72</sub> '[TIP] Typ \'certificates\' voor een overzicht van al je verdiende certificaten.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r119</sub> "        Na 3 pogingen   - Eerste hint (richting)\n" +
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r120</sub> "        Na 6 pogingen   - Tweede hint (specifieker)\n" +
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r121</sub> "        Na 10 pogingen  - Derde hint (bijna het antwoord)\n" +

#### `dashboard` — <sub>src/commands/system/dashboard.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r318</sub> out += '\n[TIP] Typ \'achievements\' voor de volledige badge galerij.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r331</sub> output += '\n\n[TIP] Typ \'achievements\' voor de volledige badge galerij.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r346</sub> out += '\n[TIP] Typ \'challenge\' om een challenge te starten.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r359</sub> output += '\n\n[TIP] Typ \'challenge\' om een challenge te starten.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r397</sub> '[TIP] Typ \'dashboard\' voor een volledig overzicht.

#### `help` — <sub>src/commands/system/help.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r208</sub> out += '[!] Echte hackers beginnen met SYSTEM & FILESYSTEM basics\n

#### `leaderboard` — <sub>src/commands/system/leaderboard.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r89</sub> output += '\n\n[TIP] Typ \'leaderboard me\' voor je persoonlijke ranking details.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r143</sub> output += '\n\n[TIP] Voltooi challenges om punten te verdienen en te stijgen!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r165</sub> out += '\n[TIP] Voltooi challenges om punten te verdienen!
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r192</sub> '[TIP] Typ \'leaderboard\' voor de volledige ranglijst.

#### `leerpad` — <sub>src/commands/system/leerpad.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r62</sub> pushLine('    [!] Vergrendeld - probeer eerst ' + PHASE3_UNLOCK_THRESHOLD + ' recon-commando' + "'s" + ' (nog ' + rem + ')');
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r107</sub> out += "  [!] Vergrendeld - probeer eerst " + PHASE3_UNLOCK_THRESHOLD + " recon-commando's\n
- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r161</sub> manPage: "\nNAAM\n    leerpad - toon leerpad met voortgang\n\nSYNOPSIS\n    leerpad\n\nBESCHRIJVING\n    Toont je leerpad als ethical hacker in 3 niveaus (Beginner,\n    Gevorderd, Expert), opgebouwd uit 4 fases. Elke command die je\n    correct uitvoert wordt automatisch afgevinkt. Bij elk niveau hoort\n    een begeleide missie (zie 'tutorial') die dezelfde stof stap voor\n    stap leert - oefenen en missie zijn twee views op hetzelfde niveau.\n\n    BEGINNER (Fase 1+2)   -> begeleide missie: tutorial fundamentals\n    GEVORDERD (Fase 3)    -> begeleide missie: tutorial recon\n    EXPERT (Fase 4)       -> begeleide missie: tutorial exploitation\n\n    FASE 1: TERMINAL BASICS\n        Leer de basis terminal commands. Begin hier als je nieuw bent.\n        Commands: help, ls, cd, pwd, cat, whoami, history\n\n    FASE 2: FILE MANIPULATION\n        Leer bestanden en directories maken en verwijderen.\n        Commands: mkdir, touch, rm, cp, mv, echo, find, grep\n\n    FASE 3: RECONNAISSANCE\n        Leer netwerk scanning en informatie verzamelen.\n        Commands: ping, nmap, whois, traceroute, ifconfig, netstat\n\n    FASE 4: SECURITY TOOLS\n        Geavanceerde security testing tools. Let op: educatief gebruik!\n        Commands: hashcat, hydra, sqlmap, metasploit, nikto\n\n        [!] Deze fase is vergrendeld totdat je 4 van de 6 Fase 3\n        commands hebt geprobeerd.\n\nVOORTGANG TRACKING\n    Je voortgang wordt automatisch opgeslagen in je browser.\n\n    Symbolen:\n        Voltooid        [✓]   (fase of command afgevinkt)\n        Niet voltooid   [ ]   (nog te doen)\n\nVOORBEELDEN\n    leerpad\n        Bekijk je huidige voortgang\n\n    help\n        Zie alle beschikbare commands\n\n    man nmap\n        Leer hoe een specifiek command werkt\n\nTIPS\n    • Begin met 'tutorial fundamentals' als je nieuw bent\n    • Typ 'help' om alle commands te zien\n    • Commands worden alleen afgevinkt bij correct gebruik (met argumenten)\n    • Fase 4 wordt ontgrendeld zodra je 4 Fase 3 commands hebt geprobeerd\n\n    [HACKSIM] Dit command is uniek voor HackSimulator.\n       Het bestaat niet in standaard Linux.\n\n    [+] In real Linux:\n       Er is geen leerpad command. Ethisch hacken leer je via\n       certificeringen (CEH, OSCP) en CTF.\n\nGERELATEERDE COMMANDO'S\n    tutorial (begeleide missies per niveau), next (je volgende stap),\n    challenge (test jezelf), help (alle commands), man (uitleg)\n".trim()

#### `next` — <sub>src/commands/system/next.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r539</sub> out += '[TIP] ' + stage.tip + '\n\n

#### `shortcuts` — <sub>src/commands/system/shortcuts.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r50</sub> out += '[TIP] Deze shortcuts werken net als in echte Linux terminals\n

#### `tutorial` — <sub>src/commands/system/tutorial.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>output r211</sub> "\n[TIP] Wil je 'm bewaren? Typ 'tutorial cert download' voor een .txt-bestand.

### Overig

#### `reset` — <sub>src/commands/special/reset.js</sub>

- [ ] klopt · [ ] klopt niet · [ ] te vaag — <sub>handleiding r193</sub> [!] WAARSCHUWING:

---

## Deel 2 — Begripsdefinities (`woordenlijst.html`)

- [ ] klopt · [ ] klopt niet · [ ] te vaag — **CLI (Command Line Interface)** (r496): Een tekstgebaseerde interface waarmee je je computer bestuurt door commando's te typen in plaats van te klikken. De terminal is een CLI.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Terminal** (r500): Het programma dat je een command line interface biedt. In Linux heet dit vaak een "terminal emulator". Je typt hier commando's in en ziet de output.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Shell** (r504): De software die je commando's interpreteert. Bash en Zsh zijn populaire shells in Linux. De shell vertaalt wat je typt naar acties die het besturingssysteem uitvoert.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Root** (r508): De "superuser" account op Linux/Unix systemen met volledige toegangsrechten. Root kan alles wijzigen op het systeem, daarom is het belangrijk deze account te beschermen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Sudo (Superuser Do)** (r512): Een commando dat tijdelijk root-rechten geeft voor een enkele actie. Veiliger dan permanent als root werken omdat elke actie expliciet wordt uitgevoerd.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Permissions (Bestandsrechten)** (r516): Linux bestandsrechten bepalen wie mag lezen (r), schrijven (w) en uitvoeren (x). Weergegeven als bijv. rwxr-xr-- voor eigenaar, groep en anderen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Directory (Map)** (r520): Een map in het bestandssysteem. In Linux gebruik je cd om van map te wisselen en ls om de inhoud te bekijken.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Pipe ( | )** (r524): Een manier om de output van het ene commando als input aan het volgende te geven. Bijvoorbeeld: cat bestand.txt \| grep "zoekterm" zoekt in de inhoud van een bestand.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Log File (Logbestand)** (r528): Een bestand dat automatisch gebeurtenissen registreert, zoals inlogpogingen of systeemfouten. Security professionals analyseren logbestanden om aanvallen te detecteren.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Daemon** (r532): Een achtergrondproces dat continu draait op een Linux systeem. Voorbeelden zijn webservers (httpd) en SSH servers (sshd). De "d" in namen staat vaak voor daemon.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **IP-adres (Internet Protocol)** (r544): Een uniek numeriek adres voor elk apparaat op een netwerk, zoals 192.168.1.1. IPv4 gebruikt 4 groepen cijfers, IPv6 gebruikt langere hexadecimale adressen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Port (Poort)** (r548): Een virtueel eindpunt voor netwerkverkeer. Poort 80 is HTTP, 443 is HTTPS, 22 is SSH. Open poorten zijn potentiële toegangspunten voor aanvallers.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **DNS (Domain Name System)** (r552): Het systeem dat domeinnamen (zoals hacksimulator.nl) vertaalt naar IP-adressen. Wordt ook wel het "telefoonboek van het internet" genoemd.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **TCP/IP** (r556): Het fundamentele communicatieprotocol van het internet. TCP zorgt voor betrouwbare, geordende dataoverdracht. IP zorgt voor adressering en routering.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Firewall** (r560): Een beveiligingssysteem dat inkomend en uitgaand netwerkverkeer filtert op basis van vooraf gedefinieerde regels. Kan hardware- of softwarematig zijn.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **VPN (Virtual Private Network)** (r564): Een versleutelde verbinding over het publieke internet die je verkeer beschermt tegen afluisteren. Veel gebruikt voor privacy en om geografische beperkingen te omzeilen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Proxy** (r568): Een tussenserver die verzoeken namens jou doorstuurt. Kan worden gebruikt voor anonimiteit, caching of contentfiltering. Verschilt van een VPN doordat verkeer niet altijd versleuteld is.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **SSH (Secure Shell)** (r572): Een versleuteld protocol voor veilige verbinding met een ander systeem op afstand. Vervangt het onveilige Telnet. Standaard op poort 22.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Packet (Pakket)** (r576): De basiseenheid van data die over een netwerk wordt verzonden. Elk pakket bevat een header (met bron- en bestemmingsadres) en payload (de eigenlijke data).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **MAC-adres** (r580): Een uniek hardware-adres dat is toegewezen aan elke netwerkinterface. In tegenstelling tot IP-adressen is een MAC-adres (meestal) permanent en fabrieksgebonden.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Ethical Hacking (Ethisch Hacken)** (r592): Het geautoriseerd testen van computersystemen op beveiligingslekken, met toestemming van de eigenaar. Ook bekend als "white hat hacking" of penetration testing.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Vulnerability (Kwetsbaarheid)** (r596): Een zwakke plek in software of hardware die kan worden misbruikt door een aanvaller. Kwetsbaarheden worden geclassificeerd met CVSS-scores van 0 (geen risico) tot 10 (kritiek).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Exploit** (r600): Een stuk code of techniek dat een kwetsbaarheid misbruikt om ongeautoriseerde toegang te krijgen. Ethische hackers gebruiken exploits om te bewijzen dat een kwetsbaarheid echt gevaarlijk is.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Payload** (r604): De "lading" van een exploit - de code die wordt uitgevoerd nadat een kwetsbaarheid is misbruikt. Kan variëren van het openen van een shell tot het installeren van malware.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Brute Force** (r608): Een aanvalsmethode waarbij systematisch alle mogelijke combinaties worden geprobeerd, meestal voor het kraken van wachtwoorden. Bescherming: sterke wachtwoorden en account lockout.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **SQL Injection** (r612): Een aanvalstechniek waarbij kwaadaardige SQL-code in invoervelden wordt geplaatst om databases te manipuleren. Een van de meest voorkomende webkwetsbaarheden.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **XSS (Cross-Site Scripting)** (r616): Een aanval waarbij kwaadaardige scripts worden geïnjecteerd in webpagina's die andere gebruikers bekijken. Kan worden gebruikt om sessies te stelen of gebruikers te redirecten.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Zero-Day** (r620): Een kwetsbaarheid die nog niet bekend is bij de softwareleverancier en waarvoor dus nog geen patch beschikbaar is. Zeer waardevol voor zowel aanvallers als beveiligingsonderzoekers.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Encryption (Versleuteling)** (r624): Het omzetten van leesbare data naar onleesbare code met behulp van een sleutel. Symmetrisch (AES) gebruikt dezelfde sleutel, asymmetrisch (RSA) gebruikt een publiek/privaat sleutelpaar.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Hash** (r628): Een eenrichtingsfunctie die data omzet naar een vaste lengte string. Wachtwoorden worden opgeslagen als hashes (bijv. SHA-256, bcrypt). Een hash kan niet worden "ontsleuteld", alleen gekraakt.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Phishing** (r632): Een social engineering aanval via nep-emails, websites of berichten die eruitzien als legitieme bronnen. Doel: gevoelige gegevens stelen zoals wachtwoorden of creditcardnummers.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Social Engineering** (r636): Manipulatietechnieken om mensen te misleiden en zo toegang te krijgen tot systemen of informatie. Phishing, pretexting en baiting zijn veelgebruikte vormen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Malware (Malicious Software)** (r640): Verzamelnaam voor schadelijke software: virussen, trojans, ransomware, spyware en worms. Elke variant heeft een ander verspreidings- en schademechanisme.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Ransomware** (r644): Malware die bestanden versleutelt en losgeld eist voor de ontsleutelingssleutel. Grote aanvallen zoals WannaCry (2017) troffen wereldwijd ziekenhuizen en bedrijven.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Rootkit** (r648): Malware die zich diep in het besturingssysteem verbergt en aanvallers ongedetecteerde toegang geeft. Zeer moeilijk te detecteren omdat het beveiligingssoftware kan omzeilen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Backdoor** (r652): Een verborgen toegangspunt in software dat normale authenticatie omzeilt. Kan opzettelijk zijn ingebouwd (door een ontwikkelaar) of geïnstalleerd door een aanvaller.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Privilege Escalation** (r656): Het verkrijgen van hogere toegangsrechten dan oorspronkelijk toegekend. Verticaal: van gebruiker naar admin. Horizontaal: toegang tot een andere gebruiker met dezelfde rechten.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Man-in-the-Middle (MitM)** (r660): Een aanval waarbij de aanvaller zich ongemerkt tussen twee communicerende partijen plaatst. Kan verkeer afluisteren of wijzigen. HTTPS en VPN beschermen hiertegen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Nmap (Network Mapper)** (r672): De meest gebruikte open-source tool voor netwerk scanning en port discovery. Onmisbaar voor ethical hackers om open services te ontdekken.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Wireshark** (r676): Een packet analyzer die netwerkverkeer opvangt en visueel weergeeft. Wordt gebruikt voor troubleshooting, analyse en educatie over netwerkprotocollen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Metasploit** (r680): Een uitgebreid penetration testing framework met duizenden exploits en payloads. De industriestandaard voor professionele pentesting.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Hashcat** (r684): Een geavanceerde wachtwoord recovery tool die GPU-versnelling gebruikt. Ondersteunt honderden hash-types en aanvalsmodi (dictionary, brute force, rule-based).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **SQLmap** (r688): Een open-source tool die automatisch SQL injection kwetsbaarheden detecteert en exploiteert. Kan databases dumpen, bestanden lezen en OS-commando's uitvoeren.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Hydra** (r692): Een snelle online brute force tool die meerdere protocollen ondersteunt (SSH, FTP, HTTP, etc.). Wordt gebruikt om zwakke wachtwoorden te testen.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Nikto** (r696): Een webserver scanner die controleert op bekende kwetsbaarheden, verouderde software en onveilige configuraties. Een goed startpunt voor web security assessments.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Kali Linux** (r700): Een op Debian gebaseerde Linux distributie speciaal ontworpen voor penetration testing en security auditing. Bevat honderden voorgeïnstalleerde security tools.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Burp Suite** (r704): Een geïntegreerd platform voor het testen van webapplicatie beveiliging. Bevat een proxy, scanner en diverse tools voor het analyseren van HTTP-verkeer.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **John the Ripper** (r708): Een populaire open-source wachtwoord kraker die meerdere hash-types en encryptie-algoritmen ondersteunt. Vaak gebruikt samen met Hashcat.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Penetration Testing (Pentest)** (r720): Een geautoriseerde gesimuleerde aanval op een computersysteem om beveiligingszwakheden te vinden. Volgt meestal een methodologie: reconnaissance, scanning, exploitation, reporting.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Reconnaissance (Verkenning)** (r724): De eerste fase van een pentest: informatie verzamelen over het doelwit. Passief (OSINT, publieke bronnen) of actief (port scanning, DNS queries).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **OSINT (Open Source Intelligence)** (r728): Het verzamelen van informatie uit openbaar beschikbare bronnen: websites, sociale media, publieke databases. Een cruciale skill voor zowel aanvallers als verdedigers.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **CTF (Capture The Flag)** (r732): Cybersecurity wedstrijden waarbij deelnemers beveiligingspuzzels oplossen om "vlaggen" te vinden. Uitstekende manier om hacking vaardigheden te oefenen in een legale omgeving.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **CVE (Common Vulnerabilities and Exposures)** (r736): Een gestandaardiseerd systeem voor het identificeren van bekende kwetsbaarheden. Elke CVE krijgt een uniek nummer, zoals CVE-2024-1234.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **OWASP Top 10** (r740): Een lijst van de 10 meest kritieke beveiligingsrisico's voor webapplicaties, uitgegeven door het Open Web Application Security Project. De standaard referentie voor web security.
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **White/Grey/Black Hat** (r744): Classificatie van hackers: White hat (ethisch, met toestemming), Grey hat (zonder toestemming maar zonder kwaad), Black hat (crimineel).
- [ ] klopt · [ ] klopt niet · [ ] te vaag — **Attack Surface (Aanvalsoppervlak)** (r748): Het totaal van alle punten waarop een aanvaller kan proberen een systeem binnen te dringen. Kleiner aanvalsoppervlak = veiliger systeem. Open poorten, publieke API's en login pagina's vergroten het aanvalsoppervlak.

---

## Wat er met je antwoorden gebeurt

- Elke "klopt niet" wordt gecorrigeerd en krijgt een bronvermelding in de tekst.
- Als je akkoord gaat, komt je naam (of alleen je functie, zoals je wilt) met de reviewdatum op
  `/over-ons.html` te staan onder "Verantwoording". Liever anoniem? Ook prima — zeg het gewoon.
- Dit bestand is opnieuw te genereren, dus een tweede ronde over alleen de wijzigingen kan zonder
  dat je alles opnieuw hoeft te lezen.

**Contact:** contact@hacksimulator.nl
