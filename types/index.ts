export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

// ── Categories ────────────────────────────────────────────────────────────────
export enum Category {
  SMARTPHONES    = 'SMARTPHONES',
  LAPTOPS        = 'LAPTOPS',
  HOME_APPLIANCES= 'HOME_APPLIANCES',
  KITCHEN        = 'KITCHEN',
  BEDROOM        = 'BEDROOM',
  AUDIO_TV       = 'AUDIO_TV',
  ELECTRICAL     = 'ELECTRICAL',
  SMART_HOME     = 'SMART_HOME',
}

// ── Users ─────────────────────────────────────────────────────────────────────
export interface User {
  id:        string;
  email:     string;
  name:      string;
  phone?:    string | null;
  image?:    string | null;
  isSeller:  boolean;
  isAdmin:   boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

// ── Products ──────────────────────────────────────────────────────────────────
export interface Product {
  id:              string;
  name:            string;
  slug:            string;
  description:     string;
  price:           number;
  comparePrice?:   number | null;
  category:        Category;
  subcategory?:    string | null;
  brand:           string;
  stock:           number;
  sku:             string;
  images:          string[];
  features?:       JsonValue;
  specifications?: JsonValue;
  tags:            string[];
  metaTitle?:      string | null;
  metaDescription?:string | null;
  isActive:        boolean;
  isFeatured:      boolean;
  sellerId:        string;
  createdAt:       Date;
  updatedAt:       Date;
}

export interface ProductWithDetails extends Product {
  reviews:     Review[];
  avgRating:   number;
  reviewCount: number;
  seller: { id: string; name: string; email: string };
}

export interface ProductFilters {
  category?:  Category;
  brand?:     string;
  minPrice?:  number;
  maxPrice?:  number;
  search?:    string;
  page?:      number;
  limit?:     number;
  sortBy?:    'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export interface Review {
  id:        string;
  rating:    number;
  comment?:  string | null;
  images:    string[];
  productId: string;
  userId:    string;
  createdAt: Date;
  updatedAt: Date;
  user?: { name: string; image?: string | null };
}

// ── Orders ────────────────────────────────────────────────────────────────────
export type OrderStatus   = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'MPESA' | 'CARD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id:        string;
  productId: string;
  quantity:  number;
  price:     number;
  product:   Product;
}

export interface ShippingAddress {
  fullName:   string;
  phone:      string;
  street:     string;
  city:       string;
  state:      string;
  postalCode: string;
  country:    string;
}

export interface Order {
  id:              string;
  userId:          string;
  items:           OrderItem[];
  subtotal:        number;
  shippingFee:     number;
  total:           number;
  status:          OrderStatus;
  paymentMethod:   PaymentMethod;
  paymentStatus:   PaymentStatus;
  shippingAddress: ShippingAddress;
  notes?:          string | null;
  createdAt:       Date;
  updatedAt:       Date;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  error?:  string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items:      T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}
