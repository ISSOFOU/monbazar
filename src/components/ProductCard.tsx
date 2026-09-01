import React from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { Product, Condition } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  // Format price e.g. 85000 -> 85 000 FCFA
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);

  // Condition Badge Color Styling
  const getConditionStyle = (cond: Condition) => {
    switch (cond) {
      case 'Neuf avec étiquette':
        return 'bg-purple-600 text-white';
      case 'Neuf sans étiquette':
        return 'bg-indigo-600 text-white';
      case 'Neuf':
        return 'bg-slate-800 text-white';
      case 'Très bon état':
        return 'bg-emerald-600 text-white';
      case 'Bon état':
        return 'bg-slate-700 text-white';
      case 'Fait main':
        return 'bg-amber-700 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onClick(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          id={`btn-fav-${product.id}`}
          onClick={(e) => onToggleFavorite(product.id, e)}
          aria-label="Ajouter aux favoris"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 shadow-sm hover:scale-110 active:scale-90 transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'
            }`}
          />
        </button>

        {/* Condition Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide shadow-xs ${getConditionStyle(
              product.condition
            )}`}
          >
            {product.condition}
          </span>
        </div>

        {/* Sold overlay if sold */}
        {product.isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
              Vendu
            </span>
          </div>
        )}
      </div>

      {/* Card Content info */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
              {formattedPrice} <span className="text-xs sm:text-sm font-semibold text-slate-600">FCFA</span>
            </div>
            {product.isNegotiable && (
              <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                Négo
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-slate-700 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Location */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1 truncate text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{product.location || product.city}</span>
          </div>
          {product.seller.verifiedMobileMoney && (
            <span title="Mobile Money vérifié" className="text-emerald-600">
              <Sparkles className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
