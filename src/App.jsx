import { useState, useEffect, useMemo, useCallback } from "react";

const DEFAULTS = {
  crawfish: { name: "Live Crawfish", perPerson: 3, pricePerUnit: 4.50, unit: "lb", category: "essentials" },
  potatoes: { name: "Red Potatoes", perPerson: 0.5, pricePerUnit: 1.25, unit: "lb", category: "essentials" },
  corn: { name: "Corn (frozen ears)", perPerson: 2, pricePerUnit: 0.75, unit: "ear", category: "essentials" },
  sausage: { name: "Andouille / Smoked Sausage", perPerson: 0.33, pricePerUnit: 5.99, unit: "lb", category: "essentials" },
  seasoning: { name: "Boil Seasoning, 4 lb bag", perPerson: 0.15, pricePerUnit: 6.99, unit: "bag", category: "essentials" },
  seasonliq: { name: "Liquid Boil Concentrate, 16 oz", perPerson: 0.08, pricePerUnit: 5.49, unit: "btl", category: "essentials" },
  lemons: { name: "Lemons", perPerson: 0.5, pricePerUnit: 0.60, unit: "ea", category: "essentials" },
  garlic: { name: "Garlic (whole heads)", perPerson: 0.25, pricePerUnit: 0.75, unit: "head", category: "essentials" },
  onions: { name: "Yellow Onions", perPerson: 0.25, pricePerUnit: 1.00, unit: "ea", category: "essentials" },
  bread: { name: "French Bread (loaves)", perPerson: 0.5, pricePerUnit: 3.50, unit: "loaf", category: "essentials" },
  mushrooms: { name: "Button Mushrooms", perPerson: 0.15, pricePerUnit: 3.99, unit: "lb", category: "popular" },
  brusselsprouts: { name: "Brussels Sprouts", perPerson: 0.15, pricePerUnit: 3.49, unit: "lb", category: "popular" },
  artichokes: { name: "Whole Artichokes", perPerson: 0.25, pricePerUnit: 2.50, unit: "ea", category: "popular" },
  oranges: { name: "Oranges", perPerson: 0.25, pricePerUnit: 0.75, unit: "ea", category: "popular" },
  celery: { name: "Celery (stalks)", perPerson: 0.5, pricePerUnit: 2.49, unit: "bunch", category: "popular" },
  sweetpotato: { name: "Sweet Potatoes", perPerson: 0.25, pricePerUnit: 1.49, unit: "lb", category: "popular" },
  pineapple: { name: "Pineapple (whole)", perPerson: 0.1, pricePerUnit: 3.99, unit: "ea", category: "popular" },
  carrots: { name: "Baby Carrots, 1 lb bag", perPerson: 0.15, pricePerUnit: 2.49, unit: "bag", category: "popular" },
  butter: { name: "Butter (sticks)", perPerson: 0.5, pricePerUnit: 1.25, unit: "stick", category: "extras" },
  boudin: { name: "Boudin Links", perPerson: 0.25, pricePerUnit: 6.99, unit: "lb", category: "extras" },
  shrimp: { name: "Shell-On Shrimp", perPerson: 0.25, pricePerUnit: 7.99, unit: "lb", category: "extras" },
  hotdogs: { name: "Hot Dogs, 8-ct pack", perPerson: 0.5, pricePerUnit: 4.99, unit: "pk", category: "extras" },
  jalapenos: { name: "Whole Jalapenos", perPerson: 0.25, pricePerUnit: 1.49, unit: "lb", category: "extras" },
  bellpepper: { name: "Mini Bell Peppers, 16 oz", perPerson: 0.15, pricePerUnit: 3.49, unit: "bag", category: "extras" },
  cauliflower: { name: "Cauliflower (whole head)", perPerson: 0.1, pricePerUnit: 2.99, unit: "head", category: "extras" },
  boiledeggs: { name: "Hard-Boiled Eggs", perPerson: 1, pricePerUnit: 0.30, unit: "ea", category: "extras" },
  greenbeans: { name: "Green Beans, 14.5 oz can", perPerson: 0.15, pricePerUnit: 1.29, unit: "can", category: "extras" },
  cabbage: { name: "Cabbage (quartered)", perPerson: 0.1, pricePerUnit: 2.49, unit: "head", category: "extras" },
  cocktailsauce: { name: "Cocktail Sauce, 12 oz", perPerson: 0.1, pricePerUnit: 3.49, unit: "btl", category: "extras" },
  ice: { name: "Ice, 10 lb bag", perPerson: 0.5, pricePerUnit: 3.50, unit: "bag", category: "supplies" },
  newspaper: { name: "Butcher Paper, 100 ft roll", perPerson: 0.05, pricePerUnit: 8.99, unit: "roll", category: "supplies" },
  vinegar: { name: "White Vinegar", perPerson: 0.05, pricePerUnit: 3.49, unit: "gal", category: "supplies" },
  salt: { name: "Coarse Salt, 3 lb box", perPerson: 0.05, pricePerUnit: 2.49, unit: "box", category: "supplies" },
  papertowels: { name: "Paper Towels, 6-roll pk", perPerson: 0.15, pricePerUnit: 5.99, unit: "pk", category: "supplies" },
  trashbags: { name: "Trash Bags, 30 ct heavy duty", perPerson: 0.1, pricePerUnit: 8.99, unit: "box", category: "supplies" },
  plates: { name: "Disposable Plates, 50 ct", perPerson: 0.3, pricePerUnit: 5.99, unit: "pk", category: "supplies" },
  cups: { name: "Plastic Cups, 16 oz 50 ct", perPerson: 0.3, pricePerUnit: 4.99, unit: "pk", category: "supplies" },
  wetwipes: { name: "Wet Wipes, 40 ct pack", perPerson: 0.15, pricePerUnit: 3.99, unit: "pk", category: "supplies" },
  servingtrays: { name: "Aluminum Serving Trays, 5 pk", perPerson: 0.05, pricePerUnit: 8.99, unit: "pk", category: "supplies" },
  ziplocks: { name: "Zip-Lock Bags, gallon 30 ct", perPerson: 0.1, pricePerUnit: 4.99, unit: "box", category: "supplies" },
  beer: { name: "Beer, 12-pack", perPerson: 0.5, pricePerUnit: 15.99, unit: "pk", category: "drinks" },
  water: { name: "Bottled Water, 24-pack", perPerson: 0.15, pricePerUnit: 5.99, unit: "case", category: "drinks" },
  soda: { name: "Soft Drinks, 12-pack", perPerson: 0.2, pricePerUnit: 6.99, unit: "pk", category: "drinks" },
  lemonade: { name: "Lemonade / Sweet Tea", perPerson: 0.15, pricePerUnit: 4.99, unit: "gal", category: "drinks" },
};

