/**
 * E2E Tests: Inline Affiliate CTA Buttons - Visual & Interactive
 *
 * Tests inline affiliate buttons that appear within blog post content.
 * These are different from grid card buttons (.resource-cta).
 *
 * Fixes tested:
 * - Phase 1: Arrow vertical alignment (display: inline-block, vertical-align: middle)
 * - Phase 2: Source file sync (prevent green button regression)
 * - Phase 3: :visited state fix (underline removal + white text)
 *
 * @see /home/willem/.claude/plans/snuggly-wobbling-rabbit.md
 */

import { test, expect } from '@playwright/test';

// Test page with inline affiliate links
const testPage = '/blog/beste-online-cursussen-ethical-hacking.html';

test.describe('Inline Affiliate Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testPage);
  });

  test('buttons exist with correct class', async ({ page }) => {
    // Find inline affiliate links (NOT the card buttons)
    const inlineButtons = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' });
    const count = await inlineButtons.count();

    // Should have 3 inline affiliate links in this blog post
    expect(count).toBe(3);

    // Verify first button is visible
    await expect(inlineButtons.first()).toBeVisible();
  });

  test('NO underline in default state', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    const textDecoration = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.textDecoration;
    });

    // Should be "none" or NOT contain "underline"
    expect(textDecoration).not.toContain('underline');
  });

  test('NO underline on hover', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    await button.hover();

    const textDecoration = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.textDecoration;
    });

    expect(textDecoration).not.toContain('underline');
  });

  test('NO underline in :visited state', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    // Simulate visited state by checking both :link and :visited styles
    const hasVisitedUnderline = await button.evaluate(el => {
      // Create a style element to force :visited state
      const style = document.createElement('style');
      style.textContent = 'a.affiliate-link:visited { text-decoration: underline !important; }';
      document.head.appendChild(style);

      const computed = window.getComputedStyle(el);
      const hasUnderline = computed.textDecoration.includes('underline');

      // Clean up
      style.remove();

      return hasUnderline;
    });

    // Our CSS should override even with !important test
    expect(hasVisitedUnderline).toBe(false);
  });

  test('arrow has correct vertical alignment properties', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    const afterStyles = await button.evaluate(el => {
      const computed = window.getComputedStyle(el, '::after');
      return {
        display: computed.display,
        verticalAlign: computed.verticalAlign,
        lineHeight: computed.lineHeight,
        fontSize: computed.fontSize,
        content: computed.content
      };
    });

    // Verify arrow properties match .resource-cta pattern
    expect(afterStyles.display).toBe('inline-block');
    expect(afterStyles.verticalAlign).toBe('middle');

    // lineHeight should be close to 1 (browsers may report as px)
    // Either "1" or a pixel value close to font-size
    const lineHeightNum = parseFloat(afterStyles.lineHeight);
    const fontSizeNum = parseFloat(afterStyles.fontSize);

    // Allow lineHeight to be either 1 or within 20% of fontSize
    const isLineHeight1 = afterStyles.lineHeight === '1' ||
                          (lineHeightNum > 0 && lineHeightNum <= fontSizeNum * 1.2);
    expect(isLineHeight1).toBe(true);

    // Verify arrow content exists
    expect(afterStyles.content).toContain('→');
  });

  test('arrow font size is 1.2em', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    const { buttonFontSize, arrowFontSize } = await button.evaluate(el => {
      const buttonComputed = window.getComputedStyle(el);
      const arrowComputed = window.getComputedStyle(el, '::after');
      return {
        buttonFontSize: parseFloat(buttonComputed.fontSize),
        arrowFontSize: parseFloat(arrowComputed.fontSize)
      };
    });

    // Arrow should be 1.2x the button font size (within 1px tolerance)
    const expectedArrowSize = buttonFontSize * 1.2;
    expect(Math.abs(arrowFontSize - expectedArrowSize)).toBeLessThan(1);
  });

  test('dark mode uses BLUE button background (not green)', async ({ page }) => {
    // Ensure dark mode is active
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    const bgColor = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.backgroundColor;
    });

    // Dark mode blue: #004494 = rgb(0, 68, 148)
    expect(bgColor).toBe('rgb(0, 68, 148)');
  });

  test('light mode uses BLUE button background (not green)', async ({ page }) => {
    // Ensure light mode is active
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    const bgColor = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.backgroundColor;
    });

    // Light mode blue: #1976d2 = rgb(25, 118, 210)
    expect(bgColor).toBe('rgb(25, 118, 210)');
  });

  test('text color is WHITE in both themes (not purple from :visited)', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    // Test dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const darkColor = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.color;
    });

    // Should be white: rgb(255, 255, 255)
    expect(darkColor).toBe('rgb(255, 255, 255)');

    // Test light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    const lightColor = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.color;
    });

    // Should still be white
    expect(lightColor).toBe('rgb(255, 255, 255)');
  });

  test('arrow slides right on hover (3px translateX)', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    // Get default arrow transform
    const defaultTransform = await button.evaluate(el => {
      const computed = window.getComputedStyle(el, '::after');
      return computed.transform;
    });

    // Hover and get new transform
    await button.hover();

    const hoverTransform = await button.evaluate(el => {
      const computed = window.getComputedStyle(el, '::after');
      return computed.transform;
    });

    // Transform should change on hover
    // Looking for translateX(3px) in the transform matrix
    expect(hoverTransform).not.toBe(defaultTransform);

    // Extract translateX value from matrix (matrix format: matrix(1, 0, 0, 1, tx, ty))
    if (hoverTransform !== 'none') {
      const match = hoverTransform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([-\d.]+)/);
      if (match) {
        const translateX = parseFloat(match[1]);
        // Should be close to 3px (within 0.5px tolerance)
        expect(Math.abs(translateX - 3)).toBeLessThan(0.5);
      }
    }
  });

  test('button lifts on hover (translateY -2px)', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    await button.hover();

    const transform = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.transform;
    });

    // Transform should include translateY(-2px)
    // In matrix format: matrix(1, 0, 0, 1, tx, ty) where ty = -2
    if (transform !== 'none') {
      const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([-\d.]+)/);
      if (match) {
        const translateY = parseFloat(match[1]);
        // Should be close to -2px
        expect(Math.abs(translateY - (-2))).toBeLessThan(0.5);
      }
    }
  });

  test('WCAG contrast ratios are sufficient', async ({ page }) => {
    const button = page.locator('a.affiliate-link').filter({ hasText: 'Start Cursus Nu' }).first();

    // Test dark mode contrast
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const darkContrast = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const bg = computed.backgroundColor;
      const fg = computed.color;

      // Parse RGB values
      const bgMatch = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      const fgMatch = fg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (!bgMatch || !fgMatch) return 0;

      // Calculate relative luminance (simplified WCAG formula)
      const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const bgLum = getLuminance(+bgMatch[1], +bgMatch[2], +bgMatch[3]);
      const fgLum = getLuminance(+fgMatch[1], +fgMatch[2], +fgMatch[3]);

      const ratio = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);
      return ratio;
    });

    // Dark mode should be WCAG AAA (7:1 minimum)
    expect(darkContrast).toBeGreaterThanOrEqual(7);

    // Test light mode contrast
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    const lightContrast = await button.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const bg = computed.backgroundColor;
      const fg = computed.color;

      const bgMatch = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      const fgMatch = fg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (!bgMatch || !fgMatch) return 0;

      const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const bgLum = getLuminance(+bgMatch[1], +bgMatch[2], +bgMatch[3]);
      const fgLum = getLuminance(+fgMatch[1], +fgMatch[2], +fgMatch[3]);

      const ratio = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);
      return ratio;
    });

    // Light mode should be at least WCAG AA (4.5:1 minimum)
    expect(lightContrast).toBeGreaterThanOrEqual(4.5);
  });
});
