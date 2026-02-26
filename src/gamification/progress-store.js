/**
 * Progress Store — Singleton localStorage wrapper for gamification data.
 *
 * Owns the `hacksim_gamification` key. All gamification modules
 * read/write through this store to prevent key conflicts.
 */

const STORAGE_KEY = 'hacksim_gamification';
const COMMAND_LOG_CAP = 100;

export default new class ProgressStore {
  constructor() {
    this._cache = null;
  }

  /**
   * Load gamification data from localStorage.
   * Returns cached data if available.
   */
  load() {
    if (this._cache) return this._cache;

    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this._cache = this._defaults();
        return this._cache;
      }
      this._cache = JSON.parse(raw);
      return this._cache;
    } catch (e) {
      console.warn('Could not load gamification data:', e);
      this._cache = this._defaults();
      return this._cache;
    }
  }

  /**
   * Save current data to localStorage.
   */
  save() {
    try {
      var data = this._cache || this._defaults();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save gamification data:', e);
    }
  }

  /**
   * Get player stats summary.
   */
  getStats() {
    var data = this.load();
    return {
      totalPoints: data.totalPoints || 0,
      completedChallenges: data.completedChallenges || [],
      totalCommands: data.totalCommands || 0,
      commandCounts: data.commandCounts || {},
      badges: data.badges || [],
      streak: data.streak || 0,
      lastActiveDate: data.lastActiveDate || null
    };
  }

  /**
   * Update stats with a partial object (merge).
   */
  updateStats(partial) {
    var data = this.load();
    for (var key in partial) {
      if (Object.prototype.hasOwnProperty.call(partial, key)) {
        data[key] = partial[key];
      }
    }
    this._cache = data;
    this.save();
  }

  /**
   * Record a command execution for challenge tracking.
   */
  recordCommand(command, args) {
    var data = this.load();

    // Update command counts
    if (!data.commandCounts) data.commandCounts = {};
    data.commandCounts[command] = (data.commandCounts[command] || 0) + 1;
    data.totalCommands = (data.totalCommands || 0) + 1;

    // Append to active challenge log (capped)
    if (!data.challengeLog) data.challengeLog = [];
    data.challengeLog.push({ command: command, args: args || [], time: Date.now() });
    if (data.challengeLog.length > COMMAND_LOG_CAP) {
      data.challengeLog = data.challengeLog.slice(-COMMAND_LOG_CAP);
    }

    this._cache = data;
    this.save();
  }

  /**
   * Get the command log for the active challenge.
   */
  getChallengeLog() {
    var data = this.load();
    return data.challengeLog || [];
  }

  /**
   * Clear the command log (on challenge start/exit).
   */
  clearChallengeLog() {
    var data = this.load();
    data.challengeLog = [];
    this._cache = data;
    this.save();
  }

  /**
   * Mark a challenge as completed.
   */
  completeChallenge(challengeId, points) {
    var data = this.load();
    if (!data.completedChallenges) data.completedChallenges = [];

    if (data.completedChallenges.indexOf(challengeId) === -1) {
      data.completedChallenges.push(challengeId);
      data.totalPoints = (data.totalPoints || 0) + (points || 0);
    }

    this._cache = data;
    this.save();
  }

  /**
   * Award a badge by ID.
   */
  awardBadge(badgeId) {
    var data = this.load();
    if (!data.badges) data.badges = [];

    if (data.badges.indexOf(badgeId) === -1) {
      data.badges.push(badgeId);
    }

    this._cache = data;
    this.save();
  }

  /**
   * Check if a badge is already earned.
   */
  hasBadge(badgeId) {
    var data = this.load();
    return (data.badges || []).indexOf(badgeId) !== -1;
  }

  /**
   * Update streak tracking.
   */
  updateStreak() {
    var data = this.load();
    var today = new Date().toISOString().slice(0, 10);
    var last = data.lastActiveDate;

    if (last === today) {
      // Already active today
      this._cache = data;
      return data.streak || 1;
    }

    if (last) {
      var lastDate = new Date(last);
      var todayDate = new Date(today);
      var diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        // Consecutive day
        data.streak = (data.streak || 0) + 1;
      } else {
        // Streak broken
        data.streak = 1;
      }
    } else {
      data.streak = 1;
    }

    data.lastActiveDate = today;
    this._cache = data;
    this.save();
    return data.streak;
  }

  /**
   * Reset all gamification data.
   */
  reset() {
    this._cache = this._defaults();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear gamification storage:', e);
    }
  }

  /**
   * Default data structure.
   */
  _defaults() {
    return {
      totalPoints: 0,
      completedChallenges: [],
      totalCommands: 0,
      commandCounts: {},
      challengeLog: [],
      badges: [],
      streak: 0,
      lastActiveDate: null
    };
  }
};
