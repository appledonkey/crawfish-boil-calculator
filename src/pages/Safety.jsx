import { useState } from "react";
import { SAFETY_CHECKLIST } from "../data.js";

export default function Safety() {
  const STORAGE_KEY = "boilcalc_safety";
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };
  const resetAll = () => { setChecked({}); localStorage.removeItem(STORAGE_KEY); };
  const total = SAFETY_CHECKLIST.length;
  const done = SAFETY_CHECKLIST.filter(i => checked[i.id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <section className="page">
      <h2 className="page-title">Boil Day Safety</h2>
      <p className="page-desc">Go through this checklist before you light the burner. Every item matters.</p>

      {/* Progress */}
      <div className="card safety-progress-card">
        <div className="safety-progress-top">
          <span className="safety-progress-label">{done} of {total} checked</span>
          {done === total && <span className="safety-progress-done">Ready to boil!</span>}
          {done > 0 && done < total && <button className="btn-reset" onClick={resetAll}>Reset</button>}
        </div>
        <div className="safety-bar-bg">
          <div className="safety-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="safety-list">
        {SAFETY_CHECKLIST.map(item => (
          <button key={item.id} className={`card safety-item ${checked[item.id] ? "safety-item--done" : ""}`}
            onClick={() => toggle(item.id)}>
            <div className={`safety-check ${checked[item.id] ? "safety-check--on" : ""}`}>
              {checked[item.id] && <span className="safety-checkmark">&#10003;</span>}
            </div>
            <div className="safety-text">
              <div className="safety-item-label">
                {item.severity === "critical" && <span className="safety-badge safety-badge--crit">Critical</span>}
                {item.label}
              </div>
              <div className="safety-item-desc">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {done === total && (
        <div className="card safety-allclear">
          <div className="safety-allclear-icon">&#10003;</div>
          <div className="safety-allclear-title">All clear!</div>
          <div className="safety-allclear-msg">You've checked every safety item. Stay alert and have a great boil.</div>
        </div>
      )}
    </section>
  );
}
