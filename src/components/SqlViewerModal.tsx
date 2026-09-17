import React from 'react';
import { X, Database, CheckCircle2, RefreshCw } from 'lucide-react';
import { Book } from '../types.ts';

interface SqlViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
}

export const SqlViewerModal: React.FC<SqlViewerModalProps> = ({
  isOpen,
  onClose,
  books,
}) => {
  const [activeTab, setActiveTab] = React.useState<'table' | 'schema' | 'stats'>('table');
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/stats')
        .then((r) => r.json())
        .then((d) => setStats(d))
        .catch((e) => console.error(e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                Inspecteur Base de Données SQL
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PostgreSQL Cloud SQL
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Visualisation directe des 30 livres enregistrés dans la table relationnelle &apos;books&apos;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-5 pt-3 gap-3 bg-stone-50/50 text-xs">
          <button
            onClick={() => setActiveTab('table')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'table'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Données SQL ({books.length} lignes)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'schema'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Schéma DDL
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'stats'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            État & Connexion
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5 overflow-y-auto flex-1 font-sans">
          {activeTab === 'table' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-700 bg-stone-100 p-3 rounded-xl border border-stone-200 font-mono">
                <span>SELECT id, title, author, category, price, stock, isbn FROM books ORDER BY id ASC;</span>
                <span className="text-emerald-700 font-sans font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {books.length} résultats
                </span>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-stone-800">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-mono text-[11px] border-b border-stone-200 font-semibold">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Titre</th>
                      <th className="py-3 px-3">Auteur</th>
                      <th className="py-3 px-3">Genre</th>
                      <th className="py-3 px-3">Prix</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">ISBN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[12px]">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-2.5 px-3 text-amber-800 font-bold">{b.id}</td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-stone-900">{b.title}</td>
                        <td className="py-2.5 px-3 font-sans text-stone-600">{b.author}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-semibold text-[10px] border border-amber-200">
                            {b.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-900 font-bold">{b.price.toFixed(2)} €</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-semibold">{b.stock}</td>
                        <td className="py-2.5 px-3 text-stone-500 text-[11px]">{b.isbn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#1e1e1e] border border-stone-800 text-stone-200 overflow-x-auto shadow-inner">
                <pre className="leading-relaxed text-amber-300/95">{`CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  isbn TEXT NOT NULL,
  published_year INTEGER NOT NULL,
  pages INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 15,
  rating REAL NOT NULL DEFAULT 4.5,
  is_featured INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_uid TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  total_amount REAL NOT NULL,
  items TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmée',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-500 font-medium">Moteur de base</span>
                  <p className="text-base font-bold text-stone-900 font-mono mt-1">PostgreSQL</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">Cloud SQL Developer Edition</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-500 font-medium">Total Livres en SQL</span>
                  <p className="text-2xl font-bold text-amber-800 font-mono mt-1">{books.length} / 30</p>
                  <span className="text-[11px] text-stone-600 font-medium">30 chefs-d’œuvre enregistrés</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-500 font-medium">Gestionnaire ORM</span>
                  <p className="text-base font-bold text-stone-900 font-mono mt-1">Drizzle ORM</p>
                  <span className="text-[11px] text-stone-600 font-medium">Pool de connexions node-postgres</span>
                </div>
              </div>

              {stats && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div>Statut serveur API : <strong className="text-emerald-700">{stats.status}</strong></div>
                  <div>Région Cloud SQL : <strong className="text-stone-900">europe-west2</strong></div>
                  <div>Commandes récentes enregistrées : <strong className="text-stone-900">{stats.recentOrdersCount}</strong></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
