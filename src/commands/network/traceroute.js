/**
 * traceroute - Trace network path to destination
 * Simulated command for the HackSimulator terminal
 */

/**
 * Get simulated traceroute path for known destinations
 */
function getTraceroutePath(destination) {
  const routes = {
    'google.com': [
      { hop: 1, ip: '192.168.1.1', hostname: 'router.local', time: [1, 1, 1] },
      { hop: 2, ip: '10.0.0.1', hostname: 'gateway.isp.net', time: [8, 9, 8] },
      { hop: 3, ip: '81.206.165.1', hostname: 'core1.isp.net', time: [12, 11, 13] },
      { hop: 4, ip: '72.14.238.10', hostname: 'edge.google.net', time: [15, 16, 14] },
      { hop: 5, ip: '142.250.185.46', hostname: 'google.com', time: [16, 15, 16] }
    ],
    'localhost': [
      { hop: 1, ip: '127.0.0.1', hostname: 'localhost', time: [0, 0, 0] }
    ],
    '8.8.8.8': [
      { hop: 1, ip: '192.168.1.1', hostname: 'router.local', time: [1, 1, 2] },
      { hop: 2, ip: '10.0.0.1', hostname: 'gateway.isp.net', time: [7, 8, 9] },
      { hop: 3, ip: '81.206.165.1', hostname: 'core1.isp.net', time: [11, 12, 11] },
      { hop: 4, ip: '8.8.8.8', hostname: 'dns.google', time: [13, 12, 14] }
    ],
    'github.com': [
      { hop: 1, ip: '192.168.1.1', hostname: 'router.local', time: [2, 1, 2] },
      { hop: 2, ip: '10.0.0.1', hostname: 'gateway.isp.net', time: [9, 10, 9] },
      { hop: 3, ip: '81.206.165.1', hostname: 'core1.isp.net', time: [14, 13, 15] },
      { hop: 4, ip: '*', hostname: null, time: ['*', '*', '*'] },  // Filtered hop
      { hop: 5, ip: '140.82.121.3', hostname: 'github.com', time: [22, 21, 23] }
    ]
  };

  return routes[destination.toLowerCase()] || routes['google.com'];
}

