# Crawfish Boil Calculator

A modern React application for planning the perfect crawfish boil using Isaac Toups' authentic Louisiana ratios.

## Features

- **Basic Mode**: Calculate essential ingredients with Isaac Toups' proven ratios
- **Advanced Mode**: Complete party planning with Cajun and Viet-Cajun styles
- **Regional Pricing**: Accurate cost estimates for Louisiana, Texas, and other states
- **Dynamic Spice Theming**: Visual theme changes with spice level selection
- **Save & Share**: Save your boil plans and share them via unique URLs
- **Amazon Affiliate Links**: Quick purchasing for equipment and supplies
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Vite** - Fast modern build tool
- **React 18** - UI library
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Database and backend
- **Custom Fonts** - Bungee (display) & Inter (body)

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── CrawfishCalculator.jsx
├── config/             # Configuration constants
├── data/               # Item data and definitions
├── hooks/              # Custom React hooks
├── lib/                # External library setup
├── styles/             # CSS styles
└── utils/              # Utility functions
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Database Schema

The app uses Supabase for storing and sharing boil calculations:

- `saved_boils` table stores boil configurations
- Shareable via unique tokens
- Public read access for shared boils

## Amazon Affiliate

Equipment and supplies include Amazon affiliate links (Store ID: oswaldcalcula-20) to help users quickly purchase needed items.
