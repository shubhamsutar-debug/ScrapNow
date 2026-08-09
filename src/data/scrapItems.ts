import newspaperImg from '../assets/images/scrap-newspaper.jpg';
import cardboardImg from '../assets/images/scrap-cardboard.jpg';
import plasticBottlesImg from '../assets/images/scrap-plastic-bottles.jpg';
import ironImg from '../assets/images/scrap-iron.jpg';
import aluminiumImg from '../assets/images/scrap-aluminium.jpg';
import copperImg from '../assets/images/scrap-copper.jpg';

export type ScrapCategory = 'Paper' | 'Plastic' | 'Metal' | 'E-waste' | 'Rubber' | 'Other';

export interface ScrapItem {
  id: string;
  name: string;
  category: ScrapCategory;
  price: number;
  unit: string;
  image: string;
  updatedAt: string;
}

export const scrapItems: ScrapItem[] = [
  // ─── Paper (8 items) ───
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'Paper',
    price: 11,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'carton',
    name: 'Carton',
    category: 'Paper',
    price: 4,
    unit: 'kg',
    image: cardboardImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'books',
    name: 'Books',
    category: 'Paper',
    price: 10,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'grey-board',
    name: 'Grey Board',
    category: 'Paper',
    price: 3,
    unit: 'kg',
    image: cardboardImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'office-paper',
    name: 'Office White Paper',
    category: 'Paper',
    price: 14,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'magazines',
    name: 'Magazines & Catalogues',
    category: 'Paper',
    price: 8,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'shredded-paper',
    name: 'Shredded Paper',
    category: 'Paper',
    price: 6,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'kraft-boxes',
    name: 'Kraft Box Packaging',
    category: 'Paper',
    price: 5,
    unit: 'kg',
    image: cardboardImg,
    updatedAt: 'Updated today',
  },

  // ─── Plastic (9 items) ───
  {
    id: 'mix-plastic',
    name: 'Mix Plastic',
    category: 'Plastic',
    price: 10,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'soft-plastic',
    name: 'Soft Plastic',
    category: 'Plastic',
    price: 10,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'hard-plastic',
    name: 'Hard Plastic',
    category: 'Plastic',
    price: 2,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'plastic-jar',
    name: 'Plastic Jar (15 Litre)',
    category: 'Plastic',
    price: 10,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'pet-bottles',
    name: 'PET Water Bottles',
    category: 'Plastic',
    price: 26,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'hdpe-containers',
    name: 'HDPE Oil Containers',
    category: 'Plastic',
    price: 18,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'pvc-pipes',
    name: 'PVC Pipes & Fittings',
    category: 'Plastic',
    price: 15,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'bubble-wrap',
    name: 'Bubble Wrap & Foam',
    category: 'Plastic',
    price: 8,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'plastic-drums',
    name: 'Large Plastic Drums',
    category: 'Plastic',
    price: 40,
    unit: 'pcs',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },

  // ─── Metal (8 items) ───
  {
    id: 'iron',
    name: 'Iron',
    category: 'Metal',
    price: 23,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'tin',
    name: 'Tin',
    category: 'Metal',
    price: 12,
    unit: 'pcs',
    image: aluminiumImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'aluminium',
    name: 'Aluminium',
    category: 'Metal',
    price: 150,
    unit: 'kg',
    image: aluminiumImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'copper',
    name: 'Copper Wire & Cable',
    category: 'Metal',
    price: 620,
    unit: 'kg',
    image: copperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'brass',
    name: 'Brass Utensils & Valves',
    category: 'Metal',
    price: 380,
    unit: 'kg',
    image: aluminiumImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'stainless-steel',
    name: 'Stainless Steel (SS)',
    category: 'Metal',
    price: 90,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'lead',
    name: 'Lead Metal',
    category: 'Metal',
    price: 110,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'battery-scrap',
    name: 'Car / Inverter Battery',
    category: 'Metal',
    price: 85,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },

  // ─── E-waste (7 items) ───
  {
    id: 'e-waste',
    name: 'E-waste',
    category: 'E-waste',
    price: 10,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'laptops',
    name: 'Old Laptops & PCs',
    category: 'E-waste',
    price: 350,
    unit: 'pcs',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'mobiles',
    name: 'Smartphones & Mobiles',
    category: 'E-waste',
    price: 80,
    unit: 'pcs',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'motherboards',
    name: 'Computer Motherboards',
    category: 'E-waste',
    price: 180,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'printers',
    name: 'Printers & Scanners',
    category: 'E-waste',
    price: 120,
    unit: 'pcs',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'monitors',
    name: 'CRT & LED TV Monitors',
    category: 'E-waste',
    price: 150,
    unit: 'pcs',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'appliances',
    name: 'Washing Machine / Fridge',
    category: 'E-waste',
    price: 650,
    unit: 'pcs',
    image: ironImg,
    updatedAt: 'Updated today',
  },

  // ─── Rubber (5 items) ───
  {
    id: 'scooter-tyres',
    name: 'Bicycle & Scooter Tyres',
    category: 'Rubber',
    price: 15,
    unit: 'pcs',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'car-tyres',
    name: 'Car Tyres',
    category: 'Rubber',
    price: 45,
    unit: 'pcs',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'truck-tyres',
    name: 'Heavy Truck Tyres',
    category: 'Rubber',
    price: 120,
    unit: 'pcs',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'rubber-hoses',
    name: 'Rubber Hoses & Belts',
    category: 'Rubber',
    price: 8,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'rubber-matting',
    name: 'Commercial Rubber Matting',
    category: 'Rubber',
    price: 12,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },

  // ─── Other (4 items) ───
  {
    id: 'clear-glass',
    name: 'Clear Glass Bottles',
    category: 'Other',
    price: 2.5,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'beer-bottles',
    name: 'Beer & Soda Bottles',
    category: 'Other',
    price: 1.5,
    unit: 'pcs',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'wooden-pallets',
    name: 'Wooden Cargo Pallets',
    category: 'Other',
    price: 60,
    unit: 'pcs',
    image: cardboardImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'fabric-waste',
    name: 'Fabric & Clothes Waste',
    category: 'Other',
    price: 6,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
];

