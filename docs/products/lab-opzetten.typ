// Je Eigen Hacklab — HackSimulator.nl
// Compileer: typst compile lab-opzetten.typ
//
// Vult het gat tussen de simulator en echt gereedschap. De andere drie gidsen
// nemen allemaal aan dat de lezer een werkende Kali-VM en een VPN heeft; deze
// gids bouwt die.
#import "template.typ": *

#show: hacksimulator-doc.with(
  title: "Je Eigen Hacklab",
  subtitle: "Van simulator naar een echte Kali-omgeving — veilig, afgeschermd en herstelbaar",
  version: "1.0",
  date: "augustus 2026",
)

// ─────────────────────────────────────────────

#outline(title: [Inhoud], depth: 2, indent: 1em)

#pagebreak()

= Over deze gids

Je hebt in HackSimulator `nmap 192.168.1.100` getypt en een lijst met open poorten teruggekregen. Nette output, duidelijke uitleg. Maar die poorten bestonden niet. Er stond geen server. Er was geen netwerk.

Dat is precies wat een simulator hoort te doen: je leert het *idee* zonder dat je iets kunt slopen. Maar op een gegeven moment wil je de echte tool op een echte machine loslaten --- en dan blijkt dat elke gids, cursus en YouTube-video begint met de zin *"start je Kali VM en verbind met de VPN"*, alsof dat vanzelfsprekend is.

Dat is de stap die deze gids maakt. Aan het eind heb je:

- Een werkende Kali Linux in een virtuele machine op je eigen computer
- Een netwerkopstelling die *niet* per ongeluk je huisgenoten, je werkgever of je buren raakt
- Snapshots, zodat een verkeerd commando je een klik kost in plaats van een avond
- Een kwetsbaar doelwit in je eigen lab om legaal op te oefenen
- Een verbinding met TryHackMe of HackTheBox

#letop[Deze gids gaat over het *bouwen* van een oefenomgeving. Wat je daarbinnen mag en wat daarbuiten strafbaar is, staat in de Juridische Gids. Het onderdeel _Stap 3: de netwerkmodus_ komt er zijdelings op terug, maar vervangt die gids niet.]

== Voor wie dit is

Je hebt de fases in HackSimulator doorlopen, of je bent bij week 5 van het 12-weken leerplan aanbeland. Je hoeft geen Linux te kennen --- dat leer je juist hierdoor. Wat je wél nodig hebt is geduld voor één avond installeren.

== Zes woorden die je verderop tegenkomt

Deze gids gebruikt een handvol termen die overal in de securitywereld terugkomen. Ze staan hier bij elkaar, zodat je verderop niet hoeft te stoppen om iets op te zoeken.

/ Virtuele machine (VM): Een complete computer die als programma binnen je eigen computer draait, met een eigen besturingssysteem en eigen schijf. Je kunt hem aanzetten, gebruiken en weggooien zonder dat je echte computer er iets van merkt.

/ Image: Eén groot bestand dat een complete, kant-en-klare virtuele machine bevat. Je downloadt het en je hebt meteen een werkende computer --- geen installatie nodig.

/ ISO: Een bestand dat een installatie-schijf nabootst. Hiermee installeer je een besturingssysteem zelf, stap voor stap. Trager dan een image, maar je ziet wel wat er gebeurt.

/ Terminal: Het tekstvenster waarin je commando's typt. Precies wat je in HackSimulator hebt geoefend --- alleen praat je nu tegen een echte computer.

/ Snapshot: Een bewaarde momentopname van een virtuele machine. Ging er iets mis, dan zet je hem met één klik terug naar dat moment.

/ Root: De hoofdgebruiker van een Linux-systeem, met alle rechten. Vergelijkbaar met "Administrator" op Windows. Met `sudo` vóór een commando voer je dat commando eenmalig als root uit.

== Wat het kost

Niets. Alle software in deze gids is gratis voor persoonlijk gebruik. Je investeert alleen wat schijfruimte en een avond van je vrije tijd.

// ─────────────────────────────────────────────

= Waarom een apart lab, en niet gewoon je laptop?

Je zou Kali als hoofdbesturingssysteem kunnen installeren, of de tools rechtstreeks op je eigen machine zetten. Doe dat niet. Drie redenen, in volgorde van belang.

== 1. Isolatie: je oefendoelwitten zijn met opzet kapot

