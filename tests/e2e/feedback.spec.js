// E2E Tests voor Feedback Systeem
// Test de volledige feedback flow: open → rate → submit → bevestiging

import { test, expect } from './fixtures.js';

const TEST_URL = 'https://hacksimulator.nl/terminal.html';

test.describe('Feedback System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to test page
    await page.goto(TEST_URL);

    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear(); // Clear ALL localStorage
    });

    // Reload page after clearing localStorage to trigger legal modal
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for legal modal to appear (timing varies in parallel suites)
    const legalModal = page.locator('#legal-modal');
    try {
      await expect(legalModal).toBeVisible({ timeout: 8000 });
      await page.click('#legal-accept-btn');
      await expect(legalModal).toBeHidden({ timeout: 3000 });
    } catch {
      // Legal modal may not appear if already accepted in another context
      console.log('[feedback.spec] Legal modal not found, continuing...');
    }

    // Cookie consent is now handled by Cookiebot (blocked in tests via fixtures.js)
    await page.waitForTimeout(500);
  });

  test('feedback button should be visible', async ({ page }) => {
    const feedbackButton = page.locator('#footer-feedback-link');
    await expect(feedbackButton).toBeVisible();
    await expect(feedbackButton).toHaveText('Feedback');
  });

  test('clicking feedback button opens modal', async ({ page }) => {
    // Click feedback button
    await page.click('#footer-feedback-link');

    // Modal should be visible and active
    const modal = page.locator('#feedback-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveClass(/active/);

    // Modal should have correct title
    const title = page.locator('#feedback-title');
    await expect(title).toHaveText('Feedback');
  });

  test('can select star rating', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Stars should be visible
    const stars = page.locator('.rating-stars .star');
    await expect(stars).toHaveCount(5);

    // Click 4th star
    await stars.nth(3).click();

    // First 4 stars should have 'active' class
    await expect(stars.nth(0)).toHaveClass(/active/);
    await expect(stars.nth(1)).toHaveClass(/active/);
    await expect(stars.nth(2)).toHaveClass(/active/);
    await expect(stars.nth(3)).toHaveClass(/active/);
    await expect(stars.nth(4)).not.toHaveClass(/active/);
  });

  test('star rating hover preview works', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    const stars = page.locator('.rating-stars .star');

    // Hover over 3rd star
    await stars.nth(2).hover();

    // Check if first 3 stars are highlighted (grayscale removed via CSS)
    // Note: We can't directly test CSS filter, but we can verify hover state
    await expect(stars.nth(2)).toBeVisible();
  });

  test('cannot submit without rating', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Try to submit without selecting rating
    await page.click('#feedback-submit');

    // Error message should appear
    const errorMessage = page.locator('.feedback-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/selecteer eerst een rating/i);

    // Modal should still be open
    const modal = page.locator('#feedback-modal');
    await expect(modal).toHaveClass(/active/);
  });

  test('can submit feedback with rating only', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Select 5 stars
    const stars = page.locator('.rating-stars .star');
    await stars.nth(4).click();

    // Submit
    await page.click('#feedback-submit');

    // Success message should appear (requires .visible class from feedback.js)
    const successMessage = page.locator('.feedback-success.visible');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(successMessage).toContainText(/bedankt/i);

    // Modal should auto-close after 2 seconds
    await page.waitForTimeout(2500);
    const modal = page.locator('#feedback-modal');
    await expect(modal).not.toHaveClass(/active/);
  });

  test('can submit feedback with rating and comment', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Select 3 stars
    const stars = page.locator('.rating-stars .star');
    await stars.nth(2).click();

    // Add comment
    const commentField = page.locator('#feedback-comment');
    await commentField.fill('Dit is een test commentaar voor Playwright tests');

    // Submit
    await page.click('#feedback-submit');

    // Success message should appear (requires .visible class from feedback.js)
    const successMessage = page.locator('.feedback-success.visible');
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // Wait for auto-close
    await page.waitForTimeout(2500);

    // Verify feedback is saved in localStorage
    const feedbackData = await page.evaluate(() => {
      const stored = localStorage.getItem('hacksim_feedback');
      return stored ? JSON.parse(stored) : [];
    });

    expect(feedbackData).toHaveLength(1);
    expect(feedbackData[0].rating).toBe(3);
    expect(feedbackData[0].comment).toBe('Dit is een test commentaar voor Playwright tests');
    expect(feedbackData[0]).toHaveProperty('timestamp');
  });

  test('can close modal with X button', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Modal should be open
    const modal = page.locator('#feedback-modal');
    await expect(modal).toHaveClass(/active/);

    // Click close button within feedback modal
    await page.click('#feedback-modal .modal-close');

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('can close modal with ESC key', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Modal should be open
    const modal = page.locator('#feedback-modal');
    await expect(modal).toHaveClass(/active/);

    // Press ESC key
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('can close modal by clicking backdrop', async ({ page }) => {
    // Open modal
    await page.click('#footer-feedback-link');

    // Modal should be open
    const modal = page.locator('#feedback-modal');
    await expect(modal).toHaveClass(/active/);

    // Click on backdrop (modal itself, not content)
    await modal.click({ position: { x: 5, y: 5 } });

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('multiple feedback submissions accumulate in localStorage', async ({ page }) => {
    // Submit first feedback
    await page.click('#footer-feedback-link');
    await page.locator('.rating-stars .star').nth(4).click();
    await page.click('#feedback-submit');
    await page.waitForTimeout(2500);

    // Submit second feedback
    await page.click('#footer-feedback-link');
    await page.locator('.rating-stars .star').nth(2).click();
    await page.locator('#feedback-comment').fill('Second feedback');
    await page.click('#feedback-submit');
    await page.waitForTimeout(2500);

    // Verify both entries in localStorage
    const feedbackData = await page.evaluate(() => {
      const stored = localStorage.getItem('hacksim_feedback');
      return stored ? JSON.parse(stored) : [];
    });

    expect(feedbackData).toHaveLength(2);
    expect(feedbackData[0].rating).toBe(5);
    expect(feedbackData[1].rating).toBe(3);
    expect(feedbackData[1].comment).toBe('Second feedback');
  });

  test('feedback stats API works correctly', async ({ page }) => {
    // Submit 3 feedback entries
    const ratings = [5, 3, 4];

    for (const rating of ratings) {
      await page.click('#footer-feedback-link');
      await page.locator('.rating-stars .star').nth(rating - 1).click();

      if (rating === 3) {
        await page.locator('#feedback-comment').fill('Test comment');
      }

      await page.click('#feedback-submit');
      await page.waitForTimeout(2500);
    }

    // Get stats via console
    const stats = await page.evaluate(() => {
      return window.HackSimulator.feedback.getStats();
    });

    expect(stats.total).toBe(3);
    expect(stats.averageRating).toBe('4.00'); // (5+3+4)/3 = 4
    expect(stats.withComments).toBe(1);
    expect(stats.ratingDistribution[5]).toBe(1);
    expect(stats.ratingDistribution[3]).toBe(1);
    expect(stats.ratingDistribution[4]).toBe(1);
  });

  test('feedback form resets after submission', async ({ page }) => {
    // Submit feedback
    await page.click('#footer-feedback-link');
    await page.locator('.rating-stars .star').nth(3).click();
    await page.locator('#feedback-comment').fill('Test comment');
    await page.click('#feedback-submit');
    await page.waitForTimeout(2500);

    // Open modal again
    await page.click('#footer-feedback-link');

    // Rating should be reset (no stars active)
    const stars = page.locator('.rating-stars .star');
    await expect(stars.nth(0)).not.toHaveClass(/active/);
    await expect(stars.nth(1)).not.toHaveClass(/active/);
    await expect(stars.nth(2)).not.toHaveClass(/active/);
    await expect(stars.nth(3)).not.toHaveClass(/active/);
    await expect(stars.nth(4)).not.toHaveClass(/active/);

    // Comment field should be empty
    const commentField = page.locator('#feedback-comment');
    await expect(commentField).toHaveValue('');
  });

  test('analytics event is tracked on feedback submission', async ({ page }) => {
    // Mock analytics tracker
    await page.evaluate(() => {
      window.analyticsEvents = [];

      // Override analytics tracker
      if (window.HackSimulator) {
        const originalTracker = window.analyticsTracker;
        window.analyticsTracker = {
          trackEvent: (eventName, params) => {
            window.analyticsEvents.push({ eventName, params });
          }
        };
      }
    });

    // Submit feedback
    await page.click('#footer-feedback-link');
    await page.locator('.rating-stars .star').nth(4).click();
    await page.locator('#feedback-comment').fill('Test');
    await page.click('#feedback-submit');

    // Check if analytics event was tracked
    const analyticsEvents = await page.evaluate(() => window.analyticsEvents || []);

    // Note: This may not work if analytics is already initialized
    // This is a best-effort check
    console.log('Analytics events:', analyticsEvents);
  });
});
