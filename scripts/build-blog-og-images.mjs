/**
 * build-blog-og-images.mjs — Genereert per blogpost een eigen og:image (social share card).
 *
 * Waarom: alle 14 posts deelden dezelfde generieke assets/og-image.png, dus een gedeelde
 * link naar "SQL injection uitgelegd" toonde dezelfde kaart als "Wireshark tutorial".
 * Let op: Google gebruikt og:image NIET in zoekresultaten — de winst zit in gedeelde
 * links (WhatsApp/LinkedIn/Slack/X). De echte waarde is dat dit een script is: elke
 * volgende post krijgt zijn kaart gratis.
 *
 * Bron van waarheid = de post zelf. Titel komt uit <h1>, categorie uit og:article:section.
 * Bewust GEEN hardcoded POSTS-array: de blogtitel leeft al op 7 plekken (zie
 * .claude/skills/blog-post/SKILL.md) en een achtste kopie zou onvermijdelijk gaan driften.
 *
 * Geen browser-rasterizer beschikbaar (egress-policy), dus SVG -> PNG via @resvg/resvg-js,
 * hetzelfde patroon als scripts/build-product-covers.mjs.
 *
 * Output: assets/blog/<slug>.png (1200x630, @2x gerenderd voor scherpte).
 * Ontwerp gewijzigd of nieuwe post? Run opnieuw: node scripts/build-blog-og-images.mjs
 *
 * Merkkleuren (assets/brand/README.md): neon #9fef00 · donker #0d1117 · zacht-wit #c9d1d9
 */

import { createRequire } from 'module';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const OUT_DIR = path.join(ROOT, 'assets', 'blog');

const W = 1200, H = 630;
const NEON = '#9fef00', DARK = '#0d1117', SOFT = '#c9d1d9', MUTED = '#7d8590';
const SANS = 'Liberation Sans';      // Arial-equivalent
const MONO = 'DejaVu Sans Mono';     // monospace

const MARGIN_X = 96;
const TEXT_W = W - MARGIN_X * 2;     // 1008px bruikbare tekstbreedte

// Bold Liberation Sans heeft een gemiddelde advance van ~0.58em voor Nederlandse
// mixed-case tekst. Conservatief gekozen: liever een regel eerder afbreken dan
// buiten de kaart lopen (resvg clipt niet, het loopt gewoon door).
const CHAR_RATIO = 0.58;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- Post-extractie -------------------------------------------------------

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function readPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .sort()
    .map((file) => {
      const html = readFileSync(path.join(BLOG_DIR, file), 'utf8');

      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (!h1) throw new Error(`${file}: geen <h1> gevonden`);
      const title = decodeEntities(h1[1].replace(/<[^>]*>/g, '')).trim();

      const sec = html.match(/property="article:section"\s+content="([^"]+)"/i)
        || html.match(/content="([^"]+)"\s+property="article:section"/i);
      const category = sec ? decodeEntities(sec[1]).trim() : 'Blog';

      return { slug: file.replace(/\.html$/, ''), title, category };
    });
}

// --- Tekst-layout ---------------------------------------------------------

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (test.length <= maxChars) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Kies de grootste lettergrootte die binnen het regelbudget past.
 * Voorkeur: 2 regels. Pas als dat niet lukt 3 regels, dan pas kleiner.
 */
function layoutTitle(title) {
  const sizes = [68, 62, 56, 50, 44];
  for (const maxLines of [2, 3]) {
    for (const size of sizes) {
      const maxChars = Math.floor(TEXT_W / (size * CHAR_RATIO));
      const lines = wrap(title, maxChars);
      if (lines.length <= maxLines) return { size, lines };
    }
  }
  // Vangnet: kleinste maat, hard op 3 regels
  const size = sizes[sizes.length - 1];
  const lines = wrap(title, Math.floor(TEXT_W / (size * CHAR_RATIO))).slice(0, 3);
  return { size, lines };
}

// --- SVG ------------------------------------------------------------------

