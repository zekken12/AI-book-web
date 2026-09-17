import React from 'react';
import { Truck, ShieldCheck, Sparkles, BookCheck, Database } from 'lucide-react';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6] via-[#FAF6EE] to-[#FAF8F5] text-stone-900 border-b border-stone-200/80 pt-10 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Catalogue Éditorial • Base SQL de 30 Ouvrages • Éditions Intégrales</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Les grandes œuvres littéraires, <br className="hidden sm:inline" />
              <span className="text-amber-800 italic font-serif">à portée de votre bibliothèque.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-sans leading-relaxed">
              Explorez notre collection de 30 chefs-d’œuvre incontournables de la littérature classique, 
              philosophique, d’aventure et de poésie avec leurs couvertures originales historiques. 
              Chaque titre est synchronisé en temps réel avec notre base de données relationnelle SQL.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-explore-catalog"
                onClick={onScrollToCatalog}
                className="px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-all shadow-md shadow-amber-900/15"
              >
                Découvrir les 30 livres
              </button>

              <div className="text-xs text-stone-600 flex items-center gap-2 font-medium bg-white/80 px-3 py-2 rounded-lg border border-stone-200/80">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Base SQL PostgreSQL active • 30 titres disponibles</span>
              </div>
            </div>
          </div>

          {/* Value propositions banner */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-white/95 border border-stone-200/90 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-2.5">
                <BookCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">30 Classiques Certifiés</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Textes intégraux, couvertures Creative Commons et préfaces historiques.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/95 border border-stone-200/90 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-2.5">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Livraison Offerte</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Frais d&apos;envoi offerts dès 35 € d&apos;achat partout en France.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/95 border border-stone-200/90 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Commandes SQL</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Enregistrement instantané des commandes dans la table SQL.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/95 border border-stone-200/90 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-2.5">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Cloud SQL PostgreSQL</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Catalogue dynamique avec recherche textuelle et tri multi-critères.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
