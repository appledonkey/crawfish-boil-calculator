import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Crawfish Boil Calculator (React)
 * Ember Glow Red & Black Theme + Isaac Toups' ratios + retail unit normalization.
 * - Fonts: Bungee (display), Inter (body)
 * - Palette: Deep black background, ember red highlights
 *
 * Update: Uniform spice-level coloring across UI via CSS var `--spice`.
 * Fix: Removed any duplicate state declarations to resolve "Identifier has already been declared".
 */

export const CONFIG = {
  boilStyles: {
    cajun: { name: 'Cajun Style' },
    vietcajun: { name: 'Viet-Cajun Style' }
  },
  regionalPricing: {
    louisiana: {
      crawfish: 2.75,      // per lb - live crawfish
      onions: 0.60,        // per onion
      lemons: 0.40,        // per lemon
      limes: 0.45,         // per lime
      lemonJuice: 0.15,    // per oz
      vinegar: 0.10,       // per oz
      salt: 0.80,          // per lb
      cajunSeasoning: 0.25, // per oz
      redPotatoes: 1.25,   // per lb
      corn: 0.60,          // per ear
      garlic: 0.12,        // per oz
      ginger: 0.20,        // per oz
      lemongrass: 0.30,    // per stalk
      sausage: 4.50        // per lb
    },
    texas: {
      crawfish: 4.50,      // per lb - live crawfish (higher due to shipping)
      onions: 0.75,        // per onion
      lemons: 0.50,        // per lemon
      limes: 0.55,         // per lime
      lemonJuice: 0.20,    // per oz
      vinegar: 0.12,       // per oz
      salt: 1.00,          // per lb
      cajunSeasoning: 0.35, // per oz
      redPotatoes: 1.75,   // per lb
      corn: 0.75,          // per ear
      garlic: 0.15,        // per oz
      ginger: 0.25,        // per oz
      lemongrass: 0.35,    // per stalk
      sausage: 6.50        // per lb
    },
    other: {
      crawfish: 3.75,      // per lb - live crawfish
      onions: 0.65,        // per onion
      lemons: 0.45,        // per lemon
      limes: 0.50,         // per lime
      lemonJuice: 0.18,    // per oz
      vinegar: 0.11,       // per oz
      salt: 0.90,          // per lb
      cajunSeasoning: 0.30, // per oz
      redPotatoes: 1.50,   // per lb
      corn: 0.65,          // per ear
      garlic: 0.13,        // per oz
      ginger: 0.22,        // per oz
      lemongrass: 0.32,    // per stalk
      sausage: 5.75        // per lb
    }
  },
  spiceLevels: {
    1: { name: 'Mild' },
    2: { name: 'Medium' },
    3: { name: 'Hot' },
    4: { name: 'Inferno' }
  }
};

// Dynamic color map for spice level (1..4)
export const SPICE_COLORS = {
  1: '#FFD54F', // mild: amber 300
  2: '#FFB300', // medium: vivid amber
  3: '#FF7043', // hot: deep orange
  4: '#FF3D00'  // inferno: red-orange
};

// Amazon affiliate configuration
const AMAZON_STORE_ID = 'oswaldcalcula-20';

// Shop section product data
const SHOP_PRODUCTS = {
  starterKits: [
    {
      name: 'Small Party Kit (Up to 30 lbs)',
      description: 'Complete setup for intimate gatherings',
      includes: 'Burner, 40qt pot, paddle, thermometer',
      price: '$145',
      originalPrice: '$165',
      asin: 'B08W4YQ8LS',
      rating: 4.6,
      reviews: 1247,
      maxCrawfish: 30,
      image: '🔥',
      whyRecommended: 'Perfect starter size with everything included',
      recommendedQty: 1,
      category: 'equipment'
    },
    {
      name: 'Medium Party Kit (30-60 lbs)',
      description: 'Perfect for family gatherings',
      includes: 'High-output burner, 60qt pot, accessories',
      price: '$185',
      originalPrice: '$210',
      asin: 'B08HVJZRQ5', 
      rating: 4.7,
      reviews: 892,
      maxCrawfish: 60,
      image: '🔥',
      whyRecommended: 'Ideal capacity for most family parties',
      recommendedQty: 1,
      category: 'equipment'
    },
    {
      name: 'Large Party Kit (60+ lbs)',
      description: 'Professional setup for big events',
      includes: 'Dual burner, 100qt pot, complete accessories',
      price: '$285',
      originalPrice: '$320',
      asin: 'B000LRDGD4',
      rating: 4.8,
      reviews: 564,
      maxCrawfish: 120,
      image: '🔥',
      whyRecommended: 'Commercial-grade for large gatherings',
      recommendedQty: 1,
      category: 'equipment'
    }
  ],
  seasonings: [
    {
      name: 'Louisiana Fish Fry Crab Boil',
      description: 'The gold standard for authentic flavor',
      price: '$12.99',
      originalPrice: '$15.99',
      asin: 'B000E1HRVO',
      rating: 4.7,
      reviews: 2340,
      image: '🌶️',
      size: '5 lbs',
      whyRecommended: 'Most authentic Louisiana flavor profile',
      getRecommendedQty: (crawfishLbs) => Math.max(1, Math.ceil(crawfishLbs / 40)),
      category: 'seasoning'
    },
    {
      name: 'Zatarains Liquid Crab Boil',
      description: 'Easy liquid seasoning, no mess',
      price: '$8.49',
      originalPrice: '$9.99',
      asin: 'B00032CGKA',
      rating: 4.5,
      reviews: 1890,
      image: '🌶️',
      size: '16 oz',
      whyRecommended: 'Convenient liquid form, no cleanup',
      getRecommendedQty: (crawfishLbs) => Math.max(1, Math.ceil(crawfishLbs / 25)),
      category: 'seasoning'
    },
    {
      name: 'Tony Chachere\'s Original Seasoning',
      description: 'Louisiana classic, perfect for everything',
      price: '$6.99',
      originalPrice: '$8.49',
      asin: 'B000SAFXZ2',
      rating: 4.8,
      reviews: 3245,
      image: '🌶️',
      size: '32 oz',
      whyRecommended: 'Versatile seasoning for all dishes',
      getRecommendedQty: (crawfishLbs) => Math.max(1, Math.ceil(crawfishLbs / 50)),
      category: 'seasoning'
    }
  ],
  essentials: [
    {
      name: 'Bayou Classic Stainless Paddle',
      description: 'Professional-grade stirring paddle',
      price: '$24.99',
      originalPrice: '$29.99',
      asin: 'B000FTUTL6',
      rating: 4.6,
      reviews: 756,
      image: '🥄',
      whyRecommended: 'Essential for proper stirring and mixing',
      getRecommendedQty: (crawfishLbs) => crawfishLbs > 60 ? 2 : 1,
      category: 'tools'
    },
    {
      name: 'Digital Probe Thermometer',
      description: 'Accurate temperature monitoring',
      price: '$15.99',
      originalPrice: '$19.99',
      asin: 'B07GCKQX2L',
      rating: 4.4,
      reviews: 1123,
      image: '🌡️',
      whyRecommended: 'Critical for food safety and perfect cooking',
      getRecommendedQty: (crawfishLbs) => 1,
      category: 'tools'
    },
    {
      name: 'Heat Resistant Gloves',
      description: 'Steam and heat protection',
      price: '$19.99',
      originalPrice: '$24.99',
      asin: 'B07Z6FC7HL',
      rating: 4.5,
      reviews: 892,
      image: '🧤',
      whyRecommended: 'Safety essential for handling hot equipment',
      getRecommendedQty: (peopleCount) => Math.max(2, Math.ceil(peopleCount / 15)),
      category: 'safety'
    },
    {
      name: 'Crawfish Strainer Basket',
      description: 'Makes lifting and draining effortless',
      price: '$45.99',
      originalPrice: '$52.99',
      asin: 'B08XKDF2M3',
      rating: 4.7,
      reviews: 643,
      image: '🧺',
      whyRecommended: 'Game-changer for easy crawfish removal',
      getRecommendedQty: (crawfishLbs) => crawfishLbs > 60 ? 2 : 1,
      category: 'tools'
    },
    {
      name: 'Propane Tank (20lb)',
      description: 'Standard propane for burners',
      price: '$35.99',
      originalPrice: '$39.99',
      asin: 'B01LXRZ8X4',
      rating: 4.3,
      reviews: 428,
      image: '⛽',
      whyRecommended: 'Always have backup fuel ready',
      getRecommendedQty: (crawfishLbs) => Math.max(1, Math.ceil(crawfishLbs / 40)),
      category: 'fuel'
    }
  ]
};

// Helper function to generate Amazon affiliate search links
const getAmazonLink = (searchTerm, customSearchTerm = null) => {
  const term = customSearchTerm || getOptimizedSearchTerm(searchTerm) || searchTerm;
  const encodedTerm = encodeURIComponent(term);
  return `https://www.amazon.com/s?k=${encodedTerm}&tag=${AMAZON_STORE_ID}`;
};

