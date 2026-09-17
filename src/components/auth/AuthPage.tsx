import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User as UserIcon, QrCode, Lock, Mail, UserCheck, ArrowRight, Sparkles, Building } from 'lucide-react';
import { User as UserType } from '../../types';
import { DEMO_USER } from '../../data/initialData';

export const AuthPage: React.FC = () => {
  const { setCurrentUser, setCurrentView, showToast, allRestaurants, setActiveRestaurant } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('owner@bellatavola.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    if (mode === 'login') {
      const existing = {
        ...DEMO_USER,
        email,
        fullName: email.split('@')[0].toUpperCase() || 'Restaurant Owner',
      };
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.fullName}!`, 'success');
      setCurrentView('dashboard');
    } else {
      if (!fullName || !restaurantName) {
        showToast('Please enter your name and restaurant name', 'error');
        return;
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        fullName,
        role: 'owner' as const,
        restaurantId: allRestaurants[0]?.id || 'rest_bella_01',
        plan: 'pro' as const,
      };
      setCurrentUser(newUser);
      showToast(`Welcome, ${fullName}! Your restaurant is ready.`, 'success');
      setCurrentView('dashboard');
    }
  };

  const handleOneClickDemo = (restaurantId: string, name: string, emailAddr: string) => {
    const targetRest = allRestaurants.find((r) => r.id === restaurantId);
    if (targetRest) {
      setActiveRestaurant(targetRest);
    }
    const user: UserType = {
      id: `usr_${restaurantId}`,
      email: emailAddr,
      fullName: name,
      role: 'owner',
      restaurantId: restaurantId,
      plan: 'pro',
    };
    setCurrentUser(user);
    showToast(`Logged in as ${name} (${targetRest?.name})`, 'success');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-100">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Restaurant Owner Portal' : 'Start Your Digital Restaurant'}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Manage your digital menu, track orders in real-time &amp; print table QR codes
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant 1-Click Demo Logins</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleOneClickDemo('rest_bella_01', 'Marco Rossi', 'owner@bellatavola.com')
              }
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-amber-400 text-left transition-all hover:shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                🇮🇹
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 truncate">Bella Tavola</div>
                <div className="text-[10px] text-stone-500">Italian Trattoria</div>
              </div>
            </button>

            <button
              onClick={() =>
                handleOneClickDemo('rest_sakura_02', 'Kenji Sato', 'owner@sakuraramen.com')
              }
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-amber-400 text-left transition-all hover:shadow-xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                🇯🇵
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 truncate">Sakura Ramen</div>
                <div className="text-[10px] text-stone-500">Japanese Cuisine</div>
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          {/* Mode Tabs */}
          <div className="flex p-1 bg-stone-100 rounded-xl mb-5">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'signup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chef Antonio"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Restaurant Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Osteria Moderna"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? 'Enter Owner Dashboard' : 'Create Restaurant'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
