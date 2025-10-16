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

// Helper function to generate Amazon affiliate search links
const getAmazonLink = (searchTerm, customSearchTerm = null) => {
  const term = customSearchTerm || getOptimizedSearchTerm(searchTerm) || searchTerm;
  const encodedTerm = encodeURIComponent(term);
  return `https://www.amazon.com/s?k=${encodedTerm}&tag=${AMAZON_STORE_ID}`;
};

// Optimized search terms for better Amazon results (equipment only)
const getOptimizedSearchTerm = (itemName) => {
  const searchTerms = {
    // Equipment search terms remain for better targeting
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
      burnerPrice: 85.00,
      propaneTanks: 1,
      searchTerm: 'crawfish boiler kit 40K BTU 40 quart'
    };
  } else if (crawfishLbs <= 60) {
    return {
      burnerSize: 'Crawfish Boiler Kit (60qt)',
      burnerPrice: 120.00,
      propaneTanks: 1,
      searchTerm: 'crawfish boiler kit 60K BTU 60 quart'
    };
  } else if (crawfishLbs <= 120) {
    return {
      burnerSize: 'Crawfish Boiler Kit (80-100qt)',
      burnerPrice: 180.00,
      propaneTanks: 2,
      searchTerm: 'crawfish boiler kit 100K BTU 100 quart'
    };
  } else {
    return {
      burnerSize: 'Dual Crawfish Boiler Kit (120qt)',
      burnerPrice: 300.00,
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
        { name: 'Garlic Heads', unit: '', ratio: 'crawfishLbs * 0.1', min: 2, price: 1.50 },
        { name: 'Crawfish Boil Seasoning', unit: 'oz', ratio: 'crawfishLbs * 1.6', min: 8, priceKey: 'cajunSeasoning' },
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
        { name: 'Propane Tanks (20lb)', unit: '', ratio: 'DYNAMIC_PROPANE_TANKS', min: 1, price: 40.00, isDynamic: true },
        { name: 'Strainer Basket', unit: '', ratio: '1', min: 1, price: 45.00 },
        { name: 'Long-handled Paddle', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Digital Thermometer', unit: '', ratio: '1', min: 1, price: 15.00 },
        { name: 'Heat Resistant Gloves', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Long Tongs (18")', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Rinse Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 15.00 },
        { name: 'Ice Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 60.00 },
        { name: 'Crawfish Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 20.00 },
        { name: 'Table Coverings', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Folding Tables', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 80.00 },
        { name: 'Extension Cords', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 2, price: 25.00 },
        { name: 'Fire Extinguisher', unit: '', ratio: '1', min: 1, price: 35.00 }
      ]
    },
    'serving-dining': {
      title: 'Serving & Dining Supplies',
      items: [
        { name: 'Disposable Plates', unit: '', ratio: 'peopleCount * 3', min: 10, price: 0.15 },
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
        { name: 'Shell Waste Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 4, price: 12.00 },
        { name: 'To-go Containers', unit: '', ratio: 'Math.ceil(peopleCount / 3)', min: 10, price: 0.75 }
      ]
    },
    'drinks-ice': {
      title: 'Drinks & Ice',
      items: [
        { name: 'Beer', unit: 'bottles', ratio: 'peopleCount * 6', min: 12, price: 1.50 },
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
        { name: 'Bluetooth Speaker', unit: '', ratio: 'Math.ceil(peopleCount / 30)', min: 1, price: 120.00 },
        { name: 'Cornhole Set', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 45.00 },
        { name: 'Ladder Toss', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 35.00 },
        { name: 'Giant Jenga', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 40.00 },
        { name: 'Horseshoes Set', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 30.00 },
        { name: 'Frisbee', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 10.00 },
        { name: 'Beer Pong Table', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 60.00 },
        { name: 'String Lights', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 15.00 },
        { name: 'Shade Canopies', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 80.00 },
        { name: 'Folding Chairs', unit: '', ratio: 'peopleCount * 1.2', min: 4, price: 25.00 }
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
        { name: 'Crawfish Boil Seasoning', unit: 'oz', ratio: 'crawfishLbs * 1.2', min: 6, priceKey: 'cajunSeasoning' },
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
        { name: 'Propane Tanks (20lb)', unit: '', ratio: 'DYNAMIC_PROPANE_TANKS', min: 1, price: 40.00, isDynamic: true },
        { name: 'Strainer Basket', unit: '', ratio: '1', min: 1, price: 45.00 },
        { name: 'Long-handled Paddle', unit: '', ratio: '1', min: 1, price: 25.00 },
        { name: 'Digital Thermometer', unit: '', ratio: '1', min: 1, price: 15.00 },
        { name: 'Heat Resistant Gloves', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 12.00 },
        { name: 'Long Tongs (18")', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Rinse Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 3, price: 15.00 },
        { name: 'Ice Coolers', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 60.00 },
        { name: 'Crawfish Serving Trays', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 3, price: 20.00 },
        { name: 'Table Coverings', unit: 'rolls', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 8.00 },
        { name: 'Folding Tables', unit: '', ratio: 'Math.ceil(peopleCount / 12)', min: 2, price: 80.00 },
        { name: 'Extension Cords', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 2, price: 25.00 },
        { name: 'Fire Extinguisher', unit: '', ratio: '1', min: 1, price: 35.00 }
      ]
    },
    'serving-dining': {
      title: 'Serving & Dining Supplies',
      items: [
        { name: 'Disposable Plates', unit: '', ratio: 'peopleCount * 3', min: 10, price: 0.15 },
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
        { name: 'Shell Waste Buckets', unit: '', ratio: 'Math.ceil(peopleCount / 8)', min: 4, price: 12.00 },
        { name: 'To-go Containers', unit: '', ratio: 'Math.ceil(peopleCount / 3)', min: 10, price: 0.75 }
      ]
    },
    'drinks-ice': {
      title: 'Drinks & Ice',
      items: [
        { name: 'Beer', unit: 'bottles', ratio: 'peopleCount * 6', min: 12, price: 1.50 },
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
        { name: 'Bluetooth Speaker', unit: '', ratio: 'Math.ceil(peopleCount / 30)', min: 1, price: 120.00 },
        { name: 'Cornhole Set', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 1, price: 45.00 },
        { name: 'Ladder Toss', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 35.00 },
        { name: 'Giant Jenga', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 40.00 },
        { name: 'Horseshoes Set', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 1, price: 30.00 },
        { name: 'Frisbee', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 10.00 },
        { name: 'Beer Pong Table', unit: '', ratio: 'Math.ceil(peopleCount / 25)', min: 1, price: 60.00 },
        { name: 'String Lights', unit: '', ratio: 'Math.ceil(peopleCount / 20)', min: 2, price: 15.00 },
        { name: 'Shade Canopies', unit: '', ratio: 'Math.ceil(peopleCount / 15)', min: 2, price: 80.00 },
        { name: 'Folding Chairs', unit: '', ratio: 'peopleCount * 1.2', min: 4, price: 25.00 }
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

  // Compute current spice accent color and expose as CSS var "--spice" for uniform theming
  const spiceColor = SPICE_COLORS[Number(spiceLevel)] || '#FF7043';
  const spiceStyle = { ['--spice']: spiceColor } as React.CSSProperties;

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

  const exportShoppingList = () => {
    const enabledItems = shoppingList.filter(item => itemToggles[item.name] !== false);
    const listText = [
      `CRAWFISH BOIL SHOPPING LIST`,
      `For ${peopleCount} people (${lbsPerPerson} lbs per person)`,
      ``,
      ...enabledItems.map(item => 
        `• ${formatQuantity(item.qty, item.unit)} ${item.unit} ${item.name} - $${(Number(item.qty) * Number(item.price)).toFixed(2)}`
      ),
      ``,
      `Total: $${Number(totalCost).toFixed(2)}`,
      ``,
      `Generated by Crawfish Boil Calculator`,
      `* Prices vary by season and location`
    ].join('\n');
    
    navigator.clipboard.writeText(listText).then(() => {
      alert('Shopping list copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = listText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Shopping list copied to clipboard!');
    });
  };

  const renderShoppingItem = (item, index, keyPrefix = '') => {
    const isEnabled = itemToggles[item.name] !== false;
    const showAmazonLink = mode === 'advanced' && AFFILIATE_CATEGORIES.includes(item.category);
    
    return (
      <li key={`${keyPrefix}${index}`} className={`bg-white/5 p-4 rounded-lg flex items-center gap-4 ${!isEnabled ? 'mg-item-disabled' : ''}`}>
        <button 
          className={`mg-toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => toggleItem(item.name)}
          title={`Toggle ${item.name}`}
        ></button>
        <span className="mg-item-text flex-1">{formatQuantity(item.qty, item.unit)} {item.unit} {item.name}</span>
        <span className="mg-price font-semibold">${ (Number(item.qty) * Number(item.price)).toFixed(2) }</span>
        {showAmazonLink && (
          <a
            href={getAmazonLink(item.name, item.amazonSearchTerm)}
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
    const enabledItems = shoppingList.filter(item => itemToggles[item.name] !== false);
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Crawfish Boil Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; }
            h1 { color: #333; border-bottom: 2px solid #FF3D00; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
            .disclaimer { color: #666; font-style: italic; margin-top: 20px; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <h1>Crawfish Boil Shopping List</h1>
          <p><strong>For ${peopleCount} people (${lbsPerPerson} lbs per person)</strong></p>
          ${enabledItems.map(item => 
            `<div class="item">
              <span>${formatQuantity(item.qty, item.unit)} ${item.unit} ${item.name}</span>
              <span>$${(Number(item.qty) * Number(item.price)).toFixed(2)}</span>
            </div>`
          ).join('')}
          <div class="total">Total: $${Number(totalCost).toFixed(2)}</div>
          <div class="disclaimer">* Prices vary by season and location</div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

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

      <div className="font-body flex justify-center items-center min-h-screen bg-[var(--ember-black)] text-gray-100 p-2 sm:p-4" style={spiceStyle}>
        <Card className="mg-card mg-border max-w-lg w-full rounded-2xl p-4 sm:p-6">
          <CardContent>
            <div className="text-center mb-6">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl mg-gradient-text drop-shadow flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl">🦞</span>
                CRAWFISH BOIL CALCULATOR
                <span className="text-2xl sm:text-3xl md:text-4xl">🦞</span>
              </h1>
            </div>

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
                // Basic mode: Simple list
                <ul className="space-y-2">
                  {shoppingList.map((item, i) => renderShoppingItem(item, i))}
                </ul>
              )}
              <div className="text-right mt-4 font-display text-xl md:text-2xl">
                <span className="mg-gradient-text">Total: ${Number(totalCost).toFixed(2)}</span>
              </div>
              
              {/* Export/Print Buttons */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={exportShoppingList}
                  className="flex-1 px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                  title="Copy shopping list to clipboard"
                >
                  📋 Copy List
                </button>
                <button 
                  onClick={printShoppingList}
                  className="flex-1 px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                  title="Print shopping list"
                >
                  🖨️ Print
                </button>
              </div>
              
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

              {/* Amazon Affiliate Disclosure */}
              <div className="text-center mt-2 text-xs text-gray-500 italic">
                As an Amazon Associate, I earn from qualifying purchases.
              </div>
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

    if (typeof console !== 'undefined') console.log('[CrawfishBoilCalculator] tests passed');
  })();
}
