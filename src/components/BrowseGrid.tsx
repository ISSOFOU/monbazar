import React from 'react';
import {
  Venus,
  Mars,
  Smartphone,
  Home,
  Sparkles,
  Baby,
  Palette,
  Car,
  Dumbbell,
  LucideIcon,
} from 'lucide-react';

interface CategoryTile {
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const TILES: CategoryTile[] = [
  { name: 'Femmes', icon: Venus, color: '#E85A38', bg: '#FFF1EC' },
  { name: 'Hommes', icon: Mars, color: '#0B8457', bg: '#E9F6F0' },
  { name: 'High-Tech', icon: Smartphone, color: '#1D4ED8', bg: '#EAF0FE' },
  { name: 'Maison', icon: Home, color: '#B45309', bg: '#FEF4E6' },
  { name: 'Beauté & Santé', icon: Sparkles, color: '#BE185D', bg: '#FDF0F6' },
  { name: 'Enfants & Bébés', icon: Baby, color: '#7C3AED', bg: '#F3EEFE' },
  { name: 'Artisanat', icon: Palette, color: '#C2410C', bg: '#FEEEE6' },
  { name: 'Véhicules', icon: Car, color: '#0369A1', bg: '#E9F6FE' },
  { name: 'Loisirs & Sport', icon: Dumbbell, color: '#15803D', bg: '#EDF9EF' },
];

interface BrowseGridProps {
  onSelectCategory: (category: string) => void;
}

export const BrowseGrid: React.FC<BrowseGridProps> = ({ onSelectCategory }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700">Parcourir par catégorie</h3>
      <div className="grid grid-cols-2 gap-3">
        {TILES.map(({ name, icon: Icon, color, bg }) => (
          <button
            key={name}
            onClick={() => onSelectCategory(name)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all text-left"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <span className="text-sm font-bold text-slate-800 leading-tight">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
