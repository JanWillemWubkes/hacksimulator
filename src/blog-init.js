/**
 * Blog-specific initialization
 * Lightweight bundle for blog posts - only loads affiliate tracking
 * Does NOT load terminal, commands, or other main site features
 */

import affiliateLinks from './ui/affiliate-links.js';

// Initialize affiliate tracking (will only run on /blog/ pages due to path check)
affiliateLinks.init();

console.log('[Blog] Affiliate tracking initialized');
