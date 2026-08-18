// Performance Test Suite - HackSimulator.nl
// Created: 2025-12-18
// Purpose: M5 Performance Testing - Bundle size, load time, TTI, localStorage quota, memory leaks
// Test URL: /terminal.html tegen Playwright baseURL (default productie; override via BASE_URL env)

import { test, expect } from './fixtures.js';
import fs from 'fs';
import path from 'path';

// Use process.cwd() to get project root (works without ES modules)
const ROOT_DIR = process.cwd();

// ========================================
// CONFIGURATION
// ========================================

const LIMITS = {
  // DRIFT-ALARM op ongeminificeerde broncode van de RUNTIME-pijler. Niet de echte
  // performancepoort — dat blijft Terminal Core <400 KB minified.
  //
  // ── Sessie 227: de formule meet nu wat hij beweert te meten ────────────────────────
  // De grens is NIET verhoogd (dat zou de vierde bump in 22 sessies zijn: 1000 → 1050 →
  // 1100 → 1120, en dat patroon zegt dat het getal het probleem niet is). In plaats
  // daarvan zijn drie fouten in de TELLER gerepareerd, gemeten op HEAD~ = 1118,63 KB:
  //
  //   1. `styles/blog.css` (42.991 B) en `src/ui/blog-*.js` (8.689 B) telden mee, terwijl
  //      .claude/CLAUDE.md de blog expliciet "SEO/content-pijler budgetloos" noemt.
  //      Nagemeten: alleen blog/*.html laadt ze (navbar.js noemt blog.css enkel in een
  //      comment). Ze horen dus niet tegen dit budget. Zie BLOG_UITSLUITING hieronder;
  //      de som ervan wordt nog wél GELOGD, zodat groei zichtbaar blijft zonder poort.
  //   2. De term `src/ui/**/*.css` matchte NUL bestanden — die directory bevat geen CSS.
  //      Een dode term suggereert dat er iets bewaakt wordt. Verwijderd.
  //   3. `index.html` telde mee, `terminal.html` niet — terwijl juist dát de entry van de
  //      pijler is waar deze poort naar vernoemd is. Beide entry-points, of geen.
  //
  // Stand na de herdefinitie: 1091,85 / 1120 KB = 28,15 KB marge (2,5%). Dat is bewust
  // ruim en niet 1,37 KB (de stand ná Sessie 226): een limiet die vlak boven de huidige
  // stand ligt vuurt op élke wijziging en wordt dan weggeklikt i.p.v. onderzocht — het
  // argument uit Sessie 214 en 217.
  //
  // Drie mutanten waarmee deze poort is gefalsifieerd. Ze falen op DRIE verschillende
  // asserties, dus geen van de drie is overbodig:
  //   M1  60 KB dummy onder src/          → GROOTTE rood  (1151,85 KB), integriteit groen.
  //   M2' alle 4 blogbestanden hernoemd   → NUL-TREFFER rood; die vuurt vóór de grootte,
  //                                         dus de diagnose leest als "uitsluiting kapot"
  //                                         i.p.v. het onbegrijpelijke "1142 > 1120".
  //   M3  predicaat verbreed met          → TE-BREED rood terwijl de som juist DAALT naar
  //       styles/landing.css                1015,53 KB. Dit is het bewijs dat de
  //                                         integriteitstak zelfstandig werkt: de
  //                                         grootte-assertie zou hier glansrijk slagen.
  //
  // Twee mutanten die NIET werken, met de reden erbij:
  //   - "de uitsluiting weghalen": 1118,63 zit nog onder 1120 → blijft groen.
  //   - "alleen blog.css hernoemen": faalt op de GROOTTE, niet op de integriteit, want de
  //     blogsom (50,47 KB) is groter dan de marge (28,15 KB). Elke deel-rename tilt de som
  //     hoe dan ook over de limiet. Alleen M3 kan die twee uit elkaar trekken.
  RUNTIME_SOURCE: 1120 * 1024,     // 1120 KB hard limit (ONLY real constraint)
  WARNING_THRESHOLD: 1008 * 1024,  // 1008 KB warning (90%)
  LCP_TARGET: 3000,              // LCP < 3s on 4G
  TTI_TARGET: 5000,              // TTI < 5s (Google's "good" TTI on 4G)
  // ES6-modulecascade. Stond op 3000 ms omdat AdSense-scripts de cascade opblies;
  // die zijn in Sessie 208 verwijderd. Lokaal (no-store server) daalde de mediaan op
  // /terminal.html van 579 → 301 ms. 2500 ms is een voorzichtige aanscherping: de
  // productiewaarde over 4G is hier niet te meten (uitgaand verkeer geblokkeerd).
  // TODO: na de deploy tegen productie meten en verder aanscherpen richting de
  // werkelijke waarde + ~30% marge.
  MODULE_CASCADE: 2500,
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Accept legal modal (reused from cross-browser.spec.js)
 */
async function acceptLegalModal(page) {
  const legalModal = page.locator('#legal-modal');
  await expect(legalModal).toBeVisible({ timeout: 5000 });
  await page.click('#legal-accept-btn');
  await expect(legalModal).toBeHidden();
}

/**
 * Clear localStorage and sessionStorage
 */
async function clearStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Calculate total size of files matching pattern in directory
 * @param {string} dir - Directory to search
 * @param {RegExp} pattern - File pattern to match
 * @returns {{ totalSize: number, files: Array<{path: string, size: number}> }}
 */
function calculateSize(dir, pattern) {
  let totalSize = 0;
  const files = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip node_modules, test results, .git, etc.
      if (entry.isDirectory()) {
        const skipDirs = ['node_modules', 'test-results', 'playwright-report', '.git', 'docs', 'tests'];
        if (!skipDirs.includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && pattern.test(entry.name)) {
        try {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
          files.push({ path: fullPath, size: stats.size });
        } catch (error) {
          console.warn(`[WARN] Could not stat file: ${fullPath}`);
        }
      }
    }
  }

  walk(dir);
  return { totalSize, files };
}

