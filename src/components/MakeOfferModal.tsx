import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmitOffer: (amount: number, message: string) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState<number>(
    Math.round((product.price * 0.9) / 500) * 500
  );
  const [message, setMessage] = useState(
    `Bonjour ${product.seller.name}, je suis très intéressé par votre ${product.title}. Est-ce que ce prix vous conviendrait ?`
  );

  const quickDiscountPercentages = [5, 10, 15, 20];

  const handleApplyDiscount = (percent: number) => {
    const discounted = product.price * (1 - percent / 100);
    setOfferAmount(Math.round(discounted / 500) * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount <= 0) return;
    onSubmitOffer(offerAmount, message);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal content */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Faire une offre</h3>
                <p className="text-xs text-slate-500">Négociez le prix avec le vendeur</p>
              </div>
              <button
                id="btn-close-offer-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product summary card */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{product.title}</p>
                <p className="text-sm font-extrabold text-slate-800">
                  Prix initial : {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">
                  Vendeur : {product.seller.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Offer Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Votre proposition (en FCFA)
                </label>
                <div className="relative">
                  <input
                    id="input-offer-amount"
                    type="number"
                    step="500"
                    min="1000"
                    max={product.price * 2}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full text-2xl font-black text-slate-900 px-4 py-3 bg-slate-50 border-2 border-emerald-600/40 rounded-2xl focus:outline-hidden focus:border-emerald-600 text-center font-display"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Quick Percentage suggestions */}
              <div>
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  Suggestions rapides :
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {quickDiscountPercentages.map((percent) => {
                    const priceWithDiscount = Math.round((product.price * (1 - percent / 100)) / 500) * 500;
                    const isSelected = offerAmount === priceWithDiscount;
                    return (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => handleApplyDiscount(percent)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        -{percent}%
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message to seller */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message d'accompagnement
                </label>
                <textarea
                  id="textarea-offer-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none text-slate-700"
                  placeholder="Écrivez votre message..."
                />
              </div>

              {/* Guarantee alert */}
              <div className="flex items-start gap-2.5 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Si le vendeur accepte votre offre de{' '}
                  <span className="font-bold">
                    {new Intl.NumberFormat('fr-FR').format(offerAmount)} FCFA
                  </span>
                  , vous pourrez finaliser par Mobile Money en toute sécurité.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-submit-offer"
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer l'offre</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