De computers waarop je gaat oefenen zijn *expres slecht beveiligd*. Dat is het hele idee: ze zijn gemaakt om ingebroken te worden, zodat jij kunt leren hoe dat werkt. Je herkent ze aan namen als *Metasploitable* of *DVWA* --- kant-en-klare oefendoelwitten die je zelf downloadt --- of je gebruikt de oefenmachines die TryHackMe en HackTheBox voor je klaarzetten.

Zo'n machine hoort niet bij jouw bestanden te kunnen. Zet je hem verkeerd neer, dan staat er een systeem met bekende gaten erin naast je belastingaangifte en je vakantiefoto's. Een virtuele machine met de juiste netwerkinstelling kan daar simpelweg niet bij.

Dat is geen overbodige voorzichtigheid: het is de reden dat professionals altijd in gescheiden omgevingen werken.

== 2. Juridisch: één verkeerde netwerkinstelling scant je hele huis

Dit is het onderdeel waar de meeste gidsen overheen stappen, en het is het gevaarlijkste. Zet je je VM in *bridged* modus, dan staat hij als volwaardig apparaat op je échte netwerk. Een `nmap 192.168.1.0/24` scant dan de telefoon van je huisgenoot, de printer van je hospita en het slimme slot van de buren.

Dat is geen ramp op je eigen apparaten. Op die van iemand anders is het een scan zonder toestemming --- precies wat de Juridische Gids behandelt. Bij _Stap 3_ zie je hoe je dat onmogelijk maakt, in plaats van er alleen aan te moeten denken.

== 3. Herstelbaarheid: fouten maken hoort erbij

Je gaat je VM slopen. Je gaat een commando met `sudo rm -rf` op de verkeerde plek uitvoeren (dat verwijdert bestanden zonder te vragen), een pakket installeren dat iets anders breekt, of een *exploit* draaien --- een stukje code dat misbruik maakt van een fout in software --- dat het systeem onbruikbaar maakt.

Met snapshots is dat een klik terug. Zonder snapshots is het opnieuw installeren. Dat verschil bepaalt of je durft te experimenteren --- en experimenteren ís het leren.

#tip[Merk op dat deze drie redenen samen ook je antwoord zijn op de vraag "waarom niet gewoon Pwnbox?". De browser-VM van TryHackMe is prima om te beginnen, maar je leert er niet mee hoe een systeem in elkaar zit, en je kunt er geen eigen doelwitten in zetten.]

// ─────────────────────────────────────────────

= Wat je nodig hebt

== Hardware

#table(
  columns: (auto, 1fr, 1fr),
  [*Onderdeel*], [*Minimaal*], [*Comfortabel*],
  [Werkgeheugen (RAM)], [8 GB in je computer], [16 GB],
  [Vrije schijfruimte], [40 GB], [100 GB],
  [Processor], [64-bit, virtualisatie aan], [4 cores of meer],
)

Je geeft de virtuele machine een deel van je werkgeheugen. Bij 8 GB totaal is 3 tot 4 GB voor Kali werkbaar --- je eigen computer houdt dan genoeg over.

Bij 4 GB totaal wordt het zwaar. Je computer gaat dan *swappen*: hij heeft te weinig geheugen en begint stukken ervan op de veel tragere harde schijf te parkeren. Alles wordt daardoor stroperig. In dat geval is de browseromgeving van TryHackMe (Pwnbox) of een tweedehands laptop een prettigere route dan een virtuele machine die de hele tijd staat te zwoegen.

== Virtualisatie inschakelen

Zonder hardware-virtualisatie start je VM niet, of alleen tergend traag. Op de meeste computers staat het aan; op sommige moet je het zelf inschakelen in de *BIOS* of *UEFI* --- het instellingenscherm dat verschijnt als je vlak na het aanzetten een toets indrukt (meestal `F2`, `Del` of `F10`; welke, zegt je computer op dat moment op het scherm). De instelling heet daar *Intel VT-x*, *AMD-V* of gewoon *Virtualization Technology*.

Controleer het zo:

#table(
  columns: (auto, 1fr),
  [*Windows*], [Taakbeheer → tabblad Prestaties → CPU. Rechtsonder staat "Virtualisatie: Ingeschakeld".],
  [macOS], [Staat altijd aan, je hoeft niets te doen.],
  [Linux], [`grep -E --color 'vmx|svm' /proc/cpuinfo` --- krijg je gekleurde treffers, dan is het aanwezig.],
)

