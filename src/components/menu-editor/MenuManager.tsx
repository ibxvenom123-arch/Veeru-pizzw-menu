import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Leaf,
  Wheat,
  X,
  Layers,
  Clock,
  Eye,
} from 'lucide-react';
import { MenuItem, Category } from '../../types';

export const MenuManager: React.FC = () => {
  const {
    activeRestaurant,
    categories,
    menuItems,
    saveMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    saveCategory,
    deleteCategory,
    openCustomerMenuForTable,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Item Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Utensils');

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openNewItemModal = () => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      restaurantId: activeRestaurant.id,
      categoryId: categories[0]?.id || 'cat_starters',
      name: '',
      description: '',
      price: 12.0,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      isChefSpecial: false,
      calories: 450,
      prepTimeMinutes: 12,
      allergens: [],
      tags: [],
      displayOrder: menuItems.length + 1,
      createdAt: new Date().toISOString(),
    };
    setEditingItem(newItem);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;
    saveMenuItem(editingItem);
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      restaurantId: activeRestaurant.id,
      name: newCatName.trim(),
      description: newCatDesc.trim() || undefined,
      iconName: newCatIcon,
      displayOrder: categories.length + 1,
      isActive: true,
    };
    saveCategory(newCat);
    setNewCatName('');
    setNewCatDesc('');
    setIsCatModalOpen(false);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Digital Food Menu Manager
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Add, edit, organize categories, and instantly toggle out-of-stock items for{' '}
                {activeRestaurant.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openCustomerMenuForTable(activeRestaurant.id, '1')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-300"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Menu</span>
              </button>

              <button
                onClick={() => setIsCatModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>+ Category</span>
              </button>

              <button
                onClick={openNewItemModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish / Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Search & Category Filter Strip */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const categoryObj = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border ${
                  item.isAvailable ? 'border-stone-200' : 'border-rose-200 bg-rose-50/20'
                } shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                {/* Image & Badges */}
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                      !item.isAvailable ? 'grayscale opacity-60' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Tags */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {item.isChefSpecial && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Special
                      </span>
                    )}
                    {item.isVegetarian && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Leaf className="w-3 h-3" /> Veg
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3" /> Spicy
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-md text-white font-extrabold text-sm border border-stone-700">
                    {activeRestaurant.currencySymbol}
                    {item.price.toFixed(2)}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-stone-200 drop-shadow-sm">
                    {categoryObj?.name || 'Category'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-stone-900 leading-snug">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Info Row (prep time, allergens) */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    {item.prepTimeMinutes ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {item.prepTimeMinutes} mins
                      </span>
                    ) : (
                      <span />
                    )}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="text-[10px] text-stone-400 truncate max-w-[150px]">
                        Contains: {item.allergens.join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    {/* In-Stock / Sold-out toggle */}
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.name}" from the menu?`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-stone-800">No menu items found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search query or add a new dish to this category.
            </p>
            <button
              onClick={openNewItemModal}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Dish</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Item Modal */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h2 className="text-base font-extrabold text-stone-900">
                {menuItems.some((i) => i.id === editingItem.id) ? 'Edit Dish' : 'Add New Dish'}
              </h2>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Handmade Fettuccine Tartufo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Price ({activeRestaurant.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Describe ingredients, cooking technique, flavors..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingItem.prepTimeMinutes || 10}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        prepTimeMinutes: parseInt(e.target.value) || 10,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editingItem.calories || 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        calories: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* Dietary Flags */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block font-bold text-stone-700 mb-2">Dietary Attributes</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isVegetarian}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isVegetarian: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-stone-800">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isVegan}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isVegan: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-stone-800">Vegan</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isGlutenFree}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isGlutenFree: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-stone-800">Gluten-Free</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isSpicy}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isSpicy: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-stone-800">Spicy</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer col-span-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isChefSpecial}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isChefSpecial: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-stone-800">
                      Chef's Signature Recommendation
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-base font-extrabold text-stone-900">Add Menu Category</h2>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wood-Fired Pizzas, Desserts"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Short subtitle for customer menu"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
