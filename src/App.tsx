import React from 'react';
import { Book, CartItem } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { BookCard } from './components/BookCard.tsx';
import { BookDetailModal } from './components/BookDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrdersModal } from './components/OrdersModal.tsx';
import { SqlViewerModal } from './components/SqlViewerModal.tsx';
import { auth } from './lib/firebase.ts';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  BookOpen,
  SlidersHorizontal,
  Search,
  Database,
  RefreshCw,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export default function App() {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'default' | 'price_asc' | 'price_desc' | 'rating' | 'year' | 'title'>('default');

  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_pages_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = React.useState(false);
  const [isSqlInspectorOpen, setIsSqlInspectorOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = React.useState<number | null>(null);

  const catalogRef = React.useRef<HTMLDivElement>(null);

  // Save cart to local storage
  React.useEffect(() => {
    try {
      localStorage.setItem('atelier_pages_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Auth observer
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch books from SQL API
  const fetchBooks = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (sortBy !== 'default') {
        params.append('sortBy', sortBy);
      }

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des livres');
      }
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Impossible de se connecter à la base de données SQL.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy]);

  // Fetch distinct categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Cart operations
  const handleAddToCart = (book: Book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });

    setRecentlyAddedId(book.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
  };

  const handleUpdateQuantity = (bookId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.book.id === bookId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const handleOrderSuccess = () => {
    setCart([]);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenSqlInspector={() => setIsSqlInspectorOpen(true)}
        totalBooksCount={books.length}
      />

      {/* Hero Vitrine */}
      <HeroBanner onScrollToCatalog={scrollToCatalog} />

      {/* Main Catalog Section */}
      <main ref={catalogRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar: Filters & Sort */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 flex items-center gap-2.5">
                <span>Le Rayon des Livres</span>
                <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                  {books.length} ouvrage{books.length > 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Catalogue issu directement de la table SQL PostgreSQL avec disponibilité en temps réel.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Trier par :</span>
              </div>
              <select
                id="select-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="default">Ordre du catalogue (ID SQL)</option>
                <option value="price_asc">Prix : croissant</option>
                <option value="price_desc">Prix : décroissant</option>
                <option value="rating">Meilleures notes lecteurs</option>
                <option value="year">Année de parution (récents)</option>
                <option value="title">Titre alphabétique (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              Tous les genres (20)
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
            <p className="font-serif text-lg text-stone-200">
              Interrogation de la base de données SQL...
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Chargement des 20 ouvrages depuis Cloud SQL PostgreSQL.
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-stone-900 border border-red-800/60 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 flex items-center justify-center mx-auto">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Connexion à la base SQL
            </h3>
            <p className="text-xs text-stone-300">{error}</p>
            <button
              onClick={() => fetchBooks()}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
            >
              Réessayer
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Search className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-200">
              Aucun livre ne correspond à votre recherche
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Essayez un autre mot-clé ou réinitialisez les filtres par catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
            >
              Réinitialiser les critères
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelectBook={(b) => setSelectedBook(b)}
                onAddToCart={(b) => handleAddToCart(b, 1)}
                isAddedRecently={recentlyAddedId === book.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Informative Footer */}
      <footer className="mt-16 bg-stone-900 border-t border-stone-800 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span className="font-serif font-bold text-base text-stone-100">
                  L’Atelier des Pages
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Site vitrine et librairie en ligne propulsée par une base de données relationnelle SQL avec un catalogue permanent de 20 livres incontournables.
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-stone-200 text-sm mb-3">Engagements</h4>
              <ul className="space-y-2 text-stone-400">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Éditions intégrales de référence</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Livraison offerte dès 35 €</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Base SQL PostgreSQL active</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-stone-200 text-sm mb-3">Genres Littéraires</h4>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 6).map((cat) => (
                  <span
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      scrollToCatalog();
                    }}
                    className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px] hover:text-amber-400 cursor-pointer"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-stone-200 text-sm mb-3">Technologies</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Architecture moderne HTML5 / CSS3 (Tailwind) / TypeScript / React 19 / Express API / Drizzle ORM et base de données PostgreSQL Cloud SQL.
              </p>
              <button
                onClick={() => setIsSqlInspectorOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs border border-stone-700"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ouvrir l&apos;inspecteur SQL</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>© 2026 L’Atelier des Pages — Tous droits réservés.</p>
            <p className="flex items-center gap-1">
              Fait avec passion pour les amoureux des livres
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToCart={(book, qty) => handleAddToCart(book, qty)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currentUser={currentUser}
      />

      <SqlViewerModal
        isOpen={isSqlInspectorOpen}
        onClose={() => setIsSqlInspectorOpen(false)}
        books={books}
      />
    </div>
  );
}
