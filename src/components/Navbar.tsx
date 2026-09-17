import React from 'react';
import { BookOpen, ShoppingBag, Search, User, LogOut, Package, Database } from 'lucide-react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: FirebaseUser | null;
  onOpenOrders: () => void;
  onOpenSqlInspector: () => void;
  totalBooksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenOrders,
  onOpenSqlInspector,
  totalBooksCount,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      // Sync user to SQL database
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName: result.user.displayName }),
      });
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-900/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block leading-tight">
                L’Atelier des Pages
              </span>
              <span className="text-xs text-amber-800 font-semibold block tracking-wide uppercase">
                Librairie & Éditions Littéraires
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher parmi les 30 ouvrages (titre, auteur)..."
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1 py-0.5"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Database inspector trigger */}
            <button
              id="btn-sql-inspect"
              onClick={onOpenSqlInspector}
              title="Voir la base de données SQL"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">SQL:</span>
              <span className="text-emerald-700 font-semibold">{totalBooksCount} livres</span>
            </button>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-colors shadow-sm"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
              {cartCount > 0 && (
                <span className="bg-white text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 text-stone-800 text-sm border border-stone-200"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Utilisateur'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden lg:inline text-xs font-medium truncate max-w-[100px]">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-stone-800 text-sm">
                    <div className="px-4 py-2 border-b border-stone-100 text-xs text-stone-500">
                      Connecté en tant que <br />
                      <strong className="text-stone-900 truncate block">
                        {currentUser.email}
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-stone-50 text-stone-800"
                    >
                      <Package className="w-4 h-4 text-amber-700" />
                      Mes Commandes
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-stone-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-google-login"
                onClick={handleSignIn}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-medium transition-colors"
              >
                <User className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher parmi les 30 livres..."
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