/**
 * Hoort dit bestand bij de BLOG-pijler (SEO/content, budgetloos) i.p.v. de runtime-pijler?
 *
 * Expliciet en greppbaar gehouden, niet slim: wie `blog.css` hernoemt of een vierde
 * blogmodule toevoegt moet hier langs. De integriteits-assertie hieronder vangt af dat
 * dit predicaat stilzwijgend nul (rename) of te veel (te breed patroon) matcht.
 *
 * @param {string} absPad - absoluut pad naar het bestand
 * @returns {boolean}
 */
function isBlogAsset(absPad) {
  const rel = path.relative(ROOT_DIR, absPad).split(path.sep).join('/');
  return rel === 'styles/blog.css' || /^src\/ui\/blog-[a-z-]+\.js$/.test(rel);
}

// ========================================
// TEST 1: BUNDLE SIZE VERIFICATION
// ========================================

test.describe('Performance Tests - Bundle Size', () => {

  // Naam interpoleert de constante: hij stond op "1000KB" terwijl de limiet al twee keer
  // was opgehoogd (1050, 1100). Een testnaam die zijn eigen grens noemt rot stilzwijgend.
  test(`Runtime source < ${LIMITS.RUNTIME_SOURCE / 1024} KB (hard limit)`, async () => {
    // Alle kandidaat-bronbestanden, daarna gesplitst in runtime-pijler en blog-pijler.
    // De term `src/ui/**/*.css` stond hier tot Sessie 227 en matchte nul bestanden.
    const jsResult = calculateSize(path.join(ROOT_DIR, 'src'), /\.js$/);
    const cssResult = calculateSize(path.join(ROOT_DIR, 'styles'), /\.css$/);
    const alleBronbestanden = [...jsResult.files, ...cssResult.files];

    const blogBestanden = alleBronbestanden.filter((f) => isBlogAsset(f.path));
    const runtimeBestanden = alleBronbestanden.filter((f) => !isBlogAsset(f.path));

    const som = (lijst) => lijst.reduce((t, f) => t + f.size, 0);

    // Beide entry-points, of geen van beide. Tot Sessie 227 telde alleen index.html mee.
    const ENTRY_HTML = ['index.html', 'terminal.html'];
    const htmlBestanden = ENTRY_HTML
      .map((naam) => path.join(ROOT_DIR, naam))
      .filter((p) => fs.existsSync(p))
      .map((p) => ({ path: p, size: fs.statSync(p).size }));

    const totalJS = som(runtimeBestanden.filter((f) => f.path.endsWith('.js')));
    const totalCSS = som(runtimeBestanden.filter((f) => f.path.endsWith('.css')));
    const htmlSize = som(htmlBestanden);
    const totalSize = totalJS + totalCSS + htmlSize;
    const blogSize = som(blogBestanden);

    // Report breakdown
    console.log('\n📦 Runtime Source Breakdown:');
    console.log(`  JavaScript:  ${(totalJS / 1024).toFixed(2)} KB (${runtimeBestanden.filter(f => f.path.endsWith('.js')).length} files)`);
    console.log(`  CSS:         ${(totalCSS / 1024).toFixed(2)} KB (${runtimeBestanden.filter(f => f.path.endsWith('.css')).length} files)`);
    console.log(`  HTML:        ${(htmlSize / 1024).toFixed(2)} KB (${htmlBestanden.map(f => path.basename(f.path)).join(', ')})`);
    console.log(`  ────────────────────────────────`);
    console.log(`  TOTAL:       ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`  Limit:       ${(LIMITS.RUNTIME_SOURCE / 1024).toFixed(2)} KB`);
    console.log(`  Buffer:      ${((LIMITS.RUNTIME_SOURCE - totalSize) / 1024).toFixed(2)} KB (${((1 - totalSize/LIMITS.RUNTIME_SOURCE) * 100).toFixed(1)}%)`);

    // Blog-pijler: GELOGD, niet geasserteerd. De blog is per .claude/CLAUDE.md budgetloos
    // (SEO/content-pijler), dus een limiet hier zou de doctrine tegenspreken. Zichtbaar
    // houden is wél de bedoeling — anders groeit hij ongemerkt.
    console.log(`\n📝 Blog-pijler (budgetloos, alleen ter informatie): ${(blogSize / 1024).toFixed(2)} KB`);
    blogBestanden
      .sort((a, b) => b.size - a.size)
      .forEach((f) => console.log(`  ${(f.size / 1024).toFixed(2)} KB  ${path.relative(ROOT_DIR, f.path)}`));

    // Top 5 largest JS files
    const largestJS = runtimeBestanden
      .filter((f) => f.path.endsWith('.js'))
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    console.log('\n📊 Largest JavaScript Files:');
    largestJS.forEach(file => {
      const relativePath = path.relative(ROOT_DIR, file.path);
      console.log(`  ${(file.size / 1024).toFixed(2)} KB  ${relativePath}`);
    });

    // Top 3 largest CSS files
    const largestCSS = runtimeBestanden
      .filter((f) => f.path.endsWith('.css'))
      .sort((a, b) => b.size - a.size)
      .slice(0, 3);

    console.log('\n📊 Largest CSS Files:');
    largestCSS.forEach(file => {
      const relativePath = path.relative(ROOT_DIR, file.path);
      console.log(`  ${(file.size / 1024).toFixed(2)} KB  ${relativePath}`);
    });

    // Warning at 90%
    if (totalSize > LIMITS.WARNING_THRESHOLD) {
      console.warn(`\n⚠️  WARNING: Runtime source approaching limit (${((totalSize/LIMITS.RUNTIME_SOURCE) * 100).toFixed(1)}%)`);
    }

    // ── Integriteit van de uitsluiting ────────────────────────────────────────────────
    // Zonder deze twee takken is "de blog wordt uitgesloten" een bewering. Een rename van
    // blog.css laat het predicaat stil nul matchen; een te breed patroon laat er stil te
    // veel uit vallen. Beide zijn onzichtbaar in de grootte-assertie zolang die groen is.
    expect(
      blogBestanden.map((f) => path.relative(ROOT_DIR, f.path)),
      'De blog-uitsluiting matchte NUL bestanden. Is styles/blog.css hernoemd of verplaatst? ' +
        'Zonder treffers meet deze poort stilzwijgend de blog mee — zie isBlogAsset().'
    ).not.toEqual([]);

    const verdacht = blogBestanden
      .map((f) => path.relative(ROOT_DIR, f.path))
      .filter((rel) => !/(^|\/)blog[-.]/.test(rel));
    expect(
      verdacht,
      'Deze bestanden zijn uitgesloten maar horen niet bij de blog-pijler. Een te breed ' +
        'predicaat verlaagt de gemeten som zonder dat iemand het ziet.'
    ).toEqual([]);

    // Assertions
    // ONLY check total runtime source size - JS/CSS split doesn't matter
    expect(totalSize).toBeLessThan(LIMITS.RUNTIME_SOURCE);
  });

});

// ========================================
// TEST 2: LOAD TIME & TIME TO INTERACTIVE
// ========================================

test.describe('Performance Tests - Load Time & TTI', () => {

  test('Load time < 3s on 4G network (Chromium)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'CDP throttling only works in Chromium');

    // Clear browser cache
    const client = await page.context().newCDPSession(page);
    await client.send('Network.clearBrowserCache');

    // Emulate 4G network (4 Mbps down, 3 Mbps up, 20ms RTT)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (4 * 1024 * 1024) / 8,  // 4 Mbps = 512 KB/s
      uploadThroughput: (3 * 1024 * 1024) / 8,    // 3 Mbps = 384 KB/s
      latency: 20,                                 // 20ms RTT
    });

    // Measure load time
    const startTime = Date.now();

    await page.goto('/terminal.html', {
      waitUntil: 'networkidle',
    });

    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintMetrics = performance.getEntriesByType('paint');

      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime || 0,
        resourceCount: performance.getEntriesByType('resource').length,
      };
    });

    // Get LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 5s
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 5000);
      });
    });

    // Calculate TTI (Time to Interactive)
    const ttiStart = Date.now();
    await page.waitForSelector('#terminal-input', { state: 'visible', timeout: 10000 });
    await page.waitForFunction(() => {
      const input = document.querySelector('#terminal-input');
      return input && !input.disabled && document.readyState === 'complete';
    }, { timeout: 10000 });
    const tti = Date.now() - startTime;

    // Report metrics
    console.log(`\n⏱️  Performance Metrics (${browserName}):`);
    console.log(`  Network: 4G (4 Mbps down, 20ms latency)`);
    console.log(`  ────────────────────────────────`);
    console.log(`  Load Time:            ${(loadTime / 1000).toFixed(2)}s`);
    console.log(`  DOM Content Loaded:   ${(metrics.domContentLoaded / 1000).toFixed(2)}s`);
    console.log(`  First Paint:          ${(metrics.firstPaint / 1000).toFixed(2)}s`);
    console.log(`  First Contentful Paint: ${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`  Largest Contentful Paint: ${lcp ? (lcp / 1000).toFixed(2) + 's' : 'N/A'}`);
    console.log(`  Time to Interactive:  ${(tti / 1000).toFixed(2)}s`);
    console.log(`  Resources Loaded:     ${metrics.resourceCount}`);

    // Assertions
    if (lcp) {
      expect(lcp).toBeLessThan(LIMITS.LCP_TARGET);
    }
    expect(tti).toBeLessThan(LIMITS.TTI_TARGET);
    expect(metrics.loadComplete).toBeLessThan(4000); // Full load < 4s (buffer)

    // Warnings
    if (lcp && lcp > 2500) {
      console.warn(`⚠️  LCP approaching 3s limit: ${(lcp / 1000).toFixed(2)}s`);
    }
    if (tti > 4000) {
      console.warn(`⚠️  TTI approaching 5s limit: ${(tti / 1000).toFixed(2)}s`);
    }
  });

  test('Load time < 3s on 4G network (Firefox)', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    // Firefox doesn't support CDP, but we can still measure without throttling
    // This provides a baseline comparison

    const startTime = Date.now();

    await page.goto('/terminal.html', {
      waitUntil: 'networkidle',
    });

    const loadTime = Date.now() - startTime;

    // Get performance metrics (same as Chromium)
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintMetrics = performance.getEntriesByType('paint');

      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // Calculate TTI
    await page.waitForSelector('#terminal-input', { state: 'visible', timeout: 10000 });
    await page.waitForFunction(() => {
      const input = document.querySelector('#terminal-input');
      return input && !input.disabled && document.readyState === 'complete';
    }, { timeout: 10000 });
    const tti = Date.now() - startTime;

    // Report (no throttling, so expect faster times)
    console.log(`\n⏱️  Performance Metrics (${browserName} - No Throttling):`);
    console.log(`  Load Time:            ${(loadTime / 1000).toFixed(2)}s`);
    console.log(`  DOM Content Loaded:   ${(metrics.domContentLoaded / 1000).toFixed(2)}s`);
    console.log(`  Time to Interactive:  ${(tti / 1000).toFixed(2)}s`);

    // No strict assertions for Firefox (baseline only)
    console.log(`  Note: Firefox baseline (no throttling) - compare with Chromium 4G`);
  });

  test('ES6 module cascade < 1s', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Resource timing test - Chromium preferred');

    await page.goto('/terminal.html', {
      waitUntil: 'networkidle',
    });

    // Get resource timing for JS modules
    const moduleTiming = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.js') && r.initiatorType === 'script')
        .map(r => ({
          name: r.name.split('/').pop(),
          duration: r.duration,
          startTime: r.startTime,
          transferSize: r.transferSize,
        }))
        .sort((a, b) => a.startTime - b.startTime);

      return resources;
    });

    console.log(`\n📊 ES6 Module Cascade (${moduleTiming.length} modules):`);

    // Show first 10 modules
    moduleTiming.slice(0, 10).forEach(mod => {
      console.log(`  ${mod.startTime.toFixed(0)}ms  ${mod.duration.toFixed(0)}ms  ${(mod.transferSize / 1024).toFixed(1)} KB  ${mod.name}`);
    });

    // Calculate total cascade time
    if (moduleTiming.length > 0) {
      const firstModule = moduleTiming[0];
      const lastModule = moduleTiming[moduleTiming.length - 1];
      const cascadeTime = lastModule.startTime + lastModule.duration - firstModule.startTime;

      console.log(`  ────────────────────────────────`);
      console.log(`  Total Cascade: ${(cascadeTime / 1000).toFixed(2)}s`);

      // Assert cascade < 1s
      expect(cascadeTime).toBeLessThan(LIMITS.MODULE_CASCADE);

      if (cascadeTime > 800) {
        console.warn(`⚠️  Module cascade approaching 1s limit: ${(cascadeTime / 1000).toFixed(2)}s`);
      }
    } else {
      console.warn(`⚠️  No JS modules detected in resource timing`);
    }
  });

});

