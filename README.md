# The Golden Plate — Static Restaurant Website

A static restaurant website whose **menu, prices, and today's specials** are pulled live from a **Google Sheet**. No backend needed — perfect for GitHub Pages.

---

## Quick Start

### 1. Create Your Google Sheet

Create a new Google Sheet with **exactly these column headers** in Row 1:

| A: Item | B: Category | C: Description | D: Price | E: TodaysSpecial |
|---------|-------------|----------------|----------|------------------|
| Paneer Tikka | Starters | Marinated cottage cheese, grilled in tandoor | 280 | Yes |
| Butter Chicken | Main Course | Creamy tomato-based curry with tender chicken | 350 | Yes |
| Dal Makhani | Main Course | Slow-cooked black lentils in butter gravy | 220 | No |
| Gulab Jamun | Desserts | Deep-fried milk dumplings in sugar syrup | 120 | No |
| Masala Chai | Beverages | Spiced Indian tea with milk | 50 | No |

> **Tip:** Change `TodaysSpecial` to `Yes` for any item to feature it as a special — update it daily!

### 2. Publish the Sheet

1. Open your Google Sheet
2. Go to **File → Share → Publish to web**
3. Choose **Entire Document** → **Web page** → Click **Publish**
4. Copy the **Sheet ID** from your sheet URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit
                                          ^^^^^^^^^^^^^^^^^
   ```

### 3. Connect to the Website

Open `script.js` and replace the placeholder with your Sheet ID:

```js
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';  // ← paste your ID here
```

### 4. Test Locally

Just open `index.html` in a browser — no server needed.

### 5. Deploy to GitHub Pages

```bash
# Create a repo and push
git init
git add .
git commit -m "Initial restaurant website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then go to **Settings → Pages → Source: Deploy from branch → Branch: main → / (root)** → Save.

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## How It Works

```
┌────────────────────┐     fetch (JSONP)      ┌──────────────────┐
│  GitHub Pages       │ ◄──────────────────── │  Google Sheets    │
│  (static HTML/JS)   │     menu data          │  (your spreadsheet)│
└────────────────────┘                         └──────────────────┘
```

- Uses the **Google Visualization API** (`/gviz/tq?tqx=out:json`) — no API key required
- The sheet must be **published to the web** (read-only, public)
- Menu updates are instant: edit the sheet → refresh the website

---

## File Structure

```
static-web-dynamic-data/
├── index.html      ← Main page
├── style.css       ← Styling (responsive, mobile-friendly)
├── script.js       ← Google Sheets fetch + render logic
└── README.md       ← This file
```

---

## Customization

| What | Where |
|------|-------|
| Restaurant name | `index.html` → `<h1>` and `<title>` |
| Currency symbol | `script.js` → `CURRENCY` constant |
| Hero background image | `style.css` → `.hero` background URL |
| Colors & fonts | `style.css` → CSS custom properties at the top |
| Sheet tab name | `script.js` → `SHEET_TAB` constant |
