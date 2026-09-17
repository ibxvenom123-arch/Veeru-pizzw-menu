import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppView,
  Restaurant,
  Category,
  MenuItem,
  RestaurantTable,
  Order,
  User,
  TableCallRequest,
  OrderItem,
  PaymentMethod,
  OrderStatus,
  PaymentStatus,
} from '../types';
import { StorageService } from '../services/storageService';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeRestaurant: Restaurant;
  setActiveRestaurant: (restaurant: Restaurant) => void;
  allRestaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
  tables: RestaurantTable[];
  orders: Order[];
  tableCalls: TableCallRequest[];
  
  // Customer menu states
  customerTableNumber: string;
  setCustomerTableNumber: (tbl: string) => void;
  cart: OrderItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddons?: any[], notes?: string) => void;
  removeFromCart: (index: number) => void;
  updateCartItemQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartService: number;
  cartTotal: number;
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;
  submitOrder: (customerName: string, phone: string, paymentMethod: PaymentMethod, notes?: string) => Order;
  requestTableAssistance: (type: 'call_waiter' | 'request_bill' | 'water_refill') => void;

  // Management actions
  updateRestaurantProfile: (updated: Restaurant) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  saveMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  saveTable: (table: RestaurantTable) => void;
  deleteTable: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPayment: (orderId: string, status: PaymentStatus) => void;
  resolveTableCall: (callId: string) => void;
  resetAllData: () => void;

  // UI state
  devicePreviewMode: 'responsive' | 'mobile_frame';
  setDevicePreviewMode: (mode: 'responsive' | 'mobile_frame') => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  
  // Navigation helper
  openCustomerMenuForTable: (restaurantId: string, tableNumber: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize storage once
  useEffect(() => {
    StorageService.initialize();
  }, []);

  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(() => StorageService.getRestaurants());
  
  const [activeRestaurant, setActiveRestaurantState] = useState<Restaurant>(() => {
    const list = StorageService.getRestaurants();
    const user = StorageService.getCurrentUser();
    if (user && user.restaurantId) {
      const found = list.find(r => r.id === user.restaurantId);
      if (found) return found;
    }
    return list[0] || ({} as Restaurant);
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableCalls, setTableCalls] = useState<TableCallRequest[]>([]);

  // Customer experience state
  const [customerTableNumber, setCustomerTableNumber] = useState<string>('3');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Viewport simulator toggle
  const [devicePreviewMode, setDevicePreviewMode] = useState<'responsive' | 'mobile_frame'>('responsive');

  // Toasts
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const refreshRestaurantData = (restaurantId: string) => {
    if (!restaurantId) return;
    setCategories(StorageService.getCategories(restaurantId));
    setMenuItems(StorageService.getMenuItems(restaurantId));
    setTables(StorageService.getTables(restaurantId));
    setOrders(StorageService.getOrders(restaurantId));
    setTableCalls(StorageService.getTableCalls(restaurantId));
  };

  useEffect(() => {
    if (activeRestaurant?.id) {
      refreshRestaurantData(activeRestaurant.id);
    }
  }, [activeRestaurant?.id]);

  const setActiveRestaurant = (rest: Restaurant) => {
    setActiveRestaurantState(rest);
    refreshRestaurantData(rest.id);
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedVariation?: any,
    selectedAddons: any[] = [],
    notes = ''
  ) => {
    let unitPrice = item.price;
    if (selectedVariation?.priceDelta) {
      unitPrice += selectedVariation.priceDelta;
    }
    if (selectedAddons?.length) {
      selectedAddons.forEach(a => {
        unitPrice += a.price;
      });
    }

    setCart(prev => {
      // Check if identical item (same id, variation, addons)
      const existingIndex = prev.findIndex(
        i =>
          i.menuItemId === item.id &&
          i.selectedVariation?.id === selectedVariation?.id &&
          JSON.stringify(i.selectedAddons?.map(a => a.id).sort()) ===
            JSON.stringify(selectedAddons.map(a => a.id).sort())
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            menuItemId: item.id,
            name: item.name,
            price: unitPrice,
            quantity,
            selectedVariation,
            selectedAddons,
            itemNotes: notes,
          },
        ];
      }
    });

    showToast(`Added "${item.name}" to order`, 'success');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], quantity };
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * (activeRestaurant?.taxRate || 0.08);
  const cartService = cartSubtotal * (activeRestaurant?.serviceChargeRate || 0);
  const cartTotal = cartSubtotal + cartTax + cartService;

  // Order submission
  const submitOrder = (
    customerName: string,
    phone: string,
    paymentMethod: PaymentMethod,
    notes?: string
  ): Order => {
    const orderNum = `#${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      restaurantId: activeRestaurant.id,
      tableNumber: customerTableNumber || '1',
      customerName: customerName || 'Guest Customer',
      customerPhone: phone || undefined,
      items: [...cart],
      subtotal: Number(cartSubtotal.toFixed(2)),
      taxAmount: Number(cartTax.toFixed(2)),
      serviceAmount: Number(cartService.toFixed(2)),
      total: Number(cartTotal.toFixed(2)),
      status: 'pending',
      paymentStatus: paymentMethod === 'online_simulated' ? 'paid' : 'unpaid',
      paymentMethod,
      notes: notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.createOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    setPlacedOrder(newOrder);
    clearCart();
    setCurrentView('customer-order-status');
    showToast(`Order ${orderNum} received by kitchen!`, 'success');
    return newOrder;
  };

  const requestTableAssistance = (type: 'call_waiter' | 'request_bill' | 'water_refill') => {
    const call: TableCallRequest = {
      id: `call_${Date.now()}`,
      restaurantId: activeRestaurant.id,
      tableNumber: customerTableNumber || '1',
      type,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    StorageService.createTableCall(call);
    setTableCalls(prev => [call, ...prev]);

    const title =
      type === 'call_waiter'
        ? 'Waiter notified for Table ' + customerTableNumber
        : type === 'request_bill'
        ? 'Bill request sent to service staff for Table ' + customerTableNumber
        : 'Water refill requested for Table ' + customerTableNumber;
    showToast(title, 'success');
  };

  // Management CRUD
  const updateRestaurantProfile = (updated: Restaurant) => {
    const saved = StorageService.updateRestaurant(updated);
    setActiveRestaurantState(saved);
    setAllRestaurants(StorageService.getRestaurants());
    showToast('Restaurant settings updated successfully', 'success');
  };

  const saveCategory = (cat: Category) => {
    const saved = StorageService.saveCategory(cat);
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, saved].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    showToast(`Category "${cat.name}" saved`, 'success');
  };

  const deleteCategory = (id: string) => {
    StorageService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category removed', 'info');
  };

  const saveMenuItem = (item: MenuItem) => {
    const saved = StorageService.saveMenuItem(item);
    setMenuItems(prev => {
      const idx = prev.findIndex(i => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, saved].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    showToast(`Menu item "${item.name}" updated`, 'success');
  };

  const deleteMenuItem = (id: string) => {
    StorageService.deleteMenuItem(id);
    setMenuItems(prev => prev.filter(i => i.id !== id));
    showToast('Item deleted from menu', 'info');
  };

  const toggleItemAvailability = (id: string) => {
    const updated = StorageService.toggleItemAvailability(id);
    if (updated) {
      setMenuItems(prev => prev.map(i => (i.id === id ? updated : i)));
      showToast(
        `"${updated.name}" is now ${updated.isAvailable ? 'Available' : 'Sold Out'}`,
        updated.isAvailable ? 'success' : 'warning'
      );
    }
  };

  const saveTable = (tbl: RestaurantTable) => {
    const saved = StorageService.saveTable(tbl);
    setTables(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    showToast(`Table ${tbl.tableNumber} saved`, 'success');
  };

  const deleteTable = (id: string) => {
    StorageService.deleteTable(id);
    setTables(prev => prev.filter(t => t.id !== id));
    showToast('Table deleted', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = StorageService.updateOrderStatus(orderId, status);
    if (updated) {
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (placedOrder && placedOrder.id === orderId) {
        setPlacedOrder(updated);
      }
      showToast(`Order ${updated.orderNumber} status changed to ${status}`, 'info');
    }
  };

  const updateOrderPayment = (orderId: string, status: PaymentStatus) => {
    const updated = StorageService.updateOrderPayment(orderId, status);
    if (updated) {
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (placedOrder && placedOrder.id === orderId) {
        setPlacedOrder(updated);
      }
      showToast(`Order ${updated.orderNumber} payment marked as ${status}`, 'success');
    }
  };

  const resolveTableCall = (callId: string) => {
    StorageService.resolveTableCall(callId);
    setTableCalls(prev => prev.filter(c => c.id !== callId));
    showToast('Call notification resolved', 'info');
  };

  const resetAllData = () => {
    StorageService.resetToDefaults();
    const list = StorageService.getRestaurants();
    setAllRestaurants(list);
    setActiveRestaurantState(list[0]);
    setCurrentUser(StorageService.getCurrentUser());
    refreshRestaurantData(list[0].id);
    setCart([]);
    setPlacedOrder(null);
    showToast('All restaurant demo data restored to initial state', 'success');
  };

  const openCustomerMenuForTable = (restaurantId: string, tableNumber: string) => {
    const target = allRestaurants.find(r => r.id === restaurantId);
    if (target) {
      setActiveRestaurant(target);
    }
    setCustomerTableNumber(tableNumber);
    setCurrentView('customer-menu');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        activeRestaurant,
        setActiveRestaurant,
        allRestaurants,
        categories,
        menuItems,
        tables,
        orders,
        tableCalls,
        customerTableNumber,
        setCustomerTableNumber,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartService,
        cartTotal,
        placedOrder,
        setPlacedOrder,
        submitOrder,
        requestTableAssistance,
        updateRestaurantProfile,
        saveCategory,
        deleteCategory,
        saveMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        saveTable,
        deleteTable,
        updateOrderStatus,
        updateOrderPayment,
        resolveTableCall,
        resetAllData,
        devicePreviewMode,
        setDevicePreviewMode,
        toast,
        showToast,
        openCustomerMenuForTable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
