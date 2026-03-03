import { EQUIPMENT, EQUIPMENT_LINKS } from "../data.js";

export default function Equipment() {
  const tiers = [
    { key: "essential", label: "Essential", color: "var(--accent)" },
    { key: "recommended", label: "Recommended", color: "#34d399" },
    { key: "nice-to-have", label: "Nice to have", color: "#60a5fa" },
  ];
  return (
    <section className="page">
      <h2 className="page-title">Gear</h2>
      <p className="page-desc">Everything you need to run a proper boil.</p>
      {tiers.map(tier => (
        <div key={tier.key} className="group">
          <div className="tier-lbl" style={{ color: tier.color }}>
            <span className="tier-dot" style={{ background: tier.color }} />{tier.label}
          </div>
          {EQUIPMENT.filter(e => e.tier === tier.key).map((eq, i) => (
            <div key={i} className="card equip-card">
              <div className="equip-top">
                <span className="equip-name">{eq.name}</span>
                <span className="equip-price">{eq.price}</span>
              </div>
              <div className="equip-desc">{eq.desc}</div>
              {EQUIPMENT_LINKS[eq.name] && (
                <a href={EQUIPMENT_LINKS[eq.name]} target="_blank" rel="noopener noreferrer" className="equip-link">
                  Shop on Amazon &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
