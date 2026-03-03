import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import "./App.css";

const DEFAULTS = {
  // === Essentials: Crawfish → Seasonings → Boil veggies & aromatics → Protein → Bread ===
  crawfish: { name: "Live Crawfish", perPerson: 3, pricePerUnit: 4.50, unit: "lb", category: "essentials" },
  seasoning: { name: "Boil Seasoning, 4 lb bag", perPerson: 0.15, pricePerUnit: 6.99, unit: "bag", category: "essentials" },
  seasonliq: { name: "Liquid Seasoning, 16 oz", perPerson: 0.08, pricePerUnit: 5.49, unit: "btl", category: "essentials" },
  potatoes: { name: "Red Potatoes", perPerson: 0.5, pricePerUnit: 1.25, unit: "lb", category: "essentials" },
  corn: { name: "Corn (frozen ears)", perPerson: 2, pricePerUnit: 0.75, unit: "ear", category: "essentials" },
  onions: { name: "Yellow Onions", perPerson: 0.25, pricePerUnit: 1.00, unit: "ea", category: "essentials" },
  garlic: { name: "Garlic (whole heads)", perPerson: 0.25, pricePerUnit: 0.75, unit: "head", category: "essentials" },
  lemons: { name: "Lemons", perPerson: 0.5, pricePerUnit: 0.60, unit: "ea", category: "essentials" },
  sausage: { name: "Andouille Sausage", perPerson: 0.33, pricePerUnit: 5.99, unit: "lb", category: "essentials" },
  bread: { name: "French Bread (loaves)", perPerson: 0.5, pricePerUnit: 3.50, unit: "loaf", category: "essentials" },
  // === Popular Add-Ins: Veggies → Fruits ===
  mushrooms: { name: "Button Mushrooms", perPerson: 0.15, pricePerUnit: 3.99, unit: "lb", category: "popular" },
  brusselsprouts: { name: "Brussels Sprouts", perPerson: 0.15, pricePerUnit: 3.49, unit: "lb", category: "popular" },
  artichokes: { name: "Whole Artichokes", perPerson: 0.25, pricePerUnit: 2.50, unit: "ea", category: "popular" },
  celery: { name: "Celery (stalks)", perPerson: 0.5, pricePerUnit: 2.49, unit: "pkg", category: "popular" },
  sweetpotato: { name: "Sweet Potatoes", perPerson: 0.25, pricePerUnit: 1.49, unit: "lb", category: "popular" },
  carrots: { name: "Baby Carrots, 1 lb bag", perPerson: 0.15, pricePerUnit: 2.49, unit: "bag", category: "popular" },
  oranges: { name: "Oranges", perPerson: 0.25, pricePerUnit: 0.75, unit: "ea", category: "popular" },
  pineapple: { name: "Pineapple (whole)", perPerson: 0.1, pricePerUnit: 3.99, unit: "ea", category: "popular" },
  // === More Extras: Proteins → Veggies → Condiments ===
  shrimp: { name: "Shell-On Shrimp", perPerson: 0.25, pricePerUnit: 7.99, unit: "lb", category: "extras" },
  boudin: { name: "Boudin Links", perPerson: 0.25, pricePerUnit: 6.99, unit: "lb", category: "extras" },
  hotdogs: { name: "Hot Dogs, 8-ct pack", perPerson: 0.5, pricePerUnit: 4.99, unit: "pk", category: "extras" },
  boiledeggs: { name: "Hard-Boiled Eggs", perPerson: 1, pricePerUnit: 0.30, unit: "ea", category: "extras" },
  jalapenos: { name: "Whole Jalapenos", perPerson: 0.25, pricePerUnit: 1.49, unit: "lb", category: "extras" },
  bellpepper: { name: "Mini Bell Peppers, 16 oz", perPerson: 0.15, pricePerUnit: 3.49, unit: "bag", category: "extras" },
  cauliflower: { name: "Cauliflower, whole", perPerson: 0.1, pricePerUnit: 2.99, unit: "head", category: "extras" },
  greenbeans: { name: "Green Beans, 14 oz", perPerson: 0.15, pricePerUnit: 1.29, unit: "can", category: "extras" },
  cabbage: { name: "Cabbage (quartered)", perPerson: 0.1, pricePerUnit: 2.49, unit: "head", category: "extras" },
  butter: { name: "Butter (sticks)", perPerson: 0.5, pricePerUnit: 1.25, unit: "stick", category: "extras" },
  cocktailsauce: { name: "Cocktail Sauce, 12 oz", perPerson: 0.1, pricePerUnit: 3.49, unit: "btl", category: "extras" },
  // === Supplies: Cooking/Prep → Serving → Cleanup ===
  ice: { name: "Ice, 10 lb bag", perPerson: 0.5, pricePerUnit: 3.50, unit: "bag", category: "supplies" },
  salt: { name: "Coarse Salt, 3 lb box", perPerson: 0.05, pricePerUnit: 2.49, unit: "box", category: "supplies" },
  vinegar: { name: "White Vinegar", perPerson: 0.05, pricePerUnit: 3.49, unit: "gal", category: "supplies" },
  newspaper: { name: "Butcher Paper, 100 ft", perPerson: 0.05, pricePerUnit: 8.99, unit: "roll", category: "supplies" },
  servingtrays: { name: "Serving Trays, 5 pk", perPerson: 0.05, pricePerUnit: 8.99, unit: "pk", category: "supplies" },
  plates: { name: "Plates, 50 ct", perPerson: 0.3, pricePerUnit: 5.99, unit: "pk", category: "supplies" },
  cups: { name: "Plastic Cups, 16 oz", perPerson: 0.3, pricePerUnit: 4.99, unit: "pk", category: "supplies" },
  papertowels: { name: "Paper Towels, 6-roll pk", perPerson: 0.15, pricePerUnit: 5.99, unit: "pk", category: "supplies" },
  wetwipes: { name: "Wet Wipes, 40 ct pack", perPerson: 0.15, pricePerUnit: 3.99, unit: "pk", category: "supplies" },
  trashbags: { name: "Trash Bags, 30 ct HD", perPerson: 0.1, pricePerUnit: 8.99, unit: "box", category: "supplies" },
  ziplocks: { name: "Zip-Lock Bags, gallon", perPerson: 0.1, pricePerUnit: 4.99, unit: "box", category: "supplies" },
  bugspray: { name: "Bug Spray / Citronella", perPerson: 0.05, pricePerUnit: 6.99, unit: "ea", category: "supplies" },
  stringlights: { name: "Outdoor String Lights", perPerson: 0.03, pricePerUnit: 14.99, unit: "set", category: "supplies" },
  speaker: { name: "Bluetooth Speaker", perPerson: 0.03, pricePerUnit: 29.99, unit: "ea", category: "supplies" },
  cornhole: { name: "Cornhole / Yard Games", perPerson: 0.03, pricePerUnit: 39.99, unit: "set", category: "supplies" },
  // === Drinks ===
  beer: { name: "Beer, 12-pack", perPerson: 0.5, pricePerUnit: 15.99, unit: "pk", category: "drinks" },
  soda: { name: "Soft Drinks, 12-pack", perPerson: 0.2, pricePerUnit: 6.99, unit: "pk", category: "drinks" },
  lemonade: { name: "Lemonade / Sweet Tea", perPerson: 0.15, pricePerUnit: 4.99, unit: "gal", category: "drinks" },
  water: { name: "Bottled Water, 24-pack", perPerson: 0.15, pricePerUnit: 5.99, unit: "case", category: "drinks" },
};

