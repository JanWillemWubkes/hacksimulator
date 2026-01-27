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

  // ==================== Demo Sequence (from plan) ====================
  const DEMO_COMMANDS = [
    {
      command: 'help',
      output: [
        '<span class="tip">[TIP] Start met deze basis commands:</span>',
        '  ls    - Toon bestanden',
        '  nmap  - Scan netwerk',
        '  whoami - Check huidige user'
      ]
    },
    {
      command: 'ls',
      output: [
        'documents/',
        'passwords.txt',
        'notes.md',
        '<span class="tip">[TIP] Gebruik cat om bestanden te lezen</span>'
      ]
    },
    {
      command: 'nmap 192.168.1.1',
      output: [
        'PORT    STATE   SERVICE',
        '22/tcp  <span class="highlight">OPEN</span>    SSH',
        '80/tcp  <span class="highlight">OPEN</span>    HTTP',
        '<span class="tip">[TIP] Open poorten = potentiele toegang</span>'
      ]
    },
    {
      command: 'whoami',
      output: [
        'user',
        '<span class="tip">[TIP] Ken je systeem, ken je rechten</span>'
      ]
    }
  ];

  // ==================== DOM Elements ====================
  let outputEl = null;
  let typingTargetEl = null;
  let cursorEl = null;
  let isRunning = false;

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
      `<div class="terminal-line prompt">user@hacksim:~$ ${firstCmd.command}</div>`,
      ...firstCmd.output.map(line => `<div class="terminal-line output">${line}</div>`)
    ].join('');

    outputEl.innerHTML = html;

    if (typingTargetEl) {
      typingTargetEl.textContent = '';
    }
    if (cursorEl) {
      cursorEl.style.display = 'none';
    }
  }

  // ==================== Animation Loop ====================
  async function startAnimation() {
    if (isRunning) return;
    isRunning = true;

    while (isRunning) {
      // Clear output area
      outputEl.innerHTML = '';

      // Run through each command
      for (const item of DEMO_COMMANDS) {
        if (!isRunning) break;

        // Type the command
        await typeCommand(item.command);
        await delay(CONFIG.outputDelay);

        // Show the output
        await showOutput(item.command, item.output);
        await delay(CONFIG.commandPause);
      }

      // Pause before looping
      await delay(CONFIG.loopDelay);
    }
  }

  // ==================== Type Command ====================
  async function typeCommand(command) {
    if (!typingTargetEl) return;

    // Clear previous typing
    typingTargetEl.textContent = '';

    // Type each character
    for (let i = 0; i < command.length; i++) {
      if (!isRunning) return;
      typingTargetEl.textContent += command[i];
      await delay(CONFIG.typeSpeed + Math.random() * CONFIG.typeVariance);
    }

    // Small pause after typing complete
    await delay(200);

    // Clear the input (command "executed")
    typingTargetEl.textContent = '';
  }

  // ==================== Show Output ====================
  async function showOutput(command, lines) {
    if (!outputEl) return;

    // Add the prompt line (shows what was typed)
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-line prompt';
    promptLine.textContent = `user@hacksim:~$ ${command}`;
    outputEl.appendChild(promptLine);

    // Remove oldest lines if exceeding max (fade out effect)
    await trimOldLines();

    // Add each output line with slight delay
    for (const line of lines) {
      if (!isRunning) return;

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
  }

  // ==================== Page Visibility Handling ====================
  // Pause animation when tab is not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (!isRunning && outputEl) {
      startAnimation();
    }
  });

  // ==================== Initialize ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for potential external control
  window.landingDemo = { stop };

  // ==================== Scroll Animations ====================
  // Intersection Observer for all animated elements (cards, results, etc.)
  function initScrollAnimations() {
    // All selectors for animated elements
    const animatedSelectors = [
      '.pain-point',
      '.feature-card',
      '.leerpad-card',
      '.testimonial-card',
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
