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
  'Mode & Friperie',
  'High-Tech',
  'Maison',
  'Beauté & Santé',
  'Enfants & Bébés',
  'Artisanat',
  'Véhicules',
  'Loisirs & Sport'
];

// No demo listings or conversations — real data comes from the shared
// database (see netlify/functions/products.mts) and from real users.
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];
