/**
 * Centralized Affiliate Configuration
 * Single source of truth for all affiliate programs
 *
 * To add a new program:
 * 1. Add entry to programs object
 * 2. Replace PLACEHOLDER with real affiliate ID after approval
 * 3. No code changes needed elsewhere!
 */

const AFFILIATE_CONFIG = {
  /**
   * Affiliate Programs
   * Format: { name, type, rate, baseUrl }
   */
  programs: {
    bol: {
      name: 'Bol.com Partner',
      type: 'books',
      rate: '7%',
      baseUrl: 'https://partner.bol.com/click/click?p=2&t=url&s=PLACEHOLDER',
      description: 'Boeken over cybersecurity en ethical hacking'
    },

    udemy: {
      name: 'Udemy Affiliate',
      type: 'courses',
      rate: '10%',
      baseUrl: 'https://www.udemy.com/course/PLACEHOLDER/?referralCode=PLACEHOLDER',
      description: 'Online cursussen ethical hacking met lifetime access'
    },

    tryhackme: {
      name: 'TryHackMe',
      type: 'platform',
      rate: '15%',
      baseUrl: 'https://tryhackme.com/?ref=PLACEHOLDER',
      description: 'Interactief leerplatform met hands-on labs'
    },

    skillshare: {
      name: 'Skillshare',
      type: 'platform',
      rate: '40% eerste betaling',
      baseUrl: 'https://www.skillshare.com/?via=PLACEHOLDER',
      description: 'Creatieve en technische vaardigheden, onbeperkte toegang'
    },

    amazon: {
      name: 'Amazon Associates',
      type: 'hardware',
      rate: '3-5%',
      baseUrl: 'https://www.amazon.nl/dp/PLACEHOLDER?tag=PLACEHOLDER',
      description: 'Hardware voor pentesting labs (Raspberry Pi, WiFi adapters)'
    }
  },

  /**
   * Disclosure Text
   * Used in banners and badges
   */
  disclosure: {
    banner: '🔗 <strong>Let op:</strong> Deze links bevatten affiliate-verwijzingen. Wij ontvangen een commissie bij aankoop, zonder extra kosten voor jou.',
    badge: 'Affiliate',
    linkText: 'Meer info over affiliate links'
  },

  /**
   * Privacy Settings
   * What we track vs. what we don't
   */
  privacy: {
    tracked: ['program', 'product', 'timestamp'],
    notTracked: ['urls', 'ip_address', 'personal_data', 'purchase_status']
  },

  /**
   * Get program info by ID
   * @param {string} programId - e.g., 'bol', 'udemy'
   * @returns {object|null} Program config or null if not found
   */
  getProgram(programId) {
    return this.programs[programId] || null;
  },

  /**
   * Get all program IDs
   * @returns {string[]} Array of program IDs
   */
  getProgramIds() {
    return Object.keys(this.programs);
  },

  /**
   * Validate program exists
   * @param {string} programId
   * @returns {boolean}
   */
  isValidProgram(programId) {
    return programId in this.programs;
  }
};

export default AFFILIATE_CONFIG;
