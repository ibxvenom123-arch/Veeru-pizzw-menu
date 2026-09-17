import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  CreditCard,
  Banknote,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { PaymentMethod } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeRestaurant,
    customerTableNumber,
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartService,
    cartTotal,
    submitOrder,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('counter_card');

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    submitOrder(customerName, phone, paymentMethod, orderNotes);
    onClose();
  };

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    // Generate formatted text message for WhatsApp
    const orderItemsText = cart
      .map((item) => {
        let line = `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`;
        if (item.selectedVariation) {
          line += ` [${item.selectedVariation.name}]`;
        }
        if (item.selectedAddons && item.selectedAddons.length > 0) {
          line += ` (+ ${item.selectedAddons.map((a) => a.name).join(', ')})`;
        }
        if (item.itemNotes) {
          line += ` Note: ${item.itemNotes}`;
        }
        return line;
      })
      .join('\n');

    const message = `*NEW ORDER - Table ${customerTableNumber}* 🍽️\n` +
      `Restaurant: ${activeRestaurant.name}\n` +
      `Guest Name: ${customerName || 'Guest'}\n\n` +
      `*Items:*\n${orderItemsText}\n\n` +
      `*Subtotal:* $${cartSubtotal.toFixed(2)}\n` +
      `*Tax & Service:* $${(cartTax + cartService).toFixed(2)}\n` +
      `*Total Due:* $${cartTotal.toFixed(2)}\n` +
      (orderNotes ? `*Special Request:* ${orderNotes}\n` : '') +
      `\nSent via MenuCraft Digital Menu`;

    const encoded = encodeURIComponent(message);
    const cleanNum = activeRestaurant.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNum || '15552348901'}?text=${encoded}`;

    // Also record in internal system
    submitOrder(customerName, phone, 'whatsapp', orderNotes);
    onClose();

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-stone-900">Your Order</h2>
              <p className="text-[11px] text-stone-500">
                Table #{customerTableNumber} • {activeRestaurant.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-stone-400 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-semibold text-stone-700">Your order is empty</p>
              <p className="text-xs text-stone-400">Add mouth-watering dishes from the menu to start!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-stone-900">{item.name}</div>
                  {item.selectedVariation && (
                    <div className="text-[10px] text-stone-500 font-medium">
                      Size: {item.selectedVariation.name}
                    </div>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="text-[10px] text-amber-800 font-medium">
                      + {item.selectedAddons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.itemNotes && (
                    <div className="text-[10px] text-stone-500 italic">"{item.itemNotes}"</div>
                  )}
                  <div className="text-xs font-bold text-amber-700 mt-1">
                    {activeRestaurant.currencySymbol}
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center text-xs font-bold shadow-xs hover:bg-stone-200 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-stone-900 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center text-xs font-bold shadow-xs hover:bg-stone-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Placement */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Guest details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                placeholder="Phone (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Special Instructions Note */}
            <input
              type="text"
              placeholder="Allergies or kitchen notes (e.g. sauce on side)..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            {/* Bill Summary */}
            <div className="text-xs space-y-1 pt-1 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {activeRestaurant.currencySymbol}
                  {cartSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(activeRestaurant.taxRate * 100).toFixed(1)}%)</span>
                <span>
                  {activeRestaurant.currencySymbol}
                  {cartTax.toFixed(2)}
                </span>
              </div>
              {cartService > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge ({(activeRestaurant.serviceChargeRate * 100).toFixed(1)}%)</span>
                  <span>
                    {activeRestaurant.currencySymbol}
                    {cartService.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-stone-900 text-sm pt-1 border-t border-stone-200">
                <span>Total Due</span>
                <span>
                  {activeRestaurant.currencySymbol}
                  {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('counter_card')}
                  className={`p-2 rounded-lg border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    paymentMethod === 'counter_card'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay by Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('counter_cash')}
                  className={`p-2 rounded-lg border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    paymentMethod === 'counter_cash'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Pay with Cash</span>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              {activeRestaurant.enableOrdering ? (
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send Order to Kitchen ({activeRestaurant.currencySymbol}{cartTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-stone-200 text-stone-600 text-xs font-medium text-center">
                  Digital ordering is currently view-only for this restaurant.
                </div>
              )}

              {/* Direct WhatsApp Ordering */}
              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
