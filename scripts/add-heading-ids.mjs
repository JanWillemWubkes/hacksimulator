#!/usr/bin/env node
/**
 * Geeft elke <h2>/<h3> binnen .blog-post-content een stabiele, geslugificeerde `id`.
 *
 * Waarom statisch en niet in de browser: alleen id's die in de HTML staan zijn te bewaken
 * door validate-blogs.sh (Check 17). Runtime toegekende id's zijn niet te asserteren zonder
 * browser, en een deeplink die pas ná JS bestaat is geen deeplink.
 *
 * De inhoudsopgave zelf wordt wél runtime gebouwd (src/ui/blog-toc.js) — een statische TOC
 * in 15 bestanden zou in lockstep met de koppen moeten blijven, en dat is precies de drift
 * die dit project structureel bestrijdt.
 *
 * Idempotent: koppen die al een id hebben blijven ongemoeid, dus een tweede run wijzigt niets.
 * Deeplinks blijven daardoor geldig, ook als er later koppen bijkomen.
 *
 * Gebruik:  node scripts/add-heading-ids.mjs [--check] [bestanden...]
 *           --check  → schrijft niets, exit 1 als er koppen zonder id zijn (voor CI)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const args = process.argv.slice(2);
const alleenControleren = args.includes('--check');
const bestanden = args.filter((a) => !a.startsWith('--'));

const doelen = bestanden.length
  ? bestanden
  : readdirSync('blog')
      .filter((f) => f.endsWith('.html') && f !== 'index.html')
      .map((f) => `blog/${f}`)
      .sort();

/** "Service versie detectie (-sV)" -> "service-versie-detectie-sv" */
function slugify(html) {
  return html
    .replace(/<[^>]+>/g, '')          // tags eruit, tekst behouden (<code>-sV</code> -> -sV)
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')// entities zijn geen letters voor een anker
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // é -> e
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'sectie';
}

let totaalToegevoegd = 0;
let zonderId = 0;

for (const pad of doelen) {
  const origineel = readFileSync(pad, 'utf8');

  // Beperk tot de artikelinhoud: de h3's in .related-articles zijn navigatie, geen secties.
  const start = origineel.indexOf('<div class="blog-post-content">');
  if (start === -1) { console.warn(`  overgeslagen (geen .blog-post-content): ${pad}`); continue; }
  const eind = origineel.indexOf('<section class="related-articles">', start);
  const grens = eind === -1 ? origineel.length : eind;

  const gebruikt = new Set(
    [...origineel.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  );

  let toegevoegd = 0;
  const inhoud = origineel.slice(start, grens).replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/g,
    (heel, tag, attrs = '', binnen) => {
      if (attrs && /\sid=/.test(attrs)) return heel;   // al een id: niet aanraken
      zonderId++;
      if (alleenControleren) return heel;
      let slug = slugify(binnen);
      let uniek = slug, n = 2;
      while (gebruikt.has(uniek)) uniek = `${slug}-${n++}`;
      gebruikt.add(uniek);
      toegevoegd++;
      return `<${tag}${attrs || ''} id="${uniek}">${binnen}</${tag}>`;
    }
  );

  if (!alleenControleren && toegevoegd > 0) {
    writeFileSync(pad, origineel.slice(0, start) + inhoud + origineel.slice(grens));
  }
  totaalToegevoegd += toegevoegd;
  if (toegevoegd) console.log(`  ${pad}: +${toegevoegd} id's`);
}

if (alleenControleren) {
  if (zonderId > 0) { console.error(`[FAIL] ${zonderId} kop(pen) zonder id`); process.exit(1); }
  console.log('[OK] alle h2/h3 in .blog-post-content hebben een id');
} else {
  console.log(`klaar: ${totaalToegevoegd} id's toegevoegd over ${doelen.length} bestand(en)`);
}
