# BoilCalc

A crawfish boil planning calculator. Figure out exactly how much to buy, what it'll cost, and get a printable shopping list for any group size.

![Screenshot](screenshot.png)

## Features

- **Calculator** — 44 items across 6 categories with per-person quantities and live cost estimates
- **9 Recipes** — Classics like crawfish boil, corn maque choux, boudin balls, and more
- **12 Equipment Picks** — Recommended gear with Amazon affiliate links
- **9 Boil Tips** — Practical advice from purging to seasoning
- **Shopping List** — Copy, share, text, or print your list
- **Persistence** — Saves your inputs to localStorage so nothing is lost on refresh
- **Mobile-First** — Fully responsive dark UI with the Outfit font
- **Email Capture** — Newsletter signup footer

## Tech Stack

- [Vite](https://vitejs.dev/) — build tool
- [React](https://react.dev/) — UI
- Single-file component (~1,000 lines), no dependencies beyond React
- All CSS is inline — no external stylesheets

## Getting Started

```bash
git clone https://github.com/appledonkey/crawfish-boil-calculator.git
cd crawfish-boil-calculator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

## License

[MIT](LICENSE)
