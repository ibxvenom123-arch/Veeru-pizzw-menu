import {
  Restaurant,
  Category,
  MenuItem,
  RestaurantTable,
  Order,
  User,
  TableCallRequest,
  OrderStatus,
  PaymentStatus,
} from '../types';
import {
  DEMO_USER,
  DEMO_RESTAURANTS,
  DEMO_CATEGORIES,
  DEMO_MENU_ITEMS,
  DEMO_TABLES,
  DEMO_ORDERS,
  DEMO_CALL_REQUESTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USER: 'menucraft_user',
  RESTAURANTS: 'menucraft_restaurants',
  CATEGORIES: 'menucraft_categories',
  ITEMS: 'menucraft_items',
  TABLES: 'menucraft_tables',
  ORDERS: 'menucraft_orders',
  CALL_REQUESTS: 'menucraft_calls',
  INITIALIZED: 'menucraft_init_v1',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading key ${key} from localStorage`, error);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing key ${key} to localStorage`, error);
  }
}

export class StorageService {
  static initialize() {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      this.resetToDefaults();
    }
  }

  static resetToDefaults() {
    setToStorage(STORAGE_KEYS.USER, DEMO_USER);
    setToStorage(STORAGE_KEYS.RESTAURANTS, DEMO_RESTAURANTS);
    setToStorage(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);
    setToStorage(STORAGE_KEYS.ITEMS, DEMO_MENU_ITEMS);
    setToStorage(STORAGE_KEYS.TABLES, DEMO_TABLES);
    setToStorage(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    setToStorage(STORAGE_KEYS.CALL_REQUESTS, DEMO_CALL_REQUESTS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // USER & AUTH
  static getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.USER, DEMO_USER);
  }

  static setCurrentUser(user: User | null) {
    setToStorage(STORAGE_KEYS.USER, user);
  }

  // RESTAURANTS
  static getRestaurants(): Restaurant[] {
    return getFromStorage<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, DEMO_RESTAURANTS);
  }

  static getRestaurantById(id: string): Restaurant | undefined {
    const list = this.getRestaurants();
    return list.find((r) => r.id === id);
  }

  static getRestaurantBySlug(slug: string): Restaurant | undefined {
    const list = this.getRestaurants();
    return list.find((r) => r.slug.toLowerCase() === slug.toLowerCase());
  }

  static updateRestaurant(updated: Restaurant): Restaurant {
    const list = this.getRestaurants();
    const index = list.findIndex((r) => r.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    setToStorage(STORAGE_KEYS.RESTAURANTS, list);
    return updated;
  }

  // CATEGORIES
  static getCategories(restaurantId: string): Category[] {
    const all = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);
    return all
      .filter((c) => c.restaurantId === restaurantId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static saveCategory(category: Category): Category {
    const all = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);
    const index = all.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      all[index] = category;
    } else {
      all.push(category);
    }
    setToStorage(STORAGE_KEYS.CATEGORIES, all);
    return category;
  }

  static deleteCategory(categoryId: string): void {
    const all = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);
    setToStorage(STORAGE_KEYS.CATEGORIES, all.filter((c) => c.id !== categoryId));
  }

  // MENU ITEMS
  static getMenuItems(restaurantId: string): MenuItem[] {
    const all = getFromStorage<MenuItem[]>(STORAGE_KEYS.ITEMS, DEMO_MENU_ITEMS);
    return all
      .filter((item) => item.restaurantId === restaurantId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static saveMenuItem(item: MenuItem): MenuItem {
    const all = getFromStorage<MenuItem[]>(STORAGE_KEYS.ITEMS, DEMO_MENU_ITEMS);
    const index = all.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    setToStorage(STORAGE_KEYS.ITEMS, all);
    return item;
  }

  static deleteMenuItem(itemId: string): void {
    const all = getFromStorage<MenuItem[]>(STORAGE_KEYS.ITEMS, DEMO_MENU_ITEMS);
    setToStorage(STORAGE_KEYS.ITEMS, all.filter((i) => i.id !== itemId));
  }

  static toggleItemAvailability(itemId: string): MenuItem | undefined {
    const all = getFromStorage<MenuItem[]>(STORAGE_KEYS.ITEMS, DEMO_MENU_ITEMS);
    const item = all.find((i) => i.id === itemId);
    if (item) {
      item.isAvailable = !item.isAvailable;
      setToStorage(STORAGE_KEYS.ITEMS, all);
      return item;
    }
    return undefined;
  }

  // TABLES
  static getTables(restaurantId: string): RestaurantTable[] {
    const all = getFromStorage<RestaurantTable[]>(STORAGE_KEYS.TABLES, DEMO_TABLES);
    return all.filter((t) => t.restaurantId === restaurantId);
  }

  static saveTable(table: RestaurantTable): RestaurantTable {
    const all = getFromStorage<RestaurantTable[]>(STORAGE_KEYS.TABLES, DEMO_TABLES);
    const index = all.findIndex((t) => t.id === table.id);
    if (index >= 0) {
      all[index] = table;
    } else {
      all.push(table);
    }
    setToStorage(STORAGE_KEYS.TABLES, all);
    return table;
  }

  static deleteTable(tableId: string): void {
    const all = getFromStorage<RestaurantTable[]>(STORAGE_KEYS.TABLES, DEMO_TABLES);
    setToStorage(STORAGE_KEYS.TABLES, all.filter((t) => t.id !== tableId));
  }

  // ORDERS
  static getOrders(restaurantId: string): Order[] {
    const all = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    return all
      .filter((o) => o.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static createOrder(order: Order): Order {
    const all = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    all.unshift(order);
    setToStorage(STORAGE_KEYS.ORDERS, all);
    return order;
  }

  static updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const all = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const order = all.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.ORDERS, all);
      return order;
    }
    return undefined;
  }

  static updateOrderPayment(orderId: string, paymentStatus: PaymentStatus): Order | undefined {
    const all = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const order = all.find((o) => o.id === orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      order.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.ORDERS, all);
      return order;
    }
    return undefined;
  }

  // TABLE CALL REQUESTS
  static getTableCalls(restaurantId: string): TableCallRequest[] {
    const all = getFromStorage<TableCallRequest[]>(STORAGE_KEYS.CALL_REQUESTS, DEMO_CALL_REQUESTS);
    return all.filter((c) => c.restaurantId === restaurantId && c.status === 'active');
  }

  static createTableCall(call: TableCallRequest): TableCallRequest {
    const all = getFromStorage<TableCallRequest[]>(STORAGE_KEYS.CALL_REQUESTS, DEMO_CALL_REQUESTS);
    all.unshift(call);
    setToStorage(STORAGE_KEYS.CALL_REQUESTS, all);
    return call;
  }

  static resolveTableCall(callId: string): void {
    const all = getFromStorage<TableCallRequest[]>(STORAGE_KEYS.CALL_REQUESTS, DEMO_CALL_REQUESTS);
    const target = all.find((c) => c.id === callId);
    if (target) {
      target.status = 'resolved';
      setToStorage(STORAGE_KEYS.CALL_REQUESTS, all);
    }
  }
}
