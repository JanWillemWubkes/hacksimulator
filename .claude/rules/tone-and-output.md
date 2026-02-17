# Tone of Voice & 80/20 Output Voorbeelden

## Error Messages

**GOOD:**
```
Bestand niet gevonden: passwords.txt
[TIP] Gebruik 'ls' om te zien welke bestanden er zijn, of 'find passwords' om te zoeken
```

**BAD:**
```
ERROR: File not found.
```

**Why:** Good = beginner knows next action + learns `ls`/`find` commands. Bad = frustrating, no help.

---

## Security Warnings

**GOOD:**
```
[!] Let op: sqlmap is een offensive tool voor het vinden van SQL injection kwetsbaarheden.
Gebruik dit ALLEEN op systemen waar je schriftelijke toestemming voor hebt!

Doorgaan? (j/n): _
```

**BAD:**
```
WARNING: Illegal use is prohibited.
```

**Why:** Good = educatief (wat doet de tool?) + ethisch (toestemming). Bad = juridisch jargon, beginner snapt niet waarom.

---

## Educational Tips

**GOOD:**
```
22/tcp   OPEN    SSH ← Secure Shell (remote terminal toegang)
80/tcp   OPEN    HTTP ← Webserver (onversleuteld!)

[TIP] Poort 22 open = mogelijkheid om op afstand in te loggen. Check of wachtwoord sterk genoeg is!
[TIP] Poort 80 = onversleutelde website. Gevoelige data? Gebruik poort 443 (HTTPS).
```

**BAD:**
```
PORT     STATE   SERVICE
22/tcp   open    ssh
80/tcp   open    http
```

**Why:** Good = context (← Nederlands), relevantie (waarom belangrijk?), actie (wat nu?). Bad = technisch, beginner leert niks.

---

## 80/20 Command Output Pattern

**DO:**
```javascript
// src/commands/network/nmap.js
return `
Starting Nmap scan...
PORT     STATE   SERVICE          ← Nederlands context
22/tcp   OPEN    SSH (Secure Shell)
80/tcp   OPEN    HTTP (Web Server)
443/tcp  OPEN    HTTPS (Encrypted Web)

[TIP] Poort 22 open = SSH toegang mogelijk. Check wachtwoord sterkte!
[!] Scan alleen systemen waar je toestemming voor hebt.
`;
```

**DON'T (te technisch):**
```javascript
return `
Starting Nmap 7.80 ( https://nmap.org ) at 2024-01-04 15:30 CET
Nmap scan report for 192.168.1.1
Host is up (0.0012s latency).
Not shown: 997 filtered ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
...
`;
```

**DON'T (te simpel):**
```javascript
return `Scan complete: 3 ports open`;
```

**Formula:** Technical output + `← Dutch context` + `[TIP]` + `[!]` warning

---

## Application

- All 32 commands in `src/commands/*/` follow this tone
- Error messages in `src/core/terminal.js`
- Help system in `src/help/help-system.js` 3-tier approach
