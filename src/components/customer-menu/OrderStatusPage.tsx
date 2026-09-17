import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Utensils,
  Bell,
  ArrowLeft,
  Sparkles,
  Smartphone,
  PhoneCall,
  Check,
} from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const {
    placedOrder,
    activeRestaurant,
    customerTableNumber,
    setCurrentView,
    requestTableAssistance,
  } = useApp();

  if (!placedOrder) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center max-w-sm w-full space-y-4 shadow-sm">
          <Utensils className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-lg font-bold text-stone-800">No Active Order Placed</h2>
          <p className="text-xs text-stone-500">
            You haven't placed an order yet. Browse our digital menu and order delicious food!
          </p>
          <button
            onClick={() => setCurrentView('customer-menu')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 text-white font-bold text-xs cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Received', icon: CheckCircle2, desc: 'Kitchen acknowledged ticket' },
    { key: 'preparing', label: 'In the Kitchen', icon: ChefHat, desc: 'Chefs are cooking your dishes' },
    { key: 'served', label: 'Served to Table', icon: Utensils, desc: 'Dishes delivered to your table' },
    { key: 'completed', label: 'Completed', icon: Check, desc: 'Enjoy your meal!' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === placedOrder.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="min-h-screen bg-stone-100 pb-20">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView('customer-menu')}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Items</span>
          </button>
          <span className="text-xs font-bold text-amber-400">
            Table #{customerTableNumber}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <ChefHat className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              {activeRestaurant.name}
            </div>
            <h1 className="text-xl font-extrabold text-stone-900">
              Order {placedOrder.orderNumber}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Estimated prep time: 15–20 minutes
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="py-4 space-y-4 text-left">
            {steps.map((step, idx) => {
              const isDone = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-8 -ml-px ${
                        idx < activeIndex ? 'bg-amber-600' : 'bg-stone-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-colors ${
                      isDone
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-amber-700' : isDone ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[10px] text-stone-500">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Table Paging Buttons */}
          <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => requestTableAssistance('call_waiter')}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>Call Waiter</span>
            </button>

            <button
              onClick={() => requestTableAssistance('request_bill')}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-stone-600" />
              <span>Request Bill</span>
            </button>
          </div>
        </div>

        {/* Order Receipt Details */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-extrabold text-xs text-stone-900 border-b border-stone-100 pb-2">
            Ordered Items
          </h3>

          <div className="divide-y divide-stone-100 text-xs space-y-2">
            {placedOrder.items.map((item, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900">{item.quantity}x</span>{' '}
                  <span className="font-medium text-stone-800">{item.name}</span>
                  {item.selectedVariation && (
                    <div className="text-[10px] text-stone-500">
                      ({item.selectedVariation.name})
                    </div>
                  )}
                </div>
                <span className="font-semibold text-stone-700">
                  {activeRestaurant.currencySymbol}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 text-xs space-y-1">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>
                {activeRestaurant.currencySymbol}
                {placedOrder.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Tax &amp; Service</span>
              <span>
                {activeRestaurant.currencySymbol}
                {(placedOrder.taxAmount + placedOrder.serviceAmount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-stone-900 text-sm pt-1 border-t border-stone-100">
              <span>Total Bill</span>
              <span>
                {activeRestaurant.currencySymbol}
                {placedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
