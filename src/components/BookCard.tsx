import React from 'react';
import { Book } from '../types.ts';
import { Star, ShoppingCart, Eye, Check, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  isAddedRecently?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelectBook,
  onAddToCart,
  isAddedRecently = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      id={`book-card-${book.id}`}
      className="group flex flex-col bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:border-amber-500/80 hover:shadow-xl hover:shadow-stone-300/40 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Cover Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF6EE] cursor-pointer flex items-center justify-center"
        onClick={() => onSelectBook(book)}
      >
        {!imageError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Classic Literary Édition Cover Fallback */
          <div className="w-full h-full p-4 flex flex-col justify-between bg-[#F7F3E9] border-4 border-[#E6DFC8] text-stone-800 select-none">
            <div className="text-center pt-2">
              <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block">
                Édition Classique
              </span>
              <div className="w-8 h-0.5 bg-amber-800/40 mx-auto mt-1" />
            </div>
            <div className="text-center space-y-1.5 px-2">
              <p className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                {book.author}
              </p>
              <h4 className="font-serif font-bold text-base leading-tight text-stone-900">
                {book.title}
              </h4>
            </div>
            <div className="text-center pb-2 flex items-center justify-center gap-1.5 text-stone-500 text-[10px]">
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-serif italic">L’Atelier des Pages</span>
            </div>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-white/95 text-amber-900 border border-stone-200/90 shadow-xs backdrop-blur-sm">
          {book.category}
        </span>

        {/* Year badge */}
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[11px] font-mono text-stone-700 font-medium rounded-md bg-white/95 border border-stone-200/80 shadow-xs backdrop-blur-sm">
          {book.publishedYear}
        </span>

        {/* Quick view button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectBook(book);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/95 text-stone-800 hover:bg-amber-700 hover:text-white shadow-md border border-stone-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Aperçu rapide"
          aria-label={`Voir les détails de ${book.title}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Book details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-amber-700 text-xs mb-1 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold text-stone-800">{book.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[11px]">• {book.pages} pages</span>
          </div>

          <h3
            onClick={() => onSelectBook(book)}
            className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-1 hover:text-amber-800 cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="text-xs text-amber-800 font-medium line-clamp-1 mt-0.5">
            {book.author}
          </p>

          <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Footer with Price and Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-500 block leading-none font-medium">Prix TTC</span>
            <span className="text-lg font-bold text-stone-900 font-mono">
              {book.price.toFixed(2).replace('.', ',')} €
            </span>
          </div>

          <button
            id={`btn-add-cart-${book.id}`}
            onClick={() => onAddToCart(book)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isAddedRecently
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-amber-700 text-stone-800 hover:text-white border border-stone-200 hover:border-amber-700'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
