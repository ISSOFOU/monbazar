import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { Product, TabType, Conversation, Message } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CONVERSATIONS,
  CURRENT_USER,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellModal } from './components/SellModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { BuyCheckoutModal } from './components/BuyCheckoutModal';
import { LocationModal } from './components/LocationModal';
import { SplashScreen } from './components/SplashScreen';
import { SearchView } from './components/SearchView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  // State Initialization
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('accueil');

  // Products & User data — loaded from the shared database (see netlify/functions/products.mts)
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts(INITIAL_PRODUCTS))
      .finally(() => setProductsLoading(false));
  }, []);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('mon_bazar_favorites');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('mon_bazar_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Mode & Friperie');
  const [currentLocation, setCurrentLocation] = useState('Cotonou, Fidjrossè');

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync with LocalStorage (favorites and conversations stay per-device for now)
  useEffect(() => {
    localStorage.setItem('mon_bazar_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mon_bazar_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Article retiré de vos favoris');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Article ajouté à vos favoris ❤️');
        return [...prev, id];
      }
    });
  };

  // Select product for detail view
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Publish new product from SellModal
  const handlePublishProduct = (newProdData: Partial<Product>) => {
    const payload = {
      title: newProdData.title,
      price: newProdData.price,
      images: newProdData.images,
      category: newProdData.category,
      condition: newProdData.condition,
      location: newProdData.location || currentLocation,
      city: newProdData.city,
      description: newProdData.description,
      isNegotiable: newProdData.isNegotiable ?? true,
      seller: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        initials: CURRENT_USER.initials,
        isVerified: true,
        memberSince: CURRENT_USER.memberSince,
        salesCount: CURRENT_USER.salesCount,
        rating: 5.0,
        phone: CURRENT_USER.phone,
        responseRate: '5 min',
        verifiedMobileMoney: true,
      },
    };

    fetch('/api/products', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((created: Product) => {
        setProducts((prev) => [created, ...prev]);
        showToast('🎉 Votre annonce a été publiée avec succès !');
      })
      .catch(() => showToast("Erreur : impossible de publier l'annonce"));
  };

  // Submit price offer
  const handleSubmitOffer = (amount: number, messageText: string) => {
    if (!selectedProduct) return;

    // Check if conversation already exists or create one
    const convId = `conv-${selectedProduct.id}-${Date.now()}`;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'buyer',
      text: `${messageText} (Offre proposée : ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA)`,
      timestamp: 'À l\'instant',
      isOffer: true,
      offerAmount: amount,
      offerStatus: 'pending',
    };

    const existingConvIndex = conversations.findIndex(
      (c) => c.productId === selectedProduct.id
    );

    if (existingConvIndex >= 0) {
      const updated = [...conversations];
      updated[existingConvIndex].messages.push(newMsg);
      updated[existingConvIndex].lastMessage = `Offre de ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
      updated[existingConvIndex].lastMessageTime = 'À l\'instant';
      setConversations(updated);
    } else {
      const newConv: Conversation = {
        id: convId,
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        productPrice: selectedProduct.price,
        productImage: selectedProduct.images[0],
        seller: selectedProduct.seller,
        lastMessage: `Offre envoyée : ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`,
        lastMessageTime: 'À l\'instant',
        unread: false,
        messages: [newMsg],
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    setIsDetailModalOpen(false);
    showToast(`✅ Offre de ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA transmise à ${selectedProduct.seller.name}`);
    setCurrentTab('messages');
  };

  // Checkout success
  const handleSuccessPurchase = (prod: Product, details: any) => {
    setIsCheckoutModalOpen(false);
    setIsDetailModalOpen(false);
    showToast(`🛍️ Achat de "${prod.title}" confirmé avec succès !`);

    fetch(`/api/products/${prod.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isSold: true }),
    })
      .then((res) => res.json())
      .then((updated: Product) => {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      })
      .catch(() => {});
  };

  // Start chat directly from product detail
  const handleStartChat = (prod: Product) => {
    setIsDetailModalOpen(false);
    const existing = conversations.find((c) => c.productId === prod.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv-${prod.id}-${Date.now()}`,
        productId: prod.id,
        productTitle: prod.title,
        productPrice: prod.price,
        productImage: prod.images[0],
        seller: prod.seller,
        lastMessage: `Bonjour, votre article "${prod.title}" est-il toujours disponible ?`,
        lastMessageTime: 'À l\'instant',
        unread: false,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: 'buyer',
            text: `Bonjour, votre article "${prod.title}" est-il toujours disponible ?`,
            timestamp: 'À l\'instant',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
    }
    setCurrentTab('messages');
  };

  // Send message in chat
  const handleSendMessage = (convId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: 'buyer',
            text,
            timestamp: 'À l\'instant',
          };
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'À l\'instant',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Delete user listing
  const handleDeleteUserProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Annonce supprimée');
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Toggle sold status
  const handleToggleSoldStatus = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextIsSold = !target.isSold;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isSold: nextIsSold } : p)));
    showToast('Statut mis à jour');
    fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isSold: nextIsSold }),
    }).catch(() => {});
  };

  // Filtered products for Accueil
  const homeProducts = products.filter((p) => {
    const matchQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCat =
      selectedCategory === 'Tous' ||
      p.category === selectedCategory ||
      (selectedCategory === 'Beauté' && p.category === 'Beauté & Santé');

    const matchLoc =
      currentLocation === 'Tout le Bénin' ||
      p.location.toLowerCase().includes(currentLocation.toLowerCase()) ||
      p.city.toLowerCase().includes(currentLocation.toLowerCase());

    return matchQuery && matchCat && matchLoc;
  });

  const userListings = products.filter((p) => p.seller.id === CURRENT_USER.id);
  const favoriteProductsList = products.filter((p) => favorites.includes(p.id));
  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-start antialiased">
      {/* Splash Screen matching Image 1, 5, 7 */}
      <AnimatePresence>
        {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white sm:my-4 sm:rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[90vh]">
        {/* Global Navbar */}
        {currentTab === 'accueil' && (
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            currentLocation={currentLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            favoritesCount={favorites.length}
            onOpenFavorites={() => setCurrentTab('profil')}
            onOpenProfile={() => setCurrentTab('profil')}
            onOpenSplash={() => setShowSplash(true)}
            userAvatar={CURRENT_USER.avatar}
          />
        )}

        {/* Dynamic Views Rendering */}
        <main className="w-full">
          {/* TAB 1: ACCUEIL (Matching Image 4, 8, 9) */}
          {currentTab === 'accueil' && (
            <div className="p-3.5 sm:p-5 pb-24 space-y-4">
              {/* Promotional Hero Banner for Mobile Money & Local Marketplace */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#167d4f] to-[#0d5937] text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1 z-10 max-w-[70%]">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    Paiement Sécurisé MoMo
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold font-display leading-snug">
                    Achetez & vendez en toute confiance à {currentLocation.split(',')[0]}
                  </h2>
                  <p className="text-[11px] text-emerald-100/90 leading-tight">
                    Fonds bloqués jusqu'à la remise en main propre.
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl sm:text-4xl">🛍️</span>
                </div>
              </div>

              {/* Products Grid: 2 Columns exactly as shown in screenshot */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-display">
                      {selectedCategory === 'Tous' ? 'Dernières annonces' : selectedCategory}
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">
                      ({homeProducts.length})
                    </span>
                  </div>
                  {selectedCategory !== 'Tous' && (
                    <button
                      onClick={() => setSelectedCategory('Tous')}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
                    >
                      Voir tout
                    </button>
                  )}
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="rounded-2xl bg-slate-100 animate-pulse aspect-[3/4]" />
                    ))}
                  </div>
                ) : homeProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {homeProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleSelectProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
                    <p className="text-sm font-bold text-slate-700">Aucun article trouvé dans cette catégorie</p>
                    <p className="text-xs text-slate-400 mt-1">Soyez le premier à déposer une annonce !</p>
                    <button
                      onClick={() => setIsSellModalOpen(true)}
                      className="mt-3 px-4 py-2 bg-[#f95738] text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Déposer une annonce
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RECHERCHE */}
          {currentTab === 'recherche' && (
            <SearchView
              products={products}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {/* TAB 3: MESSAGES */}
          {currentTab === 'messages' && (
            <MessagesView
              conversations={conversations}
              onSendMessage={handleSendMessage}
              onOpenCheckoutFromChat={(prodInfo) => {
                setCheckoutProduct(prodInfo as any);
                setIsCheckoutModalOpen(true);
              }}
              onSelectProductById={(prodId) => {
                const prod = products.find((p) => p.id === prodId);
                if (prod) handleSelectProduct(prod);
              }}
            />
          )}

          {/* TAB 4: PROFIL */}
          {currentTab === 'profil' && (
            <ProfileView
              userProducts={userListings}
              favoriteProducts={favoriteProductsList}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectProduct={handleSelectProduct}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onDeleteUserProduct={handleDeleteUserProduct}
              onToggleSoldStatus={handleToggleSoldStatus}
            />
          )}
        </main>

        {/* Global Bottom Tab Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenSellModal={() => setIsSellModalOpen(true)}
          unreadMessagesCount={unreadCount}
        />
      </div>

      {/* Global Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          showToast(`Zone modifiée : ${loc}`);
        }}
      />

      {/* Product Detail Modal (Matching Image 2, 6, 10) */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenMakeOffer={(prod) => {
          setSelectedProduct(prod);
          setIsOfferModalOpen(true);
        }}
        onOpenBuyCheckout={(prod) => {
          setCheckoutProduct(prod);
          setIsCheckoutModalOpen(true);
        }}
        onStartChat={handleStartChat}
      />

      {/* Make Offer Modal */}
      {selectedProduct && (
        <MakeOfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          product={selectedProduct}
          onSubmitOffer={handleSubmitOffer}
        />
      )}

      {/* Buy & Checkout Modal */}
      {checkoutProduct && (
        <BuyCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          product={checkoutProduct}
          onSuccessPurchase={handleSuccessPurchase}
        />
      )}

      {/* Sell Modal (Matching Image 3) */}
      <SellModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onPublishProduct={handlePublishProduct}
      />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 z-50 bg-slate-900 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 max-w-sm text-center"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
