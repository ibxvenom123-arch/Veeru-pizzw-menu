export interface Variation {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isChefSpecial: boolean;
  calories?: number;
  prepTimeMinutes?: number;
  allergens: string[];
  tags: string[];
  variations?: Variation[];
  addons?: Addon[];
  displayOrder: number;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  iconName: string; // lucide icon identifier
  displayOrder: number;
  isActive: boolean;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: string;
  section?: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariation?: Variation;
  selectedAddons?: Addon[];
  itemNotes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';
export type PaymentMethod = 'counter_cash' | 'counter_card' | 'whatsapp' | 'online_simulated';

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  serviceAmount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  cuisineType: string;
  currency: string;
  currencySymbol: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  wifiName?: string;
  wifiPassword?: string;
  taxRate: number; // e.g. 0.08 for 8%
  serviceChargeRate: number; // e.g. 0.05 for 5%
  primaryColor: string;
  accentColor: string;
  enableOrdering: boolean;
  enableCallWaiter: boolean;
  enableRequestBill: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'owner' | 'manager' | 'staff';
  restaurantId: string;
  plan: 'free_trial' | 'starter' | 'pro';
}

export interface TableCallRequest {
  id: string;
  restaurantId: string;
  tableNumber: string;
  type: 'call_waiter' | 'request_bill' | 'water_refill';
  status: 'active' | 'resolved';
  createdAt: string;
}

export type AppView = 
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'menu-manager'
  | 'restaurant-settings'
  | 'qr-codes'
  | 'customer-menu'
  | 'customer-order-status';