export default {
  name: 'traceroute',
  category: 'network',
  description: 'Trace network path to destination',
  usage: 'traceroute <destination>',

  async execute(args, flags, context) {
    // Require destination argument
    if (args.length === 0) {
      return `traceroute: missing destination operand\n\n[?] TIP: Gebruik 'traceroute <host>' om route te tracen. Bijvoorbeeld: traceroute google.com`;
    }

    const destination = args[0];
    const path = getTraceroutePath(destination);

    // Build traceroute output (realistic format)
    let output = `traceroute to ${destination}, 30 hops max\n\n`;

    path.forEach(({ hop, ip, hostname, time }) => {
      const hopStr = `${hop}`.padStart(2);

      if (ip === '*') {
        // Filtered/blocked hop
        output += ` ${hopStr}  * * *  ← Hop filtered (firewall/router config)\n`;
      } else {
        const hostnameStr = hostname ? `${hostname} (${ip})` : ip;
        const timeStr = time.map(t => `${t}ms`).join('  ');
        output += ` ${hopStr}  ${hostnameStr}  ${timeStr}\n`;
      }
    });

    // Educational tips based on destination
    if (destination === 'localhost' || destination === '127.0.0.1') {
      output += `\n[?] TIP: localhost = 0 hops, geen netwerk nodig (loopback interface).`;
    } else if (path.some(h => h.ip === '*')) {
      output += `\n[?] TIP: * betekent hop antwoordt niet (firewall, of ICMP blocked).`;
    } else {
      const hops = path.length;
      output += `\n[?] TIP: ${hops} hops = aantal routers tussen jou en bestemming. Meer hops = langere route.`;
    }

    return output;
  },

  manPage: `
NAAM
    traceroute - trace network path to destination

SYNOPSIS
    traceroute <DESTINATION>

BESCHRIJVING
    Toont de route die packets nemen van je machine naar de bestemming.
    Elke "hop" is een router op het pad. Useful voor netwerk diagnostics
    en understanding network topology.

ARGUMENTEN
    DESTINATION
        IP adres of hostname van bestemming
        Voorbeelden: google.com, 8.8.8.8, github.com

VOORBEELDEN
    traceroute google.com
        Trace route naar Google's servers

    traceroute 8.8.8.8
        Trace route naar Google DNS (reliable test)

    traceroute localhost
        Trace naar je eigen machine (0 hops)

UITLEG OUTPUT
    [###] Kolommen:
       • Hop nummer    → Positie in route (1 = eerste router)
       • Hostname/IP   → Identificatie van router
       • Time (3x)     → Round-trip time voor 3 test packets (ms)

    [!]  Special cases:
       • * * *         → Hop antwoordt niet (ICMP filtered/blocked)
       • !H            → Host unreachable
       • !N            → Network unreachable

EDUCATIEVE TIPS
    [ @ ] Hoe werkt traceroute?
       • Stuurt packets met oplopende TTL (Time To Live)
       • TTL=1 → Eerste router reageert (expired)
       • TTL=2 → Tweede router reageert
       • Etc. tot bestemming bereikt is

    [ · ] Route analyse:
       • Hop 1 is meestal je router (192.168.x.x)
       • Hop 2-3 zijn vaak ISP routers
       • Daarna internet backbone
       • Laatste hop is destination

    [~] Performance insights:
       • Grote tijd sprong (10ms → 100ms) = lange afstand of congestion
       • Hoge latency op vroege hop = probleem dichtbij
       • Hoge latency alleen op laatste hop = probleem bij destination

    [!] Security / Privacy:
       • Veel bedrijven blokkeren ICMP = * * * hops
       • Geographic location kan afgeleid worden (IP ranges)
       • Traceroute gebruikt voor network mapping (recon)

    [→] In pentesting:
       • Netwerk topologie ontdekken
       • Firewalls identificeren (waar beginnen * hops?)
       • Routing paths begrijpen (voor man-in-the-middle)
       • Geographic location bepalen

PRAKTISCHE VOORBEELDEN
    [?] Netwerk troubleshooting:
       Langzame verbinding? Check waar vertraging zit:

       traceroute slow-site.com
       → Hop 5: 200ms (probleem zit hier!)
       → Contact je ISP of probeer andere route

    [ @ ] Geographic routing:
       traceroute european-site.eu
       → Veel hops in Europa
       traceroute us-site.com
       → Hops springen Atlantische oceaan over (submarine cables!)

    [###]  Firewall detection:
       traceroute corporate-site.com
       → Hop 1-5: normaal
       → Hop 6-10: * * * (firewall blocks ICMP)
       → Hop 11: destination (past firewall)

VEELGEMAAKTE FOUTEN
    [X] Veel * * * hops (geen response)
       → Niet altijd een probleem! Routers mogen ICMP blokkeren
       → Als destination bereikbaar is (ping werkt) = OK

    [X] Route lijkt inefficiënt (veel hops, of omweg)
       → Internet routing is complex (BGP policies)
       → Route kan dynamisch veranderen (load balancing)

    [X] Laatste hop timeout maar site werkt
       → Destination server blokkeert ICMP maar accepteert HTTP
       → Dit is normaal voor security-conscious servers

TECHNICAL DETAILS
    [CFG] Implementatie varianten:
       • Linux: traceroute (gebruikt UDP)
       • Windows: tracert (gebruikt ICMP)
       • Resultaten kunnen verschillen (firewalls behandelen UDP/ICMP anders)

    [ @ ] TTL (Time To Live):
       • Start bijvoorbeeld bij 1
       • Elke router verlaagt TTL met 1
       • TTL=0 → Router stuurt "Time Exceeded" terug
       • Dit is hoe traceroute hop-by-hop ontdekt

    [CHT] Waarom 3 packets per hop?
       • Gemiddelde berekenen (routes kunnen variëren)
       • Packet loss detecteren (1 lost packet = OK)
       • Meer betrouwbare timing meting

GEAVANCEERDE USE
    -I    → Gebruik ICMP i.p.v. UDP (kan meer success hebben)
    -T    → Gebruik TCP packets (vaak niet geblokkeerd)
    -p    → Specify destination port
    -m    → Max hops (default 30)
    -q    → Aantal packets per hop (default 3)

GERELATEERDE COMMANDO'S
    ping, nmap, mtr (combines ping + traceroute)
`.trim()
};
