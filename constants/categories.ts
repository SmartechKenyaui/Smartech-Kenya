export interface SubCategory {
  name: string
  slug: string
  emoji: string
  description: string
}

export interface CategoryDef {
  name: string
  slug: string
  enum: 'TECH' | 'KITCHEN'
  description: string
  subcategories: SubCategory[]
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: 'Technology',
    slug: 'tech',
    enum: 'TECH',
    description: 'Latest gadgets, electronics & accessories',
    subcategories: [
      { name: 'Smart TVs', slug: 'smart-tvs', emoji: '', description: '4K, OLED & Android displays' },
      { name: 'Laptops', slug: 'laptops', emoji: '', description: 'Business, gaming & everyday computing' },
      { name: 'Phones & Tablets', slug: 'phones', emoji: '', description: 'Smartphones & tablets' },
      { name: 'Audio', slug: 'audio', emoji: '', description: 'Speakers, headphones & sound systems' },
      { name: 'Cameras & CCTV', slug: 'cameras', emoji: '', description: 'DSLR, mirrorless & surveillance' },
      { name: 'Gaming', slug: 'gaming', emoji: '', description: 'Consoles, games & accessories' },
      { name: 'Networking', slug: 'networking', emoji: '', description: 'Routers, modems & accessories' },
      { name: 'Accessories', slug: 'accessories', emoji: '', description: 'Cables, chargers & more' },
    ],
  },
  {
    name: 'Kitchen & Home',
    slug: 'kitchen',
    enum: 'KITCHEN',
    description: 'Premium appliances for the modern Kenyan home',
    subcategories: [
      { name: 'Fridges & Freezers', slug: 'fridges', emoji: '', description: 'Single door, double door & chest freezers' },
      { name: 'Cookers & Ovens', slug: 'cookers', emoji: '', description: 'Gas, electric & hybrid cookers' },
      { name: 'Built-in Appliances', slug: 'built-in', emoji: '', description: 'Integrated hobs, ovens & extractors' },
      { name: 'Washing Machines', slug: 'washing-machines', emoji: '', description: 'Top load, front load & dryers' },
      { name: 'Microwaves', slug: 'microwaves', emoji: '', description: 'Solo, grill & convection microwaves' },
      { name: 'Air Conditioners', slug: 'air-conditioners', emoji: '', description: 'Split, portable & inverter ACs' },
      { name: 'Small Appliances', slug: 'small-appliances', emoji: '', description: 'Blenders, kettles, toasters & more' },
      { name: 'Water Dispensers', slug: 'water-dispensers', emoji: '', description: 'Hot & cold water dispensers' },
    ],
  },
]

export const POPULAR_BRANDS = [
  'Samsung', 'LG', 'Hisense', 'Ramtons', 'Von Hotpoint',
  'Mika', 'Beko', 'Haier', 'TCL', 'Skyworth',
]