const AFFILIATE_TAG = "crawfishboilc-20";
const amazonLink = (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;

const ITEM_LINKS = {
  seasoning: amazonLink("crawfish boil seasoning Zatarains"),
  seasonliq: amazonLink("liquid crab boil concentrate Louisiana"),
  trashbags: amazonLink("heavy duty trash bags outdoor"),
  newspaper: amazonLink("butcher paper roll table covering"),
  papertowels: amazonLink("paper towels bulk"),
  wetwipes: amazonLink("hand wipes individually wrapped"),
  servingtrays: amazonLink("aluminum foil serving trays disposable"),
  ziplocks: amazonLink("ziploc gallon freezer bags"),
  plates: amazonLink("disposable plates heavy duty"),
  cups: amazonLink("plastic cups 16 oz clear"),
  bugspray: amazonLink("bug spray citronella candles outdoor"),
  stringlights: amazonLink("outdoor string lights patio waterproof"),
  speaker: amazonLink("portable bluetooth speaker outdoor waterproof"),
  cornhole: amazonLink("cornhole set outdoor yard game"),
};

const round = (v) => Math.ceil(v * 100) / 100;

/* ── POT SIZE & BATCH HELPERS ── */
const POT_SIZES = [
  { maxLbs: 15, size: "40-qt" },
  { maxLbs: 25, size: "60-qt" },
  { maxLbs: 35, size: "80-qt" },
  { maxLbs: 50, size: "100-qt" },
];
function getPotSize(lbs) {
  if (lbs <= 0) return "—";
  const match = POT_SIZES.find(p => lbs <= p.maxLbs);
  return match ? match.size : "100-qt+";
}

const BATCH_MAX_LBS = 35;
const BATCH_COOK_MIN = 45;

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ── TIMELINE GENERATOR ── */
function formatTimeAgo(minutes) {
  if (minutes <= 0) return "Serve time!";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min before`;
  return m > 0 ? `${h}h ${m}m before` : `${h}h before`;
}

function generateTimeline(batches, totalLbs) {
  const steps = [];
  const lbsPerBatch = batches > 0 ? Math.ceil(totalLbs / batches) : 0;
  const totalCookMin = batches * BATCH_COOK_MIN;

  // Work backwards from serve time
  // Each batch: 5 min boil + 20 min soak + 5 min dump/reset + 15 min reheat = ~45 min
  // Prep before first batch: ~90 min (setup, season, veggies)
  // Purge: 2 hours before first batch drop
  const firstBatchDrop = totalCookMin + 30; // last batch soak/dump
  const purgeStart = firstBatchDrop + 90 + 120;
  const setupStart = firstBatchDrop + 90;
  const fillPotStart = firstBatchDrop + 60;
  const boilVeggiesStart = firstBatchDrop + 30;

  steps.push({ time: "Day before", label: "Buy supplies", desc: "Pick up everything on your shopping list. Get crawfish as close to boil day as possible." });
  steps.push({ time: formatTimeAgo(purgeStart), label: "Purge crawfish", desc: `Dump ${totalLbs} lbs into a tub. Rinse with clean water 3-4 changes until clear. Remove dead ones (straight tails).` });
  steps.push({ time: formatTimeAgo(setupStart), label: "Set up tables & equipment", desc: "Cover tables with butcher paper, position burner, check propane, lay out supplies and trays." });
  steps.push({ time: formatTimeAgo(fillPotStart), label: "Fill pot & season water", desc: "Fill pot halfway. Add seasoning, lemons, oranges, garlic, onions. Bring to a rolling boil." });
  steps.push({ time: formatTimeAgo(boilVeggiesStart), label: "Boil vegetables first", desc: "Drop potatoes and sausage. Boil 10 min. Add corn, boil 5 more. Remove and set aside in cooler." });

  for (let b = 1; b <= batches; b++) {
    const batchStart = firstBatchDrop - ((b - 1) * BATCH_COOK_MIN);
    const batchLabel = batches > 1 ? ` batch ${b} (~${lbsPerBatch} lbs)` : ` crawfish (${totalLbs} lbs)`;

    steps.push({
      time: formatTimeAgo(batchStart),
      label: `Drop${batchLabel}`,
      desc: "Add crawfish at rolling boil. Cover, return to boil, cook 3-5 min until bright red.",
      highlight: true,
    });
    steps.push({
      time: formatTimeAgo(batchStart - 5),
      label: `Kill fire & soak${batches > 1 ? ` batch ${b}` : ""}`,
      desc: "Add ice or frozen corn to drop temp. Soak 15-20 min. When they sink, they've absorbed the flavor.",
    });

    if (b < batches) {
      steps.push({
        time: formatTimeAgo(batchStart - 25),
        label: `Dump batch ${b} & reheat`,
        desc: "Lift basket, dump on table. Reheat pot, add more seasoning if needed for next batch.",
      });
    } else {
      steps.push({
        time: formatTimeAgo(0),
        label: batches > 1 ? `Dump batch ${b} — EAT!` : "Dump & EAT!",
        desc: "Lift basket, dump on newspaper-covered table. Serve immediately. Laissez les bons temps rouler!",
        highlight: true,
      });
    }
  }

  return steps;
}

/* ── URL STATE ENCODING/DECODING ── */
const DEFAULT_ENABLED_IDS = new Set(
  Object.entries(DEFAULTS)
    .filter(([, v]) => v.category === "essentials" || v.category === "supplies")
    .map(([k]) => k)
);

function encodeStateToURL(guests, items, heat) {
  const params = new URLSearchParams();
  if (guests !== 10) params.set("g", guests);
  if (heat !== 2) params.set("h", heat);

  const enabledIds = items.filter(i => i.enabled && !i.id.startsWith("c_")).map(i => i.id);
  const enabledSet = new Set(enabledIds);
  const isDifferent = enabledIds.length !== DEFAULT_ENABLED_IDS.size ||
    enabledIds.some(id => !DEFAULT_ENABLED_IDS.has(id)) ||
    [...DEFAULT_ENABLED_IDS].some(id => !enabledSet.has(id));
  if (isDifferent) params.set("on", enabledIds.join(","));

  const overrides = items.filter(i => i.enabled && i.qtyOverride !== null && !i.id.startsWith("c_"));
  if (overrides.length > 0) params.set("q", overrides.map(i => `${i.id}:${i.qtyOverride}`).join(","));

  const qs = params.toString();
  return qs ? `${window.location.origin}${window.location.pathname}?${qs}` : `${window.location.origin}${window.location.pathname}`;
}

function decodeStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("g") && !params.has("h") && !params.has("on") && !params.has("q")) return null;
  const result = {};
  if (params.has("g")) result.guests = Math.min(500, Math.max(1, parseInt(params.get("g")) || 10));
  if (params.has("h")) result.heat = Math.min(4, Math.max(0, parseInt(params.get("h")) || 2));
  if (params.has("on")) result.enabledIds = new Set(params.get("on").split(",").filter(Boolean));
  if (params.has("q")) {
    result.qtyOverrides = {};
    params.get("q").split(",").forEach(pair => {
      const [id, qty] = pair.split(":");
      if (id && qty) result.qtyOverrides[id] = parseInt(qty) || 0;
    });
  }
  return result;
}

const HEAT_LEVELS = [
  { label: "Mild", desc: "Just a tingle", mult: 0.5, color: "#60a5fa" },
  { label: "Medium", desc: "Crowd pleaser", mult: 0.75, color: "#34d399" },
  { label: "Hot", desc: "Louisiana standard", mult: 1, color: "#fbbf24" },
  { label: "Extra Hot", desc: "Sweating encouraged", mult: 1.5, color: "#f97316" },
  { label: "Inferno", desc: "Pain is flavor", mult: 2, color: "#ef4444" },
];
const SEASONING_IDS = ["seasoning", "seasonliq", "jalapenos"];

const CATS = [
  { key: "essentials", label: "Essentials" },
  { key: "popular", label: "Popular Add-Ins" },
  { key: "extras", label: "More Extras" },
  { key: "supplies", label: "Supplies" },
  { key: "drinks", label: "Drinks" },
  { key: "custom", label: "Custom" },
];

/* ── NAV ── */
function Nav({ active, setActive }) {
  const tabs = [
    { id: "calculator", label: "Calculator" },
    { id: "plan", label: "Plan" },
    { id: "recipes", label: "Recipes" },
    { id: "equipment", label: "Gear" },
    { id: "safety", label: "Safety" },
    { id: "tips", label: "Tips" },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand"><img src="/icon-192.png" alt="" className="brand-icon" />CrawfishBoilCalculator.com</div>
        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`tab ${active === t.id ? "tab--on" : ""}`}>{t.label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ── CALCULATOR ── */
const STORAGE_KEY = "boilcalc_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function Calculator() {
  const saved = useMemo(() => loadState(), []);
  const urlState = useMemo(() => decodeStateFromURL(), []);

  const [guests, setGuests] = useState(urlState?.guests ?? saved?.guests ?? 10);
  const [items, setItems] = useState(() => {
    const defaults = Object.entries(DEFAULTS).map(([key, val]) => ({
      id: key, ...val,
      enabled: val.category === "essentials" || val.category === "supplies",
      qtyOverride: null,
    }));

    if (urlState?.enabledIds) {
      // URL params take priority
      defaults.forEach(d => { d.enabled = urlState.enabledIds.has(d.id); });
    } else if (saved?.items) {
      // Merge saved state into defaults (preserves new items added to DEFAULTS)
      const savedMap = Object.fromEntries(saved.items.map(i => [i.id, i]));
      defaults.forEach((d, idx) => {
        if (savedMap[d.id]) defaults[idx] = { ...d, enabled: savedMap[d.id].enabled, qtyOverride: savedMap[d.id].qtyOverride, pricePerUnit: savedMap[d.id].pricePerUnit };
      });
    }

    // Apply URL quantity overrides
    if (urlState?.qtyOverrides) {
      defaults.forEach(d => {
        if (urlState.qtyOverrides[d.id] !== undefined) d.qtyOverride = urlState.qtyOverrides[d.id];
      });
    }

    // Append any custom items from saved state
    if (saved?.items) {
      const customItems = saved.items.filter(i => i.category === "custom");
      return [...defaults, ...customItems];
    }
    return defaults;
  });
  const [collapsed, setCollapsed] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [heat, setHeat] = useState(urlState?.heat ?? saved?.heat ?? 2);
  const [newItem, setNewItem] = useState({ name: "", perPerson: 0.25, pricePerUnit: 1.00, unit: "ea" });
  const [showList, setShowList] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [checked, setChecked] = useState(saved?.checked ?? {});

  // Save/load plans
  const [plans, setPlans] = useState(() => {
    try { const raw = localStorage.getItem("boilcalc_plans"); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [showPlans, setShowPlans] = useState(false);
  const [planName, setPlanName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Clean URL after loading state from params
  useEffect(() => {
    if (urlState) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  // Persist state on changes (debounced)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveState({ guests, items, heat, checked });
    }, 400);
    return () => clearTimeout(saveTimerRef.current);
  }, [guests, items, heat, checked]);

  // Persist plans (debounced)
  const plansTimerRef = useRef(null);
  useEffect(() => {
    clearTimeout(plansTimerRef.current);
    plansTimerRef.current = setTimeout(() => {
      try { localStorage.setItem("boilcalc_plans", JSON.stringify(plans)); } catch {}
    }, 400);
    return () => clearTimeout(plansTimerRef.current);
  }, [plans]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showList) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showList]);

  const heatMult = HEAT_LEVELS[heat].mult;

  const getQty = useCallback((item) => {
    if (item.qtyOverride !== null) return item.qtyOverride;
    const base = Math.ceil(item.perPerson * guests);
    return SEASONING_IDS.includes(item.id) ? Math.ceil(base * heatMult) : base;
  }, [guests, heatMult]);

  const totalCost = useMemo(() => items.filter(i => i.enabled).reduce((s, i) => s + getQty(i) * i.pricePerUnit, 0), [items, getQty]);
  const perPerson = guests > 0 ? totalCost / guests : 0;
  const totalLbs = useMemo(() => items.filter(i => i.enabled && i.id === "crawfish").reduce((s, i) => s + getQty(i), 0), [items, getQty]);
  const batchCount = totalLbs > 0 ? Math.ceil(totalLbs / BATCH_MAX_LBS) : 0;
  const lbsPerBatch = batchCount > 0 ? Math.ceil(totalLbs / batchCount) : 0;
  const totalCookMinutes = batchCount * BATCH_COOK_MIN;
  const potSize = getPotSize(batchCount > 1 ? lbsPerBatch : totalLbs);
  const timeline = useMemo(() =>
    totalLbs > 0 ? generateTimeline(batchCount > 1 ? batchCount : 1, totalLbs) : [],
    [batchCount, totalLbs]
  );

  const upd = useCallback((id, c) => setItems(p => p.map(i => i.id === id ? { ...i, ...c } : i)), []);
  const del = useCallback((id) => setItems(p => p.filter(i => i.id !== id)), []);

  const toggleCat = useCallback((catKey) => {
    setItems(p => {
      const catItems = p.filter(i => i.category === catKey);
      const allOn = catItems.every(i => i.enabled);
      return p.map(i => i.category === catKey ? { ...i, enabled: !allOn } : i);
    });
  }, []);

  // Pre-compute category stats to avoid per-render recalculation
  const catStats = useMemo(() => {
    const stats = {};
    for (const cat of CATS) {
      const ci = items.filter(i => i.category === cat.key);
      const enabled = ci.filter(i => i.enabled);
      stats[cat.key] = {
        subtotal: enabled.reduce((s, i) => s + getQty(i) * i.pricePerUnit, 0),
        enabled: enabled.length,
        total: ci.length,
      };
    }
    return stats;
  }, [items, getQty]);

  const addCustom = () => {
    const name = newItem.name.trim();
    if (!name) return;
    const pp = Number(newItem.perPerson) || 0.25;
    const ppu = Number(newItem.pricePerUnit) || 1.00;
    setItems(p => [...p, {
      id: "c_" + Date.now(), name,
      perPerson: pp, pricePerUnit: ppu,
      unit: newItem.unit || "ea", category: "custom", enabled: true, qtyOverride: null,
    }]);
    setNewItem({ name: "", perPerson: 0.25, pricePerUnit: 1.00, unit: "ea" });
    setShowAdd(false);
  };

  const resetAll = () => {
    setGuests(10);
    setHeat(2);
    setChecked({});
    setItems(Object.entries(DEFAULTS).map(([key, val]) => ({
      id: key, ...val,
      enabled: val.category === "essentials" || val.category === "supplies",
      qtyOverride: null,
    })));
    localStorage.removeItem(STORAGE_KEY);
  };

  const enabledItems = useMemo(() => items.filter(i => i.enabled), [items]);
  const toggleCheck = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const clearChecks = () => setChecked({});

  const generateListText = () => {
    let text = `Crawfish Boil Shopping List (${guests} guests)\n`;
    text += `Total: $${round(totalCost).toFixed(2)} / $${round(perPerson).toFixed(2)} per person\n`;
    text += `Heat: ${HEAT_LEVELS[heat].label}\n\n`;
    CATS.forEach(cat => {
      const ci = enabledItems.filter(i => i.category === cat.key);
      if (!ci.length) return;
      text += `${cat.label.toUpperCase()}\n`;
      ci.forEach(i => {
        const qty = getQty(i);
        text += `  [ ] ${qty} ${i.unit} - ${i.name} ($${(qty * i.pricePerUnit).toFixed(2)})\n`;
      });
      text += `\n`;
    });
    text += `---\nMade with CrawfishBoilCalculator.com`;
    return text;
  };

  // Plans
  const savePlan = () => {
    const name = planName.trim() || `${guests} guests — ${new Date().toLocaleDateString()}`;
    setPlans(prev => [{ id: "plan_" + Date.now(), name, createdAt: Date.now(), state: { guests, heat, items: items.map(i => ({ ...i })) } }, ...prev]);
    setPlanName(""); setShowSaveInput(false);
  };
  const loadPlan = (plan) => {
    setGuests(plan.state.guests); setHeat(plan.state.heat);
    setItems(plan.state.items.map(i => ({ ...i }))); setChecked({}); setShowPlans(false);
  };
  const deletePlan = (planId) => setPlans(prev => prev.filter(p => p.id !== planId));

  // Share link
  const copyLink = async () => {
    const url = encodeStateToURL(guests, items, heat);
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {}
  };

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(generateListText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareList = async () => {
    const text = generateListText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `Crawfish Boil - ${guests} guests`, text });
        return;
      } catch {}
    }
    copyList();
  };

  const textList = () => {
    const text = generateListText();
    const encoded = encodeURIComponent(text);
    window.location.href = `sms:?body=${encoded}`;
  };

  const printList = () => {
    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w) return;
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Shopping List - ${guests} guests</title><style>
      *{margin:0;box-sizing:border-box}body{font-family:-apple-system,system-ui,sans-serif;padding:24px;max-width:480px;color:#111}
      h1{font-size:18px;margin-bottom:2px}
      .summary{font-size:13px;color:#666;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #ddd}
      .cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#888;margin:14px 0 6px}
      .item{display:flex;gap:8px;align-items:baseline;padding:3px 0;font-size:14px}
      .cb{width:14px;height:14px;border:1.5px solid #999;border-radius:2px;flex-shrink:0;margin-top:2px}
      .qty{font-weight:600;min-width:50px;font-size:13px;color:#555}
      .name{flex:1}.cost{color:#888;font-size:13px}
      .total{margin-top:16px;padding-top:12px;border-top:2px solid #111;font-size:16px;font-weight:700;display:flex;justify-content:space-between}
      .footer{margin-top:16px;font-size:11px;color:#aaa;text-align:center}
      @media print{body{padding:12px}}
    </style></head><body>`;
    html += `<h1>Crawfish Boil Shopping List</h1>`;
    html += `<div class="summary">${guests} guests · $${round(perPerson).toFixed(2)}/person · ${HEAT_LEVELS[heat].label} heat</div>`;
    CATS.forEach(cat => {
      const ci = enabledItems.filter(i => i.category === cat.key);
      if (!ci.length) return;
      html += `<div class="cat">${cat.label}</div>`;
      ci.forEach(i => {
        const qty = getQty(i);
        html += `<div class="item"><div class="cb"></div><span class="qty">${qty} ${i.unit}</span><span class="name">${i.name}</span><span class="cost">$${(qty * i.pricePerUnit).toFixed(2)}</span></div>`;
      });
    });
    html += `<div class="total"><span>Total</span><span>$${round(totalCost).toFixed(2)}</span></div>`;
    html += `<div class="footer">CrawfishBoilCalculator.com</div>`;
    html += `</body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <section className="page page--calc">
      <h2 className="page-title">Calculator</h2>
      <p className="page-desc">Plan quantities and costs for your crawfish boil.</p>

      {/* Guests */}
      <div className="card">
        <div className="card-label">Guests</div>
        <div className="guest-row">
          <div className="guest-ctrl">
            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="btn-step">-</button>
            <input type="number" value={guests}
              onChange={e => setGuests(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
              className="input guest-num" />
            <button onClick={() => setGuests(Math.min(500, guests + 1))} className="btn-step">+</button>
          </div>
          <div className="pills">
            {[10, 25, 50, 100, 250].map(n => (
              <button key={n} onClick={() => setGuests(n)}
                className={`pill ${guests === n ? "pill--on" : ""}`}>{n}</button>
            ))}
          </div>
        </div>
        <div className="plans-row">
          {!showSaveInput ? (
            <>
              <button className="btn-outline btn-sm" onClick={() => setShowSaveInput(true)}>Save plan</button>
              {plans.length > 0 && (
                <button className="btn-outline btn-sm" onClick={() => setShowPlans(!showPlans)}>
                  Load ({plans.length})
                </button>
              )}
            </>
          ) : (
            <div className="plans-save-row">
              <input className="input plans-name-input"
                placeholder={`${guests} guests — ${new Date().toLocaleDateString()}`}
                value={planName} onChange={e => setPlanName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && savePlan()} autoFocus />
              <button className="btn-primary btn-sm" onClick={savePlan}>Save</button>
              <button className="btn-outline btn-sm" onClick={() => setShowSaveInput(false)}>Cancel</button>
            </div>
          )}
        </div>
        {showPlans && plans.length > 0 && (
          <div className="plans-list">
            {plans.map(p => (
              <div key={p.id} className="plans-item">
                <button className="plans-load" onClick={() => loadPlan(p)}>
                  <span className="plans-item-name">{p.name}</span>
                  <span className="plans-item-meta">{new Date(p.createdAt).toLocaleDateString()}</span>
                </button>
                <button className="plans-del" onClick={() => deletePlan(p.id)}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heat Level */}
      <div className="card">
        <div className="card-label">Heat Level</div>
        <div className="heat-row">
          {HEAT_LEVELS.map((h, i) => (
            <button key={i} onClick={() => setHeat(i)}
              className={`heat-btn ${heat === i ? "heat-btn--on" : ""}`}
              style={heat === i ? { borderColor: h.color, color: h.color } : {}}>
              <span className="heat-label">{h.label}</span>
              <span className="heat-desc">{h.desc}</span>
              <span className="heat-bar">
                {Array.from({ length: i + 1 }).map((_, j) => (
                  <span key={j} className="heat-dot" style={{ background: heat === i ? h.color : "var(--text3)" }} />
                ))}
              </span>
            </button>
          ))}
        </div>
        <div className="heat-note">Adjusts seasoning and spice quantities. Currently at {HEAT_LEVELS[heat].mult}x seasoning.</div>
      </div>

      {/* Items by category */}
      {CATS.map(cat => {
        const ci = items.filter(i => i.category === cat.key);
        if (!ci.length) return null;
        const isCollapsed = collapsed[cat.key];
        const { subtotal: sub, enabled: en, total: tot } = catStats[cat.key];

        return (
          <div key={cat.key} className="group">
            <div className="group-hdr" role="button" tabIndex={0} onClick={() => setCollapsed(p => ({ ...p, [cat.key]: !isCollapsed }))}>
              <span className={`group-chev ${isCollapsed ? "" : "group-chev--open"}`}>&#9656;</span>
              <span className="group-title">{cat.label}</span>
              <span className="group-count">{en}/{tot}</span>
              {sub > 0 && <span className="group-sub">${round(sub).toFixed(2)}</span>}
              <button className="group-toggle" onClick={e => { e.stopPropagation(); toggleCat(cat.key); }}>
                {en === tot ? "None" : "All"}
              </button>
            </div>
            {!isCollapsed && ci.map(item => (
              <div key={item.id} className={`row ${item.enabled ? "" : "row--off"}`}>
                <button onClick={() => upd(item.id, { enabled: !item.enabled })}
                  className={`tog ${item.enabled ? "tog--on" : ""}`}>
                  <span className="tog-knob" />
                </button>
                <span className="row-name">{item.name}</span>
                <div className="row-qty">
                  <button onClick={() => upd(item.id, { qtyOverride: Math.max(0, getQty(item) - 1) })} className="btn-xs">-</button>
                  <input type="number" value={getQty(item)}
                    onChange={e => upd(item.id, { qtyOverride: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="input qty-in" />
                  <button onClick={() => upd(item.id, { qtyOverride: getQty(item) + 1 })} className="btn-xs">+</button>
                  <span className="row-unit">{item.unit}</span>
                </div>
                {editingPrice === item.id ? (
                  <div className="row-price-edit">
                    <span className="row-price-dollar">$</span>
                    <input type="number" step="0.01" value={item.pricePerUnit}
                      onChange={e => upd(item.id, { pricePerUnit: Math.max(0, parseFloat(e.target.value) || 0) })}
                      onBlur={() => setEditingPrice(null)}
                      autoFocus
                      className="input price-in" />
                    <span className="row-price-per">/{item.unit}</span>
                  </div>
                ) : (
                  <span className="row-cost" onClick={() => setEditingPrice(item.id)}>
                    ${(getQty(item) * item.pricePerUnit).toFixed(2)}
                  </span>
                )}
                {item.category === "custom" && (
                  <button onClick={() => del(item.id)} className="btn-xs btn-xs--del">x</button>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Add custom */}
      {showAdd ? (
        <div className="card card--glow">
          <div className="card-label">Add item</div>
          <div className="add-grid">
            <div><label className="field-lbl">Name</label>
              <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="input" placeholder="e.g. Broccoli" /></div>
            <div><label className="field-lbl">Unit</label>
              <input value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                className="input" placeholder="lb, ea, bag" /></div>
            <div><label className="field-lbl">Qty / person</label>
              <input type="number" step="0.1" value={newItem.perPerson}
                onChange={e => setNewItem({ ...newItem, perPerson: e.target.value })} className="input" /></div>
            <div><label className="field-lbl">Price / unit</label>
              <input type="number" step="0.01" value={newItem.pricePerUnit}
                onChange={e => setNewItem({ ...newItem, pricePerUnit: e.target.value })} className="input" /></div>
          </div>
          <div className="add-actions">
            <button onClick={addCustom} className="btn-primary">Add</button>
            <button onClick={() => setShowAdd(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="btn-outline btn-full">+ Add custom item</button>
      )}

      <div className="calc-footer-row">
        <p className="footnote">
          Prices are estimates. Tap any cost to edit the price per unit. Crawfish prices peak early spring and drop March-June.
        </p>
        <button onClick={resetAll} className="btn-reset">Reset all to defaults</button>
      </div>

      {/* Shopping List Overlay */}
      {showList && (
        <div className="sl-overlay" onClick={() => setShowList(false)}>
          <div className="sl-modal" onClick={e => e.stopPropagation()}>
            <div className="sl-header">
              <span className="sl-title">Shopping List</span>
              <button className="sl-close" onClick={() => setShowList(false)}>&times;</button>
            </div>
            <div className="sl-summary">
              <span>{guests} guests &middot; ${round(totalCost).toFixed(2)} total &middot; {HEAT_LEVELS[heat].label}</span>
              {Object.values(checked).filter(Boolean).length > 0 && (
                <span className="sl-checked-count">
                  &nbsp;&middot; {Object.values(checked).filter(Boolean).length}/{enabledItems.length} done
                  <button className="sl-uncheck" onClick={clearChecks}>Clear</button>
                </span>
              )}
            </div>
            <div className="sl-items">
              {CATS.map(cat => {
                const ci = enabledItems.filter(i => i.category === cat.key);
                if (!ci.length) return null;
                return (
                  <div key={cat.key} className="sl-cat">
                    <div className="sl-cat-label">{cat.label}</div>
                    {ci.map(i => {
                      const qty = getQty(i);
                      const link = ITEM_LINKS[i.id];
                      const isDone = checked[i.id];
                      return (
                        <div key={i.id} className={`sl-row ${isDone ? "sl-row--done" : ""}`}>
                          <button className={`sl-check ${isDone ? "sl-check--on" : ""}`} onClick={() => toggleCheck(i.id)}>
                            {isDone && <span className="sl-checkmark">&#10003;</span>}
                          </button>
                          <span className="sl-qty">{qty} {i.unit}</span>
                          {link ? (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="sl-name sl-name--link">{i.name}</a>
                          ) : (
                            <span className="sl-name">{i.name}</span>
                          )}
                          <span className="sl-cost">${(qty * i.pricePerUnit).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="sl-actions">
              <button className="sl-btn sl-btn--primary" onClick={copyList}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button className="sl-btn" onClick={shareList}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </button>
              <button className="sl-btn" onClick={textList}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Text
              </button>
              <button className="sl-btn" onClick={printList}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print
              </button>
              <button className="sl-btn" onClick={copyLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                {linkCopied ? "Copied!" : "Link"}
              </button>
            </div>
            <div className="sl-affiliate-note">
              Some links support CrawfishBoilCalculator.com at no extra cost to you.
            </div>
          </div>
        </div>
      )}

      {/* Sticky bottom stats */}
      <div className="sticky-stats">
        <div className="ss-item">
          <span className="ss-val ss-val--accent">${round(totalCost).toFixed(2)}</span>
          <span className="ss-lbl">Total</span>
        </div>
        <div className="ss-divider" />
        <div className="ss-item">
          <span className="ss-val">${round(perPerson).toFixed(2)}</span>
          <span className="ss-lbl">Per person</span>
        </div>
        <div className="ss-divider" />
        <div className="ss-item">
          <span className="ss-val">{totalLbs} lbs</span>
          <span className="ss-lbl">{potSize !== "—" ? `${potSize} pot` : "Crawfish"}</span>
        </div>
        <div className="ss-divider" />
        <button className="ss-share" onClick={() => setShowList(true)}>
          <svg className="ss-share-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <span className="ss-lbl">Share List</span>
        </button>
      </div>
    </section>
  );
}

/* ── PLAN (TIMELINE + BATCH) ── */
function Plan() {
  const saved = useMemo(() => loadState(), []);
  const guests = saved?.guests ?? 10;
  const heat = saved?.heat ?? 2;
  const items = useMemo(() => {
    const defaults = Object.entries(DEFAULTS).map(([key, val]) => ({
      id: key, ...val,
      enabled: val.category === "essentials" || val.category === "supplies",
      qtyOverride: null,
    }));
    if (!saved?.items) return defaults;
    const savedMap = Object.fromEntries(saved.items.map(i => [i.id, i]));
    return defaults.map(d => savedMap[d.id] ? { ...d, enabled: savedMap[d.id].enabled, qtyOverride: savedMap[d.id].qtyOverride } : d);
  }, [saved]);

  const heatMult = HEAT_LEVELS[heat].mult;
  const getQty = useCallback((item) => {
    if (item.qtyOverride !== null) return item.qtyOverride;
    const base = Math.ceil(item.perPerson * guests);
    return SEASONING_IDS.includes(item.id) ? Math.ceil(base * heatMult) : base;
  }, [guests, heatMult]);

  const totalLbs = items.filter(i => i.enabled && i.id === "crawfish").reduce((s, i) => s + getQty(i), 0);
  const batchCount = totalLbs > 0 ? Math.ceil(totalLbs / BATCH_MAX_LBS) : 0;
  const lbsPerBatch = batchCount > 0 ? Math.ceil(totalLbs / batchCount) : 0;
  const totalCookMinutes = batchCount * BATCH_COOK_MIN;
  const timeline = useMemo(() =>
    totalLbs > 0 ? generateTimeline(batchCount > 1 ? batchCount : 1, totalLbs) : [],
    [batchCount, totalLbs]
  );

  if (totalLbs === 0) {
    return (
      <section className="page">
        <h2 className="page-title">Boil Day Plan</h2>
        <p className="page-desc">Set your guest count and enable crawfish in the Calculator tab to see your boil day plan.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2 className="page-title">Boil Day Plan</h2>
      <p className="page-desc">{guests} guests &middot; {totalLbs} lbs crawfish &middot; {HEAT_LEVELS[heat].label} heat</p>

      {/* Batch Calculator */}
      {batchCount > 1 && (
        <div className="card batch-card">
          <div className="batch-icon">🦞</div>
          <div className="batch-info">
            <div className="batch-headline">{batchCount} batches needed</div>
            <div className="batch-details">
              ~{lbsPerBatch} lbs/batch &middot; {formatTime(BATCH_COOK_MIN)} each &middot; {formatTime(totalCookMinutes)} total
            </div>
            <div className="batch-tip">
              Standard 80-qt pot holds ~{BATCH_MAX_LBS} lbs. Recommended pot: {getPotSize(lbsPerBatch)}.
            </div>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="card plan-stats">
        <div className="plan-stat">
          <span className="plan-stat-val">{totalLbs} lbs</span>
          <span className="plan-stat-lbl">Crawfish</span>
        </div>
        <div className="plan-stat">
          <span className="plan-stat-val">{getPotSize(batchCount > 1 ? lbsPerBatch : totalLbs)}</span>
          <span className="plan-stat-lbl">Pot size</span>
        </div>
        <div className="plan-stat">
          <span className="plan-stat-val">{batchCount > 1 ? batchCount : 1}</span>
          <span className="plan-stat-lbl">{batchCount > 1 ? "Batches" : "Batch"}</span>
        </div>
        <div className="plan-stat">
          <span className="plan-stat-val">{formatTime(totalCookMinutes || BATCH_COOK_MIN)}</span>
          <span className="plan-stat-lbl">Cook time</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card timeline-card">
        <div className="card-label">Timeline</div>
        <div className="timeline">
          {timeline.map((step, i) => (
            <div key={i} className={`tl-step ${step.highlight ? "tl-step--hl" : ""}`}>
              <div className="tl-marker">
                <div className="tl-dot" />
                {i < timeline.length - 1 && <div className="tl-line" />}
              </div>
              <div className="tl-content">
                <div className="tl-time">{step.time}</div>
                <div className="tl-label">{step.label}</div>
                <div className="tl-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-affiliate">As an Amazon Associate I earn from qualifying purchases.</div>
      <div className="footer-bottom">
        <span className="footer-brand">CrawfishBoilCalculator.com</span>
        <span className="footer-copy">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

/* ── LAZY-LOADED PAGES ── */
const LazyRecipes = lazy(() => import("./pages/Recipes.jsx"));
const LazyEquipment = lazy(() => import("./pages/Equipment.jsx"));
const LazySafety = lazy(() => import("./pages/Safety.jsx"));
const LazyTips = lazy(() => import("./pages/Tips.jsx"));

/* ── APP ── */
export default function App() {
  const [page, setPage] = useState("calculator");
  const changePage = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);
  return (
    <div className="app">
      <Nav active={page} setActive={changePage} />
      {page === "calculator" && <Calculator />}
      {page === "plan" && <Plan />}
      <Suspense fallback={null}>
        {page === "recipes" && <LazyRecipes />}
        {page === "equipment" && <LazyEquipment />}
        {page === "safety" && <LazySafety />}
        {page === "tips" && <LazyTips />}
      </Suspense>
      <Footer />
    </div>
  );
}
