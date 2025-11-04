/**
 * ping - Test network connectivity to a host
 * Simulated command for the HackSimulator terminal
 */

/**
 * Simulate ping to known hosts
 */
function simulatePing(host) {
  // Known hosts with simulated responses
  const knownHosts = {
    '8.8.8.8': { name: 'Google DNS', rtt: [12, 11, 13, 12] },
    '1.1.1.1': { name: 'Cloudflare DNS', rtt: [8, 9, 8, 9] },
    'google.com': { name: 'google.com', ip: '142.250.185.46', rtt: [15, 16, 14, 15] },
    'github.com': { name: 'github.com', ip: '140.82.121.3', rtt: [20, 19, 21, 20] },
    'localhost': { name: 'localhost', ip: '127.0.0.1', rtt: [0, 0, 0, 0] },
    '127.0.0.1': { name: 'localhost', rtt: [0, 0, 0, 0] },
    '192.168.1.1': { name: 'Router', rtt: [3, 2, 3, 2] },
    '192.168.1.100': { name: 'Local machine', rtt: [1, 1, 1, 1] },
  };

  return knownHosts[host.toLowerCase()] || null;
}

export default {
  name: 'ping',
  category: 'network',
  description: 'Test connectivity to a host',
  usage: 'ping <host>',

  async execute(args, flags, context) {
    // Require host argument
    if (args.length === 0) {
      return `ping: missing host operand\n\n[ ? ] TIP: Gebruik 'ping <host>' om verbinding te testen. Bijvoorbeeld: ping 8.8.8.8`;
    }

    const host = args[0];
    const hostInfo = simulatePing(host);

    if (!hostInfo) {
      // Unknown host - educational response
      return `ping: ${host}: Name or service not known

[ ? ] TIP: Host onbekend. Probeer een van deze bekende hosts:
   • 8.8.8.8 (Google DNS)
   • 1.1.1.1 (Cloudflare DNS)
   • google.com
   • localhost
   • 192.168.1.1 (typische router)`;
    }

    // Build realistic ping output (80/20 principle)
    const displayHost = hostInfo.ip
      ? `${host} (${hostInfo.ip})`
      : host;

    let output = `PING ${displayHost}: 56 data bytes\n`;

    // Show 4 ping responses
    hostInfo.rtt.forEach((rtt, i) => {
      const seq = i + 1;
      const ttl = 64;
      output += `64 bytes from ${hostInfo.ip || host}: icmp_seq=${seq} ttl=${ttl} time=${rtt}ms\n`;
    });

    // Summary statistics
    const avgRtt = Math.round(
      hostInfo.rtt.reduce((a, b) => a + b, 0) / hostInfo.rtt.length
    );
    const minRtt = Math.min(...hostInfo.rtt);
    const maxRtt = Math.max(...hostInfo.rtt);

    output += `\n--- ${host} ping statistics ---\n`;
    output += `4 packets transmitted, 4 received, 0% packet loss\n`;
    output += `rtt min/avg/max = ${minRtt}/${avgRtt}/${maxRtt} ms`;

    // Educational tip based on host type
    if (host === 'localhost' || host === '127.0.0.1') {
      output += `\n\n[ ? ] TIP: localhost (127.0.0.1) is altijd je eigen machine. 0ms response = geen netwerk nodig!`;
    } else if (host.includes('192.168')) {
      output += `\n\n[ ? ] TIP: 192.168.x.x zijn private IP adressen (lokaal netwerk). Lage ping = goede verbinding.`;
    } else if (host.includes('8.8.8.8') || host.includes('1.1.1.1')) {
      output += `\n\n[ ? ] TIP: Publieke DNS servers zijn ideaal om internetverbinding te testen.`;
    } else {
      output += `\n\n[ ? ] TIP: Lage ping (<50ms) = goede verbinding. Hoge ping (>100ms) kan problemen veroorzaken.`;
    }

    return output;
  },

  manPage: `
NAAM
    ping - test network connectivity to a host

SYNOPSIS
    ping <HOST>

BESCHRIJVING
    Stuurt ICMP ECHO_REQUEST packets naar een host om te testen of deze
    bereikbaar is en hoe snel de verbinding is. In de simulator worden
    bekende hosts gesimuleerd met realistische response times.

ARGUMENTEN
    HOST
        Het IP adres of hostname waarmee je verbinding wilt testen
        Voorbeelden: 8.8.8.8, google.com, localhost

VOORBEELDEN
    ping 8.8.8.8
        Test verbinding met Google's publieke DNS server

    ping google.com
        Test verbinding met google.com (met DNS resolutie)

    ping localhost
        Test je eigen machine (altijd 0ms response)

    ping 192.168.1.1
        Test verbinding met je router (typisch adres)

UITLEG OUTPUT
    • icmp_seq    → Sequentie nummer van het packet
    • ttl         → Time To Live (max hops voordat packet expires)
    • time        → Round-trip time in milliseconds
    • packet loss → Percentage verloren packets (0% = perfect)

EDUCATIEVE TIPS
    [ ~ ] Wat doet ping?
       Ping stuurt ICMP "echo request" packets en meet hoe snel de
       "echo reply" terugkomt. Dit test netwerkbereikbaarheid.

    [ ~ ] Response tijden:
       • 0-30ms    → Excellent (lokaal netwerk of nabije server)
       • 30-100ms  → Goed (normale internet verbinding)
       • 100-300ms → Acceptabel (verre server of trage verbinding)
       • >300ms    → Slecht (problemen, of zeer verre server)

    [ ! ] Security context:
       • Ping wordt gebruikt in recon phase (is host online?)
       • Sommige servers blokkeren ping (ICMP) om verborgen te blijven
       • Ping sweeps: automatisch een hele range pingen (192.168.1.1-254)

    [ ? ] Praktisch gebruik:
       • Testen of internet werkt: ping 8.8.8.8
       • Testen of DNS werkt: ping google.com (als dit faalt, DNS probleem)
       • Testen lokaal netwerk: ping 192.168.1.1 (je router)

    [ → ] In pentesting:
       • Eerste stap: welke hosts zijn online? (host discovery)
       • ICMP blocked? Gebruik TCP ping (via nmap)
       • Firewall fingerprinting: verschillende responses = info

BEKENDE HOSTS IN SIMULATOR
    • 8.8.8.8          → Google DNS (altijd bereikbaar)
    • 1.1.1.1          → Cloudflare DNS (privacy-focused)
    • google.com       → Google's webserver
    • github.com       → GitHub servers
    • localhost        → Je eigen machine (127.0.0.1)
    • 192.168.1.1      → Typisch router adres
    • 192.168.1.100    → Voorbeeld lokale machine

VEELGEMAAKTE FOUTEN
    [ X ] ping (zonder host)
       → Je moet een host opgeven

    [ X ] ping unknown-host.com
       → Host niet bekend in simulator
       → In realiteit: DNS lookup zou falen

GERELATEERDE COMMANDO'S
    nmap, traceroute, ifconfig, netstat
`.trim()
};
