/**
 * Fuzzy matching utilities
 * Levenshtein distance algorithm for typo detection
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
export function levenshteinDistance(a, b) {
  const matrix = [];

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find closest matching command from a list
 * @param {string} input - User input (possibly with typo)
 * @param {string[]} commands - List of valid commands
 * @param {number} maxDistance - Maximum allowed distance (default: 2)
 * @returns {string|null} Closest match or null
 */
export function findClosestCommand(input, commands, maxDistance = 2) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const cmd of commands) {
    const distance = levenshteinDistance(input.toLowerCase(), cmd.toLowerCase());

    if (distance <= maxDistance && distance < bestDistance) {
      bestDistance = distance;
      bestMatch = cmd;
    }
  }

  return bestMatch;
}

/**
 * Find multiple similar commands (top 3)
 * @param {string} input - User input
 * @param {string[]} commands - List of valid commands
 * @param {number} maxResults - Max number of suggestions (default: 3)
 * @returns {string[]} Array of suggestions
 */
export function findSimilarCommands(input, commands, maxResults = 3) {
  const matches = commands
    .map(cmd => ({
      command: cmd,
      distance: levenshteinDistance(input.toLowerCase(), cmd.toLowerCase())
    }))
    .filter(m => m.distance <= 3) // Max distance of 3
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults)
    .map(m => m.command);

  return matches;
}

/**
 * Check if two strings are similar (for duplicate detection)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @param {number} threshold - Similarity threshold (0-1, default: 0.8)
 * @returns {boolean} True if similar
 */
export function isSimilar(a, b, threshold = 0.8) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return true;

  const distance = levenshteinDistance(a, b);
  const similarity = 1 - (distance / maxLen);

  return similarity >= threshold;
}

export default {
  levenshteinDistance,
  findClosestCommand,
  findSimilarCommands,
  isSimilar
};
