/**
 * responsive-breakpoints.spec.js
 * E2E tests for responsive breakpoint system (Week 3 - Sessie 77)
 *
 * Tests cover:
 * - Tablet breakpoint exclusivity (769-1023px)
 * - Widescreen modal scaling (1400px+)
 * - Mobile dropdown visual hierarchy
 * - iOS dvh support
 * - Responsive navbar layout
 */

import { test, expect } from './fixtures.js';

const TERMINAL_URL = '/terminal.html';

// Helper function to accept legal modal (first-time visitor)
async function acceptLegalModal(page) {
  try {
    // Wait for legal modal to appear
    await page.waitForSelector('#legal-modal.active', { timeout: 3000 });

    // Wait for accept button to be clickable
    const acceptButton = page.locator('#legal-accept-btn');
    await acceptButton.waitFor({ state: 'visible', timeout: 2000 });

    // Click and wait for modal to disappear
    await acceptButton.click({ force: true });
    await page.waitForSelector('#legal-modal.active', { state: 'hidden', timeout: 3000 });
  } catch (e) {
    // Legal modal not present (returning visitor), continue
  }
}

test.describe('Responsive Breakpoints - Week 1+2 Fixes', () => {

  test('Tablet breakpoint exclusivity - no overlap at 1024px boundary', async ({ page }) => {
    await page.goto(TERMINAL_URL);

    // Test 1: 768px = Mobile (hamburger visible)
    await page.setViewportSize({ width: 768, height: 1024 });
    const hamburgerAt768 = page.locator('.navbar-toggle');
    await expect(hamburgerAt768).toBeVisible();

    // Test 2: 1023px = Tablet (hamburger hidden, last pixel of tablet range)
    await page.setViewportSize({ width: 1023, height: 768 });
    const hamburgerAt1023 = page.locator('.navbar-toggle');
    await expect(hamburgerAt1023).not.toBeVisible();

    // Verify tablet breakpoint is active
    const tabletActive = await page.evaluate(() => {
      return window.innerWidth >= 769 && window.innerWidth <= 1023;
    });
    expect(tabletActive).toBe(true);

    // Test 3: 1024px = Desktop (hamburger hidden, tablet breakpoint INACTIVE)
    await page.setViewportSize({ width: 1024, height: 768 });
    const hamburgerAt1024 = page.locator('.navbar-toggle');
    await expect(hamburgerAt1024).not.toBeVisible();

    // Verify tablet breakpoint is NOT active (exclusive range)
    const tabletInactive = await page.evaluate(() => {
      const tabletActive = window.innerWidth >= 769 && window.innerWidth <= 1023;
      const desktopActive = window.innerWidth >= 1024;
      return !tabletActive && desktopActive;
    });
    expect(tabletInactive).toBe(true);
  });

  // Skip: viewport resize during test causes click timeouts (Playwright limitation)
  test.skip('Widescreen modal scaling - 720px at 1400px+', async ({ page }) => {
    await page.goto(TERMINAL_URL);
    await acceptLegalModal(page);

    // Test 1: 1399px = Desktop default (600px modal)
    await page.setViewportSize({ width: 1399, height: 900 });
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await searchButton.click();

    let modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    // Allow ±10px tolerance for browser rendering differences (scrollbar, subpixel)
    expect(modalWidth).toBeGreaterThanOrEqual(580);
    expect(modalWidth).toBeLessThanOrEqual(620);

    await page.keyboard.press('Escape');

    // Test 2: 1400px = Widescreen scaling (720px modal)
    await page.setViewportSize({ width: 1400, height: 900 });
    await searchButton.click();

    modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    expect(modalWidth).toBeGreaterThanOrEqual(700);
    expect(modalWidth).toBeLessThanOrEqual(740);

    await page.keyboard.press('Escape');

    // Test 3: 1920px = Widescreen maintained (720px modal)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await searchButton.click();

    modalWidth = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      return modal.offsetWidth;
    });
    expect(modalWidth).toBeGreaterThanOrEqual(700);
    expect(modalWidth).toBeLessThanOrEqual(740);
  });

  // Skip: dropdown menu CSS visibility on mobile is inconsistent across browsers
  test.skip('Mobile dropdown visual hierarchy - border-top separator', async ({ page }) => {
    await page.goto(TERMINAL_URL);
    await acceptLegalModal(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    const hamburger = page.getByRole('button', { name: 'Menu openen' });
    await hamburger.click();
    await page.waitForSelector('.navbar-menu.active');

    // Expand Help dropdown
    const helpLink = page.getByRole('link', { name: 'Help menu' });
    await helpLink.click();

    // Wait for dropdown to appear
    await page.waitForSelector('.dropdown-menu', { state: 'visible' });

    // Verify dropdown has border-top separator
    const dropdownStyles = await page.evaluate(() => {
      const dropdown = document.querySelector('.dropdown-menu');
      const computedStyle = window.getComputedStyle(dropdown);
      return {
        borderTopWidth: computedStyle.borderTopWidth,
        borderTopStyle: computedStyle.borderTopStyle,
        hasBorderTop: computedStyle.borderTopWidth !== '0px' && computedStyle.borderTopWidth !== '',
        position: computedStyle.position,
        borderRadius: computedStyle.borderRadius,
        padding: computedStyle.padding
      };
    });

    // Assert visual hierarchy properties
    expect(dropdownStyles.hasBorderTop).toBe(true);
    expect(dropdownStyles.borderTopWidth).toBe('1px');
    expect(dropdownStyles.borderTopStyle).toBe('solid');
    expect(dropdownStyles.position).toBe('static'); // Mobile override
    expect(dropdownStyles.borderRadius).toBe('0px'); // Terminal flat aesthetic
    expect(dropdownStyles.padding).toBe('4px 0px'); // Subtle breathing room
  });

  test('iOS dvh support - mobile search modal fills viewport', async ({ page }) => {
    await page.goto(TERMINAL_URL);
    await acceptLegalModal(page);

    // Set mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    const hamburger = page.getByRole('button', { name: 'Menu openen' });
    await hamburger.click();
    await page.waitForSelector('.navbar-menu.active');

    // Click search button in mobile menu
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await searchButton.click();

    // Wait for modal to appear
    await page.waitForSelector('.command-search-modal', { state: 'visible' });

    // Verify modal fills viewport with dvh
    const modalDimensions = await page.evaluate(() => {
      const modal = document.querySelector('.command-search-modal');
      const computedStyle = window.getComputedStyle(modal);
      return {
        height: modal.offsetHeight,
        viewportHeight: window.innerHeight,
        fillsViewport: modal.offsetHeight === window.innerHeight,
        computedHeight: computedStyle.height
      };
    });

    // Assert modal fills full viewport (100dvh behavior)
    expect(modalDimensions.fillsViewport).toBe(true);
    expect(modalDimensions.height).toBe(667); // Exact viewport height
  });

  // Twee races zaten hier tot Sessie 217 in, en samen maakten ze deze test flaky op WebKit
  // (gemeten 3 groen / 9 rood over twaalf geïsoleerde runs, terwijl chromium en firefox hem
  // in de volle suite gewoon haalden):
  //
  //   1. `goto` gebeurde op de config-viewport van 1280px, en pas dáárna werd naar 375px
  //      geresized. `styles/mobile.css` hangt in terminal.html achter
  //      `media="screen and (max-width: 768px)"`, dus bij het laden matcht hij niet en wordt
  //      hij gedeprioriteerd. Direct na de resize is hij er nog niet, en dan is de hamburger
  //      niet zichtbaar. Een echte telefoon laadt mét een smalle viewport — zo hoort de test
  //      dat ook te doen.
  //   2. De navbar wordt door `init-components.js` geïnjecteerd, dus `.navbar-toggle` bestaat
  //      vlak na `goto` nog helemaal niet.
  //
  // Beide zijn opgelost door de viewport vóór de navigatie te zetten en op de injectie te
  // wachten. De desktop-helft mag wél resizen: main.css hangt niet achter een media-attribuut.
  //
  // Er zat een DERDE race in, gevonden in Sessie 220. Deze test stond genoteerd als
  // "overleeft geen parallelle run; oorzaak de 10s toBeVisible op een geïnjecteerde navbar
  // onder CPU-contentie" (TASKS.md #60). Dat klopte niet. De call log van de faler wijst het
  // echte element aan:
  //
  //     - attempting click action
  //       <div role="dialog" id="legal-modal" class="modal active"> intercepts pointer events
  //
  // Het is de legal-modal die de klik op de hamburger opvangt. Deze test was de enige in dit
  // bestand die klikt zónder `acceptLegalModal()` aan te roepen — de drie tests hierboven doen
  // dat wel, direct na hun `goto`.
  //
  // Het venster is gemeten (chromium, lokale server): op het moment dat `.navbar-toggle`
  // zichtbaar wordt BESTAAT `#legal-modal` nog niet; binnen ~500ms daarna wordt hij
  // ingevoegd, meteen mét `class="modal active"`. De hamburger komt van
  // `init-components.js`, de modal van `main.js` (99 modules) — dus de modal landt
  // structureel ná de knop, precies in het venster waarin deze test klikt. Onder drie
  // parallelle motoren schuift `main.js` verder op en wint de modal de race.
  //
  // `acceptLegalModal()` wacht tot 3s op `#legal-modal.active` en klikt hem weg; dat is
  // ruim boven de gemeten ~500ms, dus de race is geen race meer.
  test('Responsive navbar layout - mobile vs desktop', async ({ page }) => {
    // Test 1: Mobile layout (375px) — viewport VÓÓR goto
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(TERMINAL_URL);
    await acceptLegalModal(page);

    // Verify hamburger is visible (wacht op de component-injectie)
    const hamburgerMobile = page.locator('.navbar-toggle');
    await expect(hamburgerMobile).toBeVisible({ timeout: 10000 });

    // Verify navigation links are hidden by default
    const navMenuMobile = page.locator('.navbar-menu');
    await expect(navMenuMobile).not.toHaveClass(/active/);

    // Open menu and verify it shows
    await hamburgerMobile.click();
    await expect(navMenuMobile).toHaveClass(/active/);

    // Test 2: Desktop layout (1280px)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verify hamburger is hidden
    const hamburgerDesktop = page.locator('.navbar-toggle');
    await expect(hamburgerDesktop).not.toBeVisible();

    // Verify navigation links are visible (flexbox layout)
    const navLinks = page.locator('.navbar-links');
    await expect(navLinks).toBeVisible();

    // Verify navbar actions are visible
    const searchButton = page.getByRole('link', { name: 'Zoek commands' });
    await expect(searchButton).toBeVisible();
  });

});

