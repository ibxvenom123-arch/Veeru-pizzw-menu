import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  DollarSign,
  Phone,
  MessageCircle,
  Wifi,
  Palette,
  CheckCircle,
  Save,
  Sliders,
  MapPin,
  FileText,
} from 'lucide-react';
import { Restaurant } from '../../types';

export const RestaurantSettings: React.FC = () => {
  const { activeRestaurant, updateRestaurantProfile } = useApp();

  const [form, setForm] = useState<Restaurant>({ ...activeRestaurant });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile(form);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Restaurant Profile &amp; Service Settings
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure your public digital menu identity, currency, taxes, and ordering controls
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Building className="w-4 h-4 text-amber-600" />
              <span>Brand Identity &amp; Location</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Cuisine Type</label>
                <input
                  type="text"
                  value={form.cuisineType}
                  onChange={(e) => setForm({ ...form, cuisineType: e.target.value })}
                  placeholder="e.g. Italian, Japanese Ramen, Bistro"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Tagline / Catchphrase</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  About / Bio Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Physical Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Cover Banner URL</label>
                <input
                  type="url"
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Ordering & Table Service Controls */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Ordering &amp; Table Features</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-bold text-stone-900">Enable Digital Table Ordering</div>
                  <div className="text-stone-500 text-[11px]">
                    Allows customers to submit food orders directly to kitchen from their phone
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.enableOrdering}
                  onChange={(e) => setForm({ ...form, enableOrdering: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-bold text-stone-900">Enable "Call Waiter" Button</div>
                  <div className="text-stone-500 text-[11px]">
                    Allows guests to request floor staff attention from the digital menu
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.enableCallWaiter}
                  onChange={(e) => setForm({ ...form, enableCallWaiter: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-bold text-stone-900">Enable "Request Bill" Button</div>
                  <div className="text-stone-500 text-[11px]">
                    Alerts cashiers and floor staff that table is ready to pay
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.enableRequestBill}
                  onChange={(e) => setForm({ ...form, enableRequestBill: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Pricing, Tax & Currency */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Currency, Tax &amp; Service Charges</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={form.currencySymbol}
                  onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                  placeholder="$"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={(form.taxRate * 100).toFixed(1)}
                  onChange={(e) =>
                    setForm({ ...form, taxRate: (parseFloat(e.target.value) || 0) / 100 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Service Charge Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={(form.serviceChargeRate * 100).toFixed(1)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      serviceChargeRate: (parseFloat(e.target.value) || 0) / 100,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Contact, WhatsApp & WiFi (Printed on QR Table Tent Cards) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Wifi className="w-4 h-4 text-amber-600" />
              <span>Contact &amp; Table WiFi Info (Printed on QR Cards)</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  WhatsApp Ordering Number
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  Customers can send cart orders directly to this WhatsApp number
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Telephone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Guest WiFi Network Name</label>
                <input
                  type="text"
                  value={form.wifiName || ''}
                  onChange={(e) => setForm({ ...form, wifiName: e.target.value })}
                  placeholder="e.g. BellaTavola_Guest"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Guest WiFi Password</label>
                <input
                  type="text"
                  value={form.wifiPassword || ''}
                  onChange={(e) => setForm({ ...form, wifiPassword: e.target.value })}
                  placeholder="e.g. eatfreshpasta"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Restaurant Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
