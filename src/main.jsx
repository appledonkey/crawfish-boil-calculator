import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RECIPES, TIPS } from './data.js'

/* ── Inject structured data (JSON-LD) ── */
function injectStructuredData() {
  const recipes = RECIPES.map(r => ({
    "@type": "Recipe",
    "name": r.title,
    "description": r.desc,
    "totalTime": r.time.startsWith("2+") ? "PT120M" : `PT${parseInt(r.time)}M`,
    "recipeCategory": "Main Course",
    "recipeCuisine": "Cajun",
    "keywords": `crawfish, ${r.category === "boil" ? "crawfish boil" : "cajun cooking"}, Louisiana`,
    "recipeInstructions": r.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": s
    })),
    "author": { "@type": "Organization", "name": "CrawfishBoilCalculator.com", "url": "https://crawfishboilcalculator.com" }
  }));

  const faq = TIPS.filter(t => t.faq).map(t => ({
    "@type": "Question",
    "name": t.faq,
    "acceptedAnswer": { "@type": "Answer", "text": t.body }
  }));

  const graph = [
    ...recipes,
    { "@type": "FAQPage", "mainEntity": faq }
  ];

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(script);
}

injectStructuredData();

/* ── Register service worker ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

/* ── Mount app ── */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
