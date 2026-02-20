/**
 * Tutorial Manager — Singleton state machine for guided scenarios.
 *
 * States: IDLE → INTRO → STEP_ACTIVE → STEP_COMPLETE → COMPLETE → IDLE
 *
 * The tutorial intercepts commands but never blocks them — the command
 * executes normally, and the manager validates afterwards.
 */

const STATES = {
  IDLE: 'IDLE',
  INTRO: 'INTRO',
  STEP_ACTIVE: 'STEP_ACTIVE',
  STEP_COMPLETE: 'STEP_COMPLETE',
  COMPLETE: 'COMPLETE'
};

const STORAGE_KEY_PROGRESS = 'hacksim_tutorial_progress';
const STORAGE_KEY_HINTS = 'hacksim_tutorial_hints';

// Hint tiers: after N wrong attempts, escalate
const HINT_TIER_1 = 2;
const HINT_TIER_2 = 4;
const HINT_TIER_3 = 6;

export default new class TutorialManager {
  constructor() {
    this.state = STATES.IDLE;
    this.scenarios = new Map();
    this.activeScenario = null;
    this.currentStep = 0;
    this.completedScenarios = [];
    this.attempts = 0;
    this.hintCounts = {};
    this._renderer = null;
  }

  /**
   * Set the renderer (called during init to avoid circular deps).
   */
  setRenderer(renderer) {
    this._renderer = renderer;
  }

  // --- Scenario Registry ---

  register(scenario) {
    if (!scenario || !scenario.id || !scenario.steps) {
      throw new Error('Scenario must have id and steps');
    }
    this.scenarios.set(scenario.id, scenario);
  }

  getScenario(id) {
    return this.scenarios.get(id) || null;
  }

  listScenarios() {
    var list = [];
    this.scenarios.forEach(function(scenario) {
      list.push({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        stepCount: scenario.steps.length,
        difficulty: scenario.difficulty || 'beginner'
      });
    });
    return list;
  }

  // --- State Machine ---

  isActive() {
    return this.state !== STATES.IDLE;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    if (!this.isActive()) {
      return { active: false, completedScenarios: this.completedScenarios };
    }
    var scenario = this.activeScenario;
    return {
      active: true,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      currentStep: this.currentStep,
      totalSteps: scenario.steps.length,
      step: scenario.steps[this.currentStep],
      attempts: this.attempts,
      completedScenarios: this.completedScenarios
    };
  }

  /**
   * Start a scenario by ID. Returns the intro/briefing output string.
   */
  start(scenarioId) {
    var scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return '[ X ] Onbekend scenario: ' + scenarioId + '\n\n[ ? ] Type \'tutorial\' om beschikbare scenario\'s te zien.';
    }

    if (this.isActive()) {
      return '[ ! ] Er is al een tutorial actief: ' + this.activeScenario.title + '\n\n[ ? ] Type \'tutorial exit\' om de huidige tutorial te verlaten.';
    }

    this.activeScenario = scenario;
    this.currentStep = 0;
    this.attempts = 0;
    this.state = STATES.STEP_ACTIVE;
    this._save();

    // Render briefing + first step objective
    var output = this._renderer.renderBriefing(scenario);
    output += '\n\n';
    output += this._renderer.renderObjective(scenario.steps[0], 0, scenario.steps.length);
    return output;
  }

  /**
   * Handle a command typed by the user while a tutorial is active.
   * Returns feedback string or null if the command isn't relevant.
   */
  handleCommand(command, args, flags, context) {
    if (this.state !== STATES.STEP_ACTIVE) return null;

    var step = this.activeScenario.steps[this.currentStep];
    var isCorrect = step.validate(command, args, flags, context);

    if (isCorrect) {
      this.attempts = 0;
      this._clearHintCount();
      this.state = STATES.STEP_COMPLETE;

      var feedback = this._renderer.renderStepFeedback(step, true, null);

      // Advance to next step or complete
      this.currentStep++;
      if (this.currentStep >= this.activeScenario.steps.length) {
        this.state = STATES.COMPLETE;
        feedback += '\n\n' + this._renderCompletion();
        this._markComplete();
      } else {
        this.state = STATES.STEP_ACTIVE;
        feedback += '\n\n' + this._renderer.renderObjective(
          this.activeScenario.steps[this.currentStep],
          this.currentStep,
          this.activeScenario.steps.length
        );
      }

      this._save();
      return feedback;
    }

    // Incorrect command
    this.attempts++;
    this._incrementHintCount();
    var hintLevel = this._getHintLevel();
    var hint = this._getHint(step, hintLevel);
    this._save();

    return this._renderer.renderStepFeedback(step, false, hint);
  }

  /**
   * Skip the current step.
   */
  skip() {
    if (!this.isActive()) {
      return '[ ? ] Geen actieve tutorial. Type \'tutorial\' om te beginnen.';
    }

    var step = this.activeScenario.steps[this.currentStep];
    var output = '[ ! ] Stap overgeslagen: ' + step.title + '\n';
    output += '[ ? ] Je mist de educatieve uitleg voor deze stap.\n';

    this.attempts = 0;
    this._clearHintCount();
    this.currentStep++;

    if (this.currentStep >= this.activeScenario.steps.length) {
      this.state = STATES.COMPLETE;
      output += '\n' + this._renderCompletion();
      this._markComplete();
    } else {
      output += '\n' + this._renderer.renderObjective(
        this.activeScenario.steps[this.currentStep],
        this.currentStep,
        this.activeScenario.steps.length
      );
    }

    this._save();
    return output;
  }

  /**
   * Exit the current tutorial, saving progress.
   */
  exit() {
    if (!this.isActive()) {
      return '[ ? ] Geen actieve tutorial.';
    }

    var title = this.activeScenario.title;
    var progress = (this.currentStep) + '/' + this.activeScenario.steps.length;
    this.state = STATES.IDLE;
    this.activeScenario = null;
    this.currentStep = 0;
    this.attempts = 0;
    this._save();

    return '[ ✓ ] Tutorial verlaten: ' + title + '\n' +
           '[ ? ] Voortgang (' + progress + ') opgeslagen. Type \'tutorial start <id>\' om te hervatten.';
  }

  /**
   * Resume a previously started tutorial (after page reload).
   */
  resume() {
    var saved = this._load();
    if (!saved || !saved.activeScenario) return false;

    var scenario = this.scenarios.get(saved.activeScenario);
    if (!scenario) return false;

    this.activeScenario = scenario;
    this.currentStep = saved.currentStep || 0;
    this.completedScenarios = saved.completedScenarios || [];
    this.attempts = saved.attempts || 0;
    this.hintCounts = this._loadHints();

    // Ensure step index is valid
    if (this.currentStep >= scenario.steps.length) {
      this.state = STATES.IDLE;
      this.activeScenario = null;
      return false;
    }

    this.state = STATES.STEP_ACTIVE;
    return true;
  }

  /**
   * Get resume info (for showing status after reload).
   */
  getResumeMessage() {
    if (!this.isActive()) return null;
    var step = this.activeScenario.steps[this.currentStep];
    return '[ ✓ ] Tutorial hervat: ' + this.activeScenario.title +
           ' (stap ' + (this.currentStep + 1) + '/' + this.activeScenario.steps.length + ')\n\n' +
           this._renderer.renderObjective(step, this.currentStep, this.activeScenario.steps.length);
  }

  isScenarioCompleted(scenarioId) {
    return this.completedScenarios.indexOf(scenarioId) !== -1;
  }

  // --- Hint System ---

  _getHintLevel() {
    var key = this._hintKey();
    var count = this.hintCounts[key] || 0;
    if (count >= HINT_TIER_3) return 3;
    if (count >= HINT_TIER_2) return 2;
    if (count >= HINT_TIER_1) return 1;
    return 0;
  }

  _getHint(step, level) {
    if (level === 0) return null;
    if (level >= 3 && step.hints && step.hints.length >= 3) return step.hints[2];
    if (level >= 2 && step.hints && step.hints.length >= 2) return step.hints[1];
    if (level >= 1 && step.hints && step.hints.length >= 1) return step.hints[0];
    return null;
  }

  _hintKey() {
    if (!this.activeScenario) return '';
    return this.activeScenario.id + '_' + this.currentStep;
  }

  _incrementHintCount() {
    var key = this._hintKey();
    this.hintCounts[key] = (this.hintCounts[key] || 0) + 1;
    this._saveHints();
  }

  _clearHintCount() {
    var key = this._hintKey();
    delete this.hintCounts[key];
    this._saveHints();
  }

  // --- Completion ---

  _renderCompletion() {
    var scenario = this.activeScenario;
    return this._renderer.renderCompletion(scenario, {
      stepsCompleted: scenario.steps.length,
      totalSteps: scenario.steps.length
    });
  }

  _markComplete() {
    if (this.activeScenario && this.completedScenarios.indexOf(this.activeScenario.id) === -1) {
      this.completedScenarios.push(this.activeScenario.id);
    }
    this.state = STATES.IDLE;
    this.activeScenario = null;
    this.currentStep = 0;
    this.attempts = 0;
    this._save();
  }

  // --- Persistence ---

  _save() {
    try {
      var data = {
        activeScenario: this.activeScenario ? this.activeScenario.id : null,
        currentStep: this.currentStep,
        completedScenarios: this.completedScenarios,
        attempts: this.attempts
      };
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save tutorial progress:', e);
    }
  }

  _load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Could not load tutorial progress:', e);
      return null;
    }
  }

  _saveHints() {
    try {
      localStorage.setItem(STORAGE_KEY_HINTS, JSON.stringify(this.hintCounts));
    } catch (e) {
      console.warn('Could not save hint counts:', e);
    }
  }

  _loadHints() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_HINTS);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  /**
   * Reset all tutorial data (for testing/debug).
   */
  reset() {
    this.state = STATES.IDLE;
    this.activeScenario = null;
    this.currentStep = 0;
    this.completedScenarios = [];
    this.attempts = 0;
    this.hintCounts = {};
    try {
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
      localStorage.removeItem(STORAGE_KEY_HINTS);
    } catch (e) {
      console.warn('Could not clear tutorial storage:', e);
    }
  }
};
