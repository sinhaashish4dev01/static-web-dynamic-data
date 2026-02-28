/**
 * Restaurant Menu — fetches live data from a public Google Sheet.
 *
 * Expected sheet columns (Row 1 = header):
 *   A: Item           (menu item name)
 *   B: Price          (number, e.g. 250)
 *   C: Today's Special (Yes / No)
 *
 * HOW TO CONNECT YOUR SHEET
 * 1. Create a Google Sheet with the columns above.
 * 2. File → Share → Publish to web  (entire document, Web page).
 * 3. Copy the full published URL and paste it below.
 */

// ─── CONFIG ────────────────────────────────────────────────────────────────────
// Paste your full "Publish to web" URL here (the /pubhtml one)
const PUBLISHED_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTsCkPHVyqujEVJZnlj-xZJCedG3rKdZfJOaDe01qzvo5ubvfZOD7LUHV0LR3U806cybMSPR6edriE/pubhtml';

// Currency symbol shown before prices
const CURRENCY = '₹';
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Convert the published URL to a CSV export URL.
 * Works with both /pubhtml and /pub URLs.
 */
function buildCsvUrl() {
  // Replace /pubhtml or /pub at the end with /pub?output=csv
  return PUBLISHED_URL.replace(/\/pub(html)?(\?.*)?$/, '/pub?output=csv');
}

/**
 * Parse CSV text into an array of rows (handles quoted fields with commas).
 */
function parseCsv(text) {
  const rows = [];
  const lines = text.trim().split('\n');

  for (const line of lines) {
    const row = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

/**
 * Convert parsed CSV rows into a clean array of menu items.
 * Row 0 = header, rows 1+ = data.
 */
function extractMenuItems(rows) {
  if (rows.length < 2) return [];

  // Skip header row (index 0)
  return rows.slice(1)
    .map(cols => {
      const name = (cols[0] ?? '').trim();
      if (!name) return null;

      return {
        name,
        price:     parseFloat(cols[1]) || 0,
        isSpecial: (cols[2] ?? '').trim().toLowerCase() === 'yes',
      };
    })
    .filter(Boolean);
}

// ─── DOM HELPERS ───────────────────────────────────────────────────────────────

const $ = (sel) => document.querySelector(sel);

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

/**
 * Create a single menu-card DOM element.
 */
function createMenuCard(item) {
  const card = document.createElement('div');
  card.className = `menu-card${item.isSpecial ? ' special' : ''}`;

  card.innerHTML = `
    ${item.isSpecial ? '<div class="special-badge">Today\'s Special</div>' : ''}
    <div class="card-header">
      <span class="item-name">${escapeHtml(item.name)}</span>
      <span class="item-price">${CURRENCY}${item.price.toLocaleString('en-IN')}</span>
    </div>
  `;
  return card;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── RENDER ────────────────────────────────────────────────────────────────────

let allItems = [];

function renderSpecials(items) {
  const specials = items.filter(i => i.isSpecial);
  const section = $('#specials-section');
  const grid = $('#specials-grid');
  grid.innerHTML = '';

  if (specials.length === 0) {
    hide(section);
    return;
  }

  specials.forEach(item => grid.appendChild(createMenuCard(item)));
  show(section);
}

function renderMenu(items) {
  const grid = $('#menu-grid');
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = '<p style="color:#999; grid-column:1/-1; text-align:center;">No items found.</p>';
    return;
  }

  items.forEach(item => grid.appendChild(createMenuCard(item)));
}

// ─── FETCH ─────────────────────────────────────────────────────────────────────

async function fetchMenu() {
  const loadingEl = $('#loading');
  const errorEl = $('#error');

  show(loadingEl);
  hide(errorEl);
  hide($('#specials-section'));
  hide($('#menu-section'));

  try {
    const resp = await fetch(buildCsvUrl());
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const text = await resp.text();
    const rows = parseCsv(text);
    allItems = extractMenuItems(rows);

    if (allItems.length === 0) {
      throw new Error('Sheet returned zero menu items — check your column headers.');
    }

    renderSpecials(allItems);
    renderMenu(allItems);

    show($('#menu-section'));
  } catch (err) {
    console.error('Menu fetch failed:', err);
    show(errorEl);
  } finally {
    hide(loadingEl);
  }
}

// ─── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', fetchMenu);
