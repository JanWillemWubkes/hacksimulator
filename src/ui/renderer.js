/**
 * Output Renderer
 * Renders command output to the terminal DOM
 * Handles special formatting (colors, icons, newlines)
 */

import { showCelebrationBanner } from './celebration-banner.js';

const MAX_OUTPUT_LINES = 500;

class Renderer {
  constructor() {
    this.outputElement = null;
    this.promptPrefix = 'hacker@hacksim:~$';
  }

  /**
   * Initialize renderer with DOM element
   * @param {HTMLElement} outputElement - Terminal output container
   */
  init(outputElement) {
    if (!outputElement) {
      throw new Error('Output element is required');
    }
    this.outputElement = outputElement;
  }

  /**
   * Render command input line (echo what user typed)
   * @param {string} command - Command string
   */
  renderInput(command) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-input';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = this.promptPrefix + ' ';

    const commandText = document.createElement('span');
    commandText.textContent = command;

    line.appendChild(prompt);
    line.appendChild(commandText);

    this.outputElement.appendChild(line);
    this._trimOutput();

    this._scrollToBottom();
  }

  /**
   * Render command output
   * @param {string} output - Command output text
   * @param {string} type - Output type (normal, error, success, warning, info)
   */
  renderOutput(output, type = 'normal') {
    if (!output) {
      return;
    }

    // Split by newlines and render each line
    const lines = output.split('\n');
    let lastSemanticType = type; // Track semantic type across lines

    lines.forEach(lineText => {
      const trimmed = lineText.trim();

      // Check for section header marker - render as left-aligned header (man pages + educational content)
      if (trimmed.startsWith('[###]')) {
        const header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = trimmed;
        this.outputElement.appendChild(header);
        return;  // Skip normal line rendering
      }

      // Check for welcome message marker - render as centered message
      if (trimmed.startsWith('[***]')) {
        const message = document.createElement('div');
        message.className = 'welcome-message';
        message.textContent = trimmed;
        this.outputElement.appendChild(message);
        return;  // Skip normal line rendering
      }

      const line = document.createElement('div');

      // Auto-detect semantic lines and force correct color type
      // This ensures consistent colors regardless of parent output type
      // Supports both ASCII brackets ([?]) and emoji (💡) for backward compatibility
      let lineType = type;

      // ASCII bracket detection (primary - terminal authentic)
      if (trimmed.startsWith('[?]') || trimmed.startsWith('[→]') || trimmed.startsWith('[TIP]')) {
        lineType = 'info';      // Tips/Info/Educational → cyaan
      } else if (trimmed.startsWith('[!]')) {
        lineType = 'warning';   // Warnings/Legal → oranje
      } else if (trimmed.startsWith('[✓]')) {
        lineType = 'success';   // Success → groen
      } else if (trimmed.startsWith('[X]')) {
        lineType = 'error';     // Errors/Critical → magenta
      } else if (trimmed.startsWith('[~]')) {
        lineType = 'dim';       // Systeem notices → dim grijs
      } else if (trimmed.startsWith('→')) {
        lineType = 'info';      // FASE lines (bare arrow) → cyaan
      }
      // Emoji detection (fallback for backward compatibility during migration)
      else if (trimmed.startsWith('💡') || trimmed.startsWith('🎯')) {
        lineType = 'info';      // Tips/Educational → cyaan
      } else if (trimmed.startsWith('⚠️') || trimmed.startsWith('🔒')) {
        lineType = 'warning';   // Warnings & Security → oranje
      } else if (trimmed.startsWith('✅')) {
        lineType = 'success';   // Success → groen
      } else if (trimmed.startsWith('❌')) {
        lineType = 'error';     // Errors → magenta/rood
      }
      // Check for continuation line (6+ spaces inherit parent semantic color)
      else if (isContinuationLine(lineText)) {
        lineType = lastSemanticType; // Inherit previous line's color
      }

      // Update state for next line (only on non-empty lines)
      if (trimmed !== '') {
        lastSemanticType = lineType;
      }

      line.className = `terminal-line terminal-output terminal-output-${lineType}` + getBoxLineClass(lineText);

      // Store indent level for CSS hanging indent (mobile) — houdt wrappende
      // marker/ingesprongen regels uitgelijnd. Zie Sessie 84/85 + getLineIndent().
      const indent = getLineIndent(lineText);
      if (indent !== null) line.dataset.indent = indent; // mobile.css: attr → padding-left/text-indent

      // Process special formatting
      const formattedContent = this._formatText(lineText);
      line.innerHTML = formattedContent;

      this.outputElement.appendChild(line);
    });

    this._trimOutput();

    // Always scroll to bottom (industry standard)
    this._scrollToBottom();
  }

  /**
   * Render an error message
   * @param {string} message - Error message
   */
  renderError(message) {
    this.renderOutput(message, 'error');
  }

  /**
   * Render a success message
   * @param {string} message - Success message
   */
  renderSuccess(message) {
    this.renderOutput(message, 'success');
  }

  /**
   * Render a warning message
   * @param {string} message - Warning message
   */
  renderWarning(message) {
    this.renderOutput(message, 'warning');
  }

  /**
   * Render an info message
   * @param {string} message - Info message
   */
  renderInfo(message) {
    this.renderOutput(message, 'info');
  }

  /**
   * Render completion with 3-zone layout + sequential reveal.
   * Zone 1: Mission/challenge box (green border)
   * Zone 2: Certificate (gold border, delayed reveal)
   * Zone 3: Follow-up text (no special styling)
   * @param {string} output - Step feedback text (rendered as normal output)
   * @param {string} celebrationTitle - Title shown in the flash banner
   * @param {Object} [completion] - Structured completion data
   * @param {string} [completion.missionBox] - Mission completion ASCII box
   * @param {string} [completion.completionBox] - Challenge completion ASCII box
   * @param {string} [completion.certificate] - Certificate ASCII box
   * @param {string} [completion.followUp] - Follow-up text lines
   */
  renderCompletionBlock(output, celebrationTitle, completion) {
    // Render step feedback as normal output
    if (output) {
      this.renderOutput(output, 'success');
    }

    // If no structured completion data, fall back to legacy single-block rendering
    if (!completion) return;

    // Zone 1: Mission or challenge completion box
    var boxText = completion.missionBox || completion.completionBox;
    if (boxText) {
      var missionWrapper = document.createElement('div');
      missionWrapper.className = 'terminal-completion-mission';
      this._renderLinesInto(missionWrapper, boxText);
      this.outputElement.appendChild(missionWrapper);
    }

    // Zone 2: Certificate (hidden initially for sequential reveal)
    if (completion.certificate) {
      var certWrapper = document.createElement('div');
      certWrapper.className = 'terminal-completion-certificate';
      certWrapper.style.opacity = '0';
      this._renderLinesInto(certWrapper, completion.certificate);
      this.outputElement.appendChild(certWrapper);
    }

    // Zone 3: Follow-up text (no special wrapper styling)
    if (completion.followUp) {
      var followUpWrapper = document.createElement('div');
      followUpWrapper.className = 'terminal-completion-followup';
      followUpWrapper.style.opacity = '0';
      this._renderLinesInto(followUpWrapper, completion.followUp);
      this.outputElement.appendChild(followUpWrapper);
    }

    this._trimOutput();
    // Scroll to the bottom so the follow-up CTA (the next-step instruction) is
    // always the last thing in view. The block now fits the viewport (the tall
    // inline certificate was removed), so this keeps the command + its output
    // visible above the celebration too — both ends fit without a top-anchor.
    this._scrollToBottom();

    // Sequential reveal animation
    this._revealCelebration(celebrationTitle);
  }

  /**
   * Sequential reveal: mission box → certificate → follow-up text.
   * Respects prefers-reduced-motion.
   */
  _revealCelebration(celebrationTitle) {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var mission = this.outputElement.querySelector('.terminal-completion-mission:last-of-type');
    var cert = this.outputElement.querySelector('.terminal-completion-certificate:last-of-type');
    var followUp = this.outputElement.querySelector('.terminal-completion-followup:last-of-type');

    if (prefersReduced) {
      if (mission) mission.classList.add('celebration-visible');
      if (cert) { cert.style.opacity = '1'; cert.classList.add('celebration-visible'); }
      if (followUp) followUp.style.opacity = '1';
      if (celebrationTitle) showCelebrationBanner(celebrationTitle);
      // No scroll: reveal only changes opacity (no layout change) — keep the
      // command-echo anchor set by renderCompletionBlock.
      return;
    }

    // Step 1: Mission box animates in
    if (mission) {
      mission.classList.add('celebration-visible');
    }

    // Step 2: Certificate fades in after 800ms
    setTimeout(function() {
      if (cert) {
        cert.style.opacity = '1';
        cert.classList.add('celebration-visible');
      }
    }, 800);

    // Step 3: Follow-up text + banner after 1500ms
    // No re-scroll: opacity-only reveal keeps the command-echo anchor in place,
    // so the user's last command output stays visible above the celebration.
    setTimeout(function() {
      if (followUp) followUp.style.opacity = '1';
      if (celebrationTitle) showCelebrationBanner(celebrationTitle);
    }, 1500);
  }

  /**
   * Render text lines into a container with semantic coloring.
   * Shared helper for completion zones.
   */
  _renderLinesInto(container, text) {
    var lines = text.split('\n');
    var lastSemanticType = 'info';
    var self = this;

    lines.forEach(function(lineText) {
      var trimmed = lineText.trim();

      if (trimmed.startsWith('[###]')) {
        var header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = trimmed;
        container.appendChild(header);
        return;
      }

      if (trimmed.startsWith('[***]')) {
        var message = document.createElement('div');
        message.className = 'welcome-message';
        message.textContent = trimmed;
        container.appendChild(message);
        return;
      }

      var line = document.createElement('div');
      var lineType = 'info';

      if (trimmed.startsWith('[?]') || trimmed.startsWith('[→]') || trimmed.startsWith('[TIP]')) {
        lineType = 'info';
      } else if (trimmed.startsWith('[!]')) {
        lineType = 'warning';
      } else if (trimmed.startsWith('[✓]')) {
        lineType = 'success';
      } else if (trimmed.startsWith('[X]')) {
        lineType = 'error';
      } else if (trimmed.startsWith('[~]')) {
        lineType = 'dim';
      } else if (trimmed.startsWith('→')) {
        lineType = 'info';
      } else if (isContinuationLine(lineText)) {
        lineType = lastSemanticType;
      }

      if (trimmed !== '') {
        lastSemanticType = lineType;
      }

      line.className = 'terminal-line terminal-output terminal-output-' + lineType + getBoxLineClass(lineText);

      var indent = getLineIndent(lineText);
      if (indent !== null) line.dataset.indent = indent;

      var formattedContent = self._formatText(lineText);
      line.innerHTML = formattedContent;

      container.appendChild(line);
    });
  }

  /**
   * Clear the terminal output
   */
  clear() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  /**
   * Render welcome message
   * Uses onboarding system for personalized welcome
   * First visit: typewriter effect (line by line with delay)
   * Returning visit: instant render
   * @param {Object} onboarding - Onboarding instance (optional for backward compatibility)
   * @param {Object|null} stats - Progress stats from progressStore
   */
  renderWelcome(onboarding = null, stats = null, ctaMode = 'default') {
    if (onboarding) {
      const welcome = onboarding.getWelcomeMessage(stats, ctaMode);
      if (onboarding.isFirstTimeVisitor()) {
        this._renderTypewriter(welcome);
      } else {
        this.renderOutput(welcome, 'normal');
      }
    } else {
      const welcome = `Connecting to hacksim.lab... OK

[→] Typ 'next' om te beginnen`;
      this.renderOutput(welcome, 'normal');
    }
  }

  /**
   * Render text line-by-line with typewriter effect
   * First 2 lines render quickly (connection simulation),
   * remaining lines render at a steady pace
   * @private
   * @param {string} text - Full text to render
   */
  _renderTypewriter(text) {
    const lines = text.split('\n');
    let delay = 0;

    lines.forEach((line, index) => {
      // Context-aware delays for cinematic SSH login feel
      let lineDelay;
      if (index < 2) {
        lineDelay = 60;          // Connection handshake: fast
      } else if (line.trim() === '') {
        lineDelay = 300;         // Section breaks: dramatic pause
      } else if (line.trim().startsWith('→')) {
        lineDelay = 150;         // FASE lines: steady reveal
      } else {
        lineDelay = 120;         // Default: comfortable read pace
      }
      delay += lineDelay;

      setTimeout(() => {
        this.renderOutput(line, 'normal');
      }, delay);
    });

    // Dispatch event when typewriter is done (for input re-enable)
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('typewriter-done'));
    }, delay + 50);
  }

  /**
   * Publieke alias voor _formatText — gebruikt door box-reflow.js om
   * herbouwde boxregels door dezelfde marker-formattering te halen
   * (→/[✓]-spans, HTML-escaping) als de oorspronkelijke render.
   */
  formatText(text) {
    return this._formatText(text);
  }

  /**
   * Format text with special markers
   * @private
   */
  _formatText(text) {
    // Escape HTML to prevent XSS
    let formatted = this._escapeHtml(text);

    // Replace emoji shortcuts with actual emoji (already in text)
    // No processing needed - emoji pass through

    // Format inline arrows (← for Dutch explanations)
    formatted = formatted.replace(/←/g, '<span class="inline-arrow">←</span>');

    // GEEN span om → (Sessie 233). Die bestond om het fallback-glyph op te tillen,
    // want de subset miste U+2192; sinds de subset hem bevat komt de pijl uit
    // JetBrains Mono en staat hij vanzelf goed. De span was bovendien de OORZAAK van
    // #77: hij liet de '[' van [→] achter als tekst-run van één teken vóór een
    // elementgrens, en die schildert Chromium niet. Zet hem niet terug zonder de
    // guard in tests/e2e/marker-brackets.spec.js te lezen.

    // Format markdown bold (mobile headers) - **text** → <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Inline-kleur het voltooid-vinkje groen, óók binnen de box (waar de regel-div
    // wit blijft omdat hij met │ begint) en binnen een **heading** (na de bold-replace
    // zodat de span correct nest; .terminal-output .marker-success (0,2,0) wint van
    // .terminal-output strong (0,1,1), dus groen overschrijft de lime heading-kleur).
    formatted = formatted.replace(/\[✓\]/g, '<span class="marker-success">[✓]</span>');

    // Note: Emoji formatting removed - we now use ASCII brackets [?] [!] [✓] [X]
    // Icon wrapping handled by semantic line detection above (lines 68-87)

    return formatted;
  }

  /**
   * Escape HTML to prevent XSS
   * @private
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Scroll terminal to bottom (industry standard behavior)
   * @private
   */
  _scrollToBottom() {
    if (this.outputElement) {
      // Scroll the output element itself (not parent)
      this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
  }

  /**
   * Trim output to prevent unbounded DOM growth
   * Removes oldest lines when exceeding MAX_OUTPUT_LINES
   * @private
   */
  _trimOutput() {
    if (this.outputElement && this.outputElement.children.length > MAX_OUTPUT_LINES) {
      while (this.outputElement.children.length > MAX_OUTPUT_LINES) {
        this.outputElement.removeChild(this.outputElement.firstChild);
      }
    }
  }

  /**
   * Update prompt prefix (for directory changes)
   * @param {string} cwd - Current working directory
   */
  updatePrompt(cwd = '~') {
    this.promptPrefix = `hacker@hacksim:${cwd}$`;
  }

  /**
   * Get current prompt
   * @returns {string}
   */
  getPrompt() {
    return this.promptPrefix;
  }
}

