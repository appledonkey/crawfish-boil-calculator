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