const EQUIPMENT = [
  { name: "80-Qt Boiling Pot w/ Basket", price: "$89-$140", desc: "The workhorse. Get one with a strainer basket and lid. 80-qt handles 30-40 lbs of crawfish.", tier: "essential" },
  { name: "High-Pressure Propane Burner", price: "$50-$100", desc: "You need serious BTUs. Look for 100,000+ BTU burners. Bayou Classic and King Kooker are solid.", tier: "essential" },
  { name: "Propane Tank (20 lb)", price: "$20-$40", desc: "A full tank will last you through most boils. Always have a backup if you're doing 60+ lbs.", tier: "essential" },
  { name: "Crawfish Paddle", price: "$15-$30", desc: "Long wooden or metal paddle for stirring. Don't use a regular spoon -- you need reach.", tier: "essential" },
  { name: "Purge Tub / Washtub", price: "$15-$40", desc: "Dedicated container for purging. A large plastic washtub, kiddie pool, or second cooler works. Keep separate from your drink cooler.", tier: "essential" },
  { name: "Heavy Duty Gloves", price: "$10-$20", desc: "Heat-resistant gloves for handling the basket. Silicone or leather -- not latex.", tier: "recommended" },
  { name: "Outdoor Folding Table (6ft)", price: "$40-$60", desc: "Cover it with butcher paper. This is where the magic happens. Two tables for 30+ people.", tier: "recommended" },
  { name: "Large Cooler (100+ Qt)", price: "$50-$120", desc: "For drinks and ice. A second cooler for purging is ideal but a washtub works too.", tier: "recommended" },
  { name: "Garden Hose + Spray Nozzle", price: "$15-$25", desc: "You need running water for purging -- plan 3-4 full water changes. If your boil spot is far from a spigot, bring a long hose.", tier: "recommended" },
  { name: "Thermometer (Clip-on)", price: "$10-$20", desc: "Know your water temp. You want a rolling boil at 212F before dropping crawfish.", tier: "nice-to-have" },
  { name: "Table Clips / Clamps", price: "$8-$15", desc: "Holds butcher paper down in the wind. Binder clips work in a pinch.", tier: "nice-to-have" },
  { name: "Folding Chairs", price: "$15-$25 each", desc: "People stand to eat but want to sit between batches. Budget 1 chair per 2-3 guests.", tier: "nice-to-have" },
];

