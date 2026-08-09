import newspaperImg from '../assets/images/scrap-newspaper.jpg';
import cardboardImg from '../assets/images/scrap-cardboard.jpg';
import plasticBottlesImg from '../assets/images/scrap-plastic-bottles.jpg';
import ironImg from '../assets/images/scrap-iron.jpg';
import aluminiumImg from '../assets/images/scrap-aluminium.jpg';
import copperImg from '../assets/images/scrap-copper.jpg';

export type ScrapCategory = 'Paper' | 'Plastic' | 'Metal' | 'E-Waste' | 'Others';

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
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'Paper',
    price: 25,
    unit: 'kg',
    image: newspaperImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'cardboard',
    name: 'Cardboard',
    category: 'Paper',
    price: 10,
    unit: 'kg',
    image: cardboardImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'plastic-bottles',
    name: 'Plastic Bottles',
    category: 'Plastic',
    price: 26,
    unit: 'kg',
    image: plasticBottlesImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'Metal',
    price: 30,
    unit: 'kg',
    image: ironImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'aluminium',
    name: 'Aluminium',
    category: 'Metal',
    price: 120,
    unit: 'kg',
    image: aluminiumImg,
    updatedAt: 'Updated today',
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'Metal',
    price: 620,
    unit: 'kg',
    image: copperImg,
    updatedAt: 'Updated today',
  },
];

export const categories: Array<ScrapCategory | 'All'> = [
  'All',
  'Paper',
  'Plastic',
  'Metal',
  'E-Waste',
  'Others',
];
