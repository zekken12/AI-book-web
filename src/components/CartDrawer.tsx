import React from 'react';
import { CartItem } from '../types.ts';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (bookId: number, delta: number) => void;
  onRemoveItem: (bookId: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.book.price * curr.quantity, 0);
  const freeShippingThreshold = 35.0;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 4.90;
  const total = subtotal + shippingFee;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 text-stone-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="font-serif font-bold text-xl text-stone-900">
                Votre Panier Littéraire
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                {items.reduce((acc, i) => acc + i.quantity, 0)} articles
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Gauge */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600 mb-1.5 font-medium">
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Ajoutez <strong className="text-amber-800 font-bold">{remainingForFreeShipping.toFixed(2).replace('.', ',')} €</strong> pour la livraison offerte
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ Vous bénéficiez de la livraison offerte !
                  </span>
                )}
                <span className="font-semibold text-stone-700">{subtotal.toFixed(2).replace('.', ',')} € / 35 €</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  Sélectionnez des ouvrages parmi nos 30 chefs-d’œuvre pour enrichir vos lectures.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-sm"
                >
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              items.map(({ book, quantity }) => (
                <div
                  key={book.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 items-center shadow-xs"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-20 object-cover rounded-lg bg-stone-200 shrink-0 border border-stone-200 shadow-xs"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-amber-800 truncate font-medium">{book.author}</p>
                    <p className="text-xs font-mono font-bold text-stone-900 mt-1">
                      {(book.price * quantity).toFixed(2).replace('.', ',')} €
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(book.id, -1)}
                          className="px-2.5 py-0.5 text-xs text-stone-700 hover:bg-stone-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-stone-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(book.id, 1)}
                          className="px-2.5 py-0.5 text-xs text-stone-700 hover:bg-stone-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(book.id)}
                        className="text-stone-400 hover:text-red-600 text-xs p-1 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Sous-total articles</span>
                  <span className="font-mono text-stone-900 font-bold">
                    {subtotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Frais de livraison</span>
                  <span className="font-mono text-stone-900">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700 font-sans font-bold">Offerte</strong>
                    ) : (
                      `${shippingFee.toFixed(2).replace('.', ',')} €`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2.5 border-t border-stone-200">
                  <span>Total TTC</span>
                  <span className="font-mono text-amber-800 text-lg font-bold">
                    {total.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              <button
                id="btn-cart-checkout"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-900/15"
              >
                <span>Commander mes livres</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>Validation instantanée enregistrée en base SQL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
