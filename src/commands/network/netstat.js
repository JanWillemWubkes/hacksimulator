/**
 * netstat - Network statistics and connections
 * Simulated command for the HackSimulator terminal
 */

export default {
  name: 'netstat',
  category: 'network',
  description: 'Show network connections and statistics',
  usage: 'netstat',

  async execute(args, flags, context) {
    // Simulated network connections (realistic for development machine)
    const output = `Active Internet connections

Proto  Local Address           Foreign Address         State
tcp    127.0.0.1:5432         0.0.0.0:*               LISTEN      ← PostgreSQL
tcp    127.0.0.1:3000         0.0.0.0:*               LISTEN      ← Dev server
tcp    0.0.0.0:22             0.0.0.0:*               LISTEN      ← SSH
tcp    0.0.0.0:80             0.0.0.0:*               LISTEN      ← HTTP
tcp    192.168.1.100:52341    93.184.216.34:443       ESTABLISHED ← HTTPS naar CDN
tcp    192.168.1.100:54229    140.82.121.4:443        ESTABLISHED ← GitHub
tcp    192.168.1.100:58372    8.8.8.8:53              TIME_WAIT   ← DNS lookup

Summary:
   7 active connections
   4 listening ports
   3 established connections

[?] TIP: LISTEN = server wacht op inkomende verbindingen
        ESTABLISHED = actieve verbinding met remote host
        TIME_WAIT = verbinding wordt afgesloten`;

    return output;
  },

  manPage: `
NAAM
    netstat - network statistics

SYNOPSIS
    netstat [OPTIONS]

BESCHRIJVING
    Toont netwerk connecties, routing tables, interface statistics en meer.
    Essential tool voor netwerk troubleshooting en security monitoring.

VOORBEELDEN
    netstat
        Toon alle actieve netwerk connecties

    netstat -tulpn
        (Niet in simulator) Toon listening ports met process info

UITLEG OUTPUT
    [CHT] Connection States:
       • LISTEN       → Server wacht op inkomende verbindingen
       • ESTABLISHED  → Actieve verbinding (data transfer mogelijk)
       • TIME_WAIT    → Verbinding sluit af (wacht op final packets)
       • CLOSE_WAIT   → Remote kant heeft verbinding gesloten
       • SYN_SENT     → Bezig met opzetten verbinding (TCP handshake)

    [~] Protocol types:
       • tcp    → Transmission Control Protocol (reliable, ordered)
       • udp    → User Datagram Protocol (fast, connectionless)
       • tcp6   → TCP over IPv6
       • udp6   → UDP over IPv6

    [ · ] Address format:
       • 0.0.0.0:80         → Luister op alle interfaces, poort 80
       • 127.0.0.1:5432     → Alleen localhost, poort 5432
       • 192.168.1.100:443  → Specifiek IP, poort 443

EDUCATIEVE TIPS
    [→] Wanneer gebruik je netstat?
       • Controleren welke ports open staan (security audit)
       • Debuggen van netwerk services (draait mijn server?)
       • Monitoren van actieve verbindingen (wie is verbonden?)
       • Vinden van port conflicts (waarom start service niet?)

    [?] Security gebruik:
       • Detecteren van backdoors (onverwachte LISTEN ports)
       • Monitoren van uitgaande verbindingen (malware communicatie?)
       • Controleren van exposed services (wat is toegankelijk?)

    [?] LISTEN poorten:
       • 0.0.0.0:X = Gevaarlijk! Toegankelijk van overal
       • 127.0.0.1:X = Veilig! Alleen localhost toegang
       • Database ports (3306, 5432) zouden NOOIT 0.0.0.0 moeten zijn

    [!]  TIME_WAIT state:
       Veel TIME_WAIT connecties = normaal na veel korte verbindingen
       Te veel (1000+) kan duiden op:
         • DoS attack (connection exhaustion)
         • Application bug (connections niet netjes sluiten)

PRAKTISCHE VOORBEELDEN
    [?] Checken of service draait:
       netstat | grep :80    → Is webserver actief?
       netstat | grep :22    → Is SSH server actief?

    [###]  Security check:
       • Zie je onverwachte LISTEN ports? → Mogelijk backdoor
       • Database op 0.0.0.0? → SECURITY RISK!
       • Verbindingen naar onbekende IPs? → Check wat het is

    [CPU] Development:
       • Port 3000 in gebruik? → Andere dev server draait al
       • Check welke process luistert: sudo netstat -tulpn

VEELGEMAAKTE FOUTEN
    [X] Address already in use (bij starten server)
       → Port is bezet, check met netstat welke process
       → Kill old process of kies andere port

    [X] Can't connect to localhost:5432
       → Check met netstat of PostgreSQL LISTEN is
       → Mogelijk draait het alleen op 127.0.0.1 (niet via netwerk)

GEAVANCEERDE OPTIONS (niet in simulator)
    -t    → Alleen TCP verbindingen
    -u    → Alleen UDP verbindingen
    -l    → Alleen LISTENING sockets
    -p    → Toon process ID en naam
    -n    → Numeriek (geen hostname resolution, sneller)
    -a    → Toon alles (including non-ESTABLISHED)

    netstat -tulpn = Meest gebruikte combinatie!
       (tcp, udp, listening, program, numeric)

MODERNE ALTERNATIEF
    ss (socket statistics) is sneller dan netstat:
       ss -tulpn    → Equivalent aan netstat -tulpn
       ss -s        → Socket statistics summary

    netstat is legacy maar nog steeds universeel beschikbaar.

GERELATEERDE COMMANDO'S
    nmap, ifconfig, ping, ss (moderne vervanger)
`.trim()
};