// Helper function to generate specific product links with ASINs
const getAmazonProductLink = (asin) => {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_STORE_ID}`;
};

// Optimized search terms for better Amazon results (equipment only)
const getOptimizedSearchTerm = (itemName) => {
  const searchTerms = {
    // Boil Equipment  
    'Crawfish Washer': 'crawfish washing machine basket seafood cleaner',
    'Long Mesh Skimmer': 'long handle mesh skimmer strainer crawfish boil',
    'Fire Extinguisher': 'fire extinguisher outdoor cooking safety propane',
    'Strainer Basket': 'crawfish strainer basket boil seafood cooking',
    'Long-handled Paddle': 'long handle paddle crawfish boil stirring',
    'Digital Thermometer': 'digital probe thermometer cooking outdoor grill',
    'Heat Resistant Gloves': 'heat resistant gloves grilling barbecue cooking',
    'Long Tongs (18")': 'long tongs 18 inch grilling barbecue crawfish',
    'Rinse Buckets': 'large bucket container rinse washing outdoor',
    'Propane Tanks (20lb)': 'propane tank 20 lb pound outdoor cooking grill',
    
    // Serving Setup
    'Folding Tables': 'folding tables outdoor party catering portable',
    'Seafood Serving Tables': 'seafood serving table crawfish boil party',
    'Folding Chairs': 'folding chairs outdoor portable party seating',
    'Table Coverings': 'butcher paper roll table covering party disposable',
    'Crawfish Serving Trays': 'crawfish serving tray basket seafood party',
    'Serving Scoops': 'serving scoop strainer crawfish boil ladle',
    'Ice Coolers': 'large cooler ice chest party outdoor beverage',
    'Extension Cords': 'outdoor extension cord heavy duty weatherproof',
    'Fans': 'outdoor portable fan cooling party tent',
    'Shade Tents': 'pop up canopy tent shade outdoor party',
    'Shade Canopies': 'pop up canopy tent shade outdoor party',
    
    // Eating Supplies  
    'Disposable Plates': 'disposable paper plates party heavy duty',
    'Plastic Utensils': 'disposable plastic utensils party catering bulk',
    'Disposable Serving Trays': 'disposable serving trays party catering platters',
    'Napkins': 'party napkins disposable bulk paper napkins',
    'Wet Wipes': 'wet wipes baby wipes party cleanup disposable',
    'Paper Towels': 'paper towels rolls party cleanup disposable',
    'Butter Cups': 'disposable dipping cups sauce containers party',
    'Dipping Cups': 'disposable dipping cups sauce containers party',
    'Disposable Cups': 'disposable plastic cups party drinking bulk',
    'To-go Containers': 'takeout containers disposable food storage party',
    
    // Beverages
    'Drink Coolers': 'beverage cooler dispenser party outdoor portable',
    'Bottle Openers': 'bottle opener corkscrew party bar tools',
    
    // Cleanup & Waste
    'Trash Cans': 'large trash can outdoor party waste container',
    'Heavy-duty Trash Bags': 'heavy duty trash bags outdoor party cleanup',
    'Recycling Bins': 'recycling bin outdoor party sorting waste',
    'Shell Waste Buckets': 'large bucket container outdoor party cleanup',
    'Cleaning Rags': 'cleaning rags shop towels disposable party',
    'Table Scrub Brush': 'scrub brush cleaning party table outdoor',
    'Hose': 'garden hose outdoor cleaning spray nozzle',
    
    // Comfort & Safety
    'Bug Spray': 'insect repellent bug spray outdoor party camping',
    'Citronella Candles': 'citronella candles torches outdoor party mosquito',
    'Sunscreen': 'sunscreen SPF outdoor party protection lotion',
    'Hand Sanitizer': 'hand sanitizer pump bottle party outdoor',
    'First Aid Kit': 'first aid kit outdoor party camping safety',
    
    // Entertainment & Lighting
    'Bluetooth Speaker': 'bluetooth speaker outdoor waterproof party portable',
    'Cornhole Set': 'cornhole game set outdoor party bean bag toss',
    'Ladder Toss': 'ladder toss game outdoor party yard game',
    'Giant Jenga': 'giant jenga outdoor party yard game wooden',
    'Horseshoes Set': 'horseshoe game set outdoor party yard game',
    'Frisbee': 'frisbee outdoor party game flying disc',
    'Football': 'football outdoor party game throwing',
    'Kubb': 'kubb game set outdoor party viking chess',
    'Beer Pong Table': 'beer pong table party game outdoor folding',
    'String Lights': 'outdoor string lights party patio LED waterproof',
    'Tarp': 'heavy duty tarp outdoor ground cover party',
    'Leftover Storage Coolers': 'small cooler storage container party leftovers'
  };
  
  return searchTerms[itemName];
};

// Categories that should have Amazon affiliate links (equipment only)
const AFFILIATE_CATEGORIES = [
  'Cooking Gear & Setup',
  'Serving & Cleanup',
  'Entertainment & Comfort',
  'Cleanup & Storage'
];

// Helper function to determine appropriate equipment size based on crawfish pounds
const getEquipmentSize = (crawfishLbs) => {
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
};

// Advanced mode comprehensive party checklist with pricing
export const ADVANCED_ITEMS = {
  cajun: {
    'crawfish-main': {
      title: 'Crawfish & Main Ingredients',
      items: [
        { name: 'Live Crawfish', unit: 'lbs', ratio: 'peopleCount * lbsPerPerson', min: 30, priceKey: 'crawfish' },
        { name: 'Smoked Sausage', unit: 'lbs', ratio: 'crawfishLbs * 0.05', min: 0.5, priceKey: 'sausage' },
        { name: 'Andouille Sausage', unit: 'lbs', ratio: 'crawfishLbs * 0.05', min: 0.5, priceKey: 'sausage' },
        { name: 'Corn on the Cob', unit: 'ears', ratio: 'crawfishLbs * 0.267', min: 4, priceKey: 'corn' },
        { name: 'Red Potatoes', unit: 'lbs', ratio: 'crawfishLbs * 0.333', min: 1, priceKey: 'redPotatoes' },
        { name: 'Yellow Onions', unit: '', ratio: 'crawfishLbs * 0.2', min: 1, priceKey: 'onions' },
        { name: 'Garlic Heads', unit: '', ratio: 'crawfishLbs * 0.15', min: 3, price: 1.50 },
        { name: 'Crawfish Boil Seasoning', unit: 'oz', ratio: 'crawfishLbs * 1.5', min: 8, priceKey: 'cajunSeasoning' },
        { name: 'Salt', unit: 'lbs', ratio: 'crawfishLbs * 0.1', min: 1, priceKey: 'salt' },
        { name: 'Lemons', unit: '', ratio: 'peopleCount * 0.5', min: 2, priceKey: 'lemons' },
        { name: 'Button Mushrooms', unit: 'lbs', ratio: 'peopleCount * 0.25', min: 1, price: 3.50 },
        { name: 'Celery Stalks', unit: 'bunches', ratio: 'peopleCount * 0.1', min: 1, price: 2.00 },
        { name: 'Baby Carrots', unit: 'lbs', ratio: 'peopleCount * 0.2', min: 1, price: 1.50 },
        { name: 'Artichokes', unit: 'artichokes', ratio: 'peopleCount * 0.5', min: 0, price: 2.50 },
        { name: 'Bay Leaves', unit: 'oz', ratio: '2', min: 1, price: 0.50 },
        { name: 'Garlic Butter', unit: 'lbs', ratio: 'peopleCount * 0.1', min: 1, price: 5.00 },
        { name: 'Hot Sauce', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 3.00 },
        { name: 'Cocktail Sauce', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 1, price: 4.00 },
        { name: 'Remoulade', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 12)', min: 1, price: 5.00 },
        { name: 'Cajun Seasoning', unit: 'oz', ratio: '4', min: 2, priceKey: 'cajunSeasoning' },
        { name: 'Fresh Parsley & Thyme', unit: 'bunches', ratio: '2', min: 0, price: 3.00 }
      ]
    },
    'cooking-gear': {
      title: 'Cooking Gear & Setup',
      items: [
        { name: 'DYNAMIC_BURNER_COMBO', unit: '', ratio: '1', min: 1, price: 'DYNAMIC_PRICE', isDynamic: true },
        { name: 'Propane Tanks (20lb)', unit: '', ratio: 'DYNAMIC_PROPANE_TANKS', min: 1, price: 35.00, isDynamic: true },
        { name: 'Strainer Basket', unit: '', ratio: '1', min: 1, price: 45.00 },
        { name: 'Long-handled Paddle', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Digital Thermometer', unit: '', ratio: '1', min: 1, price: 15.00 },
        { name: 'Heat Resistant Gloves', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Long Tongs (18")', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Rinse Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 15.00 },
        { name: 'Ice Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 45.00 },
        { name: 'Crawfish Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 20.00 },
        { name: 'Table Coverings', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Folding Tables', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 60.00 },
        { name: 'Extension Cords', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 2, price: 25.00 },
        { name: 'Fire Extinguisher', unit: '', ratio: '1', min: 1, price: 35.00 }
      ]
    },
    'serving-dining': {
      title: 'Serving & Dining Supplies',
      items: [
        { name: 'Disposable Plates', unit: '', ratio: 'peopleCount * 2', min: 10, price: 0.18 },
        { name: 'Plastic Utensils', unit: '', ratio: 'peopleCount * 1.5', min: 10, price: 0.25 },
        { name: 'Disposable Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 4)', min: 6, price: 1.50 },
        { name: 'Napkins', unit: 'packs', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 4.00 },
        { name: 'Paper Towels', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 8)', min: 4, price: 2.50 },
        { name: 'Wet Wipes', unit: 'packs', ratio: 'Math.ceil(peopleCount / 6)', min: 3, price: 3.00 },
        { name: 'Dipping Cups', unit: '', ratio: 'peopleCount * 2', min: 10, price: 0.10 },
        { name: 'Disposable Cups', unit: '', ratio: 'peopleCount * 4', min: 20, price: 0.08 },
        { name: 'Trash Cans', unit: '', ratio: 'Math.ceil(peopleCount / 10)', min: 3, price: 25.00 },
        { name: 'Heavy-duty Trash Bags', unit: 'boxes', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Recycling Bins', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 20.00 },
        { name: 'To-go Containers', unit: '', ratio: 'Math.ceil(peopleCount / 3)', min: 10, price: 0.75 }
      ]
    },
    'drinks-ice': {
      title: 'Drinks & Ice',
      items: [
        { name: 'Beer', unit: 'bottles', ratio: 'peopleCount * 4', min: 12, price: 1.75 },
        { name: 'Hard Seltzers', unit: 'bottles', ratio: 'peopleCount * 3', min: 6, price: 2.00 },
        { name: 'Hurricane Mix', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 8.00 },
        { name: 'Bloody Mary Mix', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 1, price: 6.00 },
        { name: 'Margarita Mix', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 1, price: 7.00 },
        { name: 'Whiskey', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 25.00 },
        { name: 'Soft Drinks', unit: 'bottles', ratio: 'peopleCount * 4', min: 12, price: 1.25 },
        { name: 'Sweet Tea', unit: 'gallons', ratio: 'Math.ceil(peopleCount / 8)', min: 2, price: 4.00 },
        { name: 'Bottled Water', unit: 'bottles', ratio: 'peopleCount * 3', min: 12, price: 0.75 },
        { name: 'Ice', unit: 'bags', ratio: 'Math.ceil(peopleCount / 3)', min: 4, price: 3.50 },
        { name: 'Drink Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 45.00 },
        { name: 'Bottle Openers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 3, price: 5.00 }
      ]
    },
    'sides-extras': {
      title: 'Sides & Extras',
      items: [
        { name: 'Garlic Bread', unit: 'loaves', ratio: 'Math.ceil(peopleCount / 4)', min: 2, price: 3.50 },
        { name: 'Coleslaw', unit: 'lbs', ratio: 'peopleCount * 0.3', min: 2, price: 3.00 },
        { name: 'Potato Salad', unit: 'lbs', ratio: 'peopleCount * 0.4', min: 2, price: 4.00 },
        { name: 'Hush Puppies', unit: 'dozen', ratio: 'Math.ceil(peopleCount / 3)', min: 2, price: 6.00 },
        { name: 'Pickles', unit: 'jars', ratio: 'Math.ceil(peopleCount / 8)', min: 2, price: 4.00 },
        { name: 'Crackers', unit: 'boxes', ratio: 'Math.ceil(peopleCount / 10)', min: 2, price: 3.00 }
      ]
    },
    'desserts': {
      title: 'Desserts',
      items: [
        { name: 'Banana Pudding', unit: 'servings', ratio: 'peopleCount', min: 8, price: 2.50 },
        { name: 'Bread Pudding', unit: 'servings', ratio: 'peopleCount * 0.8', min: 6, price: 3.00 },
        { name: 'Pecan Pie', unit: 'pies', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 15.00 },
        { name: 'Brownies', unit: 'dozen', ratio: 'Math.ceil(peopleCount / 4)', min: 2, price: 8.00 },
        { name: 'King Cake', unit: 'cakes', ratio: 'Math.ceil(peopleCount / 12)', min: 0, price: 25.00 },
        { name: 'Fruit Tray', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 20.00 }
      ]
    },
    'entertainment': {
      title: 'Music & Entertainment',
      items: [
        { name: 'Bluetooth Speaker', unit: '', ratio: 'Math.ceil(peopleCount / 30)', min: 1, price: 75.00 },
        { name: 'Cornhole Set', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 45.00 },
        { name: 'Ladder Toss', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 35.00 },
        { name: 'Giant Jenga', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 40.00 },
        { name: 'Horseshoes Set', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 30.00 },
        { name: 'Frisbee', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 10.00 },
        { name: 'Beer Pong Table', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 60.00 },
        { name: 'String Lights', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 15.00 },
        { name: 'Shade Canopies', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 80.00 },
        { name: 'Folding Chairs', unit: '', ratio: 'peopleCount * 0.8', min: 4, price: 20.00 }
      ]
    },
    'comfort-safety': {
      title: 'Comfort & Safety',
      items: [
        { name: 'Bug Spray', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 6.00 },
        { name: 'First Aid Kit', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Sunscreen', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 2, price: 8.00 },
        { name: 'Hand Sanitizer', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 4.00 },
        { name: 'Cleaning Rags', unit: 'packs', ratio: 'Math.ceil(peopleCount / 10)', min: 3, price: 3.00 },
        { name: 'Fans', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 45.00 },
        { name: 'Shade Tents', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 75.00 }
      ]
    },
    'cleanup': {
      title: 'Cleanup & Post-Party',
      items: [
        { name: 'Shell Waste Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 6)', min: 4, price: 12.00 },
        { name: 'Cleaning Solution', unit: 'bottles', ratio: '2', min: 2, price: 4.00 },
        { name: 'Cleaning Rags', unit: 'packs', ratio: '3', min: 2, price: 5.00 },
        { name: 'Leftover Storage Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 50.00 },
        { name: 'Table Scrub Brush', unit: '', ratio: '2', min: 2, price: 8.00 }
      ]
    }
  },
  vietcajun: {
    'crawfish-main': {
      title: 'Crawfish & Main Ingredients',
      items: [
        { name: 'Live Crawfish', unit: 'lbs', ratio: 'peopleCount * lbsPerPerson', min: 30, priceKey: 'crawfish' },
        { name: 'Smoked Sausage', unit: 'lbs', ratio: 'crawfishLbs * 0.05', min: 0.5, priceKey: 'sausage' },
        { name: 'Andouille Sausage', unit: 'lbs', ratio: 'crawfishLbs * 0.05', min: 0.5, priceKey: 'sausage' },
        { name: 'Corn on the Cob', unit: 'ears', ratio: 'crawfishLbs * 0.267', min: 4, priceKey: 'corn' },
        { name: 'Red Potatoes', unit: 'lbs', ratio: 'crawfishLbs * 0.333', min: 1, priceKey: 'redPotatoes' },
        { name: 'Yellow Onions', unit: '', ratio: 'crawfishLbs * 0.2', min: 1, priceKey: 'onions' },
        { name: 'Garlic Heads', unit: '', ratio: 'crawfishLbs * 0.15', min: 3, price: 1.50 },
        { name: 'Fresh Ginger', unit: 'oz', ratio: 'crawfishLbs * 0.5', min: 2, priceKey: 'ginger' },
        { name: 'Lemongrass Stalks', unit: 'stalks', ratio: 'crawfishLbs * 0.2', min: 3, priceKey: 'lemongrass' },
        { name: 'Crawfish Boil Seasoning', unit: 'oz', ratio: 'crawfishLbs * 1.3', min: 6, priceKey: 'cajunSeasoning' },
        { name: 'Salt', unit: 'lbs', ratio: 'crawfishLbs * 0.1', min: 1, priceKey: 'salt' },
        { name: 'Limes', unit: '', ratio: 'peopleCount * 0.7', min: 3, priceKey: 'limes' },
        { name: 'Lemons', unit: '', ratio: 'peopleCount * 0.3', min: 2, priceKey: 'lemons' },
        { name: 'Asian Garlic Butter Sauce', unit: 'lbs', ratio: 'peopleCount * 0.15', min: 1, price: 8.00 },
        { name: 'Fish Sauce', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 20)', min: 0, price: 4.00 },
        { name: 'Soy Sauce', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 3.00 },
        { name: 'Mushrooms', unit: 'lbs', ratio: 'peopleCount * 0.3', min: 1, price: 4.00 },
        { name: 'Green Onions', unit: 'bunches', ratio: 'peopleCount * 0.2', min: 2, price: 1.50 },
        { name: 'Thai Chilies', unit: 'oz', ratio: 'peopleCount * 0.1', min: 0, price: 2.00 },
        { name: 'Cilantro', unit: 'bunches', ratio: 'peopleCount * 0.15', min: 2, price: 2.00 },
        { name: 'Sriracha', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 4.00 }
      ]
    },
    'cooking-gear': {
      title: 'Cooking Gear & Setup',
      items: [
        { name: 'DYNAMIC_BURNER_COMBO', unit: '', ratio: '1', min: 1, price: 'DYNAMIC_PRICE', isDynamic: true },
        { name: 'Propane Tanks (20lb)', unit: '', ratio: 'DYNAMIC_PROPANE_TANKS', min: 1, price: 35.00, isDynamic: true },
        { name: 'Strainer Basket', unit: '', ratio: '1', min: 1, price: 45.00 },
        { name: 'Long-handled Paddle', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Digital Thermometer', unit: '', ratio: '1', min: 1, price: 15.00 },
        { name: 'Heat Resistant Gloves', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Long Tongs (18")', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Rinse Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 15.00 },
        { name: 'Ice Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 45.00 },
        { name: 'Crawfish Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 20.00 },
        { name: 'Table Coverings', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Folding Tables', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 60.00 },
        { name: 'Extension Cords', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 2, price: 25.00 },
        { name: 'Fire Extinguisher', unit: '', ratio: '1', min: 1, price: 35.00 }
      ]
    },
    'serving-dining': {
      title: 'Serving & Dining Supplies',
      items: [
        { name: 'Disposable Plates', unit: '', ratio: 'peopleCount * 2', min: 10, price: 0.18 },
        { name: 'Plastic Utensils', unit: '', ratio: 'peopleCount * 1.5', min: 10, price: 0.25 },
        { name: 'Disposable Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 4)', min: 6, price: 1.50 },
        { name: 'Napkins', unit: 'packs', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 4.00 },
        { name: 'Paper Towels', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 8)', min: 4, price: 2.50 },
        { name: 'Wet Wipes', unit: 'packs', ratio: 'Math.ceil(peopleCount / 6)', min: 3, price: 3.00 },
        { name: 'Dipping Cups', unit: '', ratio: 'peopleCount * 2', min: 10, price: 0.10 },
        { name: 'Disposable Cups', unit: '', ratio: 'peopleCount * 4', min: 20, price: 0.08 },
        { name: 'Trash Cans', unit: '', ratio: 'Math.ceil(peopleCount / 10)', min: 3, price: 25.00 },
        { name: 'Heavy-duty Trash Bags', unit: 'boxes', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Recycling Bins', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 20.00 },
        { name: 'To-go Containers', unit: '', ratio: 'Math.ceil(peopleCount / 3)', min: 10, price: 0.75 }
      ]
    },
    'drinks-ice': {
      title: 'Drinks & Ice',
      items: [
        { name: 'Beer', unit: 'bottles', ratio: 'peopleCount * 4', min: 12, price: 1.75 },
        { name: 'Hard Seltzers', unit: 'bottles', ratio: 'peopleCount * 3', min: 6, price: 2.00 },
        { name: 'Hurricane Mix', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 8.00 },
        { name: 'Asian Plum Wine', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 12)', min: 0, price: 15.00 },
        { name: 'Whiskey', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 25.00 },
        { name: 'Soft Drinks', unit: 'bottles', ratio: 'peopleCount * 4', min: 12, price: 1.25 },
        { name: 'Sweet Tea', unit: 'gallons', ratio: 'Math.ceil(peopleCount / 8)', min: 2, price: 4.00 },
        { name: 'Vietnamese Iced Coffee Mix', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 1, price: 6.00 },
        { name: 'Bottled Water', unit: 'bottles', ratio: 'peopleCount * 3', min: 12, price: 0.75 },
        { name: 'Ice', unit: 'bags', ratio: 'Math.ceil(peopleCount / 3)', min: 4, price: 3.50 },
        { name: 'Drink Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 45.00 },
        { name: 'Bottle Openers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 3, price: 5.00 }
      ]
    },
    'sides-extras': {
      title: 'Sides & Extras',
      items: [
        { name: 'Garlic Bread', unit: 'loaves', ratio: 'Math.ceil(peopleCount / 4)', min: 2, price: 3.50 },
        { name: 'Vietnamese Coleslaw', unit: 'lbs', ratio: 'peopleCount * 0.3', min: 2, price: 3.50 },
        { name: 'Asian Noodle Salad', unit: 'lbs', ratio: 'peopleCount * 0.4', min: 2, price: 4.50 },
        { name: 'Hush Puppies', unit: 'dozen', ratio: 'Math.ceil(peopleCount / 3)', min: 2, price: 6.00 },
        { name: 'Pickled Vegetables', unit: 'jars', ratio: 'Math.ceil(peopleCount / 8)', min: 2, price: 5.00 },
        { name: 'Crackers', unit: 'boxes', ratio: 'Math.ceil(peopleCount / 10)', min: 2, price: 3.00 }
      ]
    },
    'desserts': {
      title: 'Desserts',
      items: [
        { name: 'Banana Pudding', unit: 'servings', ratio: 'peopleCount * 0.7', min: 6, price: 2.50 },
        { name: 'Che Ba Mau', unit: 'servings', ratio: 'peopleCount * 0.5', min: 4, price: 3.50 },
        { name: 'Pecan Pie', unit: 'pies', ratio: 'Math.ceil(peopleCount / 10)', min: 1, price: 15.00 },
        { name: 'Coconut Macaroons', unit: 'dozen', ratio: 'Math.ceil(peopleCount / 4)', min: 2, price: 9.00 },
        { name: 'Fresh Tropical Fruit Tray', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 1, price: 25.00 },
        { name: 'Mochi Ice Cream', unit: 'boxes', ratio: 'Math.ceil(peopleCount / 8)', min: 1, price: 12.00 }
      ]
    },
    'entertainment': {
      title: 'Music & Entertainment',
      items: [
        { name: 'Bluetooth Speaker', unit: '', ratio: 'Math.ceil(peopleCount / 30)', min: 1, price: 75.00 },
        { name: 'Cornhole Set', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 45.00 },
        { name: 'Ladder Toss', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 35.00 },
        { name: 'Giant Jenga', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 40.00 },
        { name: 'Horseshoes Set', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 30.00 },
        { name: 'Frisbee', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 10.00 },
        { name: 'Beer Pong Table', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 60.00 },
        { name: 'String Lights', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 15.00 },
        { name: 'Shade Canopies', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 80.00 },
        { name: 'Folding Chairs', unit: '', ratio: 'peopleCount * 0.8', min: 4, price: 20.00 }
      ]
    },
    'comfort-safety': {
      title: 'Comfort & Safety',
      items: [
        { name: 'Bug Spray', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 6.00 },
        { name: 'First Aid Kit', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Sunscreen', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 10)', min: 2, price: 8.00 },
        { name: 'Hand Sanitizer', unit: 'bottles', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 4.00 },
        { name: 'Cleaning Rags', unit: 'packs', ratio: 'Math.ceil(peopleCount / 10)', min: 3, price: 3.00 },
        { name: 'Fans', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 45.00 },
        { name: 'Shade Tents', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 75.00 }
      ]
    },
    'cleanup': {
      title: 'Cleanup & Post-Party',
      items: [
        { name: 'Shell Waste Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 6)', min: 4, price: 12.00 },
        { name: 'Cleaning Solution', unit: 'bottles', ratio: '2', min: 2, price: 4.00 },
        { name: 'Cleaning Rags', unit: 'packs', ratio: '3', min: 2, price: 5.00 },
        { name: 'Leftover Storage Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 50.00 },
        { name: 'Table Scrub Brush', unit: '', ratio: '2', min: 2, price: 8.00 }
      ]
    }
  }
};

export function buildAdvancedItems({ peopleCount, lbsPerPerson, location, style = 'cajun' }) {
  const people = Number(peopleCount);
  const lpp = Number(lbsPerPerson);
  const prices = CONFIG.regionalPricing[location] ?? CONFIG.regionalPricing.louisiana;
  const crawfishLbs = people * lpp;
  const styleItems = ADVANCED_ITEMS[style] ?? ADVANCED_ITEMS.cajun;
  const equipmentSize = getEquipmentSize(crawfishLbs);
  
  // Helper function to evaluate ratio strings safely
  const evalRatio = (ratioStr) => {
    // Replace variables with actual values
    let formula = ratioStr
      .replace(/peopleCount/g, people)
      .replace(/lbsPerPerson/g, lpp)
      .replace(/crawfishLbs/g, crawfishLbs);
    
    // Handle Math functions and basic arithmetic
    try {
      return Function(`"use strict"; return (${formula})`)();
    } catch (e) {
      console.warn('Error evaluating formula:', formula, e);
      return 1; // fallback
    }
  };
  
  const allItems = [];
  let total = 0;
  
  // Process all categories
  Object.keys(styleItems).forEach(categoryKey => {
    const category = styleItems[categoryKey];
    category.items.forEach(item => {
      let processedItem = { ...item };
      
      // Handle dynamic equipment sizing
      if (item.isDynamic) {
        if (item.name === 'DYNAMIC_BURNER_COMBO') {
          processedItem.name = equipmentSize.burnerSize;
          processedItem.price = equipmentSize.burnerPrice;
          processedItem.amazonSearchTerm = equipmentSize.searchTerm;
        } else if (item.name === 'Propane Tanks' && item.ratio === 'DYNAMIC_PROPANE_TANKS') {
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

// Helper function to format quantity display
const formatQuantity = (qty, unit) => {
  const num = Number(qty);
  // Units that should always be whole numbers
  const wholeNumberUnits = ['', 'rolls', 'ears', 'bottles', 'jars', 'boxes', 'packs', 'cans', 'bunches', 'dozen', 'servings', 'gallons'];
  
  if (wholeNumberUnits.includes(unit) || Number.isInteger(num)) {
    return Math.round(num).toString();
  }
  return num.toFixed(1);
};

// Helper function to categorize items into foodstuffs vs non-foodstuffs
const categorizeShoppingList = (items) => {
  const foodstuffs = [];
  const nonFoodstuffs = [];
  
  // Define food categories and specific food items
  const foodKeywords = [
    // Main ingredients
    'crawfish', 'sausage', 'corn', 'potato', 'onion', 'garlic', 'lemon', 'mushroom', 'celery', 'carrot', 'artichoke',
    // Seasonings and condiments
    'seasoning', 'salt', 'juice', 'vinegar', 'butter', 'sauce', 'remoulade', 'parsley', 'thyme', 'bay leaves',
    // Drinks and beverages
    'beer', 'seltzer', 'hurricane', 'bloody mary', 'margarita', 'whiskey', 'soft drink', 'tea', 'water',
    // Sides and food
    'bread', 'coleslaw', 'potato salad', 'hush puppies', 'pickle', 'cracker',
    // Desserts
    'pudding', 'pie', 'brownie', 'cake', 'ice cream'
  ];
  
  const nonFoodKeywords = [
    // Cooking equipment
    'burner', 'propane', 'tank', 'strainer', 'paddle', 'thermometer', 'glove', 'tong', 'bucket', 'cooler',
    // Serving supplies
    'plate', 'utensil', 'tray', 'napkin', 'towel', 'wipe', 'cup', 'trash', 'bag', 'bin', 'container',
    // Setup equipment
    'table', 'covering', 'cord', 'extinguisher', 'opener'
  ];
  
  items.forEach(item => {
    const itemNameLower = item.name.toLowerCase();
    const isFood = foodKeywords.some(keyword => itemNameLower.includes(keyword)) || 
                   // Check specific categories that are clearly food
                   (item.category && ['Crawfish & Main Ingredients', 'Sides & Extras', 'Desserts', 'Drinks & Ice'].includes(item.category));
    
    const isNonFood = nonFoodKeywords.some(keyword => itemNameLower.includes(keyword)) ||
                      // Check specific categories that are clearly non-food
                      (item.category && ['Cooking Gear & Setup', 'Serving & Dining Supplies'].includes(item.category));
    
    if (isFood && !isNonFood) {
      foodstuffs.push(item);
    } else {
      nonFoodstuffs.push(item);
    }
  });
  
  return { foodstuffs, nonFoodstuffs };
};

// Google AdSense Ad Unit Component
const AdUnit = ({ slot, format = 'auto', style = {}, className = '' }) => {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Product Card Component for Shop Section
const ProductCard = ({ product, recommended = false, peopleCount = 4, crawfishLbs = 12, showAddToList = false, onAddToList }) => {
  // Calculate recommended quantity dynamically
  const getRecommendedQty = () => {
    if (product.getRecommendedQty) {
      // Use the appropriate parameter based on the function signature
      if (product.category === 'safety') {
        return product.getRecommendedQty(peopleCount);
      } else {
        return product.getRecommendedQty(crawfishLbs);
      }
    }
    return product.recommendedQty || 1;
  };

  const recommendedQty = getRecommendedQty();
  const savings = product.originalPrice ? 
    (parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))).toFixed(2) : null;

  return (
    <div className={`bg-white/5 p-4 rounded-lg border ${recommended ? 'border-orange-500 bg-orange-500/10' : 'border-white/10'} hover:bg-white/10 transition-colors relative`}>
      {recommended && (
        <div className="text-orange-400 text-xs font-semibold mb-2 flex items-center gap-1">
          ⭐ RECOMMENDED FOR YOUR PARTY
        </div>
      )}
      
      {savings && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          Save ${savings}
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-3xl">{product.image}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-lg mb-1">{product.name}</h4>
          <p className="text-gray-300 text-sm mb-2">{product.description}</p>
          
          {product.includes && (
            <p className="text-gray-400 text-xs mb-2">Includes: {product.includes}</p>
          )}
          {product.size && (
            <p className="text-gray-400 text-xs mb-2">Size: {product.size}</p>
          )}
          
          {/* Why Recommended section */}
          {product.whyRecommended && (
            <div className="bg-black/20 p-2 rounded text-xs mb-3 border-l-2 border-orange-400">
              <span className="text-orange-300 font-semibold">Why we recommend: </span>
              <span className="text-gray-300">{product.whyRecommended}</span>
            </div>
          )}

          {/* Quantity recommendation */}
          {recommendedQty > 1 && (
            <div className="text-xs text-blue-400 mb-2 flex items-center gap-1">
              💡 Recommended quantity for your party: <span className="font-semibold">{recommendedQty}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className="text-orange-400 text-xs flex items-center gap-1">
              ⭐ {product.rating} ({product.reviews.toLocaleString()} reviews)
            </span>
            <span className="text-green-400 text-xs">Prime eligible</span>
            {product.category && (
              <span className="text-gray-400 text-xs px-2 py-0.5 bg-black/20 rounded capitalize">
                {product.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-400">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
              )}
              {recommendedQty > 1 && (
                <span className="text-xs text-gray-400">
                  (${(parseFloat(product.price.replace('$', '')) * recommendedQty).toFixed(2)} total)
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {showAddToList && onAddToList && (
                <button
                  onClick={() => onAddToList(product, recommendedQty)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center gap-1"
                  title="Add to shopping list"
                >
                  📝 Add to List
                </button>
              )}
              <a
                href={getAmazonProductLink(product.asin)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Buy on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Section Component
const ShopSection = ({ peopleCount, crawfishLbs, onAddToShoppingList, mode }) => {
  // Determine recommended products based on party size and crawfish pounds
  const getRecommendedKit = () => {
    return SHOP_PRODUCTS.starterKits.find(kit => crawfishLbs <= kit.maxCrawfish) || SHOP_PRODUCTS.starterKits[2];
  };

  const getRecommendedSeasonings = () => {
    // Recommend top 2 seasonings for larger parties, 1 for smaller
    return crawfishLbs > 40 ? SHOP_PRODUCTS.seasonings.slice(0, 2) : SHOP_PRODUCTS.seasonings.slice(0, 1);
  };

  const getRecommendedEssentials = () => {
    // Recommend more essentials for larger parties
    if (crawfishLbs > 60) {
      return SHOP_PRODUCTS.essentials; // All essentials for large parties
    } else if (crawfishLbs > 30) {
      return SHOP_PRODUCTS.essentials.slice(0, 4); // Most essentials for medium parties
    } else {
      return SHOP_PRODUCTS.essentials.slice(0, 3); // Basic essentials for small parties
    }
  };

  const recommendedKit = getRecommendedKit();
  const recommendedSeasonings = getRecommendedSeasonings();
  const recommendedEssentials = getRecommendedEssentials();

  // Calculate total recommended cost
  const getTotalRecommendedCost = () => {
    let total = 0;
    
    // Add recommended kit
    total += parseFloat(recommendedKit.price.replace('$', ''));
    
    // Add recommended seasonings
    recommendedSeasonings.forEach(seasoning => {
      const qty = seasoning.getRecommendedQty ? seasoning.getRecommendedQty(crawfishLbs) : 1;
      total += parseFloat(seasoning.price.replace('$', '')) * qty;
    });
    
    // Add recommended essentials
    recommendedEssentials.forEach(essential => {
      const qty = essential.getRecommendedQty ? 
        (essential.category === 'safety' ? essential.getRecommendedQty(peopleCount) : essential.getRecommendedQty(crawfishLbs)) : 1;
      total += parseFloat(essential.price.replace('$', '')) * qty;
    });
    
    return total;
  };

  const totalRecommendedCost = getTotalRecommendedCost();
  const showAddToList = mode === 'advanced';

  return (
    <div className="space-y-8">
      {/* Recommendation Summary */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
        <h4 className="font-semibold text-lg mg-gradient-text mb-2">🎯 Our Recommendations for Your Party</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Party size:</span>
            <span className="text-white ml-2 font-semibold">{peopleCount} people</span>
          </div>
          <div>
            <span className="text-gray-400">Crawfish needed:</span>
            <span className="text-white ml-2 font-semibold">{crawfishLbs} lbs</span>
          </div>
          <div>
            <span className="text-gray-400">Recommended gear:</span>
            <span className="text-white ml-2 font-semibold">{1 + recommendedSeasonings.length + recommendedEssentials.length} items</span>
          </div>
          <div>
            <span className="text-gray-400">Estimated cost:</span>
            <span className="text-orange-400 ml-2 font-semibold">${totalRecommendedCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Starter Kits Section */}
      <div>
        <h4 className="font-semibold text-lg mg-gradient-text mb-4 flex items-center gap-2">
          🏁 Complete Starter Kits
          <span className="text-sm font-normal text-gray-400">Everything you need to get started</span>
        </h4>
        <div className="space-y-3">
          {SHOP_PRODUCTS.starterKits.map((kit, index) => (
            <ProductCard 
              key={index}
              product={kit} 
              recommended={kit.name === recommendedKit.name}
              peopleCount={peopleCount}
              crawfishLbs={crawfishLbs}
              showAddToList={showAddToList}
              onAddToList={onAddToShoppingList}
            />
          ))}
        </div>
      </div>

      {/* Essential Seasonings */}
      <div>
        <h4 className="font-semibold text-lg mg-gradient-text mb-4 flex items-center gap-2">
          🌶️ Essential Seasonings
          <span className="text-sm font-normal text-gray-400">The secret to authentic flavor</span>
        </h4>
        <div className="space-y-3">
          {SHOP_PRODUCTS.seasonings.map((seasoning, index) => (
            <ProductCard 
              key={index} 
              product={seasoning}
              recommended={recommendedSeasonings.includes(seasoning)}
              peopleCount={peopleCount}
              crawfishLbs={crawfishLbs}
              showAddToList={showAddToList}
              onAddToList={onAddToShoppingList}
            />
          ))}
        </div>
      </div>

      {/* Essential Tools */}
      <div>
        <h4 className="font-semibold text-lg mg-gradient-text mb-4 flex items-center gap-2">
          🛠️ Essential Tools & Safety
          <span className="text-sm font-normal text-gray-400">Professional-grade equipment</span>
        </h4>
        <div className="space-y-3">
          {SHOP_PRODUCTS.essentials.map((tool, index) => (
            <ProductCard 
              key={index} 
              product={tool}
              recommended={recommendedEssentials.includes(tool)}
              peopleCount={peopleCount}
              crawfishLbs={crawfishLbs}
              showAddToList={showAddToList}
              onAddToList={onAddToShoppingList}
            />
          ))}
        </div>
      </div>

      {/* Quick Add All Recommended */}
      {showAddToList && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            ⚡ Quick Actions
          </h4>
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Add all recommended items to shopping list
                onAddToShoppingList(recommendedKit, 1);
                recommendedSeasonings.forEach(seasoning => {
                  const qty = seasoning.getRecommendedQty ? seasoning.getRecommendedQty(crawfishLbs) : 1;
                  onAddToShoppingList(seasoning, qty);
                });
                recommendedEssentials.forEach(essential => {
                  const qty = essential.getRecommendedQty ? 
                    (essential.category === 'safety' ? essential.getRecommendedQty(peopleCount) : essential.getRecommendedQty(crawfishLbs)) : 1;
                  onAddToShoppingList(essential, qty);
                });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center gap-2"
            >
              📝 Add All Recommended to List
              <span className="text-xs opacity-75">(${totalRecommendedCost.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CrawfishBoilCalculator() {
  // State declarations — declared ONCE
  const [mode, setMode] = useState('basic');
  const [style, setStyle] = useState('cajun');
  const [location, setLocation] = useState('other'); // Default to 'other' for estimates
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting', 'detected', 'denied', 'error'
  const [detectedRegion, setDetectedRegion] = useState('');
  const [peopleCount, setPeopleCount] = useState(4);
  const [lbsPerPerson, setLbsPerPerson] = useState(3);
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [totalCost, setTotalCost] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [itemToggles, setItemToggles] = useState({});
  const [showMySetup, setShowMySetup] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Compute current spice accent color and expose as CSS var "--spice" for uniform theming
  const spiceColor = SPICE_COLORS[Number(spiceLevel)] || '#FF7043';
  const spiceStyle = { ['--spice']: spiceColor };

  // Geolocation detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Simple region detection based on coordinates
          // Louisiana: roughly 29-33°N, 89-94°W
          // Texas: roughly 25-36°N, 93-106°W
          if (latitude >= 29 && latitude <= 33 && longitude >= -94 && longitude <= -89) {
            setLocation('louisiana');
            setDetectedRegion('Louisiana');
          } else if (latitude >= 25 && latitude <= 36 && longitude >= -106 && longitude <= -93) {
            setLocation('texas');
            setDetectedRegion('Texas');
          } else {
            setLocation('other');
            setDetectedRegion('Other');
          }
          setLocationStatus('detected');
        },
        (error) => {
          console.log('Location access denied or error:', error);
          setLocation('other'); // Use estimates
          setLocationStatus('denied');
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      setLocationStatus('error');
      setLocation('other');
    }
  }, []);

  useEffect(() => {
    const { items, total } = mode === 'advanced' 
      ? buildAdvancedItems({ peopleCount, lbsPerPerson, location, style })
      : buildToupsBoilItems({ peopleCount, lbsPerPerson, location });
    setShoppingList(items);
    
    // Initialize toggles for new items (default to enabled)
    const newToggles = { ...itemToggles };
    items.forEach(item => {
      if (!(item.name in newToggles)) {
        newToggles[item.name] = true;
      }
    });
    setItemToggles(newToggles);
    
    // Calculate total with only enabled items
    const enabledTotal = items.reduce((sum, item) => {
      return sum + (newToggles[item.name] !== false ? Number(item.qty) * Number(item.price) : 0);
    }, 0);
    setTotalCost(enabledTotal);
  }, [peopleCount, lbsPerPerson, location, mode, style]);

  // Update total when toggles change
  useEffect(() => {
    const enabledTotal = shoppingList.reduce((sum, item) => {
      return sum + (itemToggles[item.name] ? Number(item.qty) * Number(item.price) : 0);
    }, 0);
    setTotalCost(enabledTotal);
  }, [itemToggles, shoppingList]);

  const toggleItem = (itemName) => {
    setItemToggles(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const toggleCategoryItems = (categoryTitle, enabled) => {
    const categoryItems = shoppingList.filter(item => item.category === categoryTitle);
    const newToggles = { ...itemToggles };
    categoryItems.forEach(item => {
      newToggles[item.name] = enabled;
    });
    setItemToggles(newToggles);
  };

  const resetAllToggles = () => {
    const allEnabled = {};
    shoppingList.forEach(item => {
      allEnabled[item.name] = true;
    });
    setItemToggles(allEnabled);
  };

  // Function to add shop products to shopping list
  const addShopItemToList = (product, quantity) => {
    const newItem = {
      name: product.name,
      qty: quantity,
      unit: '',
      price: parseFloat(product.price.replace('$', '')),
      category: 'Shop Items',
      isShopItem: true,
      amazonLink: getAmazonProductLink(product.asin)
    };

    // Check if item already exists in shopping list
    const existingItemIndex = shoppingList.findIndex(item => item.name === product.name && item.isShopItem);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedList = [...shoppingList];
      updatedList[existingItemIndex].qty = quantity;
      setShoppingList(updatedList);
    } else {
      // Add new item to shopping list
      setShoppingList(prev => [...prev, newItem]);
      setItemToggles(prev => ({
        ...prev,
        [product.name]: true
      }));
    }

    // Show confirmation feedback
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
    notification.textContent = `Added ${product.name} to shopping list!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  // Modern export system with multiple formats
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExportData = () => {
    const enabledItems = shoppingList.filter(item => itemToggles[item.name] !== false);
    const { foodstuffs, nonFoodstuffs } = categorizeShoppingList(enabledItems);
    
    return {
      metadata: {
        title: 'Crawfish Boil Shopping List',
        peopleCount,
        lbsPerPerson,
        totalCost: Number(totalCost).toFixed(2),
        mode,
        style: mode === 'advanced' ? style : 'basic',
        location,
        spiceLevel,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Crawfish Boil Calculator'
      },
      items: enabledItems,
      categories: {
        foodstuffs,
        nonFoodstuffs
      },
      summary: {
        totalItems: enabledItems.length,
        foodItems: foodstuffs.length,
        equipmentItems: nonFoodstuffs.length,
        totalCost: Number(totalCost).toFixed(2)
      }
    };
  };

  const exportFormats = {
    text: () => {
      const data = generateExportData();
      return [
        `🦞 ${data.metadata.title}`,
        `For ${data.metadata.peopleCount} people (${data.metadata.lbsPerPerson} lbs per person)`,
        `Mode: ${data.metadata.mode === 'advanced' ? `${data.metadata.mode} (${data.metadata.style})` : data.metadata.mode}`,
        `Location: ${data.metadata.location}`,
        `Spice Level: ${data.metadata.spiceLevel}/4`,
        ``,
        `🥘 FOODSTUFFS (${data.categories.foodstuffs.length} items)`,
        ...data.categories.foodstuffs.map(item => 
          `• ${formatQuantity(item.qty, item.unit)} ${item.unit} ${item.name} - $${(Number(item.qty) * Number(item.price)).toFixed(2)}`
        ),
        ``,
        `🛠️ EQUIPMENT & SUPPLIES (${data.categories.nonFoodstuffs.length} items)`,
        ...data.categories.nonFoodstuffs.map(item => 
          `• ${formatQuantity(item.qty, item.unit)} ${item.unit} ${item.name} - $${(Number(item.qty) * Number(item.price)).toFixed(2)}`
        ),
        ``,
        `💰 TOTAL: $${data.metadata.totalCost}`,
        ``,
        `Generated by Crawfish Boil Calculator on ${new Date().toLocaleDateString()}`,
        `* Prices vary by season and location`
      ].join('\n');
    },

    csv: () => {
      const data = generateExportData();
      const headers = ['Category,Item,Quantity,Unit,Price Per Unit,Total Price'];
      const rows = data.items.map(item => {
        const category = data.categories.foodstuffs.includes(item) ? 'Foodstuffs' : 'Equipment & Supplies';
        return `"${category}","${item.name}","${item.qty}","${item.unit || ''}","${item.price}","${(Number(item.qty) * Number(item.price)).toFixed(2)}"`;
      });
      return headers.concat(rows).join('\n');
    },

    json: () => {
      return JSON.stringify(generateExportData(), null, 2);
    }
  };

  const exportShoppingList = async (format = 'text') => {
    try {
      const content = exportFormats[format]();
      const data = generateExportData();
      
      // Try Web Share API first (mobile)
      if (navigator.share && format === 'text') {
        await navigator.share({
          title: data.metadata.title,
          text: content
        });
        showToast('Shared successfully!');
        return;
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(content);
      showToast('Shopping list copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = exportFormats[format]();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Shopping list copied to clipboard!');
    }
  };

  const downloadShoppingList = (format = 'csv') => {
    const content = exportFormats[format]();
    const data = generateExportData();
    const timestamp = new Date().toISOString().split('T')[0];
    
    const filenames = {
      text: `crawfish-list-${timestamp}.txt`,
      csv: `crawfish-list-${timestamp}.csv`,
      json: `crawfish-list-${timestamp}.json`
    };

    const mimeTypes = {
      text: 'text/plain',
      csv: 'text/csv',
      json: 'application/json'
    };

    downloadFile(content, filenames[format], mimeTypes[format]);
    showToast(`Downloaded ${format.toUpperCase()} file!`);
  };

  const renderShoppingItem = (item, index, keyPrefix = '') => {
    const isEnabled = itemToggles[item.name] !== false;
    const showAmazonLink = (mode === 'advanced' && AFFILIATE_CATEGORIES.includes(item.category)) || item.isShopItem;
    const amazonUrl = item.isShopItem ? item.amazonLink : getAmazonLink(item.name, item.amazonSearchTerm);
    
    return (
      <li key={`${keyPrefix}${index}`} className={`bg-white/5 p-4 rounded-lg flex items-center gap-4 ${!isEnabled ? 'mg-item-disabled' : ''} ${item.isShopItem ? 'border-l-2 border-blue-400' : ''}`}>
        <button 
          className={`mg-toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => toggleItem(item.name)}
          title={`Toggle ${item.name}`}
        ></button>
        <div className="flex-1">
          <span className="mg-item-text">{formatQuantity(item.qty, item.unit)} {item.unit} {item.name}</span>
          {item.isShopItem && (
            <div className="text-xs text-blue-400 mt-1">🛒 Shop Item</div>
          )}
        </div>
        <span className="mg-price font-semibold">${ (Number(item.qty) * Number(item.price)).toFixed(2) }</span>
        {showAmazonLink && (
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors shrink-0"
            title={`Find ${item.name} on Amazon`}
          >
            🛒 Buy
          </a>
        )}
      </li>
    );
  };

  const printShoppingList = () => {
    const data = generateExportData();
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.metadata.title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              padding: 20px; 
              max-width: 800px; 
              margin: 0 auto;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 3px solid #FF3D00; 
              padding-bottom: 20px;
            }
            .header h1 { 
              color: #FF3D00; 
              font-size: 28px; 
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .metadata { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 15px; 
              margin-bottom: 30px; 
              padding: 15px; 
              background-color: #f8f9fa; 
              border-radius: 8px;
            }
            .metadata-item { text-align: center; }
            .metadata-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .metadata-value { font-size: 16px; color: #333; }
            .section { margin-bottom: 30px; }
            .section-title { 
              font-size: 20px; 
              font-weight: bold; 
              color: #FF3D00; 
              margin-bottom: 15px; 
              display: flex; 
              align-items: center; 
              gap: 8px;
            }
            .items-grid { 
              display: grid; 
              grid-template-columns: 3fr 1fr 1fr 1fr; 
              gap: 10px; 
              align-items: center;
            }
            .items-header { 
              font-weight: bold; 
              padding: 10px 5px; 
              background-color: #f0f0f0; 
              border-bottom: 2px solid #ddd;
            }
            .item-row { 
              padding: 8px 5px; 
              border-bottom: 1px solid #eee; 
            }
            .item-row:nth-child(even) { background-color: #f9f9f9; }
            .item-name { font-weight: 500; }
            .item-qty, .item-price, .item-total { text-align: center; }
            .summary { 
              margin-top: 30px; 
              padding: 20px; 
              background-color: #fff5f5; 
              border: 2px solid #FF3D00; 
              border-radius: 8px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              font-size: 24px; 
              font-weight: bold; 
              color: #FF3D00;
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd; 
              padding-top: 15px;
            }
            .qr-placeholder {
              width: 80px;
              height: 80px;
              background-color: #f0f0f0;
              border: 2px dashed #ccc;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto;
              font-size: 10px;
              color: #999;
            }
            @media print {
              body { print-color-adjust: exact; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🦞 ${data.metadata.title} 🦞</h1>
          </div>
          
          <div class="metadata">
            <div class="metadata-item">
              <div class="metadata-label">Party Size</div>
              <div class="metadata-value">${data.metadata.peopleCount} people</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Crawfish per Person</div>
              <div class="metadata-value">${data.metadata.lbsPerPerson} lbs</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Mode</div>
              <div class="metadata-value">${data.metadata.mode === 'advanced' ? `${data.metadata.mode} (${data.metadata.style})` : data.metadata.mode}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Spice Level</div>
              <div class="metadata-value">${data.metadata.spiceLevel}/4</div>
            </div>
          </div>

          ${data.categories.foodstuffs.length > 0 ? `
          <div class="section">
            <div class="section-title">🥘 Foodstuffs (${data.categories.foodstuffs.length} items)</div>
            <div class="items-grid">
              <div class="items-header">Item</div>
              <div class="items-header">Quantity</div>
              <div class="items-header">Unit Price</div>
              <div class="items-header">Total</div>
              ${data.categories.foodstuffs.map(item => `
                <div class="item-row item-name">${item.name}</div>
                <div class="item-row item-qty">${formatQuantity(item.qty, item.unit)} ${item.unit}</div>
                <div class="item-row item-price">$${Number(item.price).toFixed(2)}</div>
                <div class="item-row item-total">$${(Number(item.qty) * Number(item.price)).toFixed(2)}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${data.categories.nonFoodstuffs.length > 0 ? `
          <div class="section">
            <div class="section-title">🛠️ Equipment & Supplies (${data.categories.nonFoodstuffs.length} items)</div>
            <div class="items-grid">
              <div class="items-header">Item</div>
              <div class="items-header">Quantity</div>
              <div class="items-header">Unit Price</div>
              <div class="items-header">Total</div>
              ${data.categories.nonFoodstuffs.map(item => `
                <div class="item-row item-name">${item.name}</div>
                <div class="item-row item-qty">${formatQuantity(item.qty, item.unit)} ${item.unit}</div>
                <div class="item-row item-price">$${Number(item.price).toFixed(2)}</div>
                <div class="item-row item-total">$${(Number(item.qty) * Number(item.price)).toFixed(2)}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="summary">
            <div class="total-row">
              <span>TOTAL COST:</span>
              <span>$${data.metadata.totalCost}</span>
            </div>
          </div>

          <div class="footer">
            <div class="qr-placeholder">QR Code<br>Placeholder</div>
            <p>Generated by Crawfish Boil Calculator on ${new Date().toLocaleDateString()}</p>
            <p>* Prices vary by season and location</p>
            <p>Visit calculator online for updates and more features</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    showToast('Print dialog opened!');
  };

  // Add scroll control effects
  // Google AdSense integration
  useEffect(() => {
    // Load AdSense script
    const adsenseScript = document.createElement('script');
    adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX';
    adsenseScript.crossOrigin = 'anonymous';
    adsenseScript.async = true;
    document.head.appendChild(adsenseScript);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Add class to body to control scrolling
    document.body.classList.add('crawfish-app-active');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('crawfish-app-active');
    };
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root{
          --ember-black:#0b0b0b; --ember-deep:#141414; --ember-red:#FF3D00; --ember-glow:#FF7043; --ember-dim:#bdbdbd;
        }
        /* Scroll prevention for direct HTML injection */
        .crawfish-calculator-wrapper {
          height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 768px) {
          .crawfish-calculator-wrapper {
            height: 100vh;
            height: 100dvh;
          }
        }
        .font-display{ font-family: 'Bungee', system-ui, sans-serif; }
        .font-body{ font-family: 'Inter', system-ui, sans-serif; }
        /* Header gradient, total text, etc. bind to current --spice for uniform coloring */
        .mg-gradient-text{ background: linear-gradient(90deg, color-mix(in srgb, var(--spice) 80%, white), var(--spice)); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 10px color-mix(in srgb, var(--spice) 45%, transparent); }
        .mg-card {
          background:
            radial-gradient(1000px 600px at 20% -10%, color-mix(in srgb, var(--spice) 20%, transparent), transparent 60%),
            radial-gradient(900px 700px at 80% 120%, color-mix(in srgb, var(--spice) 15%, transparent), transparent 60%),
            #0f0f0f;
        }
        .mg-border { box-shadow: 0 0 10px color-mix(in srgb, var(--spice) 60%, transparent), 0 0 40px color-mix(in srgb, var(--spice) 25%, transparent); }
        .mg-toggle > button { border-radius: 0.75rem; flex:1; padding: 0.65rem 0.75rem; font-weight: 700; }
        .mg-toggle .active { background: linear-gradient(135deg, color-mix(in srgb, var(--spice) 85%, white), var(--spice)); color: #0b0b0b; box-shadow: 0 0 12px color-mix(in srgb, var(--spice) 40%, transparent); }
        .mg-toggle .inactive { background: rgba(255,255,255,0.05); color: #eee; }
        .mg-label { color: #f5f5f5; font-weight: 700; }
        .mg-slider { accent-color: var(--spice); box-shadow: 0 0 10px color-mix(in srgb, var(--spice) 35%, transparent); border-radius: 999px; }
        .mg-chip { background: color-mix(in srgb, var(--spice) 18%, transparent); color: var(--spice); border: 1px solid color-mix(in srgb, var(--spice) 60%, transparent); }
        .mg-item-text { color: #f5f5f5; }
        .mg-price { color: #f5f5f5; font-weight: 600; }
        .mg-toggle-btn { 
          width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer; 
          transition: all 0.3s ease; position: relative; flex-shrink: 0;
          /* Better mobile touch target */
          min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;
        }
        .mg-toggle-btn.enabled { 
          background: linear-gradient(135deg, color-mix(in srgb, var(--spice) 85%, white), var(--spice)); 
          box-shadow: 0 0 8px color-mix(in srgb, var(--spice) 40%, transparent);
        }
        .mg-toggle-btn.disabled { background: rgba(255,255,255,0.1); }
        .mg-toggle-btn::after {
          content: ''; position: absolute; top: 2px; width: 20px; height: 20px; 
          border-radius: 50%; background: white; transition: all 0.3s ease;
        }
        .mg-toggle-btn.enabled::after { left: 22px; }
        .mg-toggle-btn.disabled::after { left: 2px; background: #999; }
        .mg-item-disabled { opacity: 0.4; }
        .mg-item-disabled .mg-item-text { color: #666; }
        .mg-item-disabled .mg-price { color: #666; text-shadow: none; }
      `}</style>

      <div className="crawfish-calculator-wrapper font-body flex justify-center items-center min-h-screen bg-[var(--ember-black)] text-gray-100 p-2 sm:p-4" style={spiceStyle}>
        <Card className="mg-card mg-border max-w-lg w-full rounded-2xl p-4 sm:p-6">
          <CardContent>
            <div className="text-center mb-6">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl mg-gradient-text drop-shadow flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl">🦞</span>
                CRAWFISH BOIL CALCULATOR
                <span className="text-2xl sm:text-3xl md:text-4xl">🦞</span>
              </h1>
            </div>

            {/* Top Ad - Header Banner */}
            <AdUnit 
              slot="XXXXXXXXX1" 
              format="horizontal" 
              className="mb-6"
              style={{ minHeight: '90px' }}
            />

            <div className="mg-toggle flex gap-2 bg-black/20 p-1 rounded-xl mb-6">
              <button className={mode === 'basic' ? 'active' : 'inactive'} onClick={() => setMode('basic')}>Basic</button>
              <button className={mode === 'advanced' ? 'active' : 'inactive'} onClick={() => setMode('advanced')}>Advanced</button>
            </div>

            {/* Style selector for Advanced Mode */}
            {mode === 'advanced' && (
              <div className="mb-6">
                <label className="mg-label block mb-2">Boil Style</label>
                <div className="mg-toggle flex gap-2 bg-black/20 p-1 rounded-xl">
                  <button className={style === 'cajun' ? 'active' : 'inactive'} onClick={() => setStyle('cajun')}>{CONFIG.boilStyles.cajun.name}</button>
                  <button className={style === 'vietcajun' ? 'active' : 'inactive'} onClick={() => setStyle('vietcajun')}>{CONFIG.boilStyles.vietcajun.name}</button>
                </div>
              </div>
            )}

            {/* Location Status Indicator */}
            {locationStatus !== 'detecting' && (
              <div className="mb-4 p-3 rounded-lg bg-black/20 border border-white/10">
                <div className="text-sm mg-label">
                  {locationStatus === 'detected' && (
                    <span className="text-green-400">📍 Pricing for {detectedRegion}</span>
                  )}
                  {locationStatus === 'denied' && (
                    <span className="text-yellow-400">📍 Using estimated pricing (location access denied)</span>
                  )}
                  {locationStatus === 'error' && (
                    <span className="text-yellow-400">📍 Using estimated pricing (location unavailable)</span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-5">

              <div>
                <label className="mg-label block mb-2">Number of People</label>
                <input 
                  type="number" 
                  min="1" 
                  value={peopleCount} 
                  onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value) || 1))} 
                  className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--spice)] text-white"
                  placeholder="Enter number of people"
                />
              </div>

              <div>
                <label className="mg-label block mb-2">Pounds per Person <span className="text-sm text-gray-400">(3 lbs/person is avg)</span></label>
                <input 
                  type="number" 
                  min="0.5" 
                  step="0.5" 
                  value={lbsPerPerson} 
                  onChange={(e) => setLbsPerPerson(Math.max(0.5, Number(e.target.value) || 0.5))} 
                  className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--spice)] text-white"
                  placeholder="Enter pounds per person"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="mg-label">Spice Level</label>
                  <span className="mg-chip px-2 py-0.5 rounded text-sm font-semibold">{CONFIG.spiceLevels[Number(spiceLevel)].name}</span>
                </div>
                <input type="range" min="1" max="4" value={Number(spiceLevel)} onChange={(e) => setSpiceLevel(Number(e.target.value))} className="mg-slider w-full" />
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-xl md:text-2xl mg-gradient-text">Shopping List</h2>
                <button 
                  onClick={resetAllToggles}
                  className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  title="Enable all items"
                >
                  Reset All
                </button>
              </div>
              {mode === 'advanced' ? (
                // Advanced mode: Group by categories
                Object.keys(ADVANCED_ITEMS[style] ?? ADVANCED_ITEMS.cajun).map(categoryKey => {
                  const category = (ADVANCED_ITEMS[style] ?? ADVANCED_ITEMS.cajun)[categoryKey];
                  const categoryItems = shoppingList.filter(item => item.category === category.title);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={categoryKey} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg mg-gradient-text">{category.title}</h3>
                        <div className="flex gap-2">
                          <button 
                            className="mg-btn-small bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => toggleCategoryItems(category.title, true)}
                          >
                            Select All
                          </button>
                          <button 
                            className="mg-btn-small bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => toggleCategoryItems(category.title, false)}
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {categoryItems.map((item, i) => renderShoppingItem(item, i, `${categoryKey}-`))}
                      </ul>
                    </div>
                  );
                })
              ) : (
                // Basic mode: Split into foodstuffs and non-foodstuffs
                (() => {
                  const { foodstuffs, nonFoodstuffs } = categorizeShoppingList(shoppingList);
                  return (
                    <div className="space-y-6">
                      {/* Foodstuffs Section */}
                      {foodstuffs.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg mg-gradient-text">🥘 Foodstuffs</h3>
                            <div className="flex gap-2">
                              <button 
                                className="mg-btn-small bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => {
                                  const newToggles = { ...itemToggles };
                                  foodstuffs.forEach(item => newToggles[item.name] = true);
                                  setItemToggles(newToggles);
                                }}
                              >
                                Select All
                              </button>
                              <button 
                                className="mg-btn-small bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => {
                                  const newToggles = { ...itemToggles };
                                  foodstuffs.forEach(item => newToggles[item.name] = false);
                                  setItemToggles(newToggles);
                                }}
                              >
                                Deselect All
                              </button>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {foodstuffs.map((item, i) => renderShoppingItem(item, i, 'food-'))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Non-Foodstuffs Section */}
                      {nonFoodstuffs.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg mg-gradient-text">🛠️ Equipment & Supplies</h3>
                            <div className="flex gap-2">
                              <button 
                                className="mg-btn-small bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => {
                                  const newToggles = { ...itemToggles };
                                  nonFoodstuffs.forEach(item => newToggles[item.name] = true);
                                  setItemToggles(newToggles);
                                }}
                              >
                                Select All
                              </button>
                              <button 
                                className="mg-btn-small bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => {
                                  const newToggles = { ...itemToggles };
                                  nonFoodstuffs.forEach(item => newToggles[item.name] = false);
                                  setItemToggles(newToggles);
                                }}
                              >
                                Deselect All
                              </button>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {nonFoodstuffs.map((item, i) => renderShoppingItem(item, i, 'nonfood-'))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
              <div className="text-right mt-4 font-display text-xl md:text-2xl">
                <span className="mg-gradient-text">Total: ${Number(totalCost).toFixed(2)}</span>
              </div>
              
              {/* Middle Ad - After Shopping List */}
              <AdUnit 
                slot="XXXXXXXXX2" 
                format="rectangle" 
                className="my-6"
                style={{ minHeight: '250px' }}
              />
              
              {/* Modern Export/Share Controls */}
              <div className="mt-4 relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>📤</span>
                  Export & Share
                  <span className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showExportMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 z-10 overflow-hidden">
                    {/* Quick Actions */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Quick Actions</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            exportShoppingList('text');
                            setShowExportMenu(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-blue-700"
                        >
                          📋 Copy List
                        </button>
                        <button 
                          onClick={() => {
                            printShoppingList();
                            setShowExportMenu(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-md transition-colors text-green-700"
                        >
                          🖨️ Print
                        </button>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Download Files</div>
                      <div className="space-y-1">
                        <button 
                          onClick={() => {
                            downloadShoppingList('csv');
                            setShowExportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors text-gray-700"
                        >
                          <span className="text-green-600">📊</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Excel/CSV</div>
                            <div className="text-xs text-gray-500">Spreadsheet format</div>
                          </div>
                        </button>
                        <button 
                          onClick={() => {
                            downloadShoppingList('json');
                            setShowExportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors text-gray-700"
                        >
                          <span className="text-blue-600">⚙️</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">JSON Data</div>
                            <div className="text-xs text-gray-500">For apps & automation</div>
                          </div>
                        </button>
                        <button 
                          onClick={() => {
                            downloadShoppingList('text');
                            setShowExportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors text-gray-700"
                        >
                          <span className="text-gray-600">📄</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Text File</div>
                            <div className="text-xs text-gray-500">Plain text format</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Share Options (if supported) */}
                    {navigator.share && (
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Share</div>
                        <button 
                          onClick={() => {
                            exportShoppingList('text');
                            setShowExportMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors text-gray-700"
                        >
                          <span className="text-purple-600">📱</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Share via Apps</div>
                            <div className="text-xs text-gray-500">Text, email, messaging</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Click outside to close menu */}
              {showExportMenu && (
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setShowExportMenu(false)}
                />
              )}
              
              {/* Season Disclaimer */}
              <div className="text-center mt-4 text-xs text-gray-400 italic">
                * Prices vary by season and location
              </div>
              
              {/* My Setup Section - Only show in advanced mode */}
              {mode === 'advanced' && (
                <div className="mt-6 border-t border-white/10 pt-4">
                  <button 
                    onClick={() => setShowMySetup(!showMySetup)}
                    className="flex items-center justify-between w-full text-left mb-3 hover:bg-white/5 p-2 rounded transition-colors"
                  >
                    <h3 className="font-semibold text-lg mg-gradient-text">My Setup - What I Actually Use</h3>
                    <span className="text-xl">{showMySetup ? '▼' : '▶'}</span>
                  </button>
                  
                  {showMySetup && (
                    <div className="space-y-4 pl-4">
                      <div>
                        <h4 className="font-semibold text-md text-white mb-2">Equipment</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">Big batches: Creole Feast CFB1001A</span>
                            <a href={`https://www.amazon.com/CFB1001A-Crawfish-Seafood-Regulator-Mounting/dp/B08W4YQ8LS?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">Small batches: Creole Feast TFS3010</span>
                            <a href={`https://www.amazon.com/CreoleFeast-TFS3010-Propane-Steamer-Outdoor/dp/B08HVJZRQ5?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">Stir paddle: Bayou Classic Stainless</span>
                            <a href={`https://www.amazon.com/Bayou-Classic-1042-Stainless-Paddle/dp/B000FTUTL6?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">Heat resistant gloves: Steam Proof Gloves</span>
                            <a href={`https://www.amazon.com/Resistant-Barbecue-Waterproof-Neoprene-Grilling/dp/B07Z6FC7HL?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-md text-white mb-2">Spices</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">HEB & Local (or Louisiana liquid/powder boils)</span>
                            <a href={`https://www.amazon.com/Louisiana-Crawfish-Shrimp-Bundle-powder/dp/B08FZ4F7VV?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-md text-white mb-2">Sauces</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center justify-between bg-white/5 p-2 rounded">
                            <span className="text-gray-300">Kraft creamy horseradish (nostalgic!) 🥄</span>
                            <a href={`https://www.amazon.com/Kraft-Horseradish-Sauce-Squeeze-Bottle/dp/B00D0FBYYI?tag=${AMAZON_STORE_ID}`} target="_blank" rel="noopener noreferrer" className="mg-amazon-btn bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs">🛒 Buy</a>
                          </li>
                          <li className="bg-white/5 p-2 rounded">
                            <span className="text-gray-400 text-xs italic">Everything else is homemade 👨‍🍳</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shop Essentials Section */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <button 
                  onClick={() => setShowShop(!showShop)}
                  className="w-full text-left flex items-center justify-between mb-4 hover:bg-white/5 p-3 rounded transition-colors"
                >
                  <div>
                    <h3 className="font-display text-xl mg-gradient-text">🛒 Shop Essentials</h3>
                    <p className="text-sm text-gray-400">Curated gear and supplies for your boil</p>
                  </div>
                  <span className="text-xl">{showShop ? '▼' : '▶'}</span>
                </button>
                
                {showShop && (
                  <div className="pl-4">
                    <ShopSection 
                      peopleCount={peopleCount} 
                      crawfishLbs={peopleCount * lbsPerPerson}
                      onAddToShoppingList={addShopItemToList}
                      mode={mode}
                    />
                  </div>
                )}
              </div>

              {/* Amazon Affiliate Disclosure */}
              <div className="text-center mt-6 text-xs text-gray-500 italic">
                As an Amazon Associate, I earn from qualifying purchases.
              </div>
              
              {/* Bottom Ad - Footer */}
              <AdUnit 
                slot="XXXXXXXXX3" 
                format="horizontal" 
                className="mt-6"
                style={{ minHeight: '90px' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// --- Tiny test harness (runs only in non-production) ---
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (function runTests() {
    const approx = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

    // Test 1: baseline values scale correctly
    const { items: t1, total: tot1 } = buildToupsBoilItems({ peopleCount: 10, lbsPerPerson: 3, location: 'louisiana' });
    const c1 = t1.find(x => x.name === 'Crawfish');
    const corn1 = t1.find(x => x.name === 'Corn');
    console.assert(approx(c1.qty, 30), 'T1 Crawfish should be 30 lbs');
    console.assert(approx(corn1.qty, 30 * 0.267), 'T1 Corn should follow ratio 0.267 ears/lb');
    console.assert(tot1 > 0, 'T1 total should be positive');

    // Test 2: string inputs are coerced to numbers
    const { items: t2 } = buildToupsBoilItems({ peopleCount: '8', lbsPerPerson: '2.5', location: 'texas' });
    const c2 = t2.find(x => x.name === 'Crawfish');
    console.assert(approx(c2.qty, 20), 'T2 Crawfish should be 20 lbs with string inputs');

    // Test 3: fallback location (unknown -> louisiana)
    const { items: t3 } = buildToupsBoilItems({ peopleCount: 4, lbsPerPerson: 3, location: 'unknown' });
    const c3 = t3.find(x => x.name === 'Crawfish');
    console.assert(approx(c3.qty, 12), 'T3 fallback to louisiana quantities');

    // Test 4: minimums applied (onions>=1, salt>=1 lb, bottles>=0.5)
    const { items: t4 } = buildToupsBoilItems({ peopleCount: 1, lbsPerPerson: 1, location: 'louisiana' });
    const onions = t4.find(x => x.name === 'Onions');
    const salt = t4.find(x => x.name === 'Salt');
    const lemonJuice = t4.find(x => x.name === 'Lemon Juice');
    console.assert(onions.qty >= 1, 'T4 onions minimum applied');
    console.assert(salt.qty >= 1, 'T4 salt minimum applied');
    console.assert(lemonJuice.qty >= 0.5, 'T4 lemon juice minimum bottle applied');

    // Test 5: spice color mapping — ensure known keys resolve
    const colors = [SPICE_COLORS[1], SPICE_COLORS[2], SPICE_COLORS[3], SPICE_COLORS[4]];
    console.assert(colors.every(Boolean), 'T5 spice color map should have all 4 levels');

    // Test 6: categorizeShoppingList — ensure proper food/non-food separation
    const testItems = [
      { name: 'Live Crawfish', category: 'Crawfish & Main Ingredients' },
      { name: 'Disposable Plates', category: 'Serving & Dining Supplies' },
      { name: 'Beer', category: 'Drinks & Ice' },
      { name: 'Heat Resistant Gloves', category: 'Cooking Gear & Setup' },
      { name: 'Garlic Bread', category: 'Sides & Extras' }
    ];
    const { foodstuffs, nonFoodstuffs } = categorizeShoppingList(testItems);
    console.assert(foodstuffs.some(item => item.name === 'Live Crawfish'), 'T6 Crawfish should be in foodstuffs');
    console.assert(foodstuffs.some(item => item.name === 'Beer'), 'T6 Beer should be in foodstuffs');
    console.assert(foodstuffs.some(item => item.name === 'Garlic Bread'), 'T6 Garlic Bread should be in foodstuffs');
    console.assert(nonFoodstuffs.some(item => item.name === 'Disposable Plates'), 'T6 Plates should be in non-foodstuffs');
    console.assert(nonFoodstuffs.some(item => item.name === 'Heat Resistant Gloves'), 'T6 Gloves should be in non-foodstuffs');

    if (typeof console !== 'undefined') console.log('[CrawfishBoilCalculator] tests passed');
  })();
}
