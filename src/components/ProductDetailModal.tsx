import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenMakeOffer: (product: Product) => void;
  onOpenBuyCheckout: (product: Product) => void;
  onStartChat: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenMakeOffer,
  onOpenBuyCheckout,
  onStartChat,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);
  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
  ];

  const shareText = `Regarde cette annonce sur Mon Bazar Bénin : ${product.title} à ${formattedPrice} FCFA (${product.location || product.city})`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    const shareData = {
      title: `${product.title} - Mon Bazar Bénin`,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (e) {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText}\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="product-detail-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex justify-center overflow-y-auto"
        >
          {/* Main Content Container (Mobile-first app screen or centered sheet) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:my-6 sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
          >
            {/* Top Navigation Floating Overlay Bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/40 via-black/20 to-transparent">
              <button
                id="btn-detail-back"
                onClick={onClose}
                aria-label="Retour"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="btn-detail-share"
                  onClick={handleShare}
                  aria-label="Partager l'annonce"
                  title="Partager l'annonce"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-emerald-700 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  id="btn-detail-fav"
                  onClick={(e) => onToggleFavorite(product.id, e)}
                  aria-label="Favori"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-700 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Toast notification feedback */}
            <AnimatePresence>
              {copiedToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-full shadow-xl flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lien de l'annonce copié dans le presse-papier !</span>
                </motion.div>
              )}

              {shareSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-emerald-800 text-white text-xs font-bold py-2 px-4 rounded-full shadow-xl flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Annonce partagée avec succès !</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Images Carousel */}
            <div className="relative w-full aspect-4/3 sm:aspect-square bg-slate-100 select-none overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Image précédente"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-800 shadow-sm hover:scale-105 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Image suivante"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-800 shadow-sm hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Carousel Indicator Dots */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`transition-all duration-300 rounded-full ${
                          currentImageIndex === idx
                            ? 'w-5 h-1.5 bg-emerald-700'
                            : 'w-1.5 h-1.5 bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col gap-5 pb-28">
              {/* Title & Price Header */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display leading-tight mb-2">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-display flex items-baseline gap-2 mb-3">
                  <span>{formattedPrice}</span>
                  <span className="text-sm sm:text-base font-bold text-slate-600">FCFA</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through font-normal">
                      {new Intl.NumberFormat('fr-FR').format(product.originalPrice)} FCFA
                    </span>
                  )}
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                    ★ {product.condition}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {product.location || product.city}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full text-xs">
                    <Clock className="w-3 h-3" />
                    {product.createdAt}
                  </span>
                </div>
              </div>

              {/* Explicit Share Section Bar */}
              <div className="p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Partager cette annonce</p>
                    <p className="text-[11px] text-slate-500">Envoyer à un ami ou sur les réseaux</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-share-native"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Partager</span>
                  </button>

                  <button
                    id="btn-share-whatsapp"
                    onClick={handleWhatsAppShare}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors cursor-pointer"
                    title="Partager sur WhatsApp"
                    aria-label="Partager sur WhatsApp"
                  >
                    <span className="text-xs font-bold">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar / Initials badge */}
                  {product.seller.avatar ? (
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                      {product.seller.initials || 'EA'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{product.seller.name}</span>
                      {product.seller.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Membre depuis {product.seller.memberSince} · {product.seller.salesCount} ventes
                    </p>
                  </div>
                </div>

                <button
                  id="btn-chat-seller-direct"
                  onClick={() => onStartChat(product)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  title="Envoyer un message"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Trust & Mobile Money Banner */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Vendeur vérifié Mobile Money
                  </h4>
                  <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">
                    Paiement sécurisé par MTN MoMo, Moov Money ou Wave. L'argent n'est débloqué qu'à la réception de l'article.
                  </p>
                </div>
              </div>

              {/* Description Section */}
              <div className="pt-2">
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Sticky Bottom Action Buttons */}
            <div className="fixed sm:absolute bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center gap-3 z-30 shadow-lg">
              {/* Faire une offre */}
              <button
                id="btn-action-make-offer"
                onClick={() => onOpenMakeOffer(product)}
                className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-600 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs cursor-pointer"
              >
                <span>Faire une offre</span>
              </button>

              {/* Acheter */}
              <button
                id="btn-action-buy-now"
                onClick={() => onOpenBuyCheckout(product)}
                className="flex-1 py-3.5 px-4 bg-[#FF6B47] hover:bg-[#E85A38] text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
              >
                <span>Acheter</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
