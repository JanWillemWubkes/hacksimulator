/**
 * Initial Filesystem Structure
 * Defines the virtual filesystem tree for the simulator
 * Based on PRD Bijlage B - Filesystem Structure
 */

export const initialFilesystem = {
  '/': {
    type: 'directory',
    children: {
      'home': {
        type: 'directory',
        children: {
          'hacker': {
            type: 'directory',
            children: {
              'README.txt': {
                type: 'file',
                content: `Welkom bij HackSimulator.nl!

Dit is een veilige omgeving om ethisch hacken te leren.
Alle activiteiten zijn gesimuleerd en beïnvloeden geen echte systemen.

BEGINNEN:
- Type 'help' voor een lijst van beschikbare commands
- Type 'man [command]' voor gedetailleerde informatie
- Gebruik ↑↓ pijltjestoetsen voor command geschiedenis

EDUCATIEVE TIPS:
[!] Bestanden in /etc bevatten systeem configuratie
[?] SSH keys staan vaak in ~/.ssh/
[?] Logs bevatten waardevolle informatie

DISCLAIMER:
Gebruik deze kennis alleen legaal en ethisch.
Ongeautoriseerde toegang tot systemen is illegaal.

Veel plezier met leren!`
              },
              'notes.txt': {
                type: 'file',
                content: `Mijn security aantekeningen:

1. Altijd eerst reconnaissance doen (nmap, whois)
2. Zoek naar open poorten en services
3. Check voor bekende vulnerabilities
4. Documenteer alles wat je vindt
5. Test alleen op systemen waar je toestemming voor hebt!

TODO:
- Leer meer over SQL injection
- Oefen met Metasploit basics
- Begrijp hoe password hashes werken`
              }
            }
          }
        }
      },
      'etc': {
        type: 'directory',
        children: {
          'passwd': {
            type: 'file',
            content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
hacker:x:1000:1000:Ethical Hacker:/home/hacker:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
mysql:x:104:108:MySQL Server:/nonexistent:/bin/false`
          },
          'shadow': {
            type: 'file',
            permissions: 'restricted',
            content: `root:$6$xyz...(restricted):18500:0:99999:7:::
hacker:$6$abc...(restricted):18500:0:99999:7:::`
          },
          'hosts': {
            type: 'file',
            content: `127.0.0.1       localhost
127.0.1.1       hacksim
192.168.1.1     router.local
192.168.1.100   target.local
10.0.0.1        server.internal

# Educational note: This is a simulated hosts file`
          },
          'hostname': {
            type: 'file',
            content: 'hacksim'
          }
        }
      },
      'var': {
        type: 'directory',
        children: {
          'log': {
            type: 'directory',
            children: {
              'auth.log': {
                type: 'file',
                content: `Oct 14 10:23:45 hacksim sshd[1234]: Accepted password for hacker from 192.168.1.50 port 54321
Oct 14 10:25:12 hacksim sshd[1235]: Failed password for root from 10.0.0.99 port 22
Oct 14 10:25:15 hacksim sshd[1235]: Failed password for root from 10.0.0.99 port 22
Oct 14 10:25:18 hacksim sshd[1235]: Failed password for root from 10.0.0.99 port 22
Oct 14 10:25:20 hacksim sshd[1235]: Connection closed by 10.0.0.99 [preauth]

[?] TIP: Herhaalde login pogingen kunnen duiden op een brute force aanval!`
              },
              'syslog': {
                type: 'file',
                content: `Oct 14 10:20:01 hacksim CRON[1122]: (root) CMD (test -x /usr/sbin/anacron)
Oct 14 10:23:45 hacksim systemd[1]: Started Session 42 of user hacker
Oct 14 10:30:12 hacksim kernel: [12345.678] Firewall: INPUT DROP IN=eth0 SRC=10.0.0.99`
              }
            }
          },
          'www': {
            type: 'directory',
            children: {
              'html': {
                type: 'directory',
                children: {
                  'index.html': {
                    type: 'file',
                    content: `<!DOCTYPE html>
<html>
<head><title>Welcome</title></head>
<body>
  <h1>Test Webserver</h1>
  <p>This is a simulated web server.</p>
</body>
</html>`
                  }
                }
              }
            }
          }
        }
      },
      'tmp': {
        type: 'directory',
        children: {}
      },
      'root': {
        type: 'directory',
        permissions: 'restricted',
        children: {}
      }
    }
  }
};

/**
 * Get the default home directory for the current user
 */
export function getHomeDirectory() {
  return '/home/hacker';
}

/**
 * Get initial current working directory
 */
export function getInitialCwd() {
  return '/home/hacker';
}