// Groen H-monogram (= assets/brand/logo-on-dark.svg), identiek aan build-product-covers.mjs.
function glyph() {
  const s = 3.1, tx = MARGIN_X - 8 * s, ty = 92 - 6 * s;
  return `<g transform="translate(${tx} ${ty}) scale(${s})" fill="${NEON}">
    <rect x="10" y="7.5" width="3" height="11.5" rx="0.8"/>
    <rect x="19" y="7.5" width="3" height="11.5" rx="0.8"/>
    <rect x="10" y="11.75" width="12" height="3" rx="0.8"/>
    <rect x="9" y="22" width="14" height="2.5" rx="1.25"/>
  </g>`;
}

function svg(post) {
  const eyebrow = esc(('BLOG · ' + post.category).toUpperCase());
  const chipX = MARGIN_X - 12, chipY = 206, chipH = 44;
  const chipW = Math.round(eyebrow.length * 13.2 + 40); // mono ~0.6em @22px

  const { size, lines } = layoutTitle(post.title);
  const lineHeight = Math.round(size * 1.16);

  // Titelblok verticaal centreren in de vrije band, zodat 1- en 3-regelige
  // titels allebei in balans staan.
  const bandTop = 292, bandBottom = 496;
  const blockH = lines.length * lineHeight;
  const firstBaseline = Math.round(bandTop + (bandBottom - bandTop - blockH) / 2 + size);

  const titleSvg = lines.map((line, i) =>
    `<text x="${MARGIN_X}" y="${firstBaseline + i * lineHeight}" font-family="${SANS}" ` +
    `font-weight="700" font-size="${size}" fill="#ffffff">${esc(line)}</text>`
  ).join('\n  ');

  const barY = firstBaseline + (lines.length - 1) * lineHeight + 34;
  const foot = 'hacksimulator.nl/blog';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="18" fill="none"
        stroke="${NEON}" stroke-opacity="0.28" stroke-width="2"/>
  ${glyph()}
  <text x="160" y="138" font-family="${SANS}" font-weight="700" font-size="30" fill="${SOFT}">HackSimulator<tspan fill="${NEON}">.nl</tspan></text>

  <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="22"
        fill="none" stroke="${NEON}" stroke-opacity="0.5" stroke-width="1.5"/>
  <text x="${chipX + 20}" y="${chipY + 29}" font-family="${MONO}" font-size="22" fill="${NEON}">${eyebrow}</text>

  ${titleSvg}

  <rect x="${MARGIN_X}" y="${barY}" width="120" height="6" rx="3" fill="${NEON}"/>

  <text x="${MARGIN_X}" y="566" font-family="${MONO}" font-size="22" fill="${MUTED}">${esc(foot)}</text>
  <rect x="${MARGIN_X + Math.round(foot.length * 13.2) + 12}" y="548" width="14" height="22" fill="${NEON}"/>
</svg>`;
}

// --- Main -----------------------------------------------------------------

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const posts = readPosts();

  for (const post of posts) {
    const { size, lines } = layoutTitle(post.title);
    const resvg = new Resvg(svg(post), {
      // Exact 1200x630, NIET @2x zoals build-product-covers.mjs: elke post draagt
      // al <meta og:image:width content="1200"> + height 630. Een @2x-render zou die
      // tags laten liegen, en social platforms schalen toch naar hun eigen formaat.
      // Vectorbron = geen kwaliteitsverlies op deze maat.
      fitTo: { mode: 'width', value: W },
      font: { loadSystemFonts: true, defaultFontFamily: SANS },
      background: DARK,
    });
    const png = resvg.render().asPng();
    const out = path.join(OUT_DIR, `${post.slug}.png`);
    writeFileSync(out, png);
    console.log(
      `PNG -> assets/blog/${post.slug}.png  ` +
      `(${(png.length / 1024).toFixed(1)} KB, ${lines.length} regel(s) @ ${size}px, ${post.category})`
    );
  }

  console.log(`\nKlaar. ${posts.length} kaarten in assets/blog/`);
}

main();