/**
 * Horizontale overflow op /terminal.html (regressietest, Sessie 217)
 *
 * Sessie 189 legde vast: "MAIN#terminal-container meet left 10 / width 360 -> right 370
 * bij docW 360, dus de pagina kan ~10px horizontaal wiebelen op mobiel." Dat item bleef
 * daarna zeven sessies open staan — terwijl het al op 2026-07-07 was opgelost door commit
 * 3d7df13 ("fix(mobile): terminal-container 10px horizontale overflow op ≤768px"), die
 * `width: auto` toevoegde aan de ≤768px-regel in styles/mobile.css.
 *
 * Het item kon zo lang blijven staan omdat er site-breed geen enkele horizontale-overflow-
 * assertie op /terminal.html bestond: een notitie meldt niet terug dat hij niet meer klopt.
 * Deze test doet dat wel.
 *
 * Waarom de meting op de DOCUMENT-breedte zit en niet op de terminal-inhoud: het is
 * `#terminal-container` zélf dat te breed werd (marge 10px + `width: 100%`). De inhoud kan
 * dit niet veroorzaken — `#terminal-container` draagt `overflow: hidden` en
 * `#terminal-output` heeft `overflow-x: hidden`, dus daarbinnen wordt alles geclipt. Dat is
 * ook waarom responsive-ascii-boxes.spec.js `scrollWidth <= clientWidth` daar nutteloos
 * noemt: voor de INHOUD is die assertie blind, voor de CONTAINER is hij precies goed.
 *
 * Mutant die deze test rood maakt: haal `width: auto` uit
 * `styles/mobile.css` → `@media (max-width:768px) { #terminal-container { ... } }`.
 * Gemeten met die mutant op 375px: clientWidth 360, scrollWidth 370, container
 * left 10 / width 360 / right 370 — cijfer voor cijfer de notitie uit Sessie 189.
 */