const RECIPES = [
  { id: "classic", title: "Classic Louisiana Crawfish Boil", time: "60 min", difficulty: "Easy", category: "boil",
    desc: "The traditional backyard boil. Seasoned water, perfect timing, a long soak, and dumped on newspaper.",
    steps: ["Purge crawfish: dump into a cooler or large basin, run clean water over them until it runs clear (3-4 water changes). Remove any dead ones.", "Fill pot halfway with water. Add a cup of white vinegar.", "Add boil seasoning (powder + liquid), halved lemons and oranges (squeeze juice in first), whole garlic heads, halved onions, celery stalks. Bring to rolling boil, cook 10-15 min.", "Add potatoes and sausage. Boil until potatoes are almost fork-tender, about 10 min.", "Add corn. Boil 5 more minutes.", "Add purged crawfish at a rolling boil. Cover, return to boil, cook 3-5 minutes.", "Kill the fire. Add frozen corn or ice to drop temp. Soak 15-20 min minimum.", "Lift basket, dump on newspaper-covered table. Eat immediately."],
    tip: "The soak is where flavor gets absorbed. 15 min = mild, 20-25 min = well-seasoned, 30+ = spicy." },
  { id: "viet-cajun", title: "Viet-Cajun Crawfish Boil", time: "60 min", difficulty: "Medium", category: "boil",
    desc: "Houston/NOLA fusion style. Standard boil with a garlic butter citrus sauce tossed after.",
    steps: ["Boil crawfish using the classic method -- purge, season water, boil 3-5 min, soak 15-20 min.", "Make sauce: melt 1 stick butter per 3 lbs crawfish. Add minced garlic, cook 2 min.", "Add 2 tbsp Cajun seasoning, 1 tbsp paprika, juice of 2 lemons, 1 tbsp sugar, 2 tbsp liquid boil concentrate.", "Optional: add 1-2 tbsp sriracha or sambal.", "Drain crawfish, toss in batches into butter sauce.", "Dump into bags or bowls. Let sit 5 min.", "Serve with French bread."],
    tip: "Some shops add lemongrass and fish sauce -- experiment and find your style." },
  { id: "garlic-butter", title: "Garlic Butter Crawfish", time: "15 min", difficulty: "Easy", category: "boil",
    desc: "Quick post-boil finisher. Toss a portion in garlic butter for a decadent upgrade.",
    steps: ["Melt 2 sticks butter over medium heat.", "Add minced garlic (8-10 cloves), cook 2 min.", "Add boil seasoning, lemon juice, hot sauce.", "Toss in 3-5 lbs warm boiled crawfish. Stir to coat.", "Cover, sit 5 min off heat.", "Serve with butter pooled at bottom. French bread mandatory."],
    tip: "Works best as a finisher for a portion of your boil, not the whole batch." },
  { id: "etouffee", title: "Crawfish Etouffee", time: "45 min", difficulty: "Medium", category: "cajun",
    desc: "Crawfish tails in a rich, roux-based gravy over rice. A cornerstone of Louisiana cooking.",
    steps: ["Make roux: melt 4 tbsp butter, whisk in 4 tbsp flour. Stir 5-7 min until golden/copper.", "Add holy trinity: diced onion, celery, bell pepper. Cook 8 min.", "Add garlic, cook 1 min. Stir in Cajun seasoning, cayenne, salt, pepper.", "Add 2 cups stock. Stir smooth. Simmer 20-30 min.", "Add 1 lb crawfish tails (and fat). Cook 5 min.", "Finish with green onions, parsley, pat of butter. Serve over rice."],
    tip: "The crawfish fat (yellow stuff from heads) is where the deep flavor lives." },
  { id: "monica", title: "Crawfish Monica", time: "30 min", difficulty: "Easy", category: "cajun",
    desc: "The legendary Jazz Fest creamy crawfish pasta. Rotini, crawfish tails, Creole seasoning, cream sauce.",
    steps: ["Cook 1/2 lb rotini. Drain, rinse, drain again.", "Melt 4 tbsp butter. Saute onion and garlic 3 min.", "Add 1 lb crawfish tails and 1 cup half-and-half. Saute until bubbly.", "Season with Creole seasoning -- pinch at a time, tasting.", "Cook 5-10 min until sauce thickens.", "Toss in pasta. Low heat 10 min, stirring often. Serve immediately."],
    tip: "The original uses rotini -- spirals catch the sauce. No cheese in the original recipe." },
  { id: "fettuccine", title: "Crawfish Fettuccine", time: "35 min", difficulty: "Easy", category: "cajun",
    desc: "The cheesy, indulgent cousin of Crawfish Monica. Fettuccine in a Velveeta cream sauce.",
    steps: ["Cook 1 lb fettuccine. Drain, set aside.", "Melt 4 tbsp butter. Saute onion, bell pepper, celery 5-7 min.", "Add garlic 2 min. Add 1 lb crawfish tails, Cajun seasoning. Cook 2-3 min.", "Sprinkle 2 tbsp flour, stir 1 min. Add 1 cup half-and-half.", "Add 8 oz Velveeta, 1/4 cup sour cream, 1/4 cup Parmesan. Stir until melted.", "Fold in pasta and green onions. Serve hot."],
    tip: "Yes, it uses Velveeta. The processed cheese makes the sauce silky. Not the time for fancy cheese." },
  { id: "bisque", title: "Crawfish Bisque", time: "2+ hrs", difficulty: "Hard", category: "cajun",
    desc: "The crown jewel. Rich roux-based soup with stuffed crawfish heads. Labor-intensive, worth it.",
    steps: ["Clean 3-4 dozen crawfish heads. Set aside.", "Make stuffing: saute trinity, add chopped tails, breadcrumbs, Cajun seasoning, egg.", "Stuff heads, bake 350F for 15-20 min.", "Make dark roux (peanut butter color), 20-25 min.", "Add trinity, cook 10 min. Add 6-8 cups stock, seasonings. Simmer 45 min.", "Add tails and stuffed heads. Simmer 15 min.", "Finish with green onions, parsley. Serve over rice."],
    tip: "This is an all-day project. Save shells and heads from a boil to make stock." },
  { id: "pie", title: "Crawfish Pie", time: "60 min", difficulty: "Medium", category: "cajun",
    desc: "Savory pie with creamy seasoned crawfish filling in flaky crust. Great for leftover tail meat.",
    steps: ["Press bottom pie crust into 9-inch dish.", "Saute trinity in butter 8 min. Add garlic 1 min.", "Add 3 tbsp flour, stir 2 min. Add cream and stock, stir until thick.", "Season, fold in 1 lb tails and green onions. Remove from heat.", "Pour into crust. Cover with top crust, crimp, cut slits.", "Bake 375F 35-40 min until golden. Rest 10 min."],
    tip: "If using leftover boil tail meat, cut Cajun seasoning in half -- it's already seasoned." },
  { id: "poboy", title: "Fried Crawfish Po'Boy", time: "25 min", difficulty: "Easy", category: "cajun",
    desc: "Crispy fried crawfish tails on French bread. A New Orleans classic.",
    steps: ["Set up breading: seasoned flour, buttermilk, seasoned cornmeal/corn flour.", "Pat 1 lb tails dry. Season with Cajun seasoning.", "Dredge in flour, dip in buttermilk, coat in cornmeal.", "Fry at 350-375F, 2-3 min until golden. Drain.", "Toast French bread. Spread mayo or remoulade.", "Layer lettuce, tomato, pickles. Pile on crawfish."],
    tip: "Corn flour (not cornmeal) gives the crispiest coating. Zatarain's Fish Fri works great." },
];

