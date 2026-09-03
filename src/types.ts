export type Condition = 
  | 'Neuf avec étiquette'
  | 'Neuf sans étiquette'
  | 'Neuf'
  | 'Très bon état'
  | 'Bon état'
  | 'État correct'
  | 'Fait main';

export type Category =
  | 'Femmes'
  | 'Hommes'
  | 'Mode & Friperie'
  | 'High-Tech'
  | 'Maison'
  | 'Beauté'
  | 'Beauté & Santé'
  | 'Enfants & Bébés'
  | 'Véhicules'
  | 'Loisirs & Sport'
  | 'Artisanat';

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
  price: number; // in FCFA
  originalPrice?: number;
  images: string[];
  category: Category;
  brand?: string;
  condition: Condition;
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

export type TabType = 'accueil' | 'recherche' | 'vendre' | 'messages' | 'profil';

export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'recent' | 'price_asc' | 'price_desc' | 'popular';
}
