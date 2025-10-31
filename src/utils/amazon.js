import { AMAZON_STORE_ID } from '../config/constants';

const OPTIMIZED_SEARCH_TERMS = {
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
  'Drink Coolers': 'beverage cooler dispenser party outdoor portable',
  'Bottle Openers': 'bottle opener corkscrew party bar tools',
  'Trash Cans': 'large trash can outdoor party waste container',
  'Heavy-duty Trash Bags': 'heavy duty trash bags outdoor party cleanup',
  'Recycling Bins': 'recycling bin outdoor party sorting waste',
  'Shell Waste Buckets': 'large bucket container outdoor party cleanup',
  'Cleaning Rags': 'cleaning rags shop towels disposable party',
  'Table Scrub Brush': 'scrub brush cleaning party table outdoor',
  'Hose': 'garden hose outdoor cleaning spray nozzle',
  'Bug Spray': 'insect repellent bug spray outdoor party camping',
  'Citronella Candles': 'citronella candles torches outdoor party mosquito',
  'Sunscreen': 'sunscreen SPF outdoor party protection lotion',
  'Hand Sanitizer': 'hand sanitizer pump bottle party outdoor',
  'First Aid Kit': 'first aid kit outdoor party camping safety',
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

export function getOptimizedSearchTerm(itemName) {
  return OPTIMIZED_SEARCH_TERMS[itemName];
}

export function getAmazonLink(searchTerm, customSearchTerm = null) {
  const term = customSearchTerm || getOptimizedSearchTerm(searchTerm) || searchTerm;
  const encodedTerm = encodeURIComponent(term);
  return `https://www.amazon.com/s?k=${encodedTerm}&tag=${AMAZON_STORE_ID}`;
}

export function getAmazonProductLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_STORE_ID}`;
}