#warning[Op Windows kan Hyper-V of de Core-isolatie/Geheugenintegriteit-functie botsen met VirtualBox, waardoor VM's extreem traag worden of niet starten. Kom je dat tegen, dan is dat bijna altijd de oorzaak --- zie *Als het misgaat* achterin.]

// ─────────────────────────────────────────────

= Stap 1: Kies en installeer je virtualisatiesoftware

Een *hypervisor* is het programma dat virtuele machines draait. Je hebt er één nodig. Welke, hangt vooral af van je processor.

== Welke past bij jou?

#table(
  columns: (1fr, 1fr, 1.4fr),
  [*Jouw computer*], [*Aanrader*], [*Waarom*],
  [Windows of Linux, Intel/AMD], [VirtualBox], [Gratis, open source, alle gidsen gaan ervan uit],
  [Windows, liever iets sneller], [VMware Workstation Pro], [Sinds eind 2024 gratis voor persoonlijk gebruik, iets vlotter],
  [Mac met Intel-processor], [VirtualBox of VMware Fusion], [Beide werken],
  [Mac met Apple Silicon (M1--M4)], [UTM of VMware Fusion], [Zie hieronder --- dit is een ander verhaal],
)

De rest van deze gids gebruikt *VirtualBox* als voorbeeld, omdat het gratis is en op de meeste systemen werkt. De stappen in andere programma's zijn vergelijkbaar; alleen de menu's heten anders.

== Apple Silicon: lees dit eerst

Heb je een Mac met een M-processor, dan zit je op een ARM-processor in plaats van x86. Dat betekent:

- Je draait de *ARM-versie* van Kali, niet de gewone. Die bestaat en werkt, maar niet elke tool of exploit is ervoor gebouwd.
- Sommige oefenmachines (Metasploitable is x86) draaien niet of alleen met trage emulatie.
- UTM is de praktische keuze; VMware Fusion werkt ook.

#tip[Op Apple Silicon is de combinatie *Kali ARM voor je tools* + *TryHackMe/HackTheBox voor je doelwitten* meestal prettiger dan lokale doelwit-VM's. De doelwitten draaien dan bij hen, en jij hoeft alleen je aanvalsmachine lokaal te hebben.]

== Installeren

+ Download VirtualBox van #link("https://www.virtualbox.org/wiki/Downloads")[virtualbox.org] --- kies het pakket voor jouw besturingssysteem.
+ Installeer het met de standaardinstellingen. Je netwerk valt tijdens de installatie even weg; dat hoort erbij, VirtualBox installeert dan zijn netwerkstuurprogramma's.
+ Start VirtualBox. De eerste keer zie je een welkomstscherm of een lege lijst --- beide zijn normaal.

// ─────────────────────────────────────────────

= Stap 2: Kali Linux installeren

Er zijn twee routes. Neem de eerste.

== Route A: het kant-en-klare image (aanbevolen)

Kali biedt vooraf geïnstalleerde VM-images aan. Je downloadt een bestand, importeert het, en bent klaar. Geen installatieprocedure, geen partitionering, geen keuzes waarvan je nog niet weet wat ze betekenen.

+ Ga naar #link("https://www.kali.org/get-kali/#kali-virtual-machines")[kali.org/get-kali] en kies *Virtual Machines*.
+ Download het image voor jouw hypervisor (VirtualBox of VMware) en jouw processor (x86-64 of ARM).
+ Het bestand is enkele gigabytes groot. Dit is een goed moment voor koffie.
+ Pak het gedownloade bestand uit en dubbelklik op het bestand dat eindigt op `.vbox`. VirtualBox opent dan met de machine er al in. Gebeurt er niets, start VirtualBox dan zelf en zoek in het menu de optie *Toevoegen* (Engels: *Add*); wijs daarmee hetzelfde `.vbox`-bestand aan.

*Inloggegevens:* gebruikersnaam `kali`, wachtwoord `kali`. Verander dat wachtwoord meteen met `passwd`.

=== Controleer of je download klopt