/**
 * Check if a line is a continuation of the previous semantic message
 * Continuation lines have 6+ leading spaces
 * @private
 * @param {string} lineText - Raw line text with spacing
 * @returns {boolean}
 */
function isContinuationLine(lineText) {
  // Normalize tabs to 4 spaces
  const normalized = lineText.replace(/\t/g, '    ');
  const leadingSpaces = normalized.match(/^(\s*)/)[1].length;
  const trimmed = lineText.trim();

  // Must have 3+ spaces AND non-empty content
  // Threshold lowered from 6 to 3 to include 4-space indents (GERELATEERDE COMMANDO'S sections)
  // See Sessie 84/85: Phase 3 - Mobile continuation line wrapping (all indents need hanging indent)
  return leadingSpaces >= 3 && trimmed.length > 0;
}

/**
 * Get number of leading spaces in a line (tabs normalized to 4 spaces)
 * Used for CSS hanging indent calculation on mobile
 * @private
 * @param {string} lineText - Raw line text with spacing
 * @returns {number} Number of leading spaces
 */
function getLeadingSpaces(lineText) {
  // Normalize tabs to 4 spaces (same as isContinuationLine)
  const normalized = lineText.replace(/\t/g, '    ');
  return normalized.match(/^(\s*)/)[1].length;
}

