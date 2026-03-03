import { TIPS } from "../data.js";

export default function Tips() {
  return (
    <section className="page">
      <h2 className="page-title">Boil Tips</h2>
      <p className="page-desc">Hard-earned wisdom so you don't learn the hard way.</p>
      <div className="tips-list">
        {TIPS.map((t, i) => (
          <div key={i} className="card tip-card">
            <div className="tip-hdr">
              <span className="tip-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="tip-title">{t.title}</span>
            </div>
            <div className="tip-body">{t.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
