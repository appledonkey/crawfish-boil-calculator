import { useState } from "react";
import { RECIPES } from "../data.js";

const AFFILIATE_TAG = "crawfishboilc-20";
const amazonLink = (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;

export default function Recipes() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("all");
  const filters = [{ key: "all", label: "All" }, { key: "boil", label: "Boil styles" }, { key: "cajun", label: "Cajun dishes" }];
  const filtered = filter === "all" ? RECIPES : RECIPES.filter(r => r.category === filter);
  return (
    <section className="page">
      <h2 className="page-title">Recipes</h2>
      <p className="page-desc">{RECIPES.length} recipes from boil variations to classic Cajun dishes.</p>
      <div className="pills pills--mb">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`pill ${filter === f.key ? "pill--on" : ""}`}>{f.label}</button>
        ))}
      </div>
      {filtered.map(r => (
        <div key={r.id} className="card recipe-card">
          <button onClick={() => setOpenId(openId === r.id ? null : r.id)} className="recipe-hdr">
            <div>
              <div className="recipe-name">{r.title}</div>
              <div className="recipe-meta">{r.time} / {r.difficulty}</div>
            </div>
            <span className={`chev ${openId === r.id ? "chev--open" : ""}`}>&#9662;</span>
          </button>
          {openId === r.id && (
            <div className="recipe-body">
              <p className="recipe-desc">{r.desc}</p>
              <ol className="recipe-steps">{r.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <div className="pro-tip">
                <span className="pro-tip-tag">Pro tip</span>
                <span className="pro-tip-txt">{r.tip}</span>
              </div>
              {r.products && r.products.length > 0 && (
                <div className="recipe-products">
                  <div className="recipe-products-label">What you'll need</div>
                  <div className="recipe-products-list">
                    {r.products.map((p, i) => (
                      <a key={i} href={amazonLink(p.query)} target="_blank" rel="noopener noreferrer" className="recipe-product-link">
                        {p.name} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
