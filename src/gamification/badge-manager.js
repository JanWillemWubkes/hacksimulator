/**
 * Badge Manager — Singleton for badge unlock detection and rendering.
 *
 * Follows challenge-manager pattern: Map-based registry, singleton export.
 * Checks badge conditions against progressStore stats on trigger events.
 */

import progressStore from './progress-store.js';
import badgeDefinitions from './badge-definitions.js';
import analyticsEvents from '../analytics/events.js';
import {
  BOX_CHARS,
  getResponsiveBoxWidth,
  isMobileView,
  wordWrap
} from '../utils/box-utils.js';

var B = BOX_CHARS;

var RARITY_ORDER = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
var RARITY_LABELS = {
  common: 'COMMON',
  uncommon: 'UNCOMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY'
};

function buildLine(text, width) {
  var inner = width - 2;
  var pad = inner - text.length;
  if (pad < 0) pad = 0;
  return B.vertical + text + ' '.repeat(pad) + B.vertical;
}

function buildEmptyLine(width) {
  var inner = width - 2;
  return B.vertical + ' '.repeat(inner) + B.vertical;
}

export default new class BadgeManager {
  constructor() {
    this.badges = new Map();
    this._initialized = false;
  }

  /**
   * Register all badge definitions.
   */
  init() {
    if (this._initialized) return;

    var self = this;
    badgeDefinitions.forEach(function(badge) {
      self.badges.set(badge.id, badge);
    });

    this._initialized = true;
  }

  /**
   * Check and unlock badges for a given trigger type.
   * Returns array of newly unlocked badge objects.
   */
  checkUnlocks(trigger) {
    if (!this._initialized) return [];

    var stats = progressStore.getStats();
    var newlyUnlocked = [];

    this.badges.forEach(function(badge) {
      // Skip if wrong trigger type
      if (badge.trigger !== trigger) return;

      // Skip if already earned
      if (progressStore.hasBadge(badge.id)) return;

      // Check condition
      if (badge.check(stats)) {
        progressStore.awardBadge(badge.id);
        newlyUnlocked.push(badge);

        analyticsEvents.gamificationEvent('badge_unlocked', badge.id, {
          rarity: badge.rarity
        });
      }
    });

    return newlyUnlocked;
  }

  /**
   * List badges with unlock status.
   * @param {Object} options - { filter: 'all'|'unlocked'|'locked', rarity: string }
   */
  listBadges(options) {
    var filter = (options && options.filter) || 'all';
    var rarity = (options && options.rarity) || null;
    var stats = progressStore.getStats();
    var earnedBadges = stats.badges || [];
    var result = [];

    this.badges.forEach(function(badge) {
      var unlocked = earnedBadges.indexOf(badge.id) !== -1;

      // Apply filters
      if (filter === 'unlocked' && !unlocked) return;
      if (filter === 'locked' && unlocked) return;
      if (rarity && badge.rarity !== rarity) return;

      result.push({
        id: badge.id,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        unlocked: unlocked
      });
    });

    // Sort by rarity (common first), then alphabetically
    result.sort(function(a, b) {
      var ra = RARITY_ORDER[a.rarity] || 0;
      var rb = RARITY_ORDER[b.rarity] || 0;
      if (ra !== rb) return ra - rb;
      return a.title.localeCompare(b.title);
    });

    return result;
  }

  /**
   * Get summary stats.
   */
  getSummary() {
    var stats = progressStore.getStats();
    var earnedBadges = stats.badges || [];
    var byRarity = {};

    this.badges.forEach(function(badge) {
      if (!byRarity[badge.rarity]) {
        byRarity[badge.rarity] = { total: 0, unlocked: 0 };
      }
      byRarity[badge.rarity].total++;
      if (earnedBadges.indexOf(badge.id) !== -1) {
        byRarity[badge.rarity].unlocked++;
      }
    });

    return {
      total: this.badges.size,
      unlocked: earnedBadges.length,
      byRarity: byRarity
    };
  }

  /**
   * Render compact ASCII notification for a newly unlocked badge.
   */
  renderNotification(badge) {
    if (isMobileView()) {
      return badge.icon + ' BADGE UNLOCKED: ' + badge.title +
             ' (' + RARITY_LABELS[badge.rarity] + ')\n' +
             '    ' + badge.description;
    }

    var width = Math.min(getResponsiveBoxWidth(), 50);
    var inner = width - 2;
    var lines = [];

    var label = ' BADGE UNLOCKED ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);

    var titleText = '  ' + badge.icon + ' ' + badge.title + ' (' + RARITY_LABELS[badge.rarity] + ')';
    if (titleText.length > inner) titleText = titleText.substring(0, inner - 3) + '...';
    lines.push(buildLine(titleText, width));

    var descText = '  ' + badge.description;
    if (descText.length > inner) descText = descText.substring(0, inner - 3) + '...';
    lines.push(buildLine(descText, width));

    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    return lines.join('\n');
  }

  /**
   * Render full badge gallery for achievements command.
   */
  renderGallery(badges, title) {
    if (badges.length === 0) {
      return '[?] Geen badges gevonden.';
    }

    if (isMobileView()) {
      return this._renderGalleryMobile(badges, title);
    }

    var width = getResponsiveBoxWidth();
    var inner = width - 2;
    var lines = [];

    // Header
    var label = ' ' + (title || 'ACHIEVEMENTS') + ' ';
    var remaining = inner - label.length;
    var leftPad = Math.floor(remaining / 2);
    var rightPad = remaining - leftPad;
    lines.push(B.topLeft + B.horizontal.repeat(leftPad) + label + B.horizontal.repeat(rightPad) + B.topRight);
    lines.push(buildEmptyLine(width));

    // Summary
    var summary = this.getSummary();
    lines.push(buildLine('  Badges: ' + summary.unlocked + '/' + summary.total + ' unlocked', width));
    lines.push(buildEmptyLine(width));

    // Group by rarity
    var currentRarity = null;
    badges.forEach(function(badge) {
      if (badge.rarity !== currentRarity) {
        currentRarity = badge.rarity;
        var rarityLabel = '  -- ' + RARITY_LABELS[currentRarity] + ' --';
        lines.push(buildLine(rarityLabel, width));
      }

      var status = badge.unlocked ? '[X]' : '[ ]';
      var displayTitle = badge.unlocked ? badge.title : '???';
      var badgeLine = '  ' + status + ' ' + badge.icon + ' ' + displayTitle;

      // Add rarity tag for clarity
      if (badgeLine.length > inner - 2) {
        badgeLine = badgeLine.substring(0, inner - 5) + '...';
      }
      lines.push(buildLine(badgeLine, width));

      // Show description only for unlocked badges
      if (badge.unlocked) {
        var descLines = wordWrap(badge.description, inner - 10);
        descLines.forEach(function(line) {
          lines.push(buildLine('        ' + line, width));
        });
      }
    });

    lines.push(buildEmptyLine(width));
    lines.push(B.bottomLeft + B.horizontal.repeat(inner) + B.bottomRight);

    return lines.join('\n');
  }

  /**
   * Mobile fallback for gallery.
   */
  _renderGalleryMobile(badges, title) {
    var summary = this.getSummary();
    var out = '\n**' + (title || 'ACHIEVEMENTS') + '**\n';
    out += 'Badges: ' + summary.unlocked + '/' + summary.total + ' unlocked\n\n';

    var currentRarity = null;
    badges.forEach(function(badge) {
      if (badge.rarity !== currentRarity) {
        currentRarity = badge.rarity;
        out += '-- ' + RARITY_LABELS[currentRarity] + ' --\n';
      }

      var status = badge.unlocked ? '[X]' : '[ ]';
      var displayTitle = badge.unlocked ? badge.title : '???';
      out += status + ' ' + badge.icon + ' ' + displayTitle + '\n';

      if (badge.unlocked) {
        out += '    ' + badge.description + '\n';
      }
    });

    return out;
  }
};
