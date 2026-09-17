import React from 'react';
import { CartItem } from '../types.ts';
import { X, CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: FirebaseUser | null;
  onOrderSuccess: (orderId: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = React.useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    address: '',
    city: 'Paris',
    postalCode: '75001',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [orderConfirmation, setOrderConfirmation] = React.useState<any>(null);

  React.useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.displayName || '',
        email: prev.email || currentUser.email || '',
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.book.price * curr.quantity, 0);
  const shippingFee = subtotal >= 35.0 ? 0 : 4.90;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      let token = '';
      if (currentUser) {
        token = await currentUser.getIdToken();
      }

      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        totalAmount: total,
        items: items.map((i) => ({
          bookId: i.book.id,
          title: i.book.title,
          price: i.book.price,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la commande');
      }

      setOrderConfirmation(data.order);
      onOrderSuccess(data.order.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible d’enregistrer la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-stone-900">
              {orderConfirmation ? 'Confirmation de commande' : 'Finalisation de votre commande'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {orderConfirmation ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Merci pour votre commande !
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Votre commande a été enregistrée avec succès dans la base de données SQL sous la référence{' '}
                <strong className="text-amber-800 font-mono font-bold">#CMD-{orderConfirmation.id}</strong>.
              </p>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2 text-stone-600 max-w-md mx-auto shadow-xs">
                <div className="flex justify-between">
                  <span>Destinataire :</span>
                  <strong className="text-stone-900 font-semibold">{orderConfirmation.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Email de confirmation :</span>
                  <strong className="text-stone-900 font-semibold">{orderConfirmation.customerEmail}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Livraison à :</span>
                  <strong className="text-stone-900 font-semibold">{orderConfirmation.address}, {orderConfirmation.postalCode} {orderConfirmation.city}</strong>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-stone-200 text-sm font-bold">
                  <span>Total réglé :</span>
                  <strong className="text-amber-800 font-mono font-bold">{orderConfirmation.totalAmount.toFixed(2).replace('.', ',')} €</strong>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-all shadow-sm"
              >
                Retour à la vitrine
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@email.fr"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adresse de livraison *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: 14 rue de la Paix"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:border-amber-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Code Postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="75001"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:bg-white focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Order Recap */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <h4 className="font-bold text-stone-800">Récapitulatif de commande</h4>
                <div className="max-h-28 overflow-y-auto space-y-1 text-stone-600 pr-1">
                  {items.map((i) => (
                    <div key={i.book.id} className="flex justify-between">
                      <span className="truncate pr-2">{i.quantity}x {i.book.title}</span>
                      <span className="font-mono font-semibold text-stone-800">{(i.book.price * i.quantity).toFixed(2).replace('.', ',')} €</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                  <span>Total à régler :</span>
                  <span className="font-mono text-amber-800 font-bold">{total.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-900/15"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement dans la base SQL...</span>
                  </>
                ) : (
                  <>
                    <span>Valider et enregistrer ma commande</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
