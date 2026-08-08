/**
 * landing-demo.js - Auto-Typing Terminal Demo for Landing Page
 *
 * Features:
 * - Typewriter effect for commands
 * - Loops through demo sequence (help → ls → nmap → whoami)
 * - Respects prefers-reduced-motion
 * - Educational output with tips (80/20 principle)
 */

(function() {
  'use strict';

  // ==================== Configuration ====================
  const CONFIG = {
    typeSpeed: 60,         // ms per character
    typeVariance: 25,      // random variance for natural feel
    outputDelay: 150,      // ms before output appears
    lineDelay: 100,        // ms between output lines
    commandPause: 1500,    // ms pause after command output
    loopDelay: 3000,       // ms before restarting sequence
    maxVisibleLines: 8,    // Maximum lines visible at once (prevents overflow)
  };

  // ==================== Demo Sequence ====================
  // Sessie 214: deze uitvoer was met de hand geschreven en week af van de engine —
  // `whoami` gaf "user" (echt: "hacker", core/terminal.js:45) en `ls` toonde
  // passwords.txt en notes.md, die geen van beide in de VFS bestaan
  // (filesystem/structure.js:7-206). Op een site die "aantoonbaar" als kwaliteitsclaim
  // voert is een demo met verzonnen bestanden een geloofwaardigheidslek. Nu afgeleid
  // uit de bron; `nmap 192.168.1.1` treft het router-profiel (network/nmap.js:32-39).
  const DEMO_COMMANDS = [
    {
      command: 'ls',
      output: [
        'documents/  notes.txt  README.txt',
        '<span class="tip">[TIP] Lees er een met: cat notes.txt</span>'
      ]
    },
    {
      command: 'whoami',
      output: [
        'hacker',
        '<span class="tip">[TIP] Geen root — dat scheelt ongelukken</span>'
      ]
    },
    {
      command: 'nmap 192.168.1.1',
      output: [
        'PORT     STATE  SERVICE',
        '53/tcp   <span class="highlight">OPEN</span>   DNS    ← naamserver',
        '80/tcp   <span class="highlight">OPEN</span>   HTTP   ← onversleuteld',
        '443/tcp  <span class="highlight">OPEN</span>   HTTPS  ← versleuteld',
        '<span class="tip">[TIP] Open poorten zijn ingangen</span>'
      ]
    },
    {
      command: 'pwd',
      output: [
        '/home/hacker',
        '<span class="tip">[TIP] ~ is korter voor /home/hacker</span>'
      ]
    }
  ];

  // ==================== DOM Elements ====================
  let outputEl = null;
  let typingTargetEl = null;
  let cursorEl = null;
  let isRunning = false;

  // Generatieteller. `isRunning = false` breekt de lopende await-keten NIET af: elke
  // opgeschorte `delay()` komt gewoon terug en loopt verder langs zijn poorten. Zette
  // iets `isRunning` intussen weer op true (de visibilitychange-handler deed dat), dan
  // liepen er twee lussen in dezelfde DOM. Een lus die niet meer de huidige generatie
  // is, stopt onherroepelijk.
  let generatie = 0;

  // Zodra de bezoeker zelf typt is de auto-demo definitief klaar. Zonder deze vlag
  // herstartte hij bij elke tabwissel over de sessie van de bezoeker heen.
  let overgedragen = false;

  /**
   * Schrijft getypte tekst naar het invoerelement. Sinds Sessie 214 is `#typing-target`
   * een <input>; `textContent` doet daar niets zichtbaars.
   *
   * De breedte gaat mee (Sessie 215). Een <input> heeft geen intrinsieke contentbreedte,
   * dus met `flex: 1` at het veld de hele regel en stond de decoratieve `_` 162px van
   * zijn eigen tekst af. `ch` is hier exact: --font-terminal resolvet naar JetBrains
   * Mono. Eén teken extra = de plek waar de cursor hoort te staan.
   */
  function setTyped(el, text) {
    if (!el) return;
    if ('value' in el) {
      el.value = text;
      el.style.width = (text.length + 1) + 'ch';
    } else {
      el.textContent = text;
    }
  }

  // ==================== Initialization ====================
  function init() {
    outputEl = document.getElementById('hero-demo');
    typingTargetEl = document.getElementById('typing-target');
    cursorEl = document.querySelector('.hero .cursor');

    if (!outputEl || !typingTargetEl) {
      console.warn('[landing-demo] Required elements not found');
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showStaticContent();
      return;
    }

    startAnimation();
  }

  // ==================== Static Content (Reduced Motion) ====================
  function showStaticContent() {
    if (!outputEl) return;

    // Show first command statically
    const firstCmd = DEMO_COMMANDS[0];
    const html = [
      `<div class="terminal-line prompt">hacker@hacksim:~$ ${firstCmd.command}</div>`,
      ...firstCmd.output.map(line => `<div class="terminal-line output">${line}</div>`)
    ].join('');

    outputEl.innerHTML = html;

    setTyped(typingTargetEl, '');
    if (cursorEl) {
      cursorEl.style.display = 'none';
    }
  }

  // ==================== Animation Loop ====================
  async function startAnimation() {
    if (isRunning || overgedragen) return;
    isRunning = true;
    const gen = ++generatie;

    while (isRunning && gen === generatie) {
      // Clear output area
      outputEl.innerHTML = '';

      // Run through each command
      for (const item of DEMO_COMMANDS) {
        if (!isRunning || gen !== generatie) break;

        // Type the command
        await typeCommand(item.command, gen);
        await delay(CONFIG.outputDelay);

        // Show the output
        await showOutput(item.command, item.output, gen);
        await delay(CONFIG.commandPause);
      }

      // Pause before looping
      await delay(CONFIG.loopDelay);
    }
  }

  // ==================== Type Command ====================
  async function typeCommand(command, gen) {
    if (!typingTargetEl) return;

    // Clear previous typing
    setTyped(typingTargetEl, '');

    // Type each character
    for (let i = 0; i < command.length; i++) {
      if (!isRunning || gen !== generatie) return;
      setTyped(typingTargetEl, command.slice(0, i + 1));
      await delay(CONFIG.typeSpeed + Math.random() * CONFIG.typeVariance);
    }

    // Small pause after typing complete
    await delay(200);

    // Clear the input (command "executed")
    if (gen === generatie) setTyped(typingTargetEl, '');
  }

  // ==================== Show Output ====================
  async function showOutput(command, lines, gen) {
    if (!outputEl || gen !== generatie) return;

    // Add the prompt line (shows what was typed)
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-line prompt';
    promptLine.textContent = `hacker@hacksim:~$ ${command}`;
    outputEl.appendChild(promptLine);

    // Remove oldest lines if exceeding max (fade out effect)
    await trimOldLines();

    // Add each output line with slight delay
    for (const line of lines) {
      if (!isRunning || gen !== generatie) return;

      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line output';
      outputLine.innerHTML = line;
      outputEl.appendChild(outputLine);

      // Remove oldest lines if exceeding max
      await trimOldLines();

      await delay(CONFIG.lineDelay);
    }

    // Add empty line for spacing
    const spacer = document.createElement('div');
    spacer.className = 'terminal-line';
    spacer.innerHTML = '&nbsp;';
    outputEl.appendChild(spacer);

    await trimOldLines();
  }

  // ==================== Trim Old Lines ====================
  async function trimOldLines() {
    while (outputEl.children.length > CONFIG.maxVisibleLines) {
      const oldest = outputEl.firstChild;
      oldest.style.opacity = '0';
      await delay(150); // Brief fade out
      oldest.remove();
    }
  }

  // ==================== Utility: Delay ====================
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== Cleanup ====================
  function stop() {
    isRunning = false;
    generatie++;   // maakt elke nog lopende lus onherroepelijk ongeldig
  }

  /**
   * De bezoeker neemt de terminal over. Onomkeerbaar: de auto-demo is een lokmiddel,
   * geen achtergrondproces dat over iemands sessie heen mag schrijven.
   */
  function handOff() {
    overgedragen = true;
    stop();
    setTyped(typingTargetEl, '');
  }

  // ==================== Page Visibility Handling ====================
  // Pause animation when tab is not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (!isRunning && !overgedragen && outputEl) {
      startAnimation();
    }
  });

  // ==================== Initialize ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for potential external control. `handOff` wordt door hero-repl.js gebruikt
  // zodra de bezoeker zelf typt of een suggestiechip tikt.
  window.landingDemo = {
    stop,
    handOff,
    isHandedOff: () => overgedragen
  };

  // ==================== Scroll Animations ====================
  // Intersection Observer for all animated elements (cards, results, etc.)
  function initScrollAnimations() {
    // All selectors for animated elements
    const animatedSelectors = [
      '.pain-point',
      '.feature-card',
      '.leerpad-card',
      '.how-step',
      '.result-item',
      '.animate-on-scroll'
    ];

    const allAnimatedElements = document.querySelectorAll(animatedSelectors.join(', '));

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show all elements immediately
      allAnimatedElements.forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once visible (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2, // Trigger when 20% visible
      rootMargin: '0px 0px -50px 0px' // Slight offset for better timing
    });

    allAnimatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Initialize scroll animations after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

})();
