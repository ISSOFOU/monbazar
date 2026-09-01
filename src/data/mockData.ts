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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Samsung Galaxy A14, 64Go',
    price: 85000,
    originalPrice: 95000,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'High-Tech',
    condition: 'Très bon état',
    location: 'Abomey-Calavi',
    city: 'Abomey-Calavi',
    description: 'Smartphone Samsung Galaxy A14, 64 Go de stockage, 4Go de RAM. Couleur noire. Très bon état, utilisé 8 mois. Fonctionne parfaitement, batterie tient plus de 2 jours. Vendu avec boîte, câble et chargeur d\'origine. Prix négociable dans la limite du raisonnable. Remise en main propre préférée à Abomey-Calavi.',
    seller: {
      id: 'seller-1',
      name: 'Espoir A.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      initials: 'EA',
      isVerified: true,
      memberSince: '2021',
      salesCount: 32,
      rating: 4.9,
      phone: '+229 97 00 11 22',
      responseRate: '10 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 2h',
    viewsCount: 142,
    likesCount: 18,
    isNegotiable: true,
    featured: true
  },
  {
    id: 'prod-2',
    title: 'Robe wax imprimée, taille M',
    price: 7500,
    originalPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Très bon état',
    location: 'Cotonou, Fidjrossè',
    city: 'Cotonou',
    description: 'Magnifique robe en tissu wax imprimé de qualité supérieure, coupe cintrée taille M. Portée une seule fois pour une cérémonie. Coutures parfaites, tissu ne déteint pas au lavage.',
    seller: {
      id: 'seller-2',
      name: 'Amina K.',
      initials: 'AK',
      isVerified: true,
      memberSince: '2022',
      salesCount: 19,
      rating: 4.8,
      phone: '+229 96 12 34 56',
      responseRate: '15 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 4h',
    viewsCount: 89,
    likesCount: 14,
    isNegotiable: true
  },
  {
    id: 'prod-3',
    title: 'Sneakers Nike Air Force 1',
    price: 20000,
    originalPrice: 28000,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Très bon état',
    location: 'Cotonou',
    city: 'Cotonou',
    description: 'Paire de baskets Nike Air Force 1 blanches avec virgule noire et semelle gum. Pointure 42. Très propres, semelle intacte.',
    seller: {
      id: 'seller-3',
      name: 'Boris T.',
      initials: 'BT',
      isVerified: true,
      memberSince: '2023',
      salesCount: 14,
      rating: 4.7,
      phone: '+229 67 89 01 23',
      responseRate: '30 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 5h',
    viewsCount: 210,
    likesCount: 27,
    isNegotiable: false
  },
  {
    id: 'prod-4',
    title: 'Table Basse Bois massif',
    price: 12000,
    originalPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Maison',
    condition: 'Neuf sans étiquette',
    location: 'Parakou',
    city: 'Parakou',
    description: 'Belle table basse en bois naturel avec double plateau inférieur pour rangement. Fait par un artisan ébéniste local. Très solide et vernie avec soin.',
    seller: {
      id: 'seller-4',
      name: 'Moussa D.',
      initials: 'MD',
      isVerified: true,
      memberSince: '2020',
      salesCount: 45,
      rating: 5.0,
      phone: '+229 95 44 33 22',
      responseRate: '5 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Hier',
    viewsCount: 95,
    likesCount: 8,
    isNegotiable: true
  },
  {
    id: 'prod-5',
    title: 'Baskets Nike Dunk Low',
    price: 15000,
    originalPrice: 22000,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Neuf avec étiquette',
    location: 'Cotonou, Haie Vive',
    city: 'Cotonou',
    description: 'Baskets tendance bicolores beige et bleu marine. Neuves dans la boîte d\'origine, jamais portées. Pointure 41.',
    seller: {
      id: 'seller-5',
      name: 'Gérard V.',
      initials: 'GV',
      isVerified: true,
      memberSince: '2023',
      salesCount: 8,
      rating: 4.6,
      phone: '+229 90 11 22 33',
      responseRate: '1h',
      verifiedMobileMoney: true
    },
    createdAt: 'Hier',
    viewsCount: 165,
    likesCount: 22,
    isNegotiable: true
  },
  {
    id: 'prod-6',
    title: 'Appareil photo Canon Vintage',
    price: 45000,
    originalPrice: 60000,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'High-Tech',
    condition: 'Bon état',
    location: 'Calavi',
    city: 'Abomey-Calavi',
    description: 'Appareil photo argentique Canon avec objectif 50mm f/1.8. Mécanisme en parfait état de fonctionnement, idéal pour passionnés de photographie argentique.',
    seller: {
      id: 'seller-6',
      name: 'Yannick H.',
      initials: 'YH',
      isVerified: true,
      memberSince: '2021',
      salesCount: 11,
      rating: 4.9,
      phone: '+229 97 88 77 66',
      responseRate: '20 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 3 jours',
    viewsCount: 310,
    likesCount: 39,
    isNegotiable: true
  },
  {
    id: 'prod-7',
    title: 'Panier artisanal tressé',
    price: 10000,
    originalPrice: 15000,
    images: [
      'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Artisanat',
    condition: 'Fait main',
    location: 'Cotonou, Ganhi',
    city: 'Cotonou',
    description: 'Grand panier tressé à la main en fibres végétales locales avec anses renforcées. Parfait pour rangement salon, linge ou décoration bohème africaine.',
    seller: {
      id: 'seller-7',
      name: 'Fidèle O.',
      initials: 'FO',
      isVerified: true,
      memberSince: '2022',
      salesCount: 52,
      rating: 5.0,
      phone: '+229 66 11 99 00',
      responseRate: '5 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 3 jours',
    viewsCount: 78,
    likesCount: 11,
    isNegotiable: false
  },
  {
    id: 'prod-8',
    title: 'Chemise à motifs wax homme',
    price: 7500,
    originalPrice: 10000,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Très bon état',
    location: 'Porto-Novo',
    city: 'Porto-Novo',
    description: 'Chemise homme manche longue motif géométrique marron et crème. Coton pur et très confortable, taille L.',
    seller: {
      id: 'seller-8',
      name: 'Patrice S.',
      initials: 'PS',
      isVerified: true,
      memberSince: '2023',
      salesCount: 7,
      rating: 4.5,
      phone: '+229 97 12 34 89',
      responseRate: '45 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 4 jours',
    viewsCount: 92,
    likesCount: 9,
    isNegotiable: true
  },
  {
    id: 'prod-9',
    title: 'iPhone XR 64Go Blanc',
    price: 85000,
    originalPrice: 100000,
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'High-Tech',
    condition: 'Bon état',
    location: 'Porto-Novo',
    city: 'Porto-Novo',
    description: 'Apple iPhone XR 64Go couleur blanche. Face ID fonctionnel, batterie 84%, débloqué tout opérateur. Fourni avec coque antichoc et verre trempé.',
    seller: {
      id: 'seller-9',
      name: 'Junior M.',
      initials: 'JM',
      isVerified: true,
      memberSince: '2022',
      salesCount: 23,
      rating: 4.8,
      phone: '+229 94 00 22 11',
      responseRate: '15 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 5 jours',
    viewsCount: 420,
    likesCount: 45,
    isNegotiable: true
  },
  {
    id: 'prod-10',
    title: 'Sac à main cuir, marron',
    price: 12000,
    originalPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Très bon état',
    location: 'Porto-Novo',
    city: 'Porto-Novo',
    description: 'Élégant sac à main en cuir marron vintage, multiples compartiments intérieurs zippés, bandoulière réglable.',
    seller: {
      id: 'seller-10',
      name: 'Christelle B.',
      initials: 'CB',
      isVerified: true,
      memberSince: '2023',
      salesCount: 16,
      rating: 4.9,
      phone: '+229 96 55 44 33',
      responseRate: '10 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 6 jours',
    viewsCount: 118,
    likesCount: 15,
    isNegotiable: true
  },
  {
    id: 'prod-11',
    title: 'Baskets homme sport pointure 42',
    price: 4000,
    originalPrice: 7000,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Neuf',
    location: 'Cotonou',
    city: 'Cotonou',
    description: 'Baskets de sport légères pour running et marche quotidienne. Semelle amortissante ultra souple.',
    seller: {
      id: 'seller-3',
      name: 'Boris T.',
      initials: 'BT',
      isVerified: true,
      memberSince: '2023',
      salesCount: 14,
      rating: 4.7,
      phone: '+229 67 89 01 23',
      responseRate: '30 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 1 semaine',
    viewsCount: 88,
    likesCount: 7,
    isNegotiable: false
  },
  {
    id: 'prod-12',
    title: 'Robe Fleurie Vintage',
    price: 5000,
    originalPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Mode & Friperie',
    condition: 'Très bon état',
    location: 'Cotonou',
    city: 'Cotonou',
    description: 'Petite robe légère d\'été à motifs fleuris vintage. Manches courtes, tombé fluide. Taille S/M.',
    seller: {
      id: 'seller-2',
      name: 'Amina K.',
      initials: 'AK',
      isVerified: true,
      memberSince: '2022',
      salesCount: 19,
      rating: 4.8,
      phone: '+229 96 12 34 56',
      responseRate: '15 min',
      verifiedMobileMoney: true
    },
    createdAt: 'Il y a 1 semaine',
    viewsCount: 145,
    likesCount: 20,
    isNegotiable: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    productId: 'prod-1',
    productTitle: 'Samsung Galaxy A14, 64Go',
    productPrice: 85000,
    productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    seller: {
      id: 'seller-1',
      name: 'Espoir A.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      initials: 'EA',
      isVerified: true,
      memberSince: '2021',
      salesCount: 32,
      rating: 4.9,
      phone: '+229 97 00 11 22',
      responseRate: '10 min',
      verifiedMobileMoney: true
    },
    lastMessage: 'Bonjour ! Oui le Samsung A14 est toujours disponible. Vous êtes dans quel quartier ?',
    lastMessageTime: '14:20',
    unread: true,
    messages: [
      {
        id: 'msg-1',
        senderId: 'buyer',
        text: 'Bonjour Espoir, votre Samsung A14 est toujours disponible ?',
        timestamp: '14:15'
      },
      {
        id: 'msg-2',
        senderId: 'seller-1',
        text: 'Bonjour ! Oui le Samsung A14 est toujours disponible. Vous êtes dans quel quartier ?',
        timestamp: '14:20'
      }
    ]
  },
  {
    id: 'conv-2',
    productId: 'prod-2',
    productTitle: 'Robe wax imprimée, taille M',
    productPrice: 7500,
    productImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    seller: {
      id: 'seller-2',
      name: 'Amina K.',
      initials: 'AK',
      isVerified: true,
      memberSince: '2022',
      salesCount: 19,
      rating: 4.8,
      phone: '+229 96 12 34 56',
      responseRate: '15 min',
      verifiedMobileMoney: true
    },
    lastMessage: 'D\'accord pour 7 000 FCFA avec remise en main propre à Fidjrossè plage !',
    lastMessageTime: 'Hier',
    unread: false,
    messages: [
      {
        id: 'msg-201',
        senderId: 'buyer',
        text: 'Bonjour Amina, acceptez-vous une offre à 6 500 FCFA ?',
        timestamp: 'Hier 11:30'
      },
      {
        id: 'msg-202',
        senderId: 'seller-2',
        text: 'D\'accord pour 7 000 FCFA avec remise en main propre à Fidjrossè plage !',
        timestamp: 'Hier 11:45',
        isOffer: true,
        offerAmount: 7000,
        offerStatus: 'accepted'
      }
    ]
  }
];

export const CURRENT_USER = {
  id: 'user-me',
  name: 'Dine L.',
  email: 'dinelemblematique@gmail.com',
  initials: 'DL',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  memberSince: '2023',
  walletBalance: 125000, // in FCFA
  phone: '+229 97 12 34 56',
  location: 'Cotonou, Fidjrossè',
  salesCount: 5,
  purchasesCount: 12,
  isVerified: true,
  verifiedMobileMoney: true
};
