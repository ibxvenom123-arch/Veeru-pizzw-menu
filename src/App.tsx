/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { MenuManager } from './components/menu-editor/MenuManager';
import { RestaurantSettings } from './components/settings/RestaurantSettings';
import { QrCodeManager } from './components/qrcode/QrCodeManager';
import { CustomerMenu } from './components/customer-menu/CustomerMenu';
import { OrderStatusPage } from './components/customer-menu/OrderStatusPage';
import { Toast } from './components/common/Toast';

const AppRouter: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    allRestaurants,
    setActiveRestaurant,
    setCustomerTableNumber,
  } = useApp();

  // Detect QR code scan parameters from URL (e.g. ?restaurant=bella-tavola&table=3)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const restSlug = params.get('restaurant');
      const tableNum = params.get('table');

      if (restSlug) {
        const found = allRestaurants.find(
          (r) => r.slug.toLowerCase() === restSlug.toLowerCase()
        );
        if (found) {
          setActiveRestaurant(found);
        }
      }

      if (tableNum) {
        setCustomerTableNumber(tableNum);
        setCurrentView('customer-menu');
      } else if (restSlug) {
        setCurrentView('customer-menu');
      }
    } catch (e) {
      console.error('URL parse error', e);
    }
  }, [allRestaurants, setActiveRestaurant, setCustomerTableNumber, setCurrentView]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {(currentView === 'login' || currentView === 'signup') && <AuthPage />}
        {currentView === 'dashboard' && <OwnerDashboard />}
        {currentView === 'menu-manager' && <MenuManager />}
        {currentView === 'restaurant-settings' && <RestaurantSettings />}
        {currentView === 'qr-codes' && <QrCodeManager />}
        {currentView === 'customer-menu' && <CustomerMenu />}
        {currentView === 'customer-order-status' && <OrderStatusPage />}
      </main>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
