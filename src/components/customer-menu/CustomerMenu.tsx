import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingBag,
  Leaf,
  Flame,
  Wheat,
  Sparkles,
  Bell,
  PhoneCall,
  Clock,
  Plus,
  Minus,
  X,
  ChevronDown,
  Wifi,
  MapPin,
  Utensils,
  Share2,
  Check,
} from 'lucide-react';
import { MenuItem, Variation, Addon } from '../../types';
import { CartDrawer } from './CartDrawer';

export const CustomerMenu: React.FC = () => {
  const {
    activeRestaurant,
    categories,
    menuItems,
    customerTableNumber,
    setCustomerTableNumber,
    tables,
    cart,
    cartTotal,
    addToCart,
    requestTableAssistance,
    devicePreviewMode,
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'vegan' | 'gf' | 'spicy' | 'special'>('all');

  // Table switcher modal
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Item customization modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [itemNotes, setItemNotes] = useState('');

  // Cart Drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Assistance modal
  const [isAssistModalOpen, setIsAssistModalOpen] = useState(false);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Dietary filter match
      if (dietaryFilter === 'veg' && !item.isVegetarian) return false;
      if (dietaryFilter === 'vegan' && !item.isVegan) return false;
      if (dietaryFilter === 'gf' && !item.isGlutenFree) return false;
      if (dietaryFilter === 'spicy' && !item.isSpicy) return false;
      if (dietaryFilter === 'special' && !item.isChefSpecial) return false;

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [menuItems, activeCategory, dietaryFilter, searchQuery]);

  // Group items by category if "all" is active
  const groupedCategories = useMemo(() => {
    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.id === activeCategory);
      return cat ? [cat] : [];
    }
    return categories;
  }, [categories, activeCategory]);

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedVariation(item.variations?.[0] || undefined);
    setSelectedAddons([]);
    setItemNotes('');
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, quantity, selectedVariation, selectedAddons, itemNotes);
    setSelectedItem(null);
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateDetailPrice = () => {
    if (!selectedItem) return 0;
    let price = selectedItem.price;
    if (selectedVariation?.priceDelta) {
      price += selectedVariation.priceDelta;
    }
    selectedAddons.forEach((a) => {
      price += a.price;
    });
    return price * quantity;
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Content rendering wrapper (either full screen or within simulated phone container)
  const menuContent = (
    <div className="bg-stone-100 min-h-screen pb-32 text-stone-900 font-sans selection:bg-amber-200">
      {/* Restaurant Header Hero */}
      <div className="relative bg-stone-900 text-white">
        {/* Banner Cover Image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={activeRestaurant.coverUrl}
            alt={activeRestaurant.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />

          {/* Top Quick Bar (Table & Call Waiter) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-stone-700 shadow-md cursor-pointer hover:bg-stone-800"
            >
              <span>Table #{customerTableNumber}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setIsAssistModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600/90 hover:bg-amber-600 backdrop-blur-md text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Bell className="w-3.5 h-3.5 animate-pulse" />
              <span>Staff Assist</span>
            </button>
          </div>

          {/* Bottom Title & Tagline in Cover */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg flex-shrink-0 bg-white">
              <img
                src={activeRestaurant.logoUrl}
                alt={activeRestaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pb-0.5">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {activeRestaurant.cuisineType}
              </div>
              <h1 className="text-xl font-black text-white leading-tight truncate">
                {activeRestaurant.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Restaurant Quick Info Sub-bar */}
        <div className="px-4 py-2.5 bg-stone-950 border-b border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-500" />
              <span className="truncate max-w-[180px]">{activeRestaurant.address}</span>
            </span>
            {activeRestaurant.wifiName && (
              <span className="hidden sm:flex items-center gap-1 text-amber-300">
                <Wifi className="w-3 h-3" />
                <span>WiFi: {activeRestaurant.wifiName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Open for Ordering</span>
          </div>
        </div>
      </div>

      {/* Sticky Search & Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        {/* Instant Search Bar */}
        <div className="p-3 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search pizza, pasta, desserts, wine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-stone-100 border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Horizontal Scroll Strip */}
        <div className="px-3 pb-2.5 max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs scale-102'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Menu
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs scale-102'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dietary Filter Pills */}
        <div className="px-3 pb-2.5 max-w-2xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] border-t border-stone-100 pt-2">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'all' ? 'bg-stone-200 text-stone-900' : 'text-stone-500'
            }`}
          >
            All Diets
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span>Vegetarian</span>
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'vegan' ? 'all' : 'vegan')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'vegan'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <span>🌱 Vegan</span>
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'gf' ? 'all' : 'gf')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'gf'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Wheat className="w-3 h-3 text-amber-700" />
            <span>Gluten-Free</span>
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'spicy' ? 'all' : 'spicy')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'spicy'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Spicy</span>
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'special' ? 'all' : 'special')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              dietaryFilter === 'special'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Chef's Choice</span>
          </button>
        </div>
      </div>

      {/* Menu Categories and Dishes List */}
      <main className="max-w-2xl mx-auto px-3 pt-4 space-y-6">
        {groupedCategories.map((cat) => {
          const catItems = filteredItems.filter((i) => i.categoryId === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-3">
              {/* Category Header */}
              <div className="pt-2">
                <h2 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>{cat.name}</span>
                  <span className="text-xs font-normal text-stone-500">
                    ({catItems.length})
                  </span>
                </h2>
                {cat.description && (
                  <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                )}
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => item.isAvailable && openItemDetail(item)}
                    className={`bg-white rounded-2xl border ${
                      item.isAvailable
                        ? 'border-stone-200/90 shadow-xs hover:shadow-md cursor-pointer'
                        : 'border-stone-200 opacity-60'
                    } p-3 sm:p-4 flex gap-3.5 transition-all`}
                  >
                    {/* Dish Text Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {item.isChefSpecial && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[9px] flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Signature
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                              Veg
                            </span>
                          )}
                          {item.isVegan && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                              Vegan
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold text-[9px]">
                              Spicy
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-sm text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Price & Add Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="text-sm font-black text-amber-700">
                          {activeRestaurant.currencySymbol}
                          {item.price.toFixed(2)}
                        </div>

                        {item.isAvailable ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openItemDetail(item);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-stone-200 text-stone-600">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dish Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center text-white text-[10px] font-bold">
                          Sold Out
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-16 text-center text-stone-500 space-y-2">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">No matching dishes found</h3>
            <p className="text-xs text-stone-400">
              Try changing dietary filters or search for another delicious food item.
            </p>
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-stone-900 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-stone-700 cursor-pointer hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-black text-sm relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              </div>
              <div>
                <div className="text-xs text-stone-400">Your Current Order</div>
                <div className="text-sm font-black text-white">
                  {activeRestaurant.currencySymbol}
                  {cartTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <span>View Order</span>
              <span className="text-[10px] bg-white/20 px-1 rounded font-normal">
                Table {customerTableNumber}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Dish Customization / Add-on Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Modal Image & Close */}
            <div className="relative h-48 sm:h-56 bg-stone-900 flex-shrink-0">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 flex-1">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-black text-stone-900">{selectedItem.name}</h2>
                  <div className="text-base font-black text-amber-700">
                    {activeRestaurant.currencySymbol}
                    {selectedItem.price.toFixed(2)}
                  </div>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {selectedItem.description}
                </p>
                {selectedItem.calories && (
                  <div className="text-[11px] text-stone-400 mt-1">
                    {selectedItem.calories} kcal • {selectedItem.prepTimeMinutes || 12} mins
                  </div>
                )}
              </div>

              {/* Allergens warning */}
              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                  <strong>Allergen Notice:</strong> Contains {selectedItem.allergens.join(', ')}
                </div>
              )}

              {/* Variations (Sizes / Crusts) */}
              {selectedItem.variations && selectedItem.variations.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Select Size / Style:
                  </label>
                  <div className="space-y-1.5">
                    {selectedItem.variations.map((v) => (
                      <label
                        key={v.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          selectedVariation?.id === v.id
                            ? 'border-amber-600 bg-amber-50 font-bold text-amber-950'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === v.id}
                            onChange={() => setSelectedVariation(v)}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <span>{v.name}</span>
                        </div>
                        {v.priceDelta > 0 && (
                          <span className="text-stone-500">
                            +{activeRestaurant.currencySymbol}
                            {v.priceDelta.toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons (Extra Toppings) */}
              {selectedItem.addons && selectedItem.addons.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Add Extras &amp; Pairings:
                  </label>
                  <div className="space-y-1.5">
                    {selectedItem.addons.map((addon) => {
                      const isChecked = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-amber-600 bg-amber-50 font-bold text-amber-950'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAddon(addon)}
                              className="rounded text-amber-600 focus:ring-amber-500"
                            />
                            <span>{addon.name}</span>
                          </div>
                          <span className="text-stone-600">
                            +{activeRestaurant.currencySymbol}
                            {addon.price.toFixed(2)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions Note */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Special Kitchen Request (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. dressing on side, no parsley..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Quantity Selector & Add Button */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-stone-700 flex items-center justify-center font-bold shadow-xs hover:bg-stone-200 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-stone-700 flex items-center justify-center font-bold shadow-xs hover:bg-stone-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Add to Order</span>
                  <span>•</span>
                  <span>
                    {activeRestaurant.currencySymbol}
                    {calculateDetailPrice().toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Switch Table Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900">Select Your Table</h3>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Your orders will be delivered directly to the selected table.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setCustomerTableNumber(t.tableNumber);
                    setIsTableModalOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    customerTableNumber === t.tableNumber
                      ? 'bg-amber-600 text-white font-extrabold border-amber-700'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  <div className="text-xs font-bold">T-{t.tableNumber}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table Assistance / Call Staff Modal */}
      {isAssistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">Table Service Assistance</h3>
              <p className="text-xs text-stone-500 mt-1">
                Need anything at Table #{customerTableNumber}? Notify our floor staff instantly.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  requestTableAssistance('call_waiter');
                  setIsAssistModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Call Waiter to Table</span>
              </button>

              <button
                onClick={() => {
                  requestTableAssistance('water_refill');
                  setIsAssistModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💧 Request Water Refill</span>
              </button>

              <button
                onClick={() => {
                  requestTableAssistance('request_bill');
                  setIsAssistModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-stone-600" />
                <span>Request Bill for Table #{customerTableNumber}</span>
              </button>
            </div>

            <button
              onClick={() => setIsAssistModalOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-700 pt-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );

  // If in 'mobile_frame' simulator mode on larger screens, wrap in smartphone frame
  if (devicePreviewMode === 'mobile_frame') {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center text-xs text-stone-400 mb-3 flex items-center gap-2">
          <span>Android Customer Phone Preview (Table #{customerTableNumber})</span>
          <span className="text-amber-400 font-bold">• Contactless Web App</span>
        </div>
        <div className="w-full max-w-[412px] bg-stone-900 rounded-[44px] p-3 shadow-2xl border-4 border-stone-700 relative">
          {/* Ear piece notch */}
          <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-700 mr-2" />
            <div className="w-10 h-1 bg-stone-700 rounded-full" />
          </div>
          {/* Screen */}
          <div className="rounded-[32px] overflow-hidden max-h-[820px] overflow-y-auto border border-stone-800 bg-stone-100 shadow-inner">
            {menuContent}
          </div>
          {/* Home indicator bar */}
          <div className="w-28 h-1 bg-stone-600 rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return menuContent;
};