const TIPS = [
  { title: "Purge Your Crawfish", body: "Dump into a cooler, run clean water over them, change 3-4 times until clear. Remove dead ones (straight tails). Let sit in clean water an hour if you have time." },
  { title: "Season the Water First", body: "Seasonings, lemons, oranges, garlic, onions boiling 10-15 min before anything else. Use both powder and liquid concentrate for best results." },
  { title: "Add Vinegar to the Pot", body: "A cup of white distilled vinegar makes shells easier to peel and cuts the lingering smell. Game changer for indoor boils." },
  { title: "Don't Overcook", body: "3-5 min of actual boiling after water returns to rolling boil. Bigger crawfish go longer. Bright red + floating = done. The soak does the rest." },
  { title: "The Soak Is Everything", body: "Kill heat, add ice/frozen corn. Sit 15-30 min. When they start sinking, they've absorbed all they can." },
  { title: "Plan 3 lbs Per Person", body: "Heavy eaters: 5+ lbs. Light: 2 lbs. Budget 3 as baseline. Takes 6-8 lbs whole crawfish to get 1 lb tail meat." },
  { title: "Check Your Crawfish", body: "Most should be alive and active before buying. Straight tails after cooking = dead going in. Toss those." },
  { title: "Save the Leftovers", body: "Peel while warm. Store tails 2-3 days in fridge. Freeze heads/shells for stock. The fat is liquid gold for etouffee." },
  { title: "Use Oranges Too", body: "Oranges add sweetness that balances heat. Squeeze juice in first, toss halves in. Some use grapefruit -- citrus breaks down shells." },
];

