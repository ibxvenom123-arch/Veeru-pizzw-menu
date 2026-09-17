import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Utensils,
  QrCode,
  Smartphone,
  ChevronRight,
  Filter,
  Check,
  CreditCard,
  Banknote,
  MessageCircle,
  User,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const {
    activeRestaurant,
    orders,
    tableCalls,
    tables,
    menuItems,
    updateOrderStatus,
    updateOrderPayment,
    resolveTableCall,
    setCurrentView,
    openCustomerMenuForTable,
  } = useApp();

  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Calculations
  const todayOrders = orders;
  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing'
  );
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'active') {
      return order.status === 'pending' || order.status === 'preparing' || order.status === 'served';
    }
    if (orderFilter === 'completed') {
      return order.status === 'completed' || order.status === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            New Order
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            In Kitchen
          </span>
        );
      case 'served':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
            <Check className="w-3 h-3 text-purple-600" />
            Served
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Kitchen &amp; Floor Command
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {activeRestaurant.name} • Live incoming customer table orders &amp; alerts
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCustomerMenuForTable(activeRestaurant.id, '3')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Preview Customer Menu</span>
              </button>

              <button
                onClick={() => setCurrentView('qr-codes')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Get Table QRs</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900 mt-2">
              {activeRestaurant.currencySymbol}
              {totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Across all tables today</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Active Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900 mt-2">{activeOrders.length}</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">In kitchen queue</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900 mt-2">{todayOrders.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">Orders logged</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Staff Alerts
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900 mt-2">{tableCalls.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">Table pings waiting</div>
          </div>
        </div>

        {/* Active Staff Calls & Table Requests Alert Bar */}
        {tableCalls.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-3">
              <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
              <span>Pending Customer Table Calls ({tableCalls.length})</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tableCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                      T{call.tableNumber}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 capitalize">
                        {call.type.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Requested {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => resolveTableCall(call.id)}
                    className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Orders Section */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Section Toolbar */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Live Orders Stream</h2>
              <p className="text-xs text-stone-500">
                Update status as food is cooked and served to tables
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setOrderFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'active'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Active ({activeOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'completed'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <Utensils className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold">No orders in this queue</p>
              <p className="text-xs text-stone-400 mt-1">
                New orders placed by customers will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Table & Customer details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                          T{order.tableNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-stone-900">
                              Order {order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 flex items-center gap-3 mt-0.5">
                            <span>Guest: {order.customerName}</span>
                            {order.customerPhone && <span>• {order.customerPhone}</span>}
                            <span>
                              •{' '}
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 max-w-xl">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-amber-700">{item.quantity}x</span>
                              <div>
                                <span className="font-semibold text-stone-800">{item.name}</span>
                                {item.selectedVariation && (
                                  <span className="text-stone-500 text-[11px] ml-1">
                                    ({item.selectedVariation.name})
                                  </span>
                                )}
                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                  <div className="text-[10px] text-stone-500">
                                    + {item.selectedAddons.map((a) => a.name).join(', ')}
                                  </div>
                                )}
                                {item.itemNotes && (
                                  <div className="text-[10px] text-amber-800 font-medium italic">
                                    Note: "{item.itemNotes}"
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="font-medium text-stone-600">
                              {activeRestaurant.currencySymbol}
                              {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}

                        {order.notes && (
                          <div className="pt-2 border-t border-stone-200 text-[11px] text-rose-700 font-medium">
                            Table Special Request: "{order.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Order Total & Status Controls */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 self-end lg:self-start">
                      <div className="text-right">
                        <div className="text-xs text-stone-500">Total Bill</div>
                        <div className="text-lg font-black text-stone-900">
                          {activeRestaurant.currencySymbol}
                          {order.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Status Transition Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cook in Kitchen
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'served')}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mark Served
                          </button>
                        )}

                        {order.status === 'served' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Complete Order
                          </button>
                        )}

                        {/* Payment Toggle */}
                        <button
                          onClick={() =>
                            updateOrderPayment(
                              order.id,
                              order.paymentStatus === 'paid' ? 'unpaid' : 'paid'
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
                          title="Toggle payment received"
                        >
                          {order.paymentStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
