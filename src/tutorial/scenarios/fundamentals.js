/**
 * Fundamentals Scenario — "Eerste dag als junior pentester"
 *
 * Teaches the absolute terminal basics that every later phase builds on:
 * navigeren (pwd, ls, cd), lezen (cat), en aanmaken/verwijderen (mkdir, touch, rm).
 * 7 steps, one command each (mirrors recon.js's validate-on-output pattern).
 *
 * This is the BEGINNER deep-link target: it bridges into the recon scenario
 * on completion, so the homepage leerpad-flow lezen -> oefenen lands here first.
 *
 * Validators check command name + args AND verify the command output doesn't
 * contain error patterns (or, for create/remove, that it DOES contain the
 * success marker). VFS targets verified against src/filesystem/structure.js:
 * cwd starts at /home/hacker (README.txt, notes.txt, documents/);
 * documents/ holds scan-results.txt and is writable.
 */

var fundamentalsScenario = {
  id: 'fundamentals',
  title: 'Fundamentals: Eerste dag als pentester',
  description: 'Leer de basis: navigeren, bestanden lezen, en je eerste bestanden aanmaken en verwijderen.',
  difficulty: 'Beginner',

  briefing:
    'Welkom bij je eerste dag als junior pentester bij SecureCorp. ' +
    'Voordat je echte hacking tools inzet, moet je je weg vinden op ' +
    'het systeem: weten waar je bent, rondkijken, navigeren, bestanden ' +
    'lezen, en je eigen werkmappen aanmaken en opruimen. Dit zijn de ' +
    'fundamenten waar elke hack op rust. We doen het stap voor stap.',

  completionMessage:
    'Je beheerst nu de fundamenten: navigeren (pwd, ls, cd), lezen (cat) ' +
    'en aanmaken/verwijderen (mkdir, touch, rm). Dit zijn de basis-skills ' +
    'voor elk systeem. Nu je je weg kent op een machine, ben je klaar voor ' +
    'je eerste echte verkenning. Type \'tutorial recon\' om je eerste ' +
    'pentest-missie te starten.',

  steps: [
    {
      title: 'Waar ben je?',
      objective: 'Gebruik pwd om te zien in welke map je nu staat.',
      command: 'pwd',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'pwd') return false;
        if (output && output.indexOf('pwd:') === 0) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] pwd betekent "print working directory" - het toont je locatie.\n' +
        '[~] Je staat in /home/hacker, je persoonlijke thuismap.\n' +
        '[~] Weten waar je bent is stap 1: zo maak je niet per ongeluk\n' +
        '      bestanden aan op de verkeerde plek.',
      hints: [
        'Type het commando dat je huidige locatie toont.',
        'Het commando bestaat uit 3 letters: p, w, d.',
        'Type: pwd'
      ]
    },
    {
      title: 'Kijk rond',
      objective: 'Gebruik ls om te zien welke bestanden en mappen er in je huidige map staan.',
      command: 'ls',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'ls') return false;
        if (output && (
          output.includes('cannot access') ||
          output.includes('No such')
        )) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] ls ("list") toont de inhoud van de huidige map.\n' +
        '[~] Je ziet hier o.a. README.txt, notes.txt en de map documents.\n' +
        '[~] Hackers gebruiken ls constant om een onbekend systeem te\n' +
        '      verkennen: wat is er, en wat is interessant?',
      hints: [
        'Type het commando dat bestanden in een map toont.',
        'Het commando bestaat uit 2 letters: l, s.',
        'Type: ls'
      ]
    },
    {
      title: 'Navigeer naar een map',
      objective: 'Gebruik cd om naar de map \'documents\' te gaan.',
      command: 'cd',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'cd') return false;
        if (args.length === 0) return 'wrong-args';
        var target = args[0].replace(/\/$/, '');
        if (target !== 'documents') return 'wrong-args';
        return true;
      },
      feedback:
        '[~] cd ("change directory") verplaatst je naar een andere map.\n' +
        '[~] Je staat nu in /home/hacker/documents.\n' +
        '[~] Navigeren door mappen is essentieel: gevoelige data zit\n' +
        '      vaak diep weggestopt in submappen.',
      hints: [
        'Gebruik cd gevolgd door de naam van de map.',
        'Probeer: cd <mapnaam> (de map heet documents).',
        'Type: cd documents'
      ]
    },
    {
      title: 'Lees een bestand',
      objective: 'Gebruik cat om het bestand \'scan-results.txt\' te lezen.',
      command: 'cat',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'cat') return false;
        if (args.length === 0) return 'wrong-args';
        if (args[0] !== 'scan-results.txt') return 'wrong-args';
        if (output && (
          output.includes('No such') ||
          output.includes('BEVEILIGING') ||
          output.includes('Is a directory')
        )) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] cat toont de inhoud van een bestand in de terminal.\n' +
        '[~] Dit bestand is een sjabloon voor een pentest-rapport.\n' +
        '[~] Bestanden lezen is hoe je informatie verzamelt: configs,\n' +
        '      wachtwoorden en logs vertellen je alles over een systeem.',
      hints: [
        'Gebruik cat gevolgd door de bestandsnaam.',
        'Probeer: cat <bestand> (let op hoofd- en kleine letters!).',
        'Type: cat scan-results.txt'
      ]
    },
    {
      title: 'Maak een map',
      objective: 'Maak met mkdir een nieuwe map aan voor je bevindingen (bijv. bevindingen).',
      command: 'mkdir',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'mkdir') return false;
        if (args.length === 0) return 'wrong-args';
        if (!output || output.indexOf('aangemaakt') === -1) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] mkdir ("make directory") maakt een nieuwe map aan.\n' +
        '[~] Je hebt nu een eigen map om je werk in te organiseren.\n' +
        '[~] Pentesters maken altijd een werkmap aan om scans, notities\n' +
        '      en buit netjes bij elkaar te houden.',
      hints: [
        'Gebruik mkdir gevolgd door een mapnaam naar keuze.',
        'Probeer: mkdir <naam> (bijv. mkdir bevindingen).',
        'Type: mkdir bevindingen'
      ]
    },
    {
      title: 'Maak een bestand',
      objective: 'Maak met touch een nieuw bestand aan voor je notities (bijv. notes.txt).',
      command: 'touch',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'touch') return false;
        if (args.length === 0) return 'wrong-args';
        if (!output || output.indexOf('aangemaakt') === -1) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] touch maakt een nieuw, leeg bestand aan.\n' +
        '[~] Handig voor notities, scripts of wordlists die je later vult.\n' +
        '[~] Documenteren tijdens een pentest is cruciaal: zonder notities\n' +
        '      vergeet je wat je waar gevonden hebt.',
      hints: [
        'Gebruik touch gevolgd door een bestandsnaam naar keuze.',
        'Probeer: touch <naam> (bijv. touch notes.txt).',
        'Type: touch notes.txt'
      ]
    },
    {
      title: 'Ruim op',
      objective: 'Verwijder met rm het bestand dat je net hebt aangemaakt (bijv. notes.txt).',
      command: 'rm',
      validate: function(cmd, args, flags, context, output) {
        if (cmd !== 'rm') return false;
        if (args.length === 0) return 'wrong-args';
        if (!output || output.indexOf('verwijderd') === -1) return 'wrong-args';
        return true;
      },
      feedback:
        '[~] rm ("remove") verwijdert een bestand permanent - geen prullenbak!\n' +
        '[~] Wees dus altijd zeker voordat je iets verwijdert.\n' +
        '[~] Aanvallers wissen soms hun sporen met rm, maar verdedigers\n' +
        '      zien verdwenen logs juist als een alarmsignaal.',
      hints: [
        'Gebruik rm gevolgd door de bestandsnaam.',
        'Probeer: rm <bestand> (het bestand dat je net aanmaakte).',
        'Type: rm notes.txt'
      ]
    }
  ]
};

export default fundamentalsScenario;
