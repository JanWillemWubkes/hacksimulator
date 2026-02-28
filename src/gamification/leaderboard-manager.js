/**
 * Leaderboard Manager — Singleton for merged simulated + personal ranking.
 *
 * Follows badge-manager pattern: singleton export, progressStore integration.
 * Merges 10 simulated entries with the player's real score, sorted descending.
 * Player wins ties (ranked above simulated entries with equal points).
 */

import progressStore from './progress-store.js';
import SIMULATED_ENTRIES from './leaderboard-data.js';

var TITLE_THRESHOLDS = [
  { min: 250, title: 'Hacker Elite' },
  { min: 200, title: 'Pentester' },
  { min: 150, title: 'Red Teamer' },
  { min: 100, title: 'Bug Hunter' },
  { min: 70, title: 'Scripter' },
  { min: 40, title: 'Analyst' },
  { min: 20, title: 'Explorer' },
  { min: 10, title: 'Beginner' },
  { min: 1, title: 'Newbie' },
  { min: 0, title: 'Script Kiddie' }
];

var leaderboardManager = {

  getPlayerTitle: function(points) {
    for (var i = 0; i < TITLE_THRESHOLDS.length; i++) {
      if (points >= TITLE_THRESHOLDS[i].min) {
        return TITLE_THRESHOLDS[i].title;
      }
    }
    return 'Script Kiddie';
  },

  getRankedList: function() {
    var stats = progressStore.getStats();
    var playerPoints = stats.totalPoints;
    var playerTitle = this.getPlayerTitle(playerPoints);

    // Copy simulated entries
    var list = SIMULATED_ENTRIES.map(function(entry) {
      return { name: entry.name, points: entry.points, title: entry.title, isPlayer: false };
    });

    // Add player
    list.push({ name: 'Jij', points: playerPoints, title: playerTitle, isPlayer: true });

    // Sort descending — player wins ties
    list.sort(function(a, b) {
      if (b.points !== a.points) return b.points - a.points;
      return a.isPlayer ? -1 : 1;
    });

    // Assign ranks
    for (var i = 0; i < list.length; i++) {
      list[i].rank = i + 1;
    }

    return list;
  },

  getPlayerRank: function() {
    var ranked = this.getRankedList();
    var player = null;
    var playerIndex = -1;

    for (var i = 0; i < ranked.length; i++) {
      if (ranked[i].isPlayer) {
        player = ranked[i];
        playerIndex = i;
        break;
      }
    }

    if (!player) return null;

    var above = playerIndex > 0 ? ranked[playerIndex - 1] : null;
    var below = playerIndex < ranked.length - 1 ? ranked[playerIndex + 1] : null;
    var pointsToClimb = above ? above.points - player.points + 1 : 0;

    return {
      rank: player.rank,
      total: ranked.length,
      points: player.points,
      title: player.title,
      above: above,
      below: below,
      pointsToClimb: pointsToClimb
    };
  }
};

export default leaderboardManager;
