// Quick debug script to test textarea interaction
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to site...');
  await page.goto('https://famous-frangollo-b5a758.netlify.app/');

  // Wait for page load
  await page.waitForTimeout(2000);

  // Close legal modal if present
  try {
    await page.click('button:has-text("Ik begrijp het")', { timeout: 2000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('No legal modal found');
  }

  console.log('Clicking feedback button...');
  await page.click('#feedback-button');
  await page.waitForTimeout(1000);

  console.log('Trying to click textarea...');
  const textarea = page.locator('#feedback-comment');

  // Check if textarea is visible and enabled
  const isVisible = await textarea.isVisible();
  const isEnabled = await textarea.isEnabled();
  const isEditable = await textarea.isEditable();

  console.log('Textarea status:');
  console.log('  - Visible:', isVisible);
  console.log('  - Enabled:', isEnabled);
  console.log('  - Editable:', isEditable);

  // Try to focus and type
  try {
    await textarea.click();
    await page.waitForTimeout(500);
    await textarea.fill('Test text');
    console.log('✅ Successfully typed in textarea!');
  } catch (e) {
    console.log('❌ Failed to type in textarea:', e.message);
  }

  // Check computed styles
  const styles = await textarea.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      pointerEvents: computed.pointerEvents,
      zIndex: computed.zIndex,
      position: computed.position,
      display: computed.display
    };
  });

  console.log('Textarea computed styles:', styles);

  // Wait to inspect manually
  console.log('\nWaiting 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
