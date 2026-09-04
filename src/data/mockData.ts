import { Product, Conversation } from '../types';

export const BENIN_LOCATIONS = [
  'Tout le Bénin',
  'Cotonou, Fidjrossè',
  'Cotonou, Haie Vive',
  'Cotonou, Ganhi',
  'Cotonou, Akpakpa',
  'Cotonou, Cadjehoun',
  'Cotonou, Agla',
  'Cotonou, Menontin',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
  'Ouidah',
  'Bohicon',
];

export const CATEGORIES_LIST = [
  'Tous',
  'Femmes',
  'Hommes',
  'High-Tech',
  'Maison',
  'Beauté & Santé',
  'Enfants & Bébés',
  'Artisanat',
  'Véhicules',
  'Loisirs & Sport',
];

// Same palette used by BrowseGrid — reused wherever category chips/pills are rendered.
export const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Tous: { color: '#334155', bg: '#F1F5F9' },
  Femmes: { color: '#E85A38', bg: '#FFF1EC' },
  Hommes: { color: '#0B8457', bg: '#E9F6F0' },
  'High-Tech': { color: '#1D4ED8', bg: '#EAF0FE' },
  Maison: { color: '#B45309', bg: '#FEF4E6' },
  'Beauté & Santé': { color: '#BE185D', bg: '#FDF0F6' },
  'Enfants & Bébés': { color: '#7C3AED', bg: '#F3EEFE' },
  Artisanat: { color: '#C2410C', bg: '#FEEEE6' },
  Véhicules: { color: '#0369A1', bg: '#E9F6FE' },
  'Loisirs & Sport': { color: '#15803D', bg: '#EDF9EF' },
};

// No demo listings or conversations — real data comes from the shared
// database (see netlify/functions/products.mts) and from real users.
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];