/**
 * Hanging-indent voor een marker-regel (0-2 leidende spaties + "[marker] " of "→ ").
 * Zulke regels vallen NÉT onder de isContinuationLine-drempel (>=3), dus zonder dit
 * kreeg bv. de welkomst-CTA "  [->] Typ 'next'..." geen data-indent en brak de wrap
 * op mobiel terug naar kolom 0 — links van de marker zelf.
 *
 * We lijnen de wrap uit onder de BERICHTTEKST (na "[marker] "), niet onder de "[".
 * Óók kolom-0 markers (0 spaties): een lange "[?]/[!]/[TIP]"-regel die op smal scherm
 * wrapt liet z'n vervolgregel anders terugvallen naar kolom 0 (onder de "["), wat
 * rafelig leest (bv. de metasploit consent-tekst). Hang-indent raakt alleen de
 * WRAP — niet-wrappende regels blijven visueel identiek, dus geen desktop-regressie.
 * >=3 spaties = houdt zijn bestaande isContinuationLine-gedrag (security-output ongemoeid).
 * @private
 * @param {string} lineText - Raw line text with spacing
 * @returns {number|null} Kolom waar de berichttekst begint, of null bij geen match
 */
function getMarkerHangIndent(lineText) {
  // Normalize tabs to 4 spaces (same as the other helpers)
  const normalized = lineText.replace(/\t/g, '    ');
  // Optionele leidende '**' (markdown-bold) wordt in de render gestript (→ <strong>),
  // dus tel 'm niet mee voor de offset — zo hangt ook een vetgedrukte marker-kop
  // (bv. "**[ ] FASE 1: ...**" in leerpad/tutorial/challenge) onder de tekst.
  const match = normalized.match(/^( {0,2})(?:\*\*)?(\[[^\]]{1,4}\]|→)\s/);
  if (!match) return null;
  return match[1].length + match[2].length + 1; // leading + marker + de scheidingsspatie
}

