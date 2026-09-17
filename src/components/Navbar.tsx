import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Utensils,
  QrCode,
  LayoutDashboard,
  Settings,
  Smartphone,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Sparkles,
  LogOut,
  LogIn,
  Store,
  Bell,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    setCurrentUser,
    activeRestaurant,
    setActiveRestaurant,
    allRestaurants,
    orders,
    tableCalls,
    resetAllData,
    devicePreviewMode,
    setDevicePreviewMode,
  } = useApp();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing'
  ).length;
  const activeCallsCount = tableCalls.length;

  const isCustomerView =
    currentView === 'customer-menu' || currentView === 'customer-order-status';

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top Banner Notice for preview & quick switcher */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            Digital Menu SaaS Demo — <strong>Instant QR Table Ordering</strong> (No Customer App
            Required)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Restaurant Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded text-[11px]">
            <Store className="w-3 h-3 opacity-80" />
            <span className="opacity-80">Demo Restaurant:</span>
            <select
              value={activeRestaurant?.id}
              onChange={(e) => {
                const target = allRestaurants.find((r) => r.id === e.target.value);
                if (target) setActiveRestaurant(target);
              }}
              className="bg-transparent text-white font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-white rounded"
            >
              {allRestaurants.map((r) => (
                <option key={r.id} value={r.id} className="text-stone-900">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all demo data (menu items, orders, tables) to original state?')) {
                resetAllData();
              }
            }}
            title="Reset demo data"
            className="flex items-center gap-1 text-[11px] opacity-80 hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                MenuCraft
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SaaS
                </span>
              </span>
              <p className="text-[11px] text-stone-400 -mt-0.5 hidden sm:block">
                {activeRestaurant?.name || 'Restaurant OS'}
              </p>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-stone-800">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              {pendingOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
              {activeCallsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Active table call" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('menu-manager')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'menu-manager'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Menu Editor</span>
            </button>

            <button
              onClick={() => setCurrentView('qr-codes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'qr-codes'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Table QR Codes</span>
            </button>

            <button
              onClick={() => setCurrentView('restaurant-settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'restaurant-settings'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5">
          {/* Customer Menu Simulator Launcher */}
          <div className="flex items-center bg-stone-800/90 border border-stone-700/80 rounded-lg p-0.5">
            <button
              onClick={() => {
                setCurrentView('customer-menu');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isCustomerView
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-stone-700/50'
              }`}
              title="Open the customer digital menu experience"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer Menu</span>
              <span className="sm:hidden">Menu</span>
            </button>

            {isCustomerView && (
              <button
                onClick={() =>
                  setDevicePreviewMode(
                    devicePreviewMode === 'responsive' ? 'mobile_frame' : 'responsive'
                  )
                }
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-stone-300 hover:text-white transition-colors cursor-pointer border-l border-stone-700"
                title="Toggle simulated smartphone frame"
              >
                <span>{devicePreviewMode === 'mobile_frame' ? 'Exit Frame' : 'Phone Frame'}</span>
              </button>
            )}
          </div>

          {/* User Auth Info */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2">
              <div className="hidden xl:block text-right">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-amber-400 font-medium">Owner Admin</div>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('landing');
                }}
                className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Owner Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-stone-950 border-t border-stone-800/80 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] ${
            currentView === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentView('menu-manager')}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] ${
            currentView === 'menu-manager' ? 'text-amber-400 font-semibold' : 'text-stone-400'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu</span>
        </button>
        <button
          onClick={() => setCurrentView('qr-codes')}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] ${
            currentView === 'qr-codes' ? 'text-amber-400 font-semibold' : 'text-stone-400'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Codes</span>
        </button>
        <button
          onClick={() => setCurrentView('restaurant-settings')}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] ${
            currentView === 'restaurant-settings' ? 'text-amber-400 font-semibold' : 'text-stone-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
