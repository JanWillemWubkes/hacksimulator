// Advanced textarea interaction debug script
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Starting textarea interaction debug...\n');

  // Navigate to live site
  await page.goto('https://famous-frangollo-b5a758.netlify.app/');
  await page.waitForTimeout(2000);

  // Handle legal modal
  try {
    await page.click('#legal-accept-btn', { timeout: 3000 });
    console.log('✅ Legal modal closed');
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log('ℹ️  No legal modal (already accepted)');
  }

  // Handle cookie banner
  try {
    await page.waitForTimeout(2500);
    await page.click('#cookie-accept', { timeout: 2000 });
    console.log('✅ Cookie banner dismissed');
  } catch (e) {
    console.log('ℹ️  No cookie banner');
  }

  // Open feedback modal
  console.log('\n🔵 Opening feedback modal...');
  await page.click('#feedback-button');
  await page.waitForTimeout(1000);

  // Get textarea element
  const textarea = page.locator('#feedback-comment');

  // Check basic properties
  console.log('\n📊 Textarea Properties:');
  const props = await textarea.evaluate(el => ({
    visible: el.offsetParent !== null,
    enabled: !el.disabled,
    readonly: el.readOnly,
    display: window.getComputedStyle(el).display,
    visibility: window.getComputedStyle(el).visibility,
    pointerEvents: window.getComputedStyle(el).pointerEvents,
    zIndex: window.getComputedStyle(el).zIndex,
    position: window.getComputedStyle(el).position,
    opacity: window.getComputedStyle(el).opacity
  }));
  console.log(props);

  // Check for overlapping elements
  console.log('\n🎯 Elements at textarea position:');
  const elementsAtPoint = await page.evaluate(() => {
    const textarea = document.getElementById('feedback-comment');
    const rect = textarea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const elementsAtCenter = document.elementsFromPoint(centerX, centerY);
    return elementsAtCenter.map(el => ({
      tag: el.tagName,
      id: el.id || '(no id)',
      className: el.className || '(no class)',
      zIndex: window.getComputedStyle(el).zIndex,
      pointerEvents: window.getComputedStyle(el).pointerEvents
    }));
  });
  console.log('Elements stacked at textarea center (top to bottom):');
  elementsAtPoint.forEach((el, i) => {
    console.log(`  ${i}: <${el.tag}> id="${el.id}" class="${el.className}" z-index=${el.zIndex} pointer-events=${el.pointerEvents}`);
  });

  // Check parent modal state
  console.log('\n🪟 Parent Modal State:');
  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('feedback-modal');
    const modalContent = modal?.querySelector('.modal-content');
    return {
      modalExists: !!modal,
      modalClasses: modal?.className || 'N/A',
      modalZIndex: modal ? window.getComputedStyle(modal).zIndex : 'N/A',
      modalPointerEvents: modal ? window.getComputedStyle(modal).pointerEvents : 'N/A',
      contentZIndex: modalContent ? window.getComputedStyle(modalContent).zIndex : 'N/A',
      contentPointerEvents: modalContent ? window.getComputedStyle(modalContent).pointerEvents : 'N/A'
    };
  });
  console.log(modalState);

  // Check for backdrop issues
  console.log('\n🚧 Backdrop Check:');
  const backdropCheck = await page.evaluate(() => {
    const legalBackdrop = document.getElementById('legal-modal-backdrop');
    const cookieConsent = document.getElementById('cookie-consent');
    return {
      legalBackdropExists: !!legalBackdrop,
      legalBackdropVisible: legalBackdrop ? legalBackdrop.offsetParent !== null : false,
      legalBackdropZIndex: legalBackdrop ? window.getComputedStyle(legalBackdrop).zIndex : 'N/A',
      cookieConsentExists: !!cookieConsent,
      cookieConsentVisible: cookieConsent ? cookieConsent.offsetParent !== null : false,
      cookieConsentZIndex: cookieConsent ? window.getComputedStyle(cookieConsent).zIndex : 'N/A'
    };
  });
  console.log(backdropCheck);

  // Try different interaction methods
  console.log('\n🧪 Testing Interaction Methods:');

  // Method 1: Direct click
  try {
    await textarea.click({ timeout: 2000 });
    console.log('✅ Method 1: Direct click succeeded');
  } catch (e) {
    console.log('❌ Method 1: Direct click failed -', e.message);
  }

  await page.waitForTimeout(500);

  // Method 2: Force click
  try {
    await textarea.click({ force: true, timeout: 2000 });
    console.log('✅ Method 2: Force click succeeded');
  } catch (e) {
    console.log('❌ Method 2: Force click failed -', e.message);
  }

  await page.waitForTimeout(500);

  // Method 3: Focus via JavaScript
  try {
    await textarea.evaluate(el => el.focus());
    console.log('✅ Method 3: JavaScript focus succeeded');
  } catch (e) {
    console.log('❌ Method 3: JavaScript focus failed -', e.message);
  }

  await page.waitForTimeout(500);

  // Method 4: Check focus state
  const focusState = await page.evaluate(() => {
    const textarea = document.getElementById('feedback-comment');
    return {
      activeElement: document.activeElement?.id || document.activeElement?.tagName || 'unknown',
      textareaHasFocus: document.activeElement === textarea,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd
    };
  });
  console.log('\n🎯 Focus State:', focusState);

  // Try typing with different methods
  console.log('\n⌨️  Testing Typing Methods:');

  // Method 1: Playwright fill
  try {
    await textarea.fill('Test via fill');
    const value1 = await textarea.inputValue();
    console.log(`✅ Method 1 (fill): Success - value="${value1}"`);
  } catch (e) {
    console.log('❌ Method 1 (fill): Failed -', e.message);
  }

  await page.waitForTimeout(500);
  await textarea.evaluate(el => el.value = ''); // Clear

  // Method 2: Playwright type
  try {
    await textarea.click();
    await page.keyboard.type('Test via keyboard.type');
    const value2 = await textarea.inputValue();
    console.log(`✅ Method 2 (keyboard.type): Success - value="${value2}"`);
  } catch (e) {
    console.log('❌ Method 2 (keyboard.type): Failed -', e.message);
  }

  await page.waitForTimeout(500);
  await textarea.evaluate(el => el.value = ''); // Clear

  // Method 3: Direct JavaScript
  try {
    await textarea.evaluate(el => {
      el.value = 'Test via JavaScript';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const value3 = await textarea.inputValue();
    console.log(`✅ Method 3 (JavaScript): Success - value="${value3}"`);
  } catch (e) {
    console.log('❌ Method 3 (JavaScript): Failed -', e.message);
  }

  // Check event listeners
  console.log('\n👂 Event Listeners:');
  const listeners = await page.evaluate(() => {
    const textarea = document.getElementById('feedback-comment');
    const modal = document.getElementById('feedback-modal');

    // Get all event types that might interfere
    const checkEvents = ['click', 'mousedown', 'mouseup', 'focus', 'blur', 'keydown', 'keyup', 'input'];

    return {
      textareaListeners: 'Cannot enumerate (browser security)',
      modalListeners: 'Cannot enumerate (browser security)',
      note: 'Event listeners are not directly accessible, but we can check if events fire'
    };
  });
  console.log(listeners);

  console.log('\n⏸️  Pausing for manual inspection (60 seconds)...');
  console.log('Try typing in the textarea manually and observe behavior');
  await page.waitForTimeout(60000);

  await browser.close();
  console.log('\n✅ Debug session complete');
})();
