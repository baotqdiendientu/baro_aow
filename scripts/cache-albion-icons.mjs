#!/usr/bin/env node
/**
 * scripts/cache-albion-icons.mjs
 * Pre-downloads all 1,702 playable Albion Online base item icons (size=96)
 * and all spell icons (size=64) from https://render.albiononline.com/v1/
 * into public/albion-icons/items and public/albion-icons/spells for instant
 * (<2ms) local rendering with zero CDN latency.
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DB_PATH = path.join(ROOT_DIR, 'src', 'data', 'albion-db.json');
const ITEMS_ICON_DIR = path.join(ROOT_DIR, 'public', 'albion-icons', 'items');
const SPELLS_ICON_DIR = path.join(ROOT_DIR, 'public', 'albion-icons', 'spells');

const SPELL_NAMES = [
  'Explosive Bolt',
  'Auto Fire',
  'CALTROPS',
  'Sunder Shot',
  'Noise Eraser',
  'Exploding Shot',
  'Well-Prepared',
  'Multishot',
  'Deadly Shot',
  'Ray of Light',
  'Frost Shot',
  'Explosive Arrows',
  'Raging Storm',
  'Energetic',
  'Rending Rage',
  'Rending Spin',
  'Adrenaline Boost',
  'Raging Blades',
  'Aftershock',
  'Deep Cuts',
  'Life Leech',
  'Heroic Strike',
  'Heroic Cleave',
  'Iron Will',
  'Splitting Slash',
  'Parry Strike',
  'Fearless Strike',
  'Heroic Fighting',
  'Assassin Spirit',
  'Chain Slash',
  'Throwing Blades',
  'Lunging Stabs',
  'Thorn Growth',
  'Rejuvenation',
  'Protection of Nature',
  'Cleanse Heal',
  'Spiritual Seed',
  'Bane',
  'Burn',
  'Desecrate',
  'Wall of Flames',
  'Dark Matter',
  'Fire Wave',
  'Spinning Blades',
  'Battle Rush',
  'Speed Shot',
];

async function downloadWithRetry(url, destPath, retries = 2) {
  if (existsSync(destPath)) return 'cached';
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 100) {
          await fs.writeFile(destPath, buf);
          return 'downloaded';
        }
      }
      if (res.status === 404) return '404';
    } catch {
      // retry
    }
  }
  return 'failed';
}

async function runPool(items, concurrency, worker) {
  let idx = 0;
  const results = [];
  async function next() {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next())
  );
  return results;
}

async function main() {
  await fs.mkdir(ITEMS_ICON_DIR, { recursive: true });
  await fs.mkdir(SPELLS_ICON_DIR, { recursive: true });

  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  console.log(`⚡ Caching ${db.length} Albion item icons + ${SPELL_NAMES.length} spell icons locally...`);
  const t0 = Date.now();

  let downloaded = 0;
  let cached = 0;
  let failed = 0;

  await runPool(db, 64, async (item, i) => {
    const fileName = `${item.unique_name}.png`;
    const dest = path.join(ITEMS_ICON_DIR, fileName);
    const url = `https://render.albiononline.com/v1/item/${encodeURIComponent(item.unique_name)}.png?size=96`;
    const status = await downloadWithRetry(url, dest);
    if (status === 'downloaded') downloaded++;
    else if (status === 'cached') cached++;
    else failed++;

    if ((i + 1) % 300 === 0 || i + 1 === db.length) {
      console.log(
        `  • Progress: ${i + 1}/${db.length} (downloaded=${downloaded}, cached=${cached}, miss=${failed})`
      );
    }
  });

  let spellOk = 0;
  await runPool(SPELL_NAMES, 16, async (spellName) => {
    const safeFile = `${spellName.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    const dest = path.join(SPELLS_ICON_DIR, safeFile);
    const url = `https://render.albiononline.com/v1/spell/${encodeURIComponent(spellName)}.png?size=64`;
    const status = await downloadWithRetry(url, dest);
    if (status === 'downloaded' || status === 'cached') spellOk++;
  });

  console.log(
    `✅ Completed in ${((Date.now() - t0) / 1000).toFixed(1)}s! Items: ${downloaded + cached}/${db.length} ready, Spells: ${spellOk}/${SPELL_NAMES.length} ready.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

