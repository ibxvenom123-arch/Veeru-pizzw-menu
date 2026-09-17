import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Zap,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  MessageCircle,
  Eye,
  CheckCircle2,
  ChefHat,
  Sliders,
  DollarSign,
  UtensilsCrossed,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, activeRestaurant, openCustomerMenuForTable } = useApp();

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 border-b border-stone-200/80 bg-radial from-amber-50/60 via-stone-50 to-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Next-Gen Mobile-First Digital Menu SaaS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
                Contactless Dining. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700">
                  Instant QR Table Orders.
                </span>{' '}
                <br />
                Zero App Downloads.
              </h1>

              <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
                Empower your restaurant with high-speed digital menus. Customers simply point their
                camera at the table QR code to browse vivid food photography, filter dietary needs,
                and place orders in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openCustomerMenuForTable(activeRestaurant.id, '3')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Try Customer Menu (Table 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm border border-stone-700 shadow-sm transition-all cursor-pointer"
                >
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  <span>Open Owner Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentView('qr-codes')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm border border-stone-300 shadow-sm transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <span>Printable Table QR Cards</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Works on Android &amp; iOS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Out-of-Stock Toggles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp &amp; Table Ordering Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative Glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl" />

                {/* Smartphone Mockup Frame */}
                <div className="relative bg-stone-900 p-3 rounded-[36px] shadow-2xl border-4 border-stone-800">
                  {/* Speaker Ear Notch */}
                  <div className="w-20 h-4 bg-stone-800 rounded-full mx-auto mb-2.5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-700 mr-2" />
                    <div className="w-8 h-1 bg-stone-700 rounded-full" />
                  </div>

                  {/* Screen Content */}
                  <div className="bg-stone-50 rounded-[28px] overflow-hidden border border-stone-200">
                    {/* Restaurant Cover Header */}
                    <div className="relative h-32 bg-stone-900">
                      <img
                        src={activeRestaurant.coverUrl}
                        alt={activeRestaurant.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between text-white">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Table #3 • Terrace
                          </div>
                          <div className="text-base font-bold leading-tight drop-shadow-sm">
                            {activeRestaurant.name}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                          <UtensilsCrossed className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Category Bar */}
                    <div className="flex gap-1.5 p-2.5 border-b border-stone-200 bg-white overflow-hidden text-[11px] font-semibold">
                      <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white whitespace-nowrap">
                        Pizzas
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 whitespace-nowrap">
                        Pasta
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 whitespace-nowrap">
                        Dolci
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 whitespace-nowrap">
                        Drinks
                      </span>
                    </div>

                    {/* Sample Menu Items Preview */}
                    <div className="p-3 space-y-2.5 bg-stone-50">
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=160&auto=format&fit=crop&q=80"
                          alt="Margherita"
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-stone-900 truncate">
                              Margherita D.O.P.
                            </span>
                            <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 font-bold rounded">
                              Veg
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 line-clamp-1">
                            Buffalo mozzarella, San Marzano, sweet basil
                          </p>
                          <div className="text-xs font-bold text-amber-700 mt-0.5">$18.00</div>
                        </div>
                        <button
                          onClick={() => openCustomerMenuForTable(activeRestaurant.id, '3')}
                          className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-xs hover:bg-amber-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=160&auto=format&fit=crop&q=80"
                          alt="Burrata"
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-stone-900 truncate">
                              Truffled Burrata
                            </span>
                            <span className="text-[9px] px-1 bg-amber-100 text-amber-800 font-bold rounded">
                              Special
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 line-clamp-1">
                            Modena drizzle, warm focaccia
                          </p>
                          <div className="text-xs font-bold text-amber-700 mt-0.5">$16.50</div>
                        </div>
                        <button
                          onClick={() => openCustomerMenuForTable(activeRestaurant.id, '3')}
                          className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-xs hover:bg-amber-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Bottom Floating Bar */}
                    <div className="p-2.5 bg-white border-t border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-stone-800">Live Table Ordering</span>
                      </div>
                      <button
                        onClick={() => openCustomerMenuForTable(activeRestaurant.id, '3')}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Menu</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Home Bar */}
                  <div className="w-24 h-1 bg-stone-700 rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              Everything Your Restaurant Needs
            </h2>
            <p className="text-3xl font-extrabold text-stone-900 tracking-tight">
              A Complete Operating System for Contactless Menus
            </p>
            <p className="text-stone-600 text-sm mt-2">
              Designed from the ground up for high-speed table turnarounds, higher check averages,
              and frictionless customer delight.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Instant Table QR Codes
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Generate high-resolution QR codes mapped to specific tables. When scanned, the app
                automatically detects the table and routes orders to your kitchen.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Real-Time Menu Control</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Sold out of fresh salmon? Toggle availability with a single click. Update pricing,
                add daily chef specials, and reorder categories without expensive reprints.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Table Assistance &amp; WhatsApp
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Customers can request a waiter, ask for water refills, or request the bill from their
                phone. Also supports direct WhatsApp ordering for takeaway or room service.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Upsell Addons &amp; Sizes</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Increase average ticket size with smart dish variations (12" vs 16"), extra toppings,
                and premium wine pairings placed right at the point of ordering.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Dietary &amp; Allergen Tags
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Clear badges for Vegetarian, Vegan, Gluten-Free, and spicy heat levels with full
                allergen transparency for guests with dietary restrictions.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400/80 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Kitchen Order Stream</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Live order queue with preparation status stages (Pending → Preparing → Served) and
                real-time audio-visual notifications for kitchen staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-14 bg-stone-900 text-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to modernise your restaurant menu?
          </h2>
          <p className="text-stone-300 text-sm max-w-xl mx-auto">
            Test the live demo right now with preloaded artisan dishes, or jump directly into the
            owner dashboard to customize your menu.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openCustomerMenuForTable(activeRestaurant.id, '1')}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Open Digital Menu (Table 1)
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-sm border border-stone-700 transition-colors cursor-pointer"
            >
              Go to Owner Kitchen Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
