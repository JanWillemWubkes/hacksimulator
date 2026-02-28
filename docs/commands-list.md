# Commands Reference - HackSimulator.nl

## System Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `clear` | Clear terminal screen | *(screen clears)* |
| `help` | Show available commands | "Available commands: clear, ls, cd..." |
| `man [cmd]` | Show manual for command | *(detailed help page)* |
| `history` | Show command history | "1. ls<br>2. cd /home<br>3. pwd" |
| `echo [text]` | Print text | "Hello World" |
| `date` | Show current date/time | "Tue Dec 10 2024 14:30:22" |
| `whoami` | Show current user | "user" |
| `shortcuts` | Show keyboard shortcuts | "Ctrl+L: clear terminal..." |

## Educational Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `tutorial` | Start guided learning scenarios | "Beschikbare scenario's: recon, webvuln, privesc" |
| `leerpad` | Show learning path overview | "Module 1: Basis Linux Commands ✅" |

## Gamification Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `challenge` | Start/manage challenges | "15 challenges beschikbaar in 3 niveaus" |
| `achievements` | Show unlocked badges | "🏆 Badges: 5/21 unlocked" |
| `certificates` | Generate completion certificate | "Certificaat gegenereerd! Download of kopieer..." |
| `dashboard` | Show progress overview | "Stats \| Badges \| Challenges" |
| `leaderboard` | Show rankings | "Top 10 hackers..." |

## File System Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `ls` | List files | "documents  downloads  notes.txt" |
| `ls -la` | List all files with details | "drwxr-xr-x user 4096 Dec 10 .ssh" |
| `cd [path]` | Change directory | *(no output on success)* |
| `pwd` | Print working directory | "/home/user" |
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
| `ping [host]` | Test connectivity | "PING 8.8.8.8: 64 bytes - time=12ms" |
| `nmap [host]` | Scan ports | "Port 22/tcp OPEN (SSH)<br>Port 80/tcp OPEN (HTTP)" |
| `ifconfig` | Show network config | "eth0: 192.168.1.100" |
| `netstat` | Network statistics | "Active connections: 5" |
| `whois [domain]` | Domain info | "Registrar: Example Inc." |
| `traceroute [host]` | Trace network path | "1. 192.168.1.1 (1ms)<br>2. 10.0.0.1 (5ms)" |

## Security Tools

| Command | Description | Example Output |
|---------|-------------|----------------|
| `hashcat [hash]` | Crack password hash | "Cracking...<br>[FOUND] password: admin123" |
| `hydra [target]` | Brute force attack | "Attempting passwords...<br>[SUCCESS] admin:password" |
| `sqlmap [url]` | Test SQL injection | "Testing parameters...<br>[VULNERABLE] id parameter" |
| `metasploit` | Exploitation framework | "msf > show exploits" |
| `nikto [target]` | Scan web vulnerabilities | "Found: /admin exposed" |

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