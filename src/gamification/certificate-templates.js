/**
 * Certificate Templates — Pure data file.
 *
 * 3 visual tiers matching challenge difficulty:
 *   easy   → Voltooiing   (. decoration, Apprentice rank)
 *   medium → Bekwaamheid  (* decoration, Specialist rank)
 *   hard   → Meesterschap (# decoration, Elite rank)
 *
 * Follows badge-definitions.js pattern: pure data, no logic.
 */

export var CERT_TEMPLATES = {
  easy: {
    label: 'CERTIFICAAT VAN VOLTOOIING',
    rank: 'Hacker Apprentice',
    decoration: '.  .  .',
    message: 'Je hebt bewezen dat je de basisprincipes van'
  },
  medium: {
    label: 'CERTIFICAAT VAN BEKWAAMHEID',
    rank: 'Hacker Specialist',
    decoration: '*  *  *',
    message: 'Je hebt aangetoond dat je gevorderde technieken van'
  },
  hard: {
    label: 'CERTIFICAAT VAN MEESTERSCHAP',
    rank: 'Hacker Elite',
    decoration: '#  #  #',
    message: 'Je hebt bewezen dat je meesterschap hebt over'
  }
};

export var DISCIPLINES = {
  // Easy
  'network-scout': 'netwerk verkenning',
  'file-explorer': 'bestandssysteem navigatie',
  'identity-check': 'systeem identificatie',
  'domain-intel': 'domein intelligence',
  'log-hunter': 'log analyse',
  // Medium
  'port-scanner-pro': 'geavanceerd port scanning',
  'web-recon': 'web reconnaissance',
  'sql-sleuth': 'SQL injection detectie',
  'password-cracker': 'wachtwoord kraken',
  'system-navigator': 'systeem navigatie',
  // Hard
  'full-recon': 'volledige reconnaissance',
  'privesc-path': 'privilege escalation',
  'multi-tool-master': 'multi-tool aanval',
  'attack-chain': 'aanvalsketens',
  'forensic-investigator': 'forensisch onderzoek'
};
