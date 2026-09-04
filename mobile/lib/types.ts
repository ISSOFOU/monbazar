export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isVerified: boolean;
  memberSince: string;
  salesCount: number;
  rating: number;
  phone?: string;
  responseRate?: string;
  verifiedMobileMoney: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  condition: string;
  location: string;
  city: string;
  description: string;
  seller: Seller;
  createdAt: string;
  viewsCount?: number;
  likesCount?: number;
  isNegotiable?: boolean;
  featured?: boolean;
  isSold?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  buyerId: string;
  sellerId: string;
  buyer: Seller;
  seller: Seller;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

export interface CurrentUser {
  id: string;
  phone: string;
  name: string;
  avatar: string | null;
  city: string | null;
  bio: string | null;
  verifiedMobileMoney: boolean;
  memberSince: string;
  salesCount: number;
  purchasesCount: number;
}

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