Een download van enkele gigabytes kan onderweg beschadigd raken --- of, in het ergste geval, door iemand zijn vervangen. Daarom publiceert Kali bij elk bestand een *checksum*: een lange reeks tekens die uit de inhoud van het bestand worden berekend. Verandert er ook maar één byte, dan komt er een compleet andere reeks uit.

Het idee is simpel: je vergelijkt twee reeksen. De reeks die Kali op hun website zet, en de reeks die jij zelf uit je download berekent. Zijn ze gelijk, dan is je bestand intact.

*Welk bestand controleer je?* Het bestand dat je zojuist hebt gedownload --- het gecomprimeerde archief (eindigend op `.7z`). Dat is het bestand dat Kali's checksum bij hoort. Pak het dus *niet* eerst uit; controleer het archief zelf.

Stap voor stap:

+ *Zoek de checksum op de website.* Ga terug naar de downloadpagina van Kali. Naast of onder de downloadlink staat een `SHA256`-waarde: een reeks van 64 tekens (letters en cijfers). Kopieer of noteer die.

+ *Open een terminal of PowerShell.*
  - *Windows:* druk op het Startmenu, typ `PowerShell` en open het.
  - *macOS of Linux:* open een terminal (Spotlight → Terminal, of `Ctrl`+`Alt`+`T`).

+ *Navigeer naar de map waar je download staat.* Dat is meestal je Downloads-map:
  - *Windows (PowerShell):* `cd ~\Downloads`
  - *macOS of Linux:* `cd ~/Downloads`

+ *Bereken de checksum.* Typ het commando met de bestandsnaam van je download erachter (gebruik Tab om de naam aan te vullen, zodat je niet alles hoeft over te typen):
  - *Windows:* `Get-FileHash kali-linux-2026.2-virtualbox-amd64.7z`
  - *macOS of Linux:* `shasum -a 256 kali-linux-2026.2-virtualbox-amd64.7z`
  Vervang de bestandsnaam door de naam van jouw gedownloade bestand.

+ *Vergelijk de twee reeksen.* Ze horen letterlijk gelijk te zijn. In de praktijk hoef je niet alle 64 tekens na te lopen: komen de eerste zes en de laatste zes overeen, dan zit het goed.

#warning[Komen ze *niet* overeen, gebruik het bestand dan niet. Download opnieuw, en blijft het afwijken, haal het dan van een andere internetverbinding. Uitgerekend bij een besturingssysteem voor beveiligingswerk wil je zeker weten dat je krijgt wat de makers hebben verstuurd.]

== Route B: zelf installeren vanaf de ISO

Wil je begrijpen hoe een Linux-installatie werkt --- ook nuttig --- download dan de *Installer*-ISO en maak zelf een nieuwe VM aan. Reken op 30 tot 60 minuten. De installatieprocedure is grotendeels "volgende, volgende, volgende". Bij de stap *Partitioning* --- het indelen van de schijf --- kies je *Guided: use entire disk*. Dat klinkt eng, maar is veilig: "entire disk" betekent hier de virtuele schijf van je nieuwe VM, niet de schijf van je eigen computer.

== Eerste start: de instellingen die ertoe doen

Voor je de VM start, controleer je deze drie dingen. Selecteer de machine in de lijst en open *Instellingen* (het tandwiel-pictogram, of via het menu).

#letop[Menunamen verschillen per versie en per taal van VirtualBox. Zoek daarom op wát je nodig hebt in plaats van op een exact klikpad --- de instellingen hieronder staan altijd onder een kopje dat lijkt op "Systeem" en "Netwerk".]

#table(
  columns: (auto, 1fr, 1.4fr),
  [*Instelling*], [*Waarde*], [*Waarom*],
  [Systeem → Werkgeheugen], [3--4 GB], [Genoeg voor Kali, laat je computer werkbaar],
  [Systeem → Processor], [2 cores], [Meer helpt nauwelijks, minder is traag],
  [Netwerk → Adapter 1], [NAT], [Voorlopig --- Stap 3 gaat hierover],
)

Start de VM en log in. Je ziet nu een bureaublad, net als op een gewone computer.

*Open een terminal.* Dat is het venster waarin je commando's typt --- hetzelfde soort venster als in HackSimulator. In Kali kan dat op drie manieren:

- Klik op het terminal-pictogram in de balk bovenaan (een zwart vierkantje)
- Of druk op `Ctrl` + `Alt` + `T`
- Of klik met de rechtermuisknop op het bureaublad en kies *Open Terminal Here*

