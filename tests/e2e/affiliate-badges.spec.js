/**
 * E2E Tests: Affiliate Book/Course Grid - Visual & Interactive
 *
 * Tests all phases of affiliate CTA optimization:
 * - Phase 1: [AFFILIATE] text wrapping fix
 * - Phase 2: Category badge contrast enhancement
 * - Phase 3: Ribbon-style affiliate badge
 * - Phase 4: Interactive CTA button animations
 *
 * @see /home/willem/.claude/plans/sunny-giggling-shell.md
 */

import { test, expect } from '@playwright/test';

// Test both blog pages with affiliate grids
const pages = [
  { url: '/blog/top-5-hacking-boeken.html', name: 'Hacking Books', cards: 5 },
  { url: '/blog/beste-online-cursussen-ethical-hacking.html', name: 'Ethical Hacking Courses', cards: 3 }
];

for (const page of pages) {
  test.describe(`Affiliate Grid: ${page.name}`, () => {
    test.beforeEach(async ({ page: browserPage }) => {
      await browserPage.goto(page.url);
    });

    test('affiliate ribbon renders in top-right corner', async ({ page: browserPage }) => {
      const ribbons = browserPage.locator('.affiliate-ribbon');
      const count = await ribbons.count();

      expect(count).toBe(page.cards);

      // Check first ribbon position and content
      const firstRibbon = ribbons.first();
      await expect(firstRibbon).toBeVisible();
      await expect(firstRibbon).toContainText('AFFILIATE');

      // Verify top-right positioning RELATIVE to parent card
      const firstCard = browserPage.locator('.resource-card').first();
      const ribbonBox = await firstRibbon.boundingBox();
      const cardBox = await firstCard.boundingBox();

      expect(ribbonBox).not.toBeNull();
      expect(cardBox).not.toBeNull();

      // Ribbon should be in top-right corner of its card
      // Right edge: ribbon.right ≈ card.right (within 5px tolerance)
      const ribbonRight = ribbonBox.x + ribbonBox.width;
      const cardRight = cardBox.x + cardBox.width;
      expect(Math.abs(ribbonRight - cardRight)).toBeLessThan(5);

      // Top edge: ribbon.top ≈ card.top (within 5px tolerance)
      expect(Math.abs(ribbonBox.y - cardBox.y)).toBeLessThan(5);
    });

    test('[AFFILIATE] text does not wrap (Phase 1 fix)', async ({ page: browserPage }) => {
      // Old inline .affiliate-badge should be completely removed
      const oldBadges = browserPage.locator('.affiliate-badge');
      await expect(oldBadges).toHaveCount(0);

      // Ribbon should be single line (white-space: nowrap)
      const ribbon = browserPage.locator('.affiliate-ribbon').first();
      const box = await ribbon.boundingBox();

      expect(box).not.toBeNull();
      expect(box.height).toBeLessThan(40); // Single line height
    });

    test('ribbon has orange gradient background', async ({ page: browserPage }) => {
      const ribbon = browserPage.locator('.affiliate-ribbon').first();

      // Check background includes gradient
      const background = await ribbon.evaluate(el =>
        window.getComputedStyle(el).background
      );

      expect(background).toContain('gradient');
    });

    test('ribbon has ASCII brackets via ::before/::after', async ({ page: browserPage }) => {
      const ribbon = browserPage.locator('.affiliate-ribbon').first();
      const text = await ribbon.textContent();

      // textContent doesn't include ::before/::after, so check base text is AFFILIATE
      expect(text.trim()).toBe('AFFILIATE');

      // Verify ::before/::after exist via computed style
      const beforeContent = await ribbon.evaluate(el => {
        const before = window.getComputedStyle(el, '::before');
        return before.content;
      });
      expect(beforeContent).toContain('[');
    });

    test('category badges have enhanced contrast (Phase 2)', async ({ page: browserPage }) => {
      const badges = browserPage.locator('.resource-category-badge');
      const count = await badges.count();

      expect(count).toBeGreaterThan(0);
      expect(count).toBe(page.cards);

      // Check first badge has visible border (depth indicator)
      const firstBadge = badges.first();
      const border = await firstBadge.evaluate(el =>
        window.getComputedStyle(el).border
      );

      expect(border).toContain('2px');
    });

    test('category badge hover effect works', async ({ page: browserPage }) => {
      const badge = browserPage.locator('.resource-category-badge').first();

      // Get initial position
      const initialBox = await badge.boundingBox();

      // Hover
      await badge.hover();

      // Check transform is applied (translateY)
      const transform = await badge.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(transform).not.toBe('none');
    });

    test('all badge variants render correctly', async ({ page: browserPage }) => {
      // Check that at least one badge of any type exists
      const badgeTypes = [
        '.badge-pentest',
        '.badge-websec',
        '.badge-exploits',
        '.badge-python',
        '.badge-socialeng',
        '.badge-bootcamp',    // Course badges
        '.badge-creative',
        '.badge-platform'
      ];

      let foundBadges = 0;

      for (const badgeClass of badgeTypes) {
        const count = await browserPage.locator(badgeClass).count();
        foundBadges += count;
      }

      expect(foundBadges).toBe(page.cards);
    });

    test('resource-card has position: relative for ribbon', async ({ page: browserPage }) => {
      const card = browserPage.locator('.resource-card').first();

      const position = await card.evaluate(el =>
        window.getComputedStyle(el).position
      );

      expect(position).toBe('relative');
    });

    test('resource-card__header has padding-top for ribbon clearance', async ({ page: browserPage }) => {
      const header = browserPage.locator('.resource-card__header').first();

      const paddingTop = await header.evaluate(el =>
        window.getComputedStyle(el).paddingTop
      );

      // Should be 36px (desktop) or 32px (mobile)
      const paddingValue = parseFloat(paddingTop);
      expect(paddingValue).toBeGreaterThanOrEqual(30);
    });

    test('CTA button has arrow indicator (Phase 4)', async ({ page: browserPage }) => {
      const cta = browserPage.locator('.resource-cta').first();

      // Check ::after content contains arrow
      const afterContent = await cta.evaluate(el => {
        const after = window.getComputedStyle(el, '::after');
        return after.content;
      });

      // Arrow (→) or unicode equivalent
      expect(afterContent).toMatch(/→|\\2192|"→"/);
    });

    test('CTA button hover animation works', async ({ page: browserPage }) => {
      const cta = browserPage.locator('.resource-cta').first();

      await expect(cta).toBeVisible();

      // Hover triggers transform
      await cta.hover();

      const transform = await cta.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(transform).not.toBe('none');
    });

    test('CTA button has proper focus state', async ({ page: browserPage }) => {
      const cta = browserPage.locator('.resource-cta').first();

      // Focus via keyboard
      await cta.focus();

      const outline = await cta.evaluate(el =>
        window.getComputedStyle(el).outline
      );

      // Should have visible outline (at least 1px solid, browsers may vary)
      expect(outline).toMatch(/(1|2|3)px/);
      expect(outline).toContain('solid');
    });

    test('mobile: ribbon scales appropriately', async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 375, height: 667 });

      const ribbon = browserPage.locator('.affiliate-ribbon').first();

      const fontSize = await ribbon.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      // Should be 0.65rem ≈ 10.4px on mobile
      expect(parseFloat(fontSize)).toBeLessThan(12);
    });

    test('mobile: CTA button is full width', async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 375, height: 667 });

      const cta = browserPage.locator('.resource-cta').first();
      const ctaBox = await cta.boundingBox();

      expect(ctaBox).not.toBeNull();
      expect(ctaBox.width).toBeGreaterThan(280); // Nearly full width (accounting for padding)
    });

    test('mobile: CTA has 44px+ touch target', async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 375, height: 667 });

      const cta = browserPage.locator('.resource-cta').first();
      const box = await cta.boundingBox();

      expect(box).not.toBeNull();
      expect(box.height).toBeGreaterThanOrEqual(44); // WCAG 2.5.5
    });

    test('mobile: header padding is reduced', async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 375, height: 667 });

      const header = browserPage.locator('.resource-card__header').first();

      const paddingTop = await header.evaluate(el =>
        window.getComputedStyle(el).paddingTop
      );

      // Should be 32px on mobile (smaller than 36px desktop)
      expect(parseFloat(paddingTop)).toBeLessThanOrEqual(35);
    });
  });
}

