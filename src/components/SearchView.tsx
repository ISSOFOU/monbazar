import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, X, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { Product, Condition, Category } from '../types';
import { BENIN_LOCATIONS, CATEGORIES_LIST } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { BrowseGrid } from './BrowseGrid';

interface SearchViewProps {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  favorites,
  onToggleFavorite,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedLocation, setSelectedLocation] = useState<string>('Tout le Bénin');
  const [selectedCondition, setSelectedCondition] = useState<string>('Tous');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter((p) => {
    // Search query match
    const matchQuery =
      query.trim() === '' ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      (p.brand ?? '').toLowerCase().includes(query.toLowerCase());

    // Category match
    const matchCat =
      selectedCategory === 'Tous' ||
      p.category === selectedCategory ||
      (selectedCategory === 'Beauté' && p.category === 'Beauté & Santé');

    // Location match
    const matchLoc =
      selectedLocation === 'Tout le Bénin' ||
      p.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      p.city.toLowerCase().includes(selectedLocation.toLowerCase());

    // Condition match
    const matchCond = selectedCondition === 'Tous' || p.condition === selectedCondition;

    // Price match
    const matchPrice = p.price <= maxPrice;

    return matchQuery && matchCat && matchLoc && matchCond && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'popular') {
      const scoreA = (a.viewsCount ?? 0) + (a.likesCount ?? 0) * 3;
      const scoreB = (b.viewsCount ?? 0) + (b.likesCount ?? 0) * 3;
      return scoreB - scoreA;
    }
    return 0; // default recent
  });

  const isBrowsing = query.trim() === '' && selectedCategory === 'Tous';

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-24">
      {/* Search Header */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2">
          {!isBrowsing && (
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setQuery('');
              }}
              className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shrink-0"
              aria-label="Retour aux catégories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-view"
              type="text"
              placeholder="Rechercher par mot-clé (ex: Samsung, Robe, Nike...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-1.5 font-bold text-xs ${
              showFilters
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {!isBrowsing && showFilters && (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Localisation</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {BENIN_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">État</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="Tous">Tous</option>
                  <option value="Neuf avec étiquette">Neuf avec étiquette</option>
                  <option value="Très bon état">Très bon état</option>
                  <option value="Bon état">Bon état</option>
                  <option value="État correct">État correct</option>
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Popularité</option>
                  <option value="price_asc">Prix croissant (FCFA)</option>
                  <option value="price_desc">Prix décroissant (FCFA)</option>
                </select>
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Prix max : {new Intl.NumberFormat('fr-FR').format(maxPrice)} FCFA</span>
                <span className="text-slate-400">100 000 FCFA</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Results Counter and active tags */}
        {!isBrowsing && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-semibold">
              {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </span>
            {(selectedCategory !== 'Tous' || selectedLocation !== 'Tout le Bénin' || selectedCondition !== 'Tous' || query) && (
              <button
                onClick={() => {
                  setSelectedCategory('Tous');
                  setSelectedLocation('Tout le Bénin');
                  setSelectedCondition('Tous');
                  setMaxPrice(100000);
                  setQuery('');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {isBrowsing ? (
        <BrowseGrid onSelectCategory={setSelectedCategory} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Aucun article ne correspond à votre recherche</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Essayez de modifier vos filtres de localisation ou d'élargir votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};