Typ daar deze twee commando's, één voor één, en druk na elk op Enter:

```
passwd
```

Dit verandert je wachtwoord. Je wordt eerst om het huidige gevraagd (`kali`) en daarna twee keer om het nieuwe. *Je ziet niets terwijl je typt* --- geen sterretjes, geen bolletjes. Dat is normaal bij Linux-wachtwoorden; typ gewoon door en druk op Enter.

```
sudo apt update && sudo apt full-upgrade -y
```

Dit haalt de nieuwste updates op en installeert ze. Je wordt om je wachtwoord gevraagd (het nieuwe). Dit kan tien minuten tot een uur duren, afhankelijk van je internetverbinding --- laat het rustig lopen.

Het is wel nodig: een Kali-image van een paar maanden oud mist beveiligings­updates die daarna zijn uitgekomen.

#tip[Is de update klaar? Zet de VM dan uit en maak meteen een snapshot. Dit is het moment waarop je machine schoon en bijgewerkt is --- precies de staat waar je later naar terug wilt kunnen. Hoe dat werkt, staat bij _Stap 4_.]

// ─────────────────────────────────────────────

= Stap 3: De netwerkmodus — het onderdeel dat ertoe doet

Als je één onderdeel van deze gids goed leest, dan dit. De netwerkinstelling van je VM bepaalt wie je kunt bereiken --- en dus wie je per ongeluk kunt aanvallen.

== De vier modi

#table(
  columns: (auto, 1.3fr, 1.3fr, auto),
  [*Modus*], [*VM kan bij...*], [*Bij VM kan...*], [*Internet?*],
  [NAT], [internet en je computer], [niemand van buiten], [Ja],
  [NAT Network], [internet en andere VM's], [andere VM's], [Ja],
  [Host-only], [je computer en andere VM's], [je computer en VM's], [*Nee*],
  [Bridged], [*je hele echte netwerk*], [*alles op dat netwerk*], [Ja],
)

== Wat je wanneer gebruikt

/ NAT --- je standaard: Je VM kan naar buiten (updates, downloads, VPN), maar niemand kan bij hem. Voor gewoon werken en voor verbinden met TryHackMe of HackTheBox is dit de juiste keuze. Laat het hierop staan tenzij je een reden hebt om te wisselen.

#letop[Kies je host-only en krijg je een foutmelding dat er geen netwerk beschikbaar is, dan bestaat er nog geen host-only-netwerk op je computer. Je maakt er één aan via de netwerkbeheerder van VirtualBox (te vinden onder *Bestand* of *Gereedschappen*, afhankelijk van je versie). Eén keer aanmaken volstaat; daarna kun je hem bij elke VM kiezen.]

/ Host-only --- je oefenlab: Wil je een kwetsbaar doelwit op je eigen computer draaien (bijvoorbeeld Metasploitable, of een van de gratis oefenmachines van de site VulnHub), zet dan *beide* VM's op host-only. Ze zien elkaar, jij ziet ze, en verder niemand. Geen internet --- en dat is precies de bedoeling: een expres-kwetsbare machine hoort niet online te staan.

/ NAT Network --- als je toch internet nodig hebt: Compromis wanneer je doelwitten elkaar moeten zien én naar buiten moeten kunnen. Gebruik dit alleen als host-only echt niet volstaat.

/ Bridged --- bijna nooit: Je VM krijgt een IP van je eigen router en staat tussen je telefoon, je tv en de apparaten van iedereen in huis. Er zijn legitieme redenen voor, maar geen enkele daarvan geldt terwijl je aan het leren bent.

#warning[*Dit is het scenario dat mensen in de problemen brengt.* Je staat in bridged modus, je wilt oefenen met netwerkverkenning, en je typt `nmap 192.168.1.0/24` omdat dat in een tutorial stond. Je scant dan elk apparaat in je huis --- en in een studentenhuis, appartementencomplex of bij je ouders is dat lang niet alles van jou. Een poortscan op andermans apparaat is een handeling zonder toestemming. Blijf op NAT of host-only, dan kán dit niet gebeuren.]

== Je opstelling controleren

Draai in Kali:

```
ip a
```

Kijk naar het IP-adres van je netwerkinterface (meestal `eth0`):