// Cross-theme tests
test.describe('Affiliate Grid: Theme Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/top-5-hacking-boeken.html');
  });

  test('category badges visible in light theme', async ({ page }) => {
    // Switch to light theme
    const themeToggle = page.locator('[data-theme-toggle]').or(page.locator('button:has-text("Light")'));
    await themeToggle.click();

    const badge = page.locator('.resource-category-badge').first();

    // Check badge has sufficient opacity/visibility
    const opacity = await badge.evaluate(el =>
      window.getComputedStyle(el).opacity
    );

    expect(parseFloat(opacity)).toBeGreaterThanOrEqual(0.9);
  });

  test('category badges visible in dark theme', async ({ page }) => {
    // Switch to dark theme
    const themeToggle = page.locator('[data-theme-toggle]').or(page.locator('button:has-text("Dark")'));
    await themeToggle.click();

    const badge = page.locator('.resource-category-badge').first();

    // Check badge has sufficient opacity/visibility
    const opacity = await badge.evaluate(el =>
      window.getComputedStyle(el).opacity
    );

    expect(parseFloat(opacity)).toBeGreaterThanOrEqual(0.9);
  });

  test('ribbon visible in both themes', async ({ page }) => {
    const ribbon = page.locator('.affiliate-ribbon').first();

    // Light theme
    const lightToggle = page.locator('[data-theme-toggle]').or(page.locator('button:has-text("Light")'));
    await lightToggle.click();
    await expect(ribbon).toBeVisible();

    // Dark theme
    const darkToggle = page.locator('[data-theme-toggle]').or(page.locator('button:has-text("Dark")'));
    await darkToggle.click();
    await expect(ribbon).toBeVisible();
  });
});

