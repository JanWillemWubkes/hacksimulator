# Commands Reference - HackSimulator.nl

**Totaal:** 41 commands

## System Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `clear` | Clear terminal screen | *(screen clears)* |
| `help` | Show available commands | "Available commands: clear, ls, cd..." |
| `man [cmd]` | Show manual for command | *(detailed help page)* |
| `history` | Show command history | "1. ls<br>2. cd /home<br>3. pwd" |
| `echo [text]` | Print text | "Hello World" |
| `date` | Show current date/time | "Thu Aug 13 2026 14:30:00 GMT+0200 (Midden-Europese zomertijd)" |
| `whoami` | Show current user | "hacker" |
| `shortcuts` | Show keyboard shortcuts | "Ctrl+L: clear terminal..." |
| `welcome` | Toon het welkomstbericht opnieuw | *(welkomstbericht)* |

## Educational Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `tutorial` | Start guided learning scenarios | "Beschikbare scenario's: fundamentals, recon, webvuln, privesc, exploitation" |
| `leerpad` | Show learning path overview | "BEGINNER → [ ] FASE 1: TERMINAL BASICS (0/7)" |
| `hint` | Vraag een hint tijdens een tutorial | "Hint: gebruik 'ls' om bestanden te zien" |
| `next` | Toon je volgende stap | "Volgende stap: probeer 'nmap 192.168.1.1'" |

## Gamification Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `challenge` | Start/manage challenges | "15 challenges beschikbaar in 3 niveaus" |
| `achievements` | Show unlocked badges | "[*] Badges: 5/22 ontgrendeld" |
| `certificates` | Generate completion certificate | "Certificaat gegenereerd! Download of kopieer..." |
| `dashboard` | Show progress overview | "Stats \| Badges \| Challenges" |
| `leaderboard` | Show rankings | "Top 10 hackers..." |

## File System Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `ls` | List files | "documents/  notes.txt  README.txt" |
| `ls -la` | List all files with details (flag van `ls`, geen apart command) | "drw-r--r--    4096  Oct 14 12:00  documents/" |
| `cd [path]` | Change directory | *(no output on success)* |
| `pwd` | Print working directory | "/home/hacker" |
| `cat [file]` | Show file contents | *(file content)* |
| `mkdir [name]` | Create directory | *(no output on success)* |
| `touch [file]` | Create empty file | *(no output on success)* |
| `rm [file]` | Remove file | *(no output on success)* |
| `cp [src] [dst]` | Copy file | *(no output on success)* |
| `mv [src] [dst]` | Move/rename file | *(no output on success)* |
| `find [name]` | Find files | "./documents/passwords.txt" |
| `grep [text]` | Search in files | "Line 3: password123" |

## Network Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `ping [host]` | Test connectivity | "64 bytes from 8.8.8.8: icmp_seq=1 ttl=64 time=12ms" |
| `nmap [host]` | Scan ports | "53/tcp OPEN DNS dnsmasq<br>80/tcp OPEN HTTP router admin" (192.168.1.1 = routerprofiel; poort 22 is dicht) |
| `ifconfig` | Show network config | "eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt; mtu 1500<br>inet 192.168.1.100" |
| `netstat` | Network statistics | "7 active connections, 4 listening ports" |
| `whois [domain]` | Domain info | "Registrar: Internet Assigned Numbers Authority" |
| `traceroute [host]` | Trace network path | "1  router.local (192.168.1.1)  1ms  1ms  1ms" |

## Security Tools

| Command | Description | Example Output |
|---------|-------------|----------------|
| `hashcat [hash]` | Crack password hash | "[✓] HASH CRACKED!<br>Password: password" |
| `hydra <protocol>://<target>` | Brute force attack | "[22][SSH] host: ssh://192.168.1.100<br>login: admin  password: admin" (protocol-prefix is verplicht) |
| `sqlmap [url]` | Test SQL injection | "[✓] VULNERABLE!<br>backend DBMS: MySQL 5.7.32" |
| `metasploit` | Exploitation framework | "metasploit v6.3.4-dev<br>2344 exploits - 1377 payloads - 423 post-modules" |
| `nikto [url]` | Scan web vulnerabilities | "+ /admin/: Directory indexing enabled" |

> Alle vijf de security tools tonen bij het **eerste** gebruik een juridische waarschuwing
> in plaats van output; het commando nogmaals typen geldt als akkoord
> (`localStorage['security_tools_consent']`). Zie `.claude/rules/command-output.md` §4.

## Special Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `reset` | Reset filesystem to default | "Filesystem gereset naar standaard" |

## Virtual File System Structure

```
/
├── home/user/
│   ├── documents/
│   │   ├── passwords.txt    # Contains fake passwords
│   │   └── notes.txt        # Contains hints
│   └── .ssh/               # Hidden directory
├── etc/
│   ├── passwd              # User information
│   └── hosts               # Network hosts
└── var/log/
    └── auth.log            # Login attempts
```

## Output Formatting Rules

1. **Errors**: "Command not found: [cmd]" or "Permission denied: [file]"
2. **Success**: Most commands show no output on success (Unix style)
3. **Educational**: Hacking tools include tips and warnings
4. **Realistic**: Basic commands mimic real Unix/Linux output