#table(
  columns: (auto, 1fr),
  [`10.0.2.x`], [NAT --- goed, je zit afgeschermd],
  [`192.168.56.x`], [Host-only --- goed, je zit in je lab],
  [Zelfde reeks als je telefoon], [*Bridged* --- zet dit om vóór je iets scant],
)

#tip[Weet je niet in welke reeks je eigen netwerk zit? Kijk op je telefoon bij de wifi-details. Staat daar `192.168.1.x` en heeft je VM ook `192.168.1.x`, dan sta je bridged.]

// ─────────────────────────────────────────────

= Stap 4: Snapshots — je vangnet

Een snapshot is een bevroren moment van je hele VM: schijf, geheugen, instellingen. Je kunt er altijd naar terug. Dit is de functie die van een VM een leeromgeving maakt in plaats van iets waar je voorzichtig mee moet doen.

== Er nu één maken

Zet de VM eerst uit. Selecteer hem daarna in de lijst en zoek de optie *Snapshots* (soms staat die achter het pictogram met de drie streepjes naast de machinenaam). Klik daar op *Maken* of *Take*, en geef de snapshot een naam als `schoon-na-installatie`.

Dat kost een paar seconden en het is de belangrijkste minuut van deze hele gids.

== Wanneer je er een maakt

- Direct na de installatie en de eerste update --- je basis
- Voor je een grote tool installeert of iets aan de configuratie verandert
- Voor je een exploit draait waarvan je de uitwerking niet kent
- Voor je een oefening begint die het systeem gaat veranderen

== Wanneer je terugzet

Als er iets kapot is, ja --- maar ook als een oefening klaar is. Terugzetten naar een schone staat betekent dat je volgende oefening niet vervuild wordt door de vorige. Dat is precies waarom professionals per opdracht een verse omgeving gebruiken.

#letop[Snapshots zijn geen back-up. Ze zitten in hetzelfde bestand als je VM: raakt dat kwijt of beschadigd, dan zijn je snapshots ook weg. Bewaar werk dat je écht wilt houden (notities, scripts, rapporten) buiten de VM.]

#tip[Snapshots kosten schijfruimte, en een lange rij ervan maakt je VM trager. Houd er een handvol aan: je schone basis, en één per lopende oefening. Ruim de rest op als je klaar bent.]

// ─────────────────────────────────────────────

= Stap 5: Een doelwit om legaal op te oefenen

Je hebt nu een aanvalsmachine. Je hebt nog niets om op te oefenen --- en het internet is geen oefenterrein.

== Optie A: een kwetsbare VM in je eigen lab

De klassieke keuze is *Metasploitable 2*: een Linux-machine die met opzet vol gaten zit, gemaakt om op te oefenen. Ook goed: de images op #link("https://www.vulnhub.com")[VulnHub], die van makkelijk tot zeer lastig lopen.

Opzetten:

+ Download het bestand en pak het uit. Let op: Metasploitable wordt geleverd als een kále virtuele schijf (een bestand dat eindigt op `.vmdk`), niet als een kant-en-klare machine zoals Kali. Je moet er dus zelf een VM omheen maken.
+ Maak in VirtualBox een *nieuwe* machine aan. Kies als type Linux en als versie "Ubuntu (32-bit)" of "Other Linux (32-bit)". Geef hem 1 GB geheugen; meer heeft hij niet nodig.
+ Kies bij de schijf niet "nieuwe schijf aanmaken" maar *bestaande schijf gebruiken*, en wijs het uitgepakte `.vmdk`-bestand aan.
+ *Zet de netwerkadapter op host-only.* Doe dit vóór de eerste start.
+ Doe hetzelfde bij je Kali-VM, zodat ze elkaar zien.
+ Start beide. Zoek in Kali het adres van je doelwit met `ip a` (voor je eigen reeks) en dan `nmap -sn 192.168.56.0/24` om te zien wie er nog meer in dat netwerk zit.

#warning[Metasploitable heeft standaardwachtwoorden, open services en bekende gaten. Zet hem nooit in bridged modus en nooit rechtstreeks aan het internet. Host-only, altijd.]

== Optie B: kwetsbare webapplicaties

Wil je je op websites richten in plaats van op hele systemen, dan zijn *DVWA* (Damn Vulnerable Web Application) en *OWASP Juice Shop* een lichter alternatief: het zijn opzettelijk lekke websites in plaats van complete computers.

