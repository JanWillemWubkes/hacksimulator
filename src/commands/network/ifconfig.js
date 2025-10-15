/**
 * ifconfig - Display network interface configuration
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'ifconfig',
  category: 'network',
  description: 'Display network configuration',
  usage: 'ifconfig',

  async execute(args, flags, context) {
    // Simulated network interfaces (realistic for a typical Linux machine)
    const output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  ← Je lokale IP adres
        netmask 255.255.255.0
        broadcast 192.168.1.255
        ether 08:00:27:3f:2a:1b  ← MAC adres (hardware)
        RX packets 15234  bytes 12847291 (12.8 MB)
        TX packets 9821   bytes 1834724 (1.8 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  ← Loopback (localhost)
        netmask 255.0.0.0
        RX packets 1043  bytes 89234 (89.2 KB)
        TX packets 1043  bytes 89234 (89.2 KB)

wlan0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.1.105  ← WiFi interface (indien verbonden)
        netmask 255.255.255.0
        broadcast 192.168.1.255
        ether a4:5e:60:c2:8d:3f
        RX packets 8923  bytes 9234812 (9.2 MB)
        TX packets 7234  bytes 892341 (892.3 KB)

💡 TIP: Belangrijke velden:
   • inet (IPv4) = Je IP adres op dit netwerk
   • netmask = Bepaalt welke IPs in je lokale netwerk zitten
   • ether (MAC) = Uniek hardware adres van je netwerkkaart
   • RX/TX = Ontvangen/verzonden packets (statistieken)`;

    return output;
  },

  manPage: `
NAAM
    ifconfig - configure network interfaces

SYNOPSIS
    ifconfig [INTERFACE]

BESCHRIJVING
    Toont configuratie van alle netwerk interfaces op je systeem. In moderne
    Linux systemen is 'ip addr' de vervanger, maar ifconfig wordt nog breed
    gebruikt en is essentieel voor pentesting.

ARGUMENTEN
    [INTERFACE]
        Optioneel: toon alleen specifieke interface (eth0, wlan0, lo)
        Zonder argument: toon alle interfaces

VOORBEELDEN
    ifconfig
        Toon alle netwerk interfaces en hun configuratie

    ifconfig eth0
        Toon alleen ethernet interface (niet geïmplementeerd in simulator)

UITLEG OUTPUT
    🔌 Interfaces:
       • eth0   → Ethernet (bekabeld netwerk)
       • wlan0  → WiFi (draadloos netwerk)
       • lo     → Loopback (localhost, 127.0.0.1)

    📊 Belangrijke velden:
       • inet      → IPv4 adres van deze interface
       • netmask   → Subnet mask (welke IPs zijn "lokaal")
       • broadcast → Broadcast adres (messaging naar alle hosts)
       • ether     → MAC adres (hardware identifier, uniek)
       • RX/TX     → Received/Transmitted packets (statistieken)
       • mtu       → Maximum Transmission Unit (packet size limit)

    🏷️  Flags:
       • UP      → Interface is actief
       • RUNNING → Interface heeft carrier signal (kabel aangesloten)
       • BROADCAST → Ondersteunt broadcast messaging
       • MULTICAST → Ondersteunt multicast messaging
       • LOOPBACK → Loopback interface (lo)

EDUCATIEVE TIPS
    🌐 IP Adressen begrijpen:
       • 192.168.x.x    → Private netwerk (thuis/kantoor)
       • 10.x.x.x       → Private netwerk (grote organisaties)
       • 172.16-31.x.x  → Private netwerk (medium organisaties)
       • 127.0.0.1      → Loopback (altijd je eigen machine)

    🎯 Netmask (subnet mask):
       • 255.255.255.0   → /24 netwerk (254 hosts mogelijk)
       • 255.255.0.0     → /16 netwerk (65534 hosts mogelijk)
       • 255.0.0.0       → /8 netwerk (16 miljoen hosts)

       Voorbeeld: 192.168.1.100 met netmask 255.255.255.0
       → Lokaal netwerk = 192.168.1.1 t/m 192.168.1.254

    🔍 MAC Adres (Media Access Control):
       • Uniek hardware adres van je netwerkkaart
       • Format: 08:00:27:3f:2a:1b (hexadecimaal)
       • Eerste 3 bytes = vendor ID (manufacturer)
       • Gebruikt op laag 2 (data link layer) van OSI model

    💡 In pentesting:
       • Bepaal je eigen IP voor local privilege escalation
       • Check welke interfaces beschikbaar zijn
       • MAC adressen kunnen gespoofed worden (ARP spoofing)
       • Multiple interfaces = mogelijk pivot point naar andere netwerken

    🔒 Security implicaties:
       • Publiek IP vs Private IP (NAT)
       • MAC filtering (beperkte beveiliging, makkelijk te omzeilen)
       • IP conflicts (two machines, same IP = probleem)

PRAKTISCH GEBRUIK
    🏠 Netwerk troubleshooting:
       1. ifconfig → Check je IP adres
       2. ping 192.168.1.1 → Test gateway (router)
       3. ping 8.8.8.8 → Test internet

    🔍 Info gathering (recon):
       • Wat is mijn lokale IP? (voor local exploits)
       • Welke interfaces zijn beschikbaar? (pivot opportunities)
       • Wat is mijn netwerk range? (lateral movement scope)

VEELGEMAAKTE FOUTEN
    ❌ ifconfig op moderne systemen (command not found)
       → Moderne distros gebruiken 'ip addr' (maar ifconfig is klassiek)

    ❌ IP adres lijkt verkeerd (bijv. 169.254.x.x)
       → APIPA adres = geen DHCP beschikbaar (netwerk probleem)

    ❌ Geen internet maar wel IP adres
       → Check gateway met 'ping 192.168.1.1'
       → Check DNS met 'ping 8.8.8.8'

HISTORISCHE CONTEXT
    ifconfig is een legacy tool (uit BSD Unix, jaren '80). Moderne Linux
    gebruikt 'ip' command van iproute2 package:
       • ifconfig → ip addr (toon adressen)
       • route   → ip route (toon routing)

    Maar ifconfig blijft populair omdat het:
       • Overzichtelijker is (minder verbose)
       • Universeel bekend is (alle tutorials)
       • Standaard op macOS en BSD

GERELATEERDE COMMANDO'S
    ping, netstat, traceroute, nmap

    Moderne equivalenten:
       • ip addr     → show IP addresses
       • ip link     → show interfaces
       • ip route    → show routing table
`.trim()
};