// Accessibility tests
test.describe('Affiliate Grid: Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/top-5-hacking-boeken.html');
  });

  test('CTA links have proper ARIA labels', async ({ page }) => {
    const cta = page.locator('.resource-cta').first();

    const ariaLabel = await cta.getAttribute('aria-label');

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Affiliate');
  });

  test('CTA links have rel="sponsored noopener noreferrer"', async ({ page }) => {
    const cta = page.locator('.resource-cta').first();

    const rel = await cta.getAttribute('rel');

    expect(rel).toContain('sponsored');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  test('CTA links have target="_blank"', async ({ page }) => {
    const cta = page.locator('.resource-cta').first();

    const target = await cta.getAttribute('target');

    expect(target).toBe('_blank');
  });

  test('keyboard navigation works (Tab through CTAs)', async ({ page }) => {
    // Focus first CTA via keyboard
    await page.keyboard.press('Tab');

    // Keep tabbing until we hit a CTA
    let focused = await page.locator(':focus').first();
    let attempts = 0;

    while (attempts < 20) {
      const classes = await focused.getAttribute('class') || '';
      if (classes.includes('resource-cta')) {
        break;
      }
      await page.keyboard.press('Tab');
      focused = page.locator(':focus').first();
      attempts++;
    }

    // Verify we can focus CTA buttons
    const focusedClasses = await focused.getAttribute('class');
    expect(focusedClasses).toContain('resource-cta');
  });
});

// Performance tests
test.describe('Affiliate Grid: Performance', () => {
  test('page loads without layout shift from ribbons', async ({ page }) => {
    await page.goto('/blog/top-5-hacking-boeken.html');

    // Wait for network idle
    await page.waitForLoadState('networkidle');

    // Ribbons should be in final position immediately
    const ribbon = page.locator('.affiliate-ribbon').first();
    const initialBox = await ribbon.boundingBox();

    // Wait a bit
    await page.waitForTimeout(500);

    const finalBox = await ribbon.boundingBox();

    // Position should not have shifted
    expect(Math.abs(initialBox.x - finalBox.x)).toBeLessThan(2);
    expect(Math.abs(initialBox.y - finalBox.y)).toBeLessThan(2);
  });

  test('hover animations are smooth (no jank)', async ({ page }) => {
    await page.goto('/blog/top-5-hacking-boeken.html');

    const cta = page.locator('.resource-cta').first();

    // Check transition property exists
    const transition = await cta.evaluate(el =>
      window.getComputedStyle(el).transition
    );

    expect(transition).toContain('0.2s');
  });

  test('CTA button arrow should be vertically centered', async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');

    const arrowStyles = await page.evaluate(() => {
      const cta = document.querySelector('.resource-cta');
      const after = window.getComputedStyle(cta, '::after');
      return {
        lineHeight: after.lineHeight,
        display: after.display,
        verticalAlign: after.verticalAlign
      };
    });

    expect(arrowStyles.lineHeight).toBe('1');
    expect(arrowStyles.display).toBe('inline-block');
    expect(arrowStyles.verticalAlign).toBe('middle');
  });

  test('CTA buttons should align at same height across cards', async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');

    const buttons = await page.locator('.resource-cta').all();
    expect(buttons.length).toBeGreaterThanOrEqual(3);

    const positions = await Promise.all(buttons.map(b => b.boundingBox()));
    const bottoms = positions.map(p => p.y + p.height);

    // All buttons should have bottom edge within 2px tolerance
    const maxBottom = Math.max(...bottoms);
    const minBottom = Math.min(...bottoms);
    expect(maxBottom - minBottom).toBeLessThan(2);
  });

  test('Featured badge should be present on TryHackMe card', async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');

    const featuredBadge = page.locator('.featured-badge');
    await expect(featuredBadge).toBeVisible();
    await expect(featuredBadge).toHaveText('MEEST POPULAIR');

    // Verify gradient background
    const gradient = await featuredBadge.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundImage;
    });

    expect(gradient).toContain('linear-gradient');
    expect(gradient).toContain('rgb(39, 174, 96)'); // #27ae60
  });

  test('Featured card CTA should be green', async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');

    // Find the featured card CTA (card containing .featured-badge)
    const featuredCta = page.locator('.resource-card:has(.featured-badge) .resource-cta');
    await expect(featuredCta).toBeVisible();

    const bgColor = await featuredCta.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be green (var(--color-success) = #27ae60 or #3fb950 depending on CSS vars)
    expect(bgColor).toMatch(/rgb\((?:39|63), (?:174|185), (?:96|80)\)/); // Accept both variants
  });

  test('All CTA buttons should have uniform text', async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');

    const allButtons = await page.locator('.resource-cta').allTextContents();

    // All should contain "BEKIJK AANBIEDING" (arrow is in CSS ::after)
    allButtons.forEach(text => {
      expect(text.trim()).toBe('BEKIJK AANBIEDING');
    });
  });
});