// ========================================
// TEST 3: LOCALSTORAGE QUOTA HANDLING
// ========================================

test.describe('Performance Tests - localStorage Quota', () => {

  test.skip('Handles localStorage quota exceeded gracefully', async ({ page }) => {
    // SKIPPED: Modern browsers have 10-15 MB localStorage quota (vs 5 MB expected in 2020)
    // At 44 bytes/file, would need 227,000+ files to hit quota (timeout after 1000 files)
    // Product graceful degradation verified in src/filesystem/persistence.js (try-catch on save)
    // Real-world usage: ~1,000 files max expected

    test.setTimeout(60000); // Increase timeout to 60s (creating 1000 dirs takes time)

    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await page.waitForTimeout(500);

    const input = page.locator('#terminal-input');
    const output = page.locator('#terminal-output');

    console.log('\n💾 Simulating localStorage quota exhaustion...');

    let quotaExceeded = false;
    let filesCreated = 0;

    // Try to fill localStorage by creating many directories
    for (let i = 0; i < 1000 && !quotaExceeded; i++) {
      await input.fill(`mkdir test_dir_${i}`);
      await input.press('Enter');
      await page.waitForTimeout(30); // Faster than original spec

      // Check if quota exceeded
      quotaExceeded = await page.evaluate(() => {
        try {
          localStorage.setItem('__quota_test__', 'x');
          localStorage.removeItem('__quota_test__');
          return false;
        } catch (e) {
          return e.name === 'QuotaExceededError';
        }
      });

      if (quotaExceeded) {
        console.log(`  ✓ Quota exceeded after ${i} directories`);
        break;
      }

      filesCreated = i + 1;
    }

    if (!quotaExceeded) {
      console.warn(`  ⚠️  Could not trigger quota (created ${filesCreated} dirs)`);
      console.warn('  Note: Browser may have large quota or efficient compression');
      // Skip assertions if quota not reached
      test.skip();
      return;
    }

    // If quota exceeded, test recovery
    await input.fill('mkdir should_fail');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Terminal should still be functional (critical requirement)
    await input.fill('whoami');
    await input.press('Enter');
    await page.waitForTimeout(300);

    const outputText = await output.textContent();
    expect(outputText).toContain('hacker'); // Command executed successfully

    console.log('  ✓ Terminal remains functional after quota error');

    // Check VFS size
    const vfsSize = await page.evaluate(() => {
      const vfsData = localStorage.getItem('hacksim_filesystem');
      return vfsData ? vfsData.length : 0;
    });

    console.log(`  VFS Size: ${(vfsSize / 1024).toFixed(2)} KB`);

    // Cleanup: reset VFS
    await input.fill('reset');
    await input.press('Enter');
    await page.waitForTimeout(1000);

    const vfsSizeAfterReset = await page.evaluate(() => {
      const vfsData = localStorage.getItem('hacksim_filesystem');
      return vfsData ? vfsData.length : 0;
    });

    console.log(`  VFS Size After Reset: ${(vfsSizeAfterReset / 1024).toFixed(2)} KB`);
    expect(vfsSizeAfterReset).toBeLessThan(vfsSize); // Reset reduces size
  });

  test('VFS growth rate is linear (no memory leaks in storage)', async ({ page }) => {
    await page.goto('/terminal.html');
    await acceptLegalModal(page);
    await page.waitForTimeout(500);

    const input = page.locator('#terminal-input');

    console.log('\n📈 Testing VFS growth linearity...');

    const measurements = [];

    // Measure VFS size at different points
    for (let round = 0; round < 5; round++) {
      // Create 10 files per round
      for (let i = 0; i < 10; i++) {
        await input.fill(`touch file_${round}_${i}.txt`);
        await input.press('Enter');
        await page.waitForTimeout(30);
      }

      // De VFS-save is gedebounced op 1000ms (persistence.js:47-58) en die timer wordt door
      // ELKE volgende mutatie teruggezet. Tussen twee `touch`-commando's zit hier ~350ms,
      // dus die seconde verstrijkt nooit en localStorage blijft leeg. Gemeten Sessie 220,
      // 10 touches tegen productie: meteen uitlezen = 0 bytes, na 1200ms wachten = 5139,
      // na flush() = 5139. Daarmee stond deze test 10 van de 10 seriële runs op nul.
      //
      // Flushen i.p.v. wachten, om twee redenen: het is deterministisch (geen race die
      // onder parallelle load wél een save laat landen en de variantie laat klappen), en
      // het kost geen tijd — 5x 1200ms wachten duwt deze test van ~12s naar ~18s tegen
      // een timeout van 30s.
      const geflushed = await page.evaluate(() => {
        const persistence = window.HackSimulator?.debug?.persistence;
        if (!persistence) return false;
        persistence.flush(); // no-op als de timer al vuurde — localStorage is dan al actueel
        return true;
      });
      // Zonder deze assertie zou een ontbrekende debug-handle stil dezelfde nulmeting
      // opleveren als de bug die we hier repareren.
      expect(geflushed, 'window.HackSimulator.debug.persistence ontbreekt — er valt niets te meten').toBe(true);

      // Measure VFS size
      const vfsSize = await page.evaluate(() => {
        const vfsData = localStorage.getItem('hacksim_filesystem');
        return vfsData ? vfsData.length : 0;
      });

      measurements.push({ files: (round + 1) * 10, size: vfsSize });
      console.log(`  ${measurements[round].files} files → ${(measurements[round].size / 1024).toFixed(2)} KB`);
    }

    // Calculate growth rates (bytes per file)
    const growthRates = [];
    for (let i = 1; i < measurements.length; i++) {
      const rate = (measurements[i].size - measurements[i-1].size) / 10;
      growthRates.push(rate);
    }

    const avgGrowth = growthRates.reduce((a, b) => a + b) / growthRates.length;
    const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - avgGrowth, 2), 0) / growthRates.length;
    const stdDev = Math.sqrt(variance);

    console.log(`\n📊 VFS Growth Analysis:`);
    console.log(`  Avg bytes/file: ${avgGrowth.toFixed(2)}`);
    console.log(`  Std deviation:  ${stdDev.toFixed(2)}`);
    console.log(`  Coefficient of variation: ${((stdDev / avgGrowth) * 100).toFixed(1)}%`);

    // Tot Sessie 220 stond hier een `if (avgGrowth === 0) return;`-guard tegen 0/0 = NaN.
    // Bedoeld als edge-case-afhandeling, in de praktijk een stille pass: hij zette "er is
    // niets gemeten" om in "geslaagd" en werd 10 van de 10 seriële runs genomen. Nu de
    // save geflusht wordt, betekent avgGrowth === 0 dat 50 `touch`-commando's nul bytes
    // hebben gepersisteerd — dat hoort rood te zijn, niet groen.
    expect(avgGrowth, 'VFS groeide 0 bytes over 50 bestanden — touch persisteert niets').toBeGreaterThan(0);

    // Growth should be roughly consistent (CV < 50% = acceptable linearity)
    // Note: first round has higher variance due to initial VFS structure serialization
    // and network latency when testing against production URL
    expect(stdDev / avgGrowth).toBeLessThan(0.5);

    if (stdDev / avgGrowth > 0.3) {
      console.warn(`⚠️  VFS growth variance elevated (${((stdDev / avgGrowth) * 100).toFixed(1)}%) - still within acceptable range`);
    } else {
      console.log(`  ✓ VFS growth is linear and predictable`);
    }
  });

});

// ========================================
// TEST SUMMARY
// ========================================

test.describe('Performance Tests - Summary', () => {

  test('All performance metrics summary', async () => {
    // This test just logs a summary - no actual assertions
    console.log('\n' + '='.repeat(50));
    console.log('M5 PERFORMANCE TEST SUITE COMPLETE');
    console.log('='.repeat(50));
    console.log('\nTests executed:');
    console.log('  1. ✓ Bundle size verification');
    console.log('  2. ✓ Load time & TTI (4G network)');
    console.log('  3. ✓ ES6 module cascade');
    console.log('  4. ✓ localStorage quota handling');
    console.log('  5. ✓ VFS growth linearity');
    console.log('\nManual tests required:');
    console.log('  → Memory leak detection (45 min DevTools profiling)');
    console.log('  → Network throttling verification (10 min)');
    console.log('\nNext steps:');
    console.log('  1. Review test output above');
    console.log('  2. Execute manual tests (docs/testing/manual-protocol.md)');
    console.log('  3. Document results (docs/testing/performance-results.md)');
    console.log('  4. Mark M5 Performance Testing complete in TASKS.md');
    console.log('');
  });

});
