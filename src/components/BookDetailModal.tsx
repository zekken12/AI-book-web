import React from 'react';
import { Book } from '../types.ts';
import { X, Star, ShoppingCart, BookOpen, Calendar, Hash, Layers, CheckCircle2 } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book, quantity: number) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setImageError(false);
  }, [book]);

  if (!book) return null;

  const handleAdd = () => {
    onAddToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors border border-stone-200 shadow-sm"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Column */}
        <div className="md:w-5/12 bg-[#FAF6EE] p-6 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-stone-200/80">
          <div className="relative aspect-[3/4] w-48 md:w-full max-w-[240px] rounded-xl overflow-hidden shadow-xl border border-stone-200 bg-white flex items-center justify-center">
            {!imageError ? (
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full p-4 flex flex-col justify-between bg-[#F7F3E9] border-4 border-[#E6DFC8] text-stone-800 select-none">
                <div className="text-center pt-2">
                  <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                    Édition Classique
                  </span>
                  <div className="w-8 h-0.5 bg-amber-800/40 mx-auto mt-1" />
                </div>
                <div className="text-center space-y-1 px-1">
                  <p className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                    {book.author}
                  </p>
                  <h4 className="font-serif font-bold text-base leading-tight text-stone-900">
                    {book.title}
                  </h4>
                </div>
                <div className="text-center pb-2 flex items-center justify-center gap-1 text-stone-500 text-[10px]">
                  <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                  <span className="font-serif italic">L’Atelier des Pages</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {book.category}
                </span>
                <div className="flex items-center gap-1 text-amber-700 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-stone-800">{book.rating.toFixed(1)} / 5</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm font-semibold text-amber-800 mt-1">
                Par {book.author}
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Présentation de l’œuvre
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-200 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Parution : <strong className="text-stone-900 font-semibold">{book.publishedYear}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Pagination : <strong className="text-stone-900 font-semibold">{book.pages} p.</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-700" />
                <span className="truncate">ISBN : <strong className="text-stone-900 font-mono text-[11px]">{book.isbn}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Disponibilité : <strong className="text-emerald-700 font-semibold">{book.stock} ex.</strong></span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block font-medium">Prix unitaire</span>
                <span className="text-2xl font-bold font-mono text-stone-900">
                  {book.price.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-sm font-bold font-mono text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              id="btn-modal-add-cart"
              onClick={handleAdd}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-900/15'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    Ajouter au panier ({(book.price * quantity).toFixed(2).replace('.', ',')} €)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