/**
 * Bepaal de hanging-indent-kolom (data-indent) voor één regel op mobiel, of null.
 * Gedeeld door beide render-paden (renderOutput + de mission/completion-render) zodat
 * ze niet uit sync lopen. Drie gevallen, in volgorde:
 *   1. >=3 leidende spaties  → continuation-regel, hang op de eigen inspringing;
 *   2. 0-2 spaties + marker   → hang onder de berichttekst na "[marker] ";
 *   3. 1-2 spaties, geen marker → licht-ingesprongen lijstitem (bv. help/shortcuts
 *      "  cd - ...") → hang de wrap onder de itemtekst i.p.v. terug naar kolom 0.
 * Regels zonder inspringing/marker (gewone alinea's) → null (wrap naar kolom 0 = prima).
 * @private
 * @param {string} lineText
 * @returns {number|null}
 */
function getLineIndent(lineText) {
  if (isContinuationLine(lineText)) return getLeadingSpaces(lineText);
  const hang = getMarkerHangIndent(lineText);
  if (hang !== null) return hang;
  const lead = getLeadingSpaces(lineText);
  return lead >= 1 ? lead : null;
}

/**
 * Extra klasse(n) voor een regel die met een box-drawing-glyph begint (U+2500-257F).
 *
 * Waarom: .terminal-line draagt margin-bottom: var(--spacing-xs) = 4px. Box-regels zijn
 * losse block-elementen en een verticale glyph (│/┃) tekent alléén binnen zijn eigen
 * linebox — nooit over die marge heen. Elke marge werd dus een zichtbaar gat in de rand.
 * Gemeten Sessie 222 op de gerenderde randkolom: 12 stubs van 27px met 4px gaten, en
 * 8px op regels met een pijl, want die droegen toen nog een opgetilde span. Sessie 233
 * haalde die weg (de subset bevat U+2192 nu zelf); .inline-arrow is nog het enige
 * pijl-element en zet alleen kleur/marge, geen verticale verschuiving meer.
 *
 * De sluitregel (╰/┗) houdt zijn marge wél: die scheidt de box van wat erna komt.
 * Gedeeld door beide render-paden zodat ze niet uit sync lopen, net als getLineIndent().
 * @private
 * @param {string} lineText - Ruwe regeltekst (vóór _formatText)
 * @returns {string} '' of ' terminal-line--box[ terminal-line--box-end]'
 */
function getBoxLineClass(lineText) {
  const first = lineText[0];
  // Box Drawing-blok: U+2500 '─' t/m U+257F '╿'
  if (!first || first < '─' || first > '╿') return '';
  return (first === '╰' || first === '┗')
    ? ' terminal-line--box terminal-line--box-end'
    : ' terminal-line--box';
}

// Export as singleton
export default new Renderer();