Je draait ze rechtstreeks op je Kali-machine, of in een *container* --- een soort mini-VM die alleen één programma draait en binnen seconden start. Juice Shop is de modernere van de twee en houdt zelf bij welke lekken je al gevonden hebt.

== Optie C: online platforms

TryHackMe en HackTheBox hosten de doelwitten voor je. Dat scheelt schijfruimte en opzetwerk, en de begeleiding is beter. Zie Stap 6 hieronder.

#tip[Begin bij optie C als je nog geen ervaring hebt --- de begeleide rooms van TryHackMe leren je meer dan een kale Metasploitable. Kom terug voor optie A zodra je zelf wilt rommelen zonder dat iemand meekijkt.]

// ─────────────────────────────────────────────

= Stap 6: Verbinden met TryHackMe of HackTheBox

Deze platforms draaien hun oefenmachines in een eigen netwerk. Je komt er binnen via een VPN-verbinding.

== De verbinding opzetten

De stappen zijn bij beide platforms vrijwel gelijk:

+ Maak een account en zoek de pagina die *Access*, *Connect* of *VPN* heet.
+ Kies een server (meestal de dichtstbijzijnde regio) en download het `.ovpn`-configuratiebestand.
+ Zet dat bestand in je Kali-VM.
+ Start de verbinding: `sudo openvpn jouwbestand.ovpn`
+ Laat dat venster open staan --- zolang het draait, ben je verbonden.

== Controleren of het werkt

Open een tweede terminal en draai `ip a`. Je ziet nu een extra interface, meestal `tun0`, met een IP-adres in het bereik van het platform. Dat adres is je identiteit binnen het oefennetwerk.

Het platform zelf laat op de Access-pagina ook zien of je als verbonden geldt. Klopt het daar niet, dan is er iets mis met de verbinding, niet met jouw machine.

#tip[Blijft de verbinding hangen of krijg je DNS-fouten, controleer dan of je VM op NAT staat. In host-only heeft je VM geen internet en kan de VPN dus nergens naartoe --- dat is de meest voorkomende oorzaak.]

#letop[De VPN geeft je toegang tot de machines van dat platform, en tot niets anders. Alles binnen dat netwerk mag je aanvallen; dat is waar het voor is. Alles daarbuiten niet --- ook niet als je het vanuit die verbinding kunt bereiken.]

// ─────────────────────────────────────────────

= Van simulator naar lab: dezelfde commando's, echte output

Nu wordt het interessant. De commando's die je in HackSimulator hebt geoefend, werken hier ook --- maar de output is rijker, rommeliger en soms verwarrend. Dat is geen fout: dat is de werkelijkheid waarvoor de simulator je heeft voorbereid.

#table(
  columns: (auto, 1.3fr, 1.4fr),
  [*Command*], [*In de simulator*], [*In je lab*],
  [`nmap`], [Een nette lijst met poorten en uitleg], [Ook versies, OS-gissingen, gefilterde poorten en scans die minuten duren],
  [`whois`], [Overzichtelijke registratiegegevens], [Vaak afgeschermd door privacydiensten],
  [`hydra`], [Vindt een zwak wachtwoord in de demo-database], [Loopt vast op verdedigingen: servers die maar een paar pogingen per minuut toestaan, accounts die op slot gaan, en trage reacties],
  [`cat /etc/shadow`], [Toont voorbeeld-hashes], [Weigert, tenzij je root bent --- en dát is de les],
)

== Je eerste echte scan

Draai op je host-only doelwit:

```
nmap -sV 192.168.56.101        # vervang door het adres van je doelwit
```

De `-sV` vraagt om versiedetectie. Je krijgt nu niet alleen "poort 21 open" maar ook welke FTP-server daar draait en welke versie. Dat versienummer is het aanknopingspunt: daarmee zoek je op of er bekende kwetsbaarheden voor bestaan.

Dat is de stap die de simulator niet kon maken, en waar het echte werk begint.

#tip[Merk op hoeveel langer dit duurt dan in de simulator. Een volledige scan van één machine kost al snel minuten. Dat tempo hoort erbij --- en het is de reden dat pentesters hun scans starten en ondertussen aan iets anders werken.]

== Waar je nu verder kunt

Met een werkend lab zijn de andere gidsen bruikbaar geworden:

