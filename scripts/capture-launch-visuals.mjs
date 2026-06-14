/**
 * capture-launch-visuals.mjs — Pre-launch visueel materiaal voor de launch-aankondigings-kit (§4).
 *
 * Produceert 3 artefacten in .playwright-mcp/launch/ (gitignored — externe marketing-assets,
 * geen site-runtime-assets):
 *   1. terminal-help-nmap.gif   — loopende GIF: `help` -> `nmap 192.168.1.1` (1000px breed, donker)
 *   2. terminal-desktop.png      — statische desktop-screenshot (1280px, nmap-output zichtbaar)
 *   3. terminal-mobile-375.png   — mobiele screenshot (375px viewport, retina 2x)
 *
 * Bron = productie https://hacksimulator.nl/terminal.html (= Playwright baseURL).
 *
 * Schone take: legal-modal + onboarding-hints + consent-banner worden vooraf via localStorage
 * weggezet (addInitScript) zodat er geen modal/muis in beeld komt — conform kit "strak, een take".
 * De echte disclaimer/consent blijft uiteraard op de live site staan; dit raakt alleen deze opname.
 *
 * GIF-encoding: pure-JS (gifenc + pngjs). Playwright's gebundelde ffmpeg is een gestripte build
 * zonder gif-muxer/palettegen; system-ffmpeg vereist sudo-wachtwoord. Pure-JS = geen system-install.
 *
 * Run: node scripts/capture-launch-visuals.mjs
 */

import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');
const { PNG } = require('pngjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.playwright-mcp', 'launch');
const BASE_URL = process.env.BASE_URL || 'https://hacksimulator.nl';
const TERMINAL_URL = `${BASE_URL}/terminal.html`;

// localStorage-state voor een schone take (keys geverifieerd in src/ui/legal.js,
// src/ui/onboarding.js, src/analytics/consent.js).
const CLEAN_STATE = `
  try {
    localStorage.setItem('hacksim_legal_accepted', 'true');
    localStorage.setItem('hacksim_first_visit', 'false');
    localStorage.setItem('hacksim_analytics_consent',
      JSON.stringify({ necessary: true, analytics: false, advertising: false }));
  } catch (e) {}
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wacht tot de terminal interactief is en focus het echte input-element. */
async function readyTerminal(page) {
  await page.goto(TERMINAL_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const input = page.locator('#terminal-input');
  await input.waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(1400); // fonts + init + render settle
  await input.focus();
  return input;
}

/**
 * Voer het demo-scenario uit. Wanneer `onFrame` is meegegeven, wordt na elke
 * relevante stap een viewport-screenshot vastgelegd (voor de GIF).
 * `onFrame(delayMs)` legt 1 frame vast met de opgegeven frame-duur.
 */
async function runScenario(page, input, onFrame) {
  const typeWithFrames = async (text, charDelay) => {
    for (const ch of text) {
      await input.pressSequentially(ch, { delay: 0 });
      if (onFrame) await onFrame(charDelay);
      else await page.waitForTimeout(charDelay);
    }
  };
  const hold = async (count, delayMs) => {
    for (let i = 0; i < count; i++) {
      if (onFrame) await onFrame(delayMs);
      else await page.waitForTimeout(delayMs);
    }
  };

  if (onFrame) await onFrame(600);           // openingsframe: lege prompt in beeld
  else await page.waitForTimeout(400);

  await typeWithFrames('help', 135);         // typ `help` (rustig tempo)
  await input.press('Enter');
  await hold(2, 300);                        // output verschijnt
  if (onFrame) await onFrame(1500);          // hold: tijd om de command-lijst te lezen

  await typeWithFrames('nmap 192.168.1.1', 125); // typ het nmap-commando (rustig tempo)
  await input.press('Enter');
  await hold(2, 300);                        // output "licht op"
  if (onFrame) await onFrame(3600);          // lange hold: lees de nmap-output + loop-pauze
  else await page.waitForTimeout(600);
}

/** GIF-capture: vaste viewport-dimensies (GIF vereist constante frame-grootte). */
async function captureGif(browser) {
  const width = 1000, height = 640;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  await context.addInitScript(CLEAN_STATE);
  const page = await context.newPage();
  const input = await readyTerminal(page);

  const frames = []; // { data: Buffer(RGBA), delay }
  const onFrame = async (delay) => {
    const buf = await page.screenshot({ type: 'png', animations: 'disabled' });
    const png = PNG.sync.read(buf);
    frames.push({ data: png.data, delay, width: png.width, height: png.height });
  };

  await runScenario(page, input, onFrame);
  await context.close();

  // Palette uit een mix van het laatste (rijkste: nmap-output) + een vroeg frame,
  // zodat zowel help- als nmap-kleuren in de globale color-table zitten.
  const fw = frames[0].width, fh = frames[0].height;
  const last = frames[frames.length - 1].data;
  const early = frames[Math.floor(frames.length / 3)].data;
  const sample = new Uint8Array(last.length + early.length);
  sample.set(last, 0);
  sample.set(early, last.length);
  const palette = quantize(sample, 256);

  const gif = GIFEncoder();
  frames.forEach((f, i) => {
    const indexed = applyPalette(f.data, palette);
    gif.writeFrame(indexed, fw, fh, {
      palette,
      delay: f.delay,
      ...(i === 0 ? { repeat: 0 } : {}), // 0 = oneindig loopen (Netscape-extensie)
    });
  });
  gif.finish();

  const outPath = path.join(OUT_DIR, 'terminal-help-nmap.gif');
  writeFileSync(outPath, gif.bytes());
  console.log(`GIF   -> ${outPath} (${frames.length} frames, ${fw}x${fh})`);
}

/** Statische screenshot in een eigen context (desktop of mobiel). */
async function captureStatic({ name, width, height, scale }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    colorScheme: 'dark',
    isMobile: width < 500,
    hasTouch: width < 500,
  });
  await context.addInitScript(CLEAN_STATE);
  const page = await context.newPage();
  const input = await readyTerminal(page);
  await runScenario(page, input, null); // geen frames; gewoon afspelen
  await page.waitForTimeout(500);
  const outPath = path.join(OUT_DIR, name);
  await page.screenshot({ path: outPath, animations: 'disabled' });
  await browser.close();
  console.log(`PNG   -> ${outPath} (${width}x${height} @${scale}x)`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Bron: ${TERMINAL_URL}`);

  const browser = await chromium.launch();
  await captureGif(browser);
  await browser.close();

  await captureStatic({ name: 'terminal-desktop.png', width: 1280, height: 720, scale: 1 });
  await captureStatic({ name: 'terminal-mobile-375.png', width: 375, height: 812, scale: 2 });

  console.log('Klaar. Artefacten in .playwright-mcp/launch/');
}

main().catch((e) => { console.error(e); process.exit(1); });