export const categories: Array<ScrapCategory | 'All'> = [
  'All',
  'Paper',
  'Plastic',
  'Metal',
  'E-waste',
  'Rubber',
  'Other',
];

// City-specific price overrides for MVP demo
const cityPriceOverrides: Record<string, Record<string, number>> = {
  Mumbai: {
    newspaper: 13,
    carton: 5,
    'mix-plastic': 12,
    books: 12,
    iron: 26,
    tin: 14,
    'grey-board': 4,
    'soft-plastic': 12,
    'hard-plastic': 3,
    'e-waste': 14,
    'plastic-jar': 12,
    aluminium: 165,
    copper: 645,
    laptops: 380,
    'car-tyres': 50,
  },
  Pune: {
    newspaper: 11,
    carton: 4,
    'mix-plastic': 10,
    books: 10,
    iron: 23,
    tin: 12,
    'grey-board': 3,
    'soft-plastic': 10,
    'hard-plastic': 2,
    'e-waste': 10,
    'plastic-jar': 10,
    aluminium: 150,
    copper: 620,
    laptops: 350,
    'car-tyres': 45,
  },
  Delhi: {
    newspaper: 12,
    carton: 4.5,
    'mix-plastic': 11,
    books: 11,
    iron: 25,
    tin: 13,
    'grey-board': 3.5,
    'soft-plastic': 11,
    'hard-plastic': 2.5,
    'e-waste': 12,
    'plastic-jar': 11,
    aluminium: 155,
    copper: 635,
    laptops: 360,
    'car-tyres': 48,
  },
  Bangalore: {
    newspaper: 11.5,
    carton: 4.5,
    'mix-plastic': 11,
    books: 10.5,
    iron: 24,
    tin: 13,
    'grey-board': 3.5,
    'soft-plastic': 10.5,
    'hard-plastic': 2.5,
    'e-waste': 11,
    'plastic-jar': 11,
    aluminium: 152,
    copper: 630,
    laptops: 370,
    'car-tyres': 47,
  },
};

export function getScrapItemsForCity(city: string): ScrapItem[] {
  const overrides = cityPriceOverrides[city];
  if (overrides) {
    return scrapItems.map((item) => ({
      ...item,
      price: overrides[item.id] ?? item.price,
    }));
  }

  // Generate deterministic realistic variation for other cities based on city string hash
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }

  const factor = 1 + ((Math.abs(hash) % 15) - 7) / 100; // -7% to +7% variation

  return scrapItems.map((item) => ({
    ...item,
    price: Math.round(item.price * factor * 10) / 10,
  }));
}
