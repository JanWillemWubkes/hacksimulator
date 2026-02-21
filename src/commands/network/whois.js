/**
 * whois - Domain registration information lookup
 * Simulated command for the HackSimulator terminal
 */

/**
 * Get simulated whois data for known domains
 */
function getWhoisData(domain) {
  const whoisDatabase = {
    'google.com': {
      registrar: 'MarkMonitor Inc.',
      created: '1997-09-15',
      expires: '2028-09-14',
      nameservers: ['ns1.google.com', 'ns2.google.com'],
      organization: 'Google LLC',
      country: 'US'
    },
    'github.com': {
      registrar: 'MarkMonitor Inc.',
      created: '2007-10-09',
      expires: '2029-10-09',
      nameservers: ['ns1.p16.dynect.net', 'ns2.p16.dynect.net'],
      organization: 'GitHub, Inc.',
      country: 'US'
    },
    'example.com': {
      registrar: 'Internet Assigned Numbers Authority',
      created: '1995-08-14',
      expires: 'Reserved',
      nameservers: ['a.iana-servers.net', 'b.iana-servers.net'],
      organization: 'Internet Assigned Numbers Authority',
      country: 'US'
    },
    'hacksimulator.nl': {
      registrar: 'SIDN (Stichting Internet Domeinregistratie NL)',
      created: '2025-01-15',
      expires: '2026-01-15',
      nameservers: ['ns1.netlify.com', 'ns2.netlify.com'],
      organization: 'HackSimulator Educational Project',
      country: 'NL'
    }
  };

  return whoisDatabase[domain.toLowerCase()] || null;
}

export default {
  name: 'whois',
  category: 'network',
  description: 'Lookup domain registration information',
  usage: 'whois <domain>',

  async execute(args, flags, context) {
    // Require domain argument
    if (args.length === 0) {
      return `whois: missing domain operand\n\n[?] TIP: Gebruik 'whois <domain>' voor registratie info. Bijvoorbeeld: whois google.com`;
    }

    const domain = args[0];
    const whoisData = getWhoisData(domain);

    if (!whoisData) {
      return `No whois data found for ${domain}

[?] TIP: Probeer bekende domains:
   • google.com
   • github.com
   • hacksimulator.nl
   • example.com`;
    }

    // Build realistic whois output
    let output = `Domain Name: ${domain.toUpperCase()}\n`;
    output += `\nRegistrar Info:\n`;
    output += `   Registrar: ${whoisData.registrar}  ← Waar domain geregistreerd is\n`;
    output += `   Created: ${whoisData.created}\n`;
    output += `   Expires: ${whoisData.expires}\n`;
    output += `\nRegistrant:\n`;
    output += `   Organization: ${whoisData.organization}\n`;
    output += `   Country: ${whoisData.country}\n`;
    output += `\nName Servers:\n`;
    whoisData.nameservers.forEach(ns => {
      output += `   ${ns}\n`;
    });

    // Educational tip based on domain
    if (domain.includes('.nl')) {
      output += `\n[?] TIP: .nl domains worden beheerd door SIDN (Nederlandse registry).`;
    } else if (domain === 'google.com' || domain === 'github.com') {
      output += `\n[?] TIP: MarkMonitor is een premium registrar gebruikt door grote bedrijven.`;
    } else {
      output += `\n[?] TIP: Whois data is publiek - privacy protection kan je info verbergen.`;
    }

    return output;
  },

  manPage: `
NAAM
    whois - lookup domain registration information

SYNOPSIS
    whois <DOMAIN>

BESCHRIJVING
    Toont publieke registratie informatie van een domain name. Useful voor
    reconnaissance en verificatie van domain ownership.

ARGUMENTEN
    DOMAIN
        Het domain name om op te zoeken (bijv. google.com)

VOORBEELDEN
    whois google.com
        Bekijk wie google.com heeft geregistreerd

    whois hacksimulator.nl
        Check registratie info van een .nl domain

UITLEG OUTPUT
    [ = ] Belangrijke velden:
       • Registrar     → Bij welk bedrijf domain geregistreerd is
       • Created       → Wanneer domain voor het eerst geregistreerd werd
       • Expires       → Wanneer registratie verloopt (moet renewed worden)
       • Organization  → Wie eigenaar is (kan privacy-protected zijn)
       • Name Servers  → DNS servers die domain resolven

EDUCATIEVE TIPS
    [?] Whois in reconnaissance (OSINT):
       • Organisatie identificeren (wie is eigenaar?)
       • Registratie datum (hoe oud is de site?)
       • Email adressen (voor social engineering of contact)
       • Nameservers (hosting provider achterhalen)

    [###]  Privacy Protection:
       Veel domains gebruiken "privacy protection" services die echte
       contact details verbergen:
          • WHOIS PRIVACY PROTECTION SERVICE
          • Contact via proxy
          • Geen persoonlijke data publiek

       Voor .nl domains is privacy standaard sinds AVG/GDPR (2018).

    [→] Praktische use cases:
       • Verificatie: Is dit domain echt van bedrijf X?
       • Expiry check: Gaat domain binnenkort verlopen? (typosquatting opportunity)
       • Infrastructure mapping: Nameservers = hosting provider
       • Email harvesting: Contact emails (voor legitimate outreach of phishing)

    [!]  GDPR Impact:
       Sinds 2018 is veel persoonlijke data verborgen in whois:
          • Geen persoonlijke namen meer (voor EU domains)
          • Geen privé adressen
          • Geen directe telefoonnummers
          • Alleen organisatie info (voor business domains)

    [?] Alternative info sources:
       Als whois weinig geeft, probeer:
          • DNSDumpster (DNS reconnaissance)
          • Builtwith (technology stack)
          • Archive.org (domain history)
          • Certificate transparency logs (SSL cert info)

PRAKTISCHE VOORBEELDEN
    [?] Domain research:
       1. whois target.com → Basic info
       2. Check nameservers → Hosting provider
       3. Check creation date → Hoe gevestigd is site?
       4. Google organization name → Meer context

    [ !! ] Scam detection:
       • Domain pas geregistreerd (< 6 maanden)? → Suspicieus
       • Privacy protection op business site? → Suspicieus
       • Nameservers in "shady" landen? → Suspicieus
       • Organisatie naam generiek (LLC, LTD)? → Check verder

    [ $ ] Business use:
       • Domain expiry monitoring (voorkom verlies)
       • Concurrent analyse (welke domains hebben ze?)
       • Brand protection (typosquatting detecteren)

VEELGEMAAKTE FOUTEN
    [X] whois 192.168.1.1 (IP address)
       → whois werkt met domains, niet IP adressen
       → Voor IP lookup gebruik 'whois <IP>' op grotere systemen

    [X] "No data" voor nieuwe domain
       → Kan 24-48 uur duren voordat whois data beschikbaar is

    [X] Verouderde info
       → Whois databases worden periodiek geupdate (niet real-time)

TECHNICAL DETAILS
    [ @ ] Hoe werkt whois?
       • Gedistribueerde database (per TLD een registry)
       • .com/.net → Verisign
       • .nl → SIDN
       • .org → Public Interest Registry
       • Etc.

    [~] Protocol:
       • Port 43 (whois protocol)
       • Simple text-based query/response
       • Different format per registry (geen standaard)

GERELATEERDE COMMANDO'S
    nmap, ping, dig (DNS lookup tool - niet in simulator)
`.trim()
};
