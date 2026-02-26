/**
 * Challenge Manager — State machine for hack challenges.
 *
 * States: IDLE → ACTIVE → COMPLETE → IDLE
 *
 * Key difference from TutorialManager: challenges validate against
 * a command log (multiple commands in any order), not per-step.
 * Commands always execute normally — the manager validates afterwards.
 */

import progressStore from './progress-store.js';
import analyticsEvents from '../analytics/events.js';

const STATES = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  COMPLETE: 'COMPLETE'
};

const HINT_TIER_1 = 3;
const HINT_TIER_2 = 6;
const HINT_TIER_3 = 10;

export default new class ChallengeManager {
  constructor() {
    this.state = STATES.IDLE;
    this.challenges = new Map();
    this.activeChallenge = null;
    this.attempts = 0;
    this._renderer = null;
  }

  /**
   * Set the renderer (called during init to avoid circular deps).
   */
  setRenderer(renderer) {
    this._renderer = renderer;
  }

  // --- Challenge Registry ---

  register(challenge) {
    if (!challenge || !challenge.id || !challenge.validate) {
      throw new Error('Challenge must have id and validate function');
    }
    this.challenges.set(challenge.id, challenge);
  }

  getChallenge(id) {
    return this.challenges.get(id) || null;
  }

  listChallenges() {
    var stats = progressStore.getStats();
    var list = [];
    this.challenges.forEach(function(challenge) {
      list.push({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        points: challenge.points,
        completed: stats.completedChallenges.indexOf(challenge.id) !== -1
      });
    });
    return list;
  }

  // --- State Machine ---

  isActive() {
    return this.state === STATES.ACTIVE;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    if (!this.isActive()) {
      var stats = progressStore.getStats();
      return {
        active: false,
        completedCount: stats.completedChallenges.length,
        totalPoints: stats.totalPoints
      };
    }

    var challenge = this.activeChallenge;
    var log = progressStore.getChallengeLog();
    var progress = this._checkProgress(challenge, log);

    return {
      active: true,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      difficulty: challenge.difficulty,
      points: challenge.points,
      requirements: challenge.requirements,
      progress: progress,
      attempts: this.attempts
    };
  }

  /**
   * Start a challenge by ID.
   */
  start(challengeId) {
    var challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return '[X] Onbekende challenge: ' + challengeId + '\n\n[?] Type \'challenge\' om beschikbare challenges te zien.';
    }

    if (this.isActive()) {
      return '[!] Er is al een challenge actief: ' + this.activeChallenge.title + '\n\n[?] Type \'challenge exit\' om de huidige challenge te verlaten.';
    }

    // Check if already completed
    var stats = progressStore.getStats();
    if (stats.completedChallenges.indexOf(challengeId) !== -1) {
      return '[✓] Je hebt deze challenge al voltooid!\n\n[?] Type \'challenge\' om andere challenges te zien.';
    }

    this.activeChallenge = challenge;
    this.state = STATES.ACTIVE;
    this.attempts = 0;
    progressStore.clearChallengeLog();

    analyticsEvents.gamificationEvent('challenge_started', challengeId);

    return this._renderer.renderBriefing(challenge);
  }

  /**
   * Handle a command typed by the user while a challenge is active.
   * Returns feedback string or null.
   */
  handleCommand(command, args, flags, context) {
    if (this.state !== STATES.ACTIVE) return null;

    var challenge = this.activeChallenge;

    // Record command in log
    progressStore.recordCommand(command, args);

    var log = progressStore.getChallengeLog();
    this.attempts++;

    // Check if challenge is complete
    var isComplete = challenge.validate(log, context);

    if (isComplete) {
      this.state = STATES.COMPLETE;
      progressStore.completeChallenge(challenge.id, challenge.points);

      analyticsEvents.gamificationEvent('challenge_completed', challenge.id, {
        attempts: this.attempts,
        points: challenge.points
      });

      var feedback = this._renderer.renderCompletion(challenge, this.attempts);

      // Reset state
      this.state = STATES.IDLE;
      this.activeChallenge = null;
      this.attempts = 0;
      progressStore.clearChallengeLog();

      return feedback;
    }

    // Show progress update (every 3 commands to avoid spam)
    if (this.attempts % 3 === 0) {
      var progress = this._checkProgress(challenge, log);
      return this._renderer.renderProgress(challenge, progress);
    }

    return null;
  }

  /**
   * Get a hint for the current challenge.
   */
  getHint() {
    if (!this.isActive()) {
      return '[?] Geen actieve challenge. Type \'challenge\' om te beginnen.';
    }

    var challenge = this.activeChallenge;
    var tips = challenge.tips || [];

    var level = 0;
    if (this.attempts >= HINT_TIER_3) level = 2;
    else if (this.attempts >= HINT_TIER_2) level = 1;
    else if (this.attempts >= HINT_TIER_1) level = 0;
    else {
      return '[?] Probeer nog even! Na ' + HINT_TIER_1 + ' pogingen krijg je een hint.\n' +
             '[?] Pogingen tot nu toe: ' + this.attempts;
    }

    if (tips[level]) {
      return '[TIP] Hint ' + (level + 1) + '/' + tips.length + ': ' + tips[level];
    }

    return '[?] Geen verdere hints beschikbaar. Bekijk de challenge omschrijving nog eens.';
  }

  /**
   * Exit the current challenge.
   */
  exit() {
    if (!this.isActive()) {
      return '[?] Geen actieve challenge.';
    }

    var title = this.activeChallenge.title;

    analyticsEvents.gamificationEvent('challenge_abandoned', this.activeChallenge.id, {
      attempts: this.attempts
    });

    this.state = STATES.IDLE;
    this.activeChallenge = null;
    this.attempts = 0;
    progressStore.clearChallengeLog();

    return '[✓] Challenge verlaten: ' + title + '\n' +
           '[?] Je kunt de challenge later opnieuw starten.';
  }

  /**
   * Check progress: which requirements are met.
   */
  _checkProgress(challenge, log) {
    var reqs = challenge.requirements || [];
    var commandsUsed = {};
    log.forEach(function(entry) {
      commandsUsed[entry.command] = (commandsUsed[entry.command] || 0) + 1;
    });

    return reqs.map(function(req) {
      var met = commandsUsed[req.command] && commandsUsed[req.command] >= (req.minCount || 1);
      return {
        command: req.command,
        description: req.description || req.command,
        met: !!met
      };
    });
  }

  /**
   * Reset all challenge data.
   */
  reset() {
    this.state = STATES.IDLE;
    this.activeChallenge = null;
    this.attempts = 0;
  }
};
