import { CONFIG } from '../config/constants';
import { ADVANCED_ITEMS } from '../data/advancedItems';

export function getEquipmentSize(crawfishLbs) {
  if (crawfishLbs <= 30) {
    return {
      burnerSize: 'Crawfish Boiler Kit (30-40qt)',
      burnerPrice: 95.00,
      propaneTanks: 1,
      searchTerm: 'crawfish boiler kit 40K BTU 40 quart'
    };
  } else if (crawfishLbs <= 60) {
    return {
      burnerSize: 'Crawfish Boiler Kit (60qt)',
      burnerPrice: 135.00,
      propaneTanks: 1,
      searchTerm: 'crawfish boiler kit 60K BTU 60 quart'
    };
  } else if (crawfishLbs <= 120) {
    return {
      burnerSize: 'Crawfish Boiler Kit (80-100qt)',
      burnerPrice: 195.00,
      propaneTanks: 2,
      searchTerm: 'crawfish boiler kit 100K BTU 100 quart'
    };
  } else {
    return {
      burnerSize: 'Dual Crawfish Boiler Kit (120qt)',
      burnerPrice: 320.00,
      propaneTanks: 2,
      searchTerm: 'dual crawfish boiler kit 120K BTU 120 quart'
    };
  }
}

export function buildToupsBoilItems({ peopleCount, lbsPerPerson, location }) {
  const people = Number(peopleCount);
  const lpp = Number(lbsPerPerson);
  const prices = CONFIG.regionalPricing[location] ?? CONFIG.regionalPricing.louisiana;
  const crawfishLbs = people * lpp;

  const ratios = {
    redPotatoes: 0.333,
    lemonJuiceCups: 0.1,
    vinegarCups: 0.067,
    saltCups: 0.1,
    boilSpiceCups: 0.2,
    onions: 0.2,
    corn: 0.267,
    garlicCups: 0.1,
    sausage: 0.1
  };

  const OZ_PER_CUP = 8;
  const CUPS_PER_LB_SALT = 2;

  const items = [
    { name: 'Live Crawfish', qty: Math.max(30, Math.ceil(crawfishLbs / 30) * 30), unit: 'lbs', price: prices.crawfish },
    { name: 'Smoked Sausage', qty: crawfishLbs * ratios.sausage * 0.5, unit: 'lbs', price: prices.sausage },
    { name: 'Andouille Sausage', qty: crawfishLbs * ratios.sausage * 0.5, unit: 'lbs', price: prices.sausage },
    { name: 'Corn on the Cob', qty: crawfishLbs * ratios.corn, unit: 'ears', price: prices.corn },
    { name: 'Red Potatoes', qty: crawfishLbs * ratios.redPotatoes, unit: 'lbs', price: prices.redPotatoes },
    { name: 'Yellow Onions', qty: Math.max(1, Math.ceil(crawfishLbs * ratios.onions)), unit: '', price: prices.onions },
    { name: 'Garlic', qty: Math.max(4, crawfishLbs * ratios.garlicCups * OZ_PER_CUP), unit: 'oz', price: prices.garlic },
    { name: 'Crawfish Boil Seasoning', qty: Math.max(4, crawfishLbs * ratios.boilSpiceCups * OZ_PER_CUP), unit: 'oz', price: prices.cajunSeasoning },
    { name: 'Lemon Juice', qty: Math.max(4, crawfishLbs * ratios.lemonJuiceCups * OZ_PER_CUP), unit: 'oz', price: prices.lemonJuice },
    { name: 'Vinegar', qty: Math.max(4, crawfishLbs * ratios.vinegarCups * OZ_PER_CUP), unit: 'oz', price: prices.vinegar },
    { name: 'Salt', qty: Math.max(1, (crawfishLbs * ratios.saltCups) / CUPS_PER_LB_SALT), unit: 'lbs', price: prices.salt }
  ];

  const total = items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
  return { items, total };
}

export function buildAdvancedItems({ peopleCount, lbsPerPerson, location, style = 'cajun' }) {
  const people = Number(peopleCount);
  const lpp = Number(lbsPerPerson);
  const prices = CONFIG.regionalPricing[location] ?? CONFIG.regionalPricing.louisiana;
  const crawfishLbs = people * lpp;
  const styleItems = ADVANCED_ITEMS[style] ?? ADVANCED_ITEMS.cajun;
  const equipmentSize = getEquipmentSize(crawfishLbs);

  const evalRatio = (ratioStr) => {
    let formula = ratioStr
      .replace(/peopleCount/g, people)
      .replace(/lbsPerPerson/g, lpp)
      .replace(/crawfishLbs/g, crawfishLbs);

    try {
      return Function(`"use strict"; return (${formula})`)();
    } catch (e) {
      console.warn('Error evaluating formula:', formula, e);
      return 1;
    }
  };

  const allItems = [];
  let total = 0;

  Object.keys(styleItems).forEach(categoryKey => {
    const category = styleItems[categoryKey];
    category.items.forEach(item => {
      let processedItem = { ...item };

      if (item.isDynamic) {
        if (item.name === 'DYNAMIC_BURNER_COMBO') {
          processedItem.name = equipmentSize.burnerSize;
          processedItem.price = equipmentSize.burnerPrice;
          processedItem.amazonSearchTerm = equipmentSize.searchTerm;
        } else if (item.name === 'Propane Tanks (20lb)' && item.ratio === 'DYNAMIC_PROPANE_TANKS') {
          processedItem.ratio = equipmentSize.propaneTanks.toString();
        }
      }

      const qty = Math.max(processedItem.min, evalRatio(processedItem.ratio));
      const price = processedItem.priceKey ? prices[processedItem.priceKey] : processedItem.price || 0;
      const itemTotal = qty * price;

      allItems.push({
        ...processedItem,
        qty,
        price,
        category: category.title
      });

      total += itemTotal;
    });
  });

  return { items: allItems, total, categories: Object.keys(styleItems).map(key => styleItems[key]) };
}

export function formatQuantity(qty, unit) {
  const num = Number(qty);
  const wholeNumberUnits = ['', 'rolls', 'ears', 'bottles', 'jars', 'boxes', 'packs', 'cans', 'bunches', 'dozen', 'servings', 'gallons'];

  if (wholeNumberUnits.includes(unit) || Number.isInteger(num)) {
    return Math.round(num).toString();
  }
  return num.toFixed(1);
}
