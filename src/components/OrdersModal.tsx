import React from 'react';
import { X, Package, Clock, Calendar } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen && currentUser) {
      fetchOrders();
    }
  }, [isOpen, currentUser]);

  const fetchOrders = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Impossible de charger vos commandes');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Historique de vos commandes (Base SQL)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-stone-500">
              <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-700" />
              <p className="text-sm">Interrogation de la base de données SQL...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <p className="font-serif text-lg font-bold text-stone-800">Aucune commande enregistrée pour l’instant.</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Vos prochaines commandes validées apparaîtront ici et seront conservées dans la table SQL &apos;orders&apos;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                let parsedItems = [];
                try {
                  parsedItems = typeof ord.items === 'string' ? JSON.parse(ord.items) : ord.items;
                } catch {
                  parsedItems = [];
                }

                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800">
                          #CMD-{ord.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-stone-600">
                      {parsedItems.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-stone-800">{it.quantity}x {it.title}</span>
                          <span className="font-mono text-stone-500 font-medium">{(it.price * it.quantity).toFixed(2).replace('.', ',')} €</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-xs">
                      <span className="text-stone-600">
                        Livré à : <strong className="text-stone-900 font-semibold">{ord.address}, {ord.postalCode} {ord.city}</strong>
                      </span>
                      <span className="text-sm font-bold font-mono text-amber-800">
                        Total: {ord.totalAmount.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