- Het *Pentest Playbook* neemt je mee door de zes fases, met dit lab als omgeving.
- Het *12-weken leerplan* gebruikt vanaf week 5 precies deze opstelling.
- De *Juridische Gids* legt uit waar de grens ligt zodra je buiten dit lab kijkt.

// ─────────────────────────────────────────────

= Als het misgaat

De vijf problemen die je waarschijnlijk tegenkomt.

== "VT-x is niet beschikbaar" of de VM start niet

Virtualisatie staat uit in je BIOS/UEFI, óf een ander programma claimt het. Op Windows is dat meestal Hyper-V, WSL2, Docker Desktop of de functie *Geheugenintegriteit* onder Windows-beveiliging. Die kunnen VirtualBox in de weg zitten.

Zet ze tijdelijk uit, of gebruik VMware, dat er beter mee overweg kan.

== De VM is tergend traag

Meestal te weinig RAM toegewezen, of juist te veel --- waardoor je computer zelf gaat swappen. Blijf onder de helft van je totale geheugen. Zet ook 3D-versnelling uit; die helpt hier niet en veroorzaakt wel problemen.

== Geen internet in de VM

Controleer de netwerkmodus. In *host-only* is er geen internet, en dat is opzet. Zet hem op NAT als je wilt updaten of een VPN wilt gebruiken.

== Kali en het doelwit zien elkaar niet

Beide VM's moeten op *dezelfde* host-only-adapter staan. Controleer per VM: Instellingen → Netwerk → Naam. Staat daar bij de een `vboxnet0` en bij de ander `vboxnet1`, dan zitten ze in gescheiden netwerken.

== Het scherm is te klein of past niet

Installeer de *Guest Additions*: een klein pakket stuurprogramma's van VirtualBox dat je binnen de VM installeert. Daarna schaalt het scherm mee met het venster en kun je kopiëren en plakken tussen je eigen computer en de VM. Je vindt het in het menu van het VM-venster, onder *Apparaten* (Engels: *Devices*).

// ─────────────────────────────────────────────

= Checklist: is je lab klaar?

Loop dit af voor je aan je eerste oefening begint.

- [ ] Virtualisatie staat aan; de VM start zonder foutmeldingen
- [ ] Kali draait en is bijgewerkt (`apt full-upgrade` gedraaid)
- [ ] Het standaardwachtwoord `kali` is veranderd
- [ ] Je weet in welke netwerkmodus je staat, en waarom
- [ ] `ip a` toont `10.0.2.x` (NAT) of `192.168.56.x` (host-only) --- géén adres uit je eigen wifi-reeks
- [ ] Er staat een snapshot `schoon-na-installatie`
- [ ] Je hebt een doelwit: een lokale VM op host-only, óf een VPN-verbinding met een platform
- [ ] Je weet hoe je een snapshot terugzet als er iets misgaat

#tip[Vink deze lijst opnieuw af als je over een paar weken iets aan je opstelling verandert. De netwerkmodus is het item dat het vaakst stilletjes verschuift --- en het enige waar een fout gevolgen heeft buiten je eigen computer.]

// ─────────────────────────────────────────────

= Tot slot

Je hebt nu precies datgene waar elke andere gids, cursus en video zonder uitleg mee begint: een werkende Kali-machine, afgeschermd van je eigen netwerk, met snapshots en een doelwit om op te oefenen.

Vanaf hier is de rem eraf. Je kunt scannen, inbreken, dingen kapotmaken en terugzetten --- zonder dat iemand anders er last van heeft en zonder dat je iets illegaals doet.

Die twee voorwaarden --- *niemand anders heeft er last van* en *je doet niets illegaals* --- zijn geen bijzaak. Ze zijn het verschil tussen iemand die security leert en iemand met een strafblad. Je lab is de plek waar je die twee cadeau krijgt.

Gebruik hem.

#v(1fr)

#align(center)[
  #line(length: 60%, stroke: 0.5pt + luma(200))
  #v(6pt)
  #text(size: 9pt, fill: luma(140))[
    _Deze gids hoort bij HackSimulator.nl --- de gratis browser-based terminal simulator voor ethisch hacken._\
    _Versie 1.0 · augustus 2026 · Software verandert; controleer bij afwijkingen de officiële documentatie._
  ]
]
