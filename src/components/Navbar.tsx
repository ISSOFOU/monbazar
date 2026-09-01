import React from 'react';
import { Search, MapPin, Heart, ChevronDown, Bell, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { CATEGORIES_LIST } from '../data/mockData';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  currentLocation: string;
  onOpenLocationModal: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  onOpenSplash: () => void;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  currentLocation,
  onOpenLocationModal,
  favoritesCount,
  onOpenFavorites,
  onOpenProfile,
  onOpenSplash,
  userAvatar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2.5">
        {/* Top bar row: Logo + Action icons */}
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={onOpenSplash} title="Voir l'écran de démarrage">
            <Logo size="md" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Splash screen view badge / icon */}
            <button
              onClick={onOpenSplash}
              className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors"
              title="Revoir le Splash Screen"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Splash</span>
            </button>

            {/* Favorites Icon Button with badge */}
            <button
              id="btn-nav-favorites"
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Mes favoris"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              id="btn-nav-profile"
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 hover:scale-105 transition-transform"
              aria-label="Mon profil"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Profil"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  DL
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Search bar row matching screenshot */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-main-search"
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Location selector dropdown matching screenshot "📍 Cotonou, Fidjrossè ▾" */}
        <div className="flex items-center justify-between text-xs">
          <button
            id="btn-location-selector"
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-emerald-700 transition-colors py-0.5"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLocation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <span className="text-[11px] text-slate-400 font-medium">
            Bénin · FCFA
          </span>
        </div>

        {/* Horizontal Category Pill Tabs matching screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 no-scrollbar">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