// CTA Optimization Tests (Sessie 89)
test.describe('Affiliate CTA: Design System Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');
  });

  test('inline affiliate links have arrow indicator', async ({ page }) => {
    // Find inline affiliate link (not in card)
    const inlineLink = page.locator('.blog-post-content .affiliate-link').first();
    await expect(inlineLink).toBeVisible();

    // Check ::after content contains arrow
    const afterContent = await inlineLink.evaluate(el => {
      return window.getComputedStyle(el, '::after').content;
    });

    // Arrow (→) or unicode equivalent or " →" (with space)
    expect(afterContent).toMatch(/→|\\2192|" →"/);
  });

  test('card CTAs use terminal font (design system compliance)', async ({ page }) => {
    const cta = page.locator('.resource-cta').first();

    const fontFamily = await cta.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );

    // Should contain 'JetBrains Mono' or fallback to monospace
    expect(fontFamily).toMatch(/JetBrains Mono|Courier|monospace/i);
  });

  test('card CTAs use theme-aware colors (not hardcoded)', async ({ page }) => {
    const cta = page.locator('.resource-cta').first();

    const bgColor = await cta.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Dark theme: rgb(0, 68, 148) OR Light theme: rgb(26, 102, 52)
    // Accept either theme's value (test runs in default theme)
    expect(bgColor).toMatch(/rgb\(0, 68, 148\)|rgb\(26, 102, 52\)/);
  });

  test('inline affiliate link arrow animates on hover', async ({ page }) => {
    const link = page.locator('.blog-post-content .affiliate-link').first();
    await expect(link).toBeVisible();

    // Hover on link
    await link.hover();

    // Check ::after has transform
    const transform = await link.evaluate(el => {
      const after = window.getComputedStyle(el, '::after');
      return after.transform;
    });

    // Should have translateX(3px) in matrix form
    // Matrix format: matrix(1, 0, 0, 1, 3, 0) where 5th value is X translation
    expect(transform).toContain('matrix');
  });
});

// Phase 3 Visual Refinements Tests (Sessie 89)
test.describe('Affiliate CTA: Phase 3 Visual Refinements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/beste-online-cursussen-ethical-hacking.html');
  });

  test('inline affiliate links have no underline', async ({ page }) => {
    const inlineLink = page.locator('.blog-post-content .affiliate-link').first();
    await expect(inlineLink).toBeVisible();

    const textDecoration = await inlineLink.evaluate(el =>
      window.getComputedStyle(el).textDecoration
    );

    // Should be "none" or "none solid rgb(...)" (no underline)
    expect(textDecoration).toMatch(/^none/);
  });

  test('light mode: regular cards have blue buttons, featured has green', async ({ page }) => {
    // Switch to light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    // Wait for theme transition
    await page.waitForTimeout(100);

    // Regular card (first card - Udemy)
    const regularCta = page.locator('.resource-card').first().locator('.resource-cta');
    await expect(regularCta).toBeVisible();

    const regularBg = await regularCta.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Should be blue (rgb(25, 118, 210) = #1976d2)
    expect(regularBg).toBe('rgb(25, 118, 210)');

    // Featured card (second card - TryHackMe with .featured-badge)
    const featuredCta = page.locator('.resource-card:has(.featured-badge) .resource-cta');
    await expect(featuredCta).toBeVisible();

    const featuredBg = await featuredCta.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Should be green (var(--color-success) = #27ae60)
    expect(featuredBg).toBe('rgb(39, 174, 96)');
  });

  test('dark mode: buttons maintain correct colors (regression test)', async ({ page }) => {
    // Ensure dark theme (default)
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(100);

    // Regular card should be blue in dark mode
    const regularCta = page.locator('.resource-card').first().locator('.resource-cta');
    const regularBg = await regularCta.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Dark mode blue: rgb(0, 68, 148) = #004494
    expect(regularBg).toBe('rgb(0, 68, 148)');

    // Featured card should be green in dark mode
    const featuredCta = page.locator('.resource-card:has(.featured-badge) .resource-cta');
    const featuredBg = await featuredCta.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Should be green (var(--color-success) = #27ae60)
    expect(featuredBg).toBe('rgb(39, 174, 96)');
  });
});