const AFFILIATE_TAG = "crawfishboilc-20"; // Replace with your Amazon Associates tag
const amazonLink = (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;

const EQUIPMENT_LINKS = {
  "80-Qt Boiling Pot w/ Basket": amazonLink("80 qt crawfish boiling pot basket"),
  "High-Pressure Propane Burner": amazonLink("high pressure propane burner outdoor cooking"),
  "Propane Tank (20 lb)": amazonLink("20 lb propane tank"),
  "Crawfish Paddle": amazonLink("crawfish boil paddle long wooden"),
  "Purge Tub / Washtub": amazonLink("large plastic washtub outdoor"),
  "Heavy Duty Gloves": amazonLink("heat resistant silicone gloves cooking"),
  "Outdoor Folding Table (6ft)": amazonLink("6ft folding table outdoor"),
  "Large Cooler (100+ Qt)": amazonLink("100 qt cooler"),
  "Garden Hose + Spray Nozzle": amazonLink("garden hose spray nozzle"),
  "Thermometer (Clip-on)": amazonLink("clip on pot thermometer cooking"),
  "Table Clips / Clamps": amazonLink("tablecloth clips outdoor"),
  "Folding Chairs": amazonLink("folding chairs outdoor set"),
};

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
    { id: "recipes", label: "Recipes" },
    { id: "equipment", label: "Gear" },
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

  // Persist state on changes
  useEffect(() => {
    saveState({ guests, items, heat, checked });
  }, [guests, items, heat, checked]);

  // Persist plans
  useEffect(() => {
    try { localStorage.setItem("boilcalc_plans", JSON.stringify(plans)); } catch {}
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

  const totalCost = items.filter(i => i.enabled).reduce((s, i) => s + getQty(i) * i.pricePerUnit, 0);
  const perPerson = guests > 0 ? totalCost / guests : 0;
  const totalLbs = items.filter(i => i.enabled && i.id === "crawfish").reduce((s, i) => s + getQty(i), 0);
  const batchCount = totalLbs > 0 ? Math.ceil(totalLbs / BATCH_MAX_LBS) : 0;
  const lbsPerBatch = batchCount > 0 ? Math.ceil(totalLbs / batchCount) : 0;
  const totalCookMinutes = batchCount * BATCH_COOK_MIN;
  const potSize = getPotSize(batchCount > 1 ? lbsPerBatch : totalLbs);
  const timeline = useMemo(() =>
    totalLbs > 0 ? generateTimeline(batchCount > 1 ? batchCount : 1, totalLbs) : [],
    [batchCount, totalLbs]
  );

  const upd = (id, c) => setItems(p => p.map(i => i.id === id ? { ...i, ...c } : i));
  const del = (id) => setItems(p => p.filter(i => i.id !== id));

  const toggleCat = (catKey) => {
    const catItems = items.filter(i => i.category === catKey);
    const allOn = catItems.every(i => i.enabled);
    setItems(p => p.map(i => i.category === catKey ? { ...i, enabled: !allOn } : i));
  };

  const catSubtotal = (catKey) => items.filter(i => i.category === catKey && i.enabled)
    .reduce((s, i) => s + getQty(i) * i.pricePerUnit, 0);

  const catEnabled = (catKey) => items.filter(i => i.category === catKey && i.enabled).length;
  const catTotal = (catKey) => items.filter(i => i.category === catKey).length;

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
        const sub = catSubtotal(cat.key);
        const en = catEnabled(cat.key);
        const tot = catTotal(cat.key);

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

      {/* Batch Calculator */}
      {batchCount > 1 && (
        <div className="card batch-card">
          <div className="batch-icon">🦞</div>
          <div className="batch-info">
            <div className="batch-headline">{batchCount} batches needed</div>
            <div className="batch-details">
              ~{lbsPerBatch} lbs each &middot; {formatTime(BATCH_COOK_MIN)}/batch &middot; {formatTime(totalCookMinutes)} total cook time
            </div>
            <div className="batch-tip">
              Standard 80-qt pot holds ~{BATCH_MAX_LBS} lbs. Recommended pot: {getPotSize(lbsPerBatch)}.
            </div>
          </div>
        </div>
      )}

      {/* Boil Day Timeline */}
      {timeline.length > 0 && (
        <div className="card timeline-card">
          <div className="card-label">Boil Day Timeline</div>
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

/* ── RECIPES ── */
function Recipes() {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("all");
  const filters = [{ key: "all", label: "All" }, { key: "boil", label: "Boil styles" }, { key: "cajun", label: "Cajun dishes" }];
  const filtered = filter === "all" ? RECIPES : RECIPES.filter(r => r.category === filter);
  return (
    <section className="page">
      <h2 className="page-title">Recipes</h2>
      <p className="page-desc">{RECIPES.length} recipes from boil variations to classic Cajun dishes.</p>
      <div className="pills" style={{ marginBottom: 14 }}>
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
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

/* ── EQUIPMENT ── */
function Equipment() {
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

/* ── TIPS ── */
function Tips() {
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

/* ── APP ── */
export default function App() {
  const [page, setPage] = useState("calculator");
  const changePage = (p) => { setPage(p); window.scrollTo(0, 0); };
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { document.head.removeChild(link); document.head.removeChild(s); };
  }, []);
  return (
    <div className="app">
      <Nav active={page} setActive={changePage} />
      {page === "calculator" && <Calculator />}
      {page === "recipes" && <Recipes />}
      {page === "equipment" && <Equipment />}
      {page === "tips" && <Tips />}
      <Footer />
    </div>
  );
}

const CSS = `
:root {
  --bg: #0b0b0b; --surface: rgba(255,255,255,0.04); --surface2: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.08); --border-accent: rgba(245,158,11,0.25);
  --text: #e8e8e8; --text2: #888; --text3: #555;
  --accent: #f59e0b; --accent2: #fbbf24;
  --font: 'Outfit', -apple-system, sans-serif;
  --r: 12px; --rs: 8px;
}
*,*::before,*::after{box-sizing:border-box;margin:0}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;overflow-x:hidden}
input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none}
input[type="number"]{-moz-appearance:textfield}
::selection{background:rgba(245,158,11,0.25)}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.app{min-height:100vh;background:var(--bg)}

/* NAV */
.nav{position:sticky;top:0;z-index:100;background:rgba(11,11,11,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:680px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;padding:0 12px}
.brand{font-weight:700;font-size:14px;color:var(--accent);letter-spacing:-0.3px;margin-right:auto;padding:10px 0 0;width:100%;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px}
.brand-icon{width:32px;height:32px;border-radius:50%;flex-shrink:0}
.tabs{display:flex;gap:2px;width:100%;justify-content:center}
.tab{background:transparent;color:var(--text3);border:none;padding:10px 10px;cursor:pointer;font-size:12px;font-weight:500;font-family:var(--font);border-bottom:2px solid transparent;transition:all .15s;-webkit-tap-highlight-color:transparent;flex:1;text-align:center}
.tab--on{color:var(--text);border-bottom-color:var(--accent)}

/* PAGE */
.page{max-width:680px;margin:0 auto;padding:16px 10px 40px}
.page--calc{padding-bottom:100px}
.page-title{font-size:22px;font-weight:700;margin:0 0 4px;letter-spacing:-0.5px}
.page-desc{font-size:13px;color:var(--text2);margin:0 0 16px}

/* CARD */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:8px}
.card--glow{border-color:var(--border-accent)}
.card-label{font-size:11px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}

/* INPUT */
.input{background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:var(--rs);color:var(--text);padding:10px 12px;font-size:16px;font-family:var(--font);outline:none;width:100%;-webkit-appearance:none;-webkit-tap-highlight-color:transparent}
.input:focus{border-color:var(--border-accent)}
.field-lbl{font-size:11px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px}

/* BUTTONS */
.btn-primary{background:var(--accent);color:#000;border:none;padding:12px 20px;border-radius:var(--rs);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font);-webkit-tap-highlight-color:transparent}
.btn-outline{background:transparent;color:var(--text2);border:1px solid var(--border);padding:12px 20px;border-radius:var(--rs);font-size:14px;font-weight:500;cursor:pointer;font-family:var(--font);-webkit-tap-highlight-color:transparent}
.btn-full{width:100%;text-align:center}
.btn-step{width:48px;height:48px;border-radius:var(--rs);background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:20px;cursor:pointer;font-weight:500;display:flex;align-items:center;justify-content:center;font-family:var(--font);-webkit-tap-highlight-color:transparent;flex-shrink:0}
.btn-xs{width:28px;height:28px;border-radius:6px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:14px;cursor:pointer;font-weight:500;display:flex;align-items:center;justify-content:center;font-family:var(--font);-webkit-tap-highlight-color:transparent;flex-shrink:0}
.btn-xs--del{color:#f87171;border-color:rgba(248,113,113,0.2)}

/* GUEST */
.guest-row{display:flex;flex-direction:column;gap:10px}
.guest-ctrl{display:flex;align-items:center;gap:10px;justify-content:center}
.guest-num{width:72px;text-align:center;font-size:28px;font-weight:700;padding:6px}
.pills{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}
.pill{background:var(--surface);border:1px solid var(--border);color:var(--text3);border-radius:100px;padding:7px 14px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--font);-webkit-tap-highlight-color:transparent}
.pill--on{background:rgba(245,158,11,0.12);border-color:var(--border-accent);color:var(--accent)}

/* GROUP HEADERS */
.group{margin-bottom:6px}
.group-hdr{width:100%;display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--surface);border:none;border-radius:var(--rs);cursor:pointer;font-family:var(--font);-webkit-tap-highlight-color:transparent;margin-bottom:4px}
.group-chev{color:var(--text3);font-size:10px;transition:transform .15s;flex-shrink:0;width:12px}
.group-chev--open{transform:rotate(90deg)}
.group-title{font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.6px}
.group-count{font-size:11px;color:var(--text3);font-weight:500}
.group-sub{font-size:12px;font-weight:600;color:var(--accent);margin-left:auto}
.group-toggle{margin-left:4px;background:transparent;border:1px solid var(--border);border-radius:100px;padding:3px 10px;font-size:10px;font-weight:600;color:var(--text3);cursor:pointer;font-family:var(--font);text-transform:uppercase;letter-spacing:.5px;-webkit-tap-highlight-color:transparent;flex-shrink:0}

/* ITEM ROWS - single line */
.row{display:flex;align-items:center;gap:4px;padding:6px 6px;margin-bottom:2px;border-radius:var(--rs);transition:opacity .15s;min-height:40px}
.row--off{opacity:.3}
.row-name{flex:1;min-width:0;font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row-qty{display:flex;align-items:center;gap:2px;flex-shrink:0}
.row-unit{font-size:10px;color:var(--text3);width:22px;text-align:center}
.row-cost{font-size:12px;font-weight:600;color:var(--accent);flex-shrink:0;min-width:48px;text-align:right;cursor:pointer;padding:4px 2px;border-radius:4px;text-decoration:underline;text-decoration-style:dotted;text-decoration-color:rgba(245,158,11,0.3);text-underline-offset:3px}
.row-cost:active{background:var(--surface2)}
.row-price-edit{display:flex;align-items:center;gap:2px;flex-shrink:0}
.row-price-dollar{font-size:12px;color:var(--text3)}
.price-in{width:56px;font-size:13px;padding:4px 6px;text-align:center}
.row-price-per{font-size:10px;color:var(--text3)}
.qty-in{width:36px;text-align:center;padding:4px 2px;font-size:13px}

/* TOGGLE */
.tog{width:32px;height:20px;border-radius:10px;flex-shrink:0;background:rgba(255,255,255,0.08);border:none;cursor:pointer;position:relative;transition:background .2s;-webkit-tap-highlight-color:transparent;padding:0}
.tog--on{background:var(--accent)}
.tog-knob{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s;display:block}
.tog--on .tog-knob{transform:translateX(12px)}

/* STICKY STATS */
.sticky-stats{position:fixed;bottom:0;left:0;right:0;z-index:99;background:rgba(11,11,11,0.95);backdrop-filter:blur(20px);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:center;padding:10px 12px;padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px));gap:0}
.ss-item{flex:1;text-align:center}
.ss-val{font-size:14px;font-weight:700;color:var(--text);display:block;letter-spacing:-.3px}
.ss-val--accent{color:var(--accent)}
.ss-lbl{font-size:8px;color:var(--text3);font-weight:500;text-transform:uppercase;letter-spacing:.3px}
.ss-divider{width:1px;height:28px;background:var(--border);flex-shrink:0;margin:0 4px}

/* HEAT LEVEL */
.heat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.heat-btn{background:var(--surface);border:1px solid var(--border);border-radius:var(--rs);padding:8px 4px;cursor:pointer;font-family:var(--font);-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .15s}
.heat-btn--on{background:rgba(255,255,255,0.06)}
.heat-label{font-size:11px;font-weight:600;color:var(--text)}
.heat-desc{font-size:9px;color:var(--text3);display:none}
.heat-bar{display:flex;gap:3px;margin-top:2px}
.heat-dot{width:6px;height:6px;border-radius:50%;background:var(--text3);transition:background .15s}
.heat-note{font-size:11px;color:var(--text3);margin-top:8px;text-align:center}

/* ADD */
.add-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:12px}
.add-actions{display:flex;gap:8px}
.add-actions>*{flex:1}

/* FOOTNOTE */
.footnote{font-size:11px;color:var(--text3);text-align:center;margin-top:16px;line-height:1.5}
.calc-footer-row{text-align:center;margin-top:12px}
.btn-reset{background:none;border:none;color:var(--text3);font-size:11px;font-weight:500;font-family:var(--font);cursor:pointer;padding:6px 12px;margin-top:4px;-webkit-tap-highlight-color:transparent;text-decoration:underline;text-decoration-color:rgba(255,255,255,0.1);text-underline-offset:3px}
.btn-reset:active{color:var(--text2)}

/* RECIPES */
.recipe-card{padding:0;overflow:hidden}
.recipe-hdr{width:100%;background:none;border:none;cursor:pointer;padding:14px;display:flex;align-items:center;gap:10px;text-align:left;-webkit-tap-highlight-color:transparent;font-family:var(--font)}
.recipe-hdr:active{background:var(--surface2)}
.recipe-name{font-size:15px;font-weight:600;color:var(--text)}
.recipe-meta{font-size:11px;color:var(--text3);margin-top:2px}
.chev{color:var(--text3);font-size:14px;margin-left:auto;transition:transform .2s}
.chev--open{transform:rotate(180deg)}
.recipe-body{padding:0 14px 14px;animation:fadeIn .15s ease}
.recipe-desc{font-size:13px;color:var(--text2);line-height:1.6;margin:0 0 10px}
.recipe-steps{margin:0;padding-left:18px}
.recipe-steps li{font-size:13px;color:var(--text);line-height:1.65;margin-bottom:5px;font-weight:400}
.pro-tip{margin-top:12px;padding:10px 12px;background:rgba(245,158,11,0.04);border-left:2px solid var(--accent);border-radius:0 var(--rs) var(--rs) 0;display:flex;flex-direction:column;gap:3px}
.pro-tip-tag{font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.8px}
.pro-tip-txt{font-size:12px;color:var(--text2);line-height:1.5}

/* EQUIPMENT */
.tier-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.tier-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.equip-card{padding:12px}
.equip-top{display:flex;flex-direction:column;gap:2px}
.equip-name{font-size:14px;font-weight:600;color:var(--text)}
.equip-price{font-size:13px;font-weight:600;color:var(--accent)}
.equip-desc{font-size:12px;color:var(--text2);line-height:1.5;margin-top:4px}

/* TIPS */
.tips-list{display:grid;gap:6px}
.tip-card{padding:12px 14px}
.tip-hdr{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.tip-num{font-size:11px;font-weight:700;color:var(--accent);background:rgba(245,158,11,0.1);border-radius:6px;padding:2px 7px;font-variant-numeric:tabular-nums;flex-shrink:0}
.tip-title{font-size:14px;font-weight:600;color:var(--text)}
.tip-body{font-size:12px;color:var(--text2);line-height:1.6}

/* FOOTER */
.footer{border-top:1px solid var(--border);margin-top:16px;padding:0}
.footer-affiliate{font-size:10px;color:var(--text3);text-align:center;padding:12px 16px 0;line-height:1.4}
.footer-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 16px 16px}
.footer-brand{font-size:14px;font-weight:700;color:var(--text3)}
.footer-copy{font-size:12px;color:var(--text3)}


/* EQUIPMENT AFFILIATE */
.equip-link{display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:var(--accent);text-decoration:none;padding:5px 12px;border:1px solid var(--border-accent);border-radius:100px;transition:all .15s}
.equip-link:active{background:rgba(245,158,11,0.08)}

/* SHARE BUTTON IN STICKY BAR */
.ss-share{flex:1;text-align:center;background:none;border:none;cursor:pointer;padding:0;font-family:var(--font);-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center;gap:2px}
.ss-share-icon{color:var(--accent)}

/* SHOPPING LIST OVERLAY */
.sl-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .15s ease}
.sl-modal{background:#111;border:1px solid var(--border);border-radius:var(--r) var(--r) 0 0;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;padding:0}
.sl-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);position:sticky;top:0;background:#111;z-index:1}
.sl-title{font-size:16px;font-weight:700;color:var(--text)}
.sl-close{background:none;border:none;color:var(--text3);font-size:24px;cursor:pointer;padding:0 4px;font-family:var(--font);-webkit-tap-highlight-color:transparent}
.sl-summary{padding:12px 16px;font-size:13px;color:var(--text2);border-bottom:1px solid var(--border)}
.sl-items{padding:8px 16px 16px}
.sl-cat{margin-bottom:12px}
.sl-cat-label{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px}
.sl-row{display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;transition:opacity .15s}
.sl-row--done{opacity:.4}
.sl-row--done .sl-name{text-decoration:line-through}
.sl-qty{color:var(--accent);font-weight:600;min-width:50px;font-size:12px}
.sl-name{color:var(--text);flex:1}
.sl-name--link{color:var(--accent);text-decoration:underline;text-decoration-color:rgba(245,158,11,0.3);cursor:pointer}
.sl-cost{color:var(--text2);font-weight:500;font-size:12px}
.sl-check{width:20px;height:20px;border-radius:4px;border:1.5px solid var(--text3);background:none;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0;transition:all .15s;-webkit-tap-highlight-color:transparent}
.sl-check--on{background:var(--accent);border-color:var(--accent)}
.sl-checkmark{color:#000;font-size:12px;font-weight:700;line-height:1}
.sl-checked-count{color:var(--accent);font-weight:600}
.sl-uncheck{background:none;border:none;color:var(--text3);font-size:11px;font-weight:500;font-family:var(--font);cursor:pointer;text-decoration:underline;margin-left:6px;-webkit-tap-highlight-color:transparent;padding:0}
.sl-actions{padding:8px 16px 12px;padding-bottom:calc(12px + env(safe-area-inset-bottom, 0px));position:sticky;bottom:0;background:#111;display:flex;flex-wrap:wrap;gap:6px}
.sl-btn{flex:1 1 0;min-width:0;display:flex;align-items:center;justify-content:center;gap:4px;padding:10px 6px;border-radius:var(--rs);border:1px solid var(--border);background:var(--surface);color:var(--text2);font-size:11px;font-weight:600;font-family:var(--font);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all .15s}
.sl-btn--primary{background:var(--accent);color:#000;border-color:var(--accent)}
.sl-btn:active{transform:scale(0.97)}
.sl-btn svg{flex-shrink:0}
.sl-affiliate-note{font-size:10px;color:var(--text3);text-align:center;padding:0 16px 16px}

/* BATCH CALCULATOR */
.batch-card{display:flex;align-items:flex-start;gap:12px;border-color:var(--border-accent);background:rgba(245,158,11,0.03)}
.batch-icon{font-size:24px;flex-shrink:0;line-height:1}
.batch-info{min-width:0}
.batch-headline{font-size:15px;font-weight:700;color:var(--accent);margin-bottom:2px}
.batch-details{font-size:13px;color:var(--text);line-height:1.5}
.batch-tip{font-size:11px;color:var(--text3);margin-top:4px;line-height:1.4}

/* TIMELINE */
.timeline-card{padding:16px 14px}
.timeline{display:flex;flex-direction:column}
.tl-step{display:flex;gap:12px}
.tl-marker{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:16px}
.tl-dot{width:10px;height:10px;border-radius:50%;background:var(--surface2);border:2px solid var(--text3);flex-shrink:0;z-index:1}
.tl-step--hl .tl-dot{background:var(--accent);border-color:var(--accent)}
.tl-line{width:2px;flex:1;background:var(--border);min-height:12px}
.tl-content{padding-bottom:16px;min-width:0}
.tl-time{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.tl-step--hl .tl-time{color:var(--accent)}
.tl-label{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px}
.tl-desc{font-size:12px;color:var(--text2);line-height:1.5}
.tl-step:last-child .tl-line{display:none}
.tl-step:last-child .tl-content{padding-bottom:0}

/* PLANS */
.plans-row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.btn-sm{padding:7px 14px;font-size:12px}
.plans-save-row{display:flex;gap:6px;width:100%;align-items:center}
.plans-name-input{flex:1;font-size:13px;padding:7px 10px}
.plans-list{margin-top:8px;border-top:1px solid var(--border);padding-top:8px}
.plans-item{display:flex;align-items:center;gap:4px;margin-bottom:4px}
.plans-load{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--rs);padding:8px 12px;cursor:pointer;text-align:left;font-family:var(--font);-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;gap:1px}
.plans-load:active{background:var(--surface2)}
.plans-item-name{font-size:13px;font-weight:600;color:var(--text)}
.plans-item-meta{font-size:10px;color:var(--text3)}
.plans-del{background:none;border:1px solid rgba(248,113,113,0.2);border-radius:var(--rs);color:#f87171;width:32px;height:32px;font-size:18px;cursor:pointer;flex-shrink:0;font-family:var(--font);-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center}

/* ═══ DESKTOP 600px+ ═══ */
@media(min-width:600px){
  .page{max-width:800px;padding:28px 24px 56px}
  .page--calc{padding-bottom:110px}
  .nav-inner{max-width:800px}
  .brand{font-size:20px;width:auto;padding:14px 0;text-align:left;justify-content:flex-start}
  .brand-icon{width:38px;height:38px}
  .tabs{width:auto;justify-content:flex-end}
  .tab{padding:14px 16px;font-size:14px;flex:unset}
  .page-title{font-size:28px}
  .page-desc{font-size:15px;margin-bottom:20px}
  .card{padding:18px;margin-bottom:10px}
  .card-label{font-size:12px;letter-spacing:1px;margin-bottom:12px}
  .guest-row{flex-direction:row;align-items:center}
  .guest-num{font-size:32px}
  .btn-step{width:52px;height:52px;font-size:22px}
  .pills{margin-left:auto}
  .pill{padding:8px 16px;font-size:14px}
  .sticky-stats{max-width:800px;left:50%;transform:translateX(-50%);border-radius:var(--r) var(--r) 0 0;border-left:1px solid var(--border);border-right:1px solid var(--border);padding:12px 16px}
  .ss-val{font-size:22px}
  .ss-lbl{font-size:10px;letter-spacing:.5px}
  .group-hdr{padding:12px 14px}
  .group-title{font-size:13px;letter-spacing:.8px}
  .group-count{font-size:12px}
  .group-sub{font-size:14px}
  .group-toggle{padding:4px 12px;font-size:11px}
  .row{padding:8px 12px;gap:8px;min-height:44px}
  .row-name{font-size:15px}
  .row-cost{font-size:14px;min-width:60px}
  .btn-xs{width:34px;height:34px;font-size:16px}
  .qty-in{width:44px;font-size:15px}
  .row-unit{width:30px;font-size:11px}
  .tog{width:36px;height:22px}
  .tog-knob{width:16px;height:16px}
  .tog--on .tog-knob{transform:translateX(14px)}
  .add-grid{grid-template-columns:1fr 1fr}
  .heat-row{grid-template-columns:repeat(5,1fr);gap:6px}
  .heat-desc{display:block}
  .heat-btn{padding:12px 8px;gap:4px}
  .heat-label{font-size:13px}
  .heat-desc{font-size:10px}
  .heat-note{font-size:12px}
  .batch-headline{font-size:17px}
  .batch-details{font-size:14px}
  .batch-tip{font-size:12px}
  .tl-label{font-size:15px}
  .tl-desc{font-size:13px;line-height:1.6}
  .tl-time{font-size:11px}
  .equip-top{flex-direction:row;justify-content:space-between;align-items:baseline}
  .equip-name{font-size:16px}
  .equip-price{font-size:14px}
  .equip-desc{font-size:13px}
  .recipe-name{font-size:18px}
  .recipe-meta{font-size:12px}
  .recipe-body{padding:0 18px 18px}
  .recipe-desc{font-size:14px}
  .recipe-steps li{font-size:14px}
  .pro-tip-txt{font-size:13px}
  .tip-title{font-size:16px}
  .tip-body{font-size:13px}
  .tip-num{font-size:12px}
  .footnote{font-size:12px}
  .sl-overlay{align-items:center}
  .sl-modal{border-radius:var(--r);max-height:70vh;max-width:520px}
  .sl-title{font-size:18px}
  .sl-row{font-size:14px}
  .sl-qty{font-size:13px}
  .sl-btn{font-size:12px;padding:12px 10px}
  .equip-link:hover{background:rgba(245,158,11,0.08)}
  .equip-link{font-size:13px;padding:6px 14px}
  .plans-item-name{font-size:14px}
  .btn-sm{padding:8px 16px;font-size:13px}
  .btn-outline{font-size:14px}
  .btn-primary{font-size:14px}
}
`;
