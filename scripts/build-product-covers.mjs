/**
 * build-product-covers.mjs — Genereert per-gids cover-images voor de Product-markup
 * (Verkopersvermeldingen / merchant listings) op gidsen.html.
 *
 * Waarom: GSC vroeg om een `image` per Product. Eén gedeelde og-image werkt, maar
 * losse covers per gids geven rijkere resultaten. Geen browser-rasterizer beschikbaar
 * (chromium-download geblokkeerd door egress-policy), dus SVG -> PNG via @resvg/resvg-js
 * (Rust, prebuilt, geen browser/binary-download nodig).
 *
 * Output: assets/products/<slug>.png (2400x1260 = 1200x630 @2x — getrackte, geserveerde
 * assets). Bron-van-waarheid = de GUIDES-array + merkkleuren hieronder. Ontwerp gewijzigd?
 * Run opnieuw: node scripts/build-product-covers.mjs
 *
 * Merkkleuren (assets/brand/README.md): neon #9fef00 · donker #0d1117 · zacht-wit #c9d1d9
 */

import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'assets', 'products');

const W = 1200, H = 630;
const NEON = '#9fef00', DARK = '#0d1117', SOFT = '#c9d1d9', MUTED = '#7d8590';
const SANS = 'Liberation Sans';      // Arial-equivalent, aanwezig in de container
const MONO = 'DejaVu Sans Mono';     // monospace, aanwezig in de container

const GUIDES = [
  { slug: 'ethisch-hacken-wet',      eyebrow: 'GIDS · WET & ETHIEK',     title: ['Ethisch Hacken', '& Nederlandse Wet'] },
  { slug: 'eerste-pentest-playbook', eyebrow: 'GIDS · PENTEST PLAYBOOK', title: ['Je Eerste Pentest:', 'Stap-voor-Stap Playbook'] },
  { slug: 'ctf-leerplan',            eyebrow: 'GIDS · LEERPLAN',         title: ['Van Nul naar CTF:', '12-Weken Leerplan'] },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Groen H-monogram (= assets/brand/logo-on-dark.svg) geschaald/geplaatst linksboven.
// Lokale viewBox "8 6 16 20"; transform mapt local->canvas (uniform scale 3.1).
function glyph() {
  const s = 3.1, tx = 96 - 8 * s, ty = 92 - 6 * s;
  return `<g transform="translate(${tx} ${ty}) scale(${s})" fill="${NEON}">
    <rect x="10" y="7.5" width="3" height="11.5" rx="0.8"/>
    <rect x="19" y="7.5" width="3" height="11.5" rx="0.8"/>
    <rect x="10" y="11.75" width="12" height="3" rx="0.8"/>
    <rect x="9" y="22" width="14" height="2.5" rx="1.25"/>
  </g>`;
}

function svg(g) {
  const eyebrow = esc(g.eyebrow.toUpperCase());
  const chipX = 84, chipY = 232, chipH = 44;
  const chipW = Math.round(eyebrow.length * 13.2 + 40); // mono ~0.6em @22px
  const [l1, l2] = g.title.map(esc);
  const foot = 'PDF-gids · Nederlands · vanaf €5';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="18" fill="none"
        stroke="${NEON}" stroke-opacity="0.28" stroke-width="2"/>
  ${glyph()}
  <text x="160" y="138" font-family="${SANS}" font-weight="700" font-size="30" fill="${SOFT}">HackSimulator<tspan fill="${NEON}">.nl</tspan></text>

  <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="22"
        fill="none" stroke="${NEON}" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="${chipX + 20}" y="${chipY + 29}" font-family="${MONO}" font-size="22" fill="${NEON}">${eyebrow}</text>

  <text x="96" y="362" font-family="${SANS}" font-weight="700" font-size="66" fill="#ffffff">${l1}</text>
  <text x="96" y="434" font-family="${SANS}" font-weight="700" font-size="66" fill="#ffffff">${l2}</text>

  <rect x="96" y="470" width="120" height="6" rx="3" fill="${NEON}"/>

  <text x="96" y="558" font-family="${MONO}" font-size="22" fill="${MUTED}">${esc(foot)}</text>
  <rect x="${96 + foot.length * 13.2 + 12}" y="540" width="14" height="22" fill="${NEON}"/>
</svg>`;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const g of GUIDES) {
    const resvg = new Resvg(svg(g), {
      fitTo: { mode: 'width', value: W * 2 }, // @2x voor retina-scherpte
      font: { loadSystemFonts: true, defaultFontFamily: SANS },
      background: DARK,
    });
    const png = resvg.render().asPng();
    const out = path.join(OUT_DIR, `${g.slug}.png`);
    writeFileSync(out, png);
    console.log(`PNG -> ${out} (${(png.length / 1024).toFixed(1)} KB)`);
  }
  console.log('Klaar. Covers in assets/products/');
}

main();