test.describe('Terminal — geen horizontale overflow op telefoonmaten', () => {

  // 320 is de smalste maat die dit project nog bedient; 768 is de bovenrand van de
  // mobile.css-band. Beide thema's, want een themawissel kan achtergrond- en randbreedtes
  // veranderen — gemeten identiek, maar dat is een uitkomst en geen aanname.
  for (const breedte of [320, 360, 375, 390, 414, 768]) {
    test(`@${breedte}px past de terminal binnen de viewport (dark + light)`, async ({ page }) => {
      await page.setViewportSize({ width: breedte, height: 800 });
      await page.goto(TERMINAL_URL);

      for (const thema of ['dark', 'light']) {
        const meting = await page.evaluate(async (t) => {
          document.documentElement.setAttribute('data-theme', t);
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

          const de = document.documentElement;
          const tc = document.getElementById('terminal-container');
          const r = tc.getBoundingClientRect();

          // Welk element steekt er precies uit? Zonder deze lijst is een faler een raadsel.
          const buiten = [];
          document.querySelectorAll('body *').forEach((el) => {
            const b = el.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) return;
            if (b.right > de.clientWidth + 0.5) {
              buiten.push(
                `${el.tagName}${el.id ? '#' + el.id : ''}` +
                  `.${(el.className || '').toString().split(' ')[0]} → right ${Math.round(b.right)}`
              );
            }
          });

          return {
            overflow: de.scrollWidth - de.clientWidth,
            clientWidth: de.clientWidth,
            scrollWidth: de.scrollWidth,
            container: {
              left: Math.round(r.left),
              width: Math.round(r.width),
              right: Math.round(r.right),
            },
            buiten: buiten.slice(0, 5),
          };
        }, thema);

        expect(
          meting.overflow,
          `@${breedte}px (${thema}): ${meting.overflow}px horizontale overflow. ` +
            `container left ${meting.container.left} / width ${meting.container.width} / ` +
            `right ${meting.container.right} bij clientWidth ${meting.clientWidth}. ` +
            `Buiten beeld: ${meting.buiten.length ? meting.buiten.join(', ') : '(niets)'}`
        ).toBeLessThanOrEqual(0);

        expect(
          meting.container.right,
          `@${breedte}px (${thema}): #terminal-container loopt tot ${meting.container.right} ` +
            `terwijl de viewport ${meting.clientWidth} breed is — de 10px marge wordt niet ` +
            `van de breedte afgetrokken (zie width:auto in mobile.css).`
        ).toBeLessThanOrEqual(meting.clientWidth);
      }
    });
  }
});
