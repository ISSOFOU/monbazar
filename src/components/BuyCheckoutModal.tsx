import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, Phone, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface BuyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccessPurchase: (product: Product, paymentDetails: any) => void;
}

export const BuyCheckoutModal: React.FC<BuyCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccessPurchase,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'moov' | 'wave' | 'celtiis' | 'cash'>('momo');
  const [phoneNumber, setPhoneNumber] = useState('97 00 11 22');
  const [deliveryAddress, setDeliveryAddress] = useState('Cotonou, Fidjrossè');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deliveryFee = 1000;
  const buyerProtectionFee = 500;
  const totalAmount = product.price + deliveryFee + buyerProtectionFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccessPurchase(product, {
          paymentMethod,
          phoneNumber,
          totalAmount,
        });
      }, 1500);
    }, 1800);
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

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {isSuccess ? (
              <div className="py-8 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Paiement sécurisé effectué !
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Vos fonds sont sécurisés par Mon Bazar et seront débloqués au vendeur dès confirmation de votre réception.
                </p>
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>SMS de confirmation envoyé au +229 {phoneNumber}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">Acheter cet article</h3>
                    <p className="text-xs text-slate-500">Paiement sécurisé garanti</p>
                  </div>
                  <button
                    id="btn-close-checkout-modal"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Summary */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{product.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{product.location}</p>
                    <p className="text-base font-extrabold text-[#f95738] mt-0.5">
                      {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePay} className="mt-5 space-y-4">
                  {/* Select Payment Operator */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Moyen de paiement sécurisé
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {/* MTN MoMo */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          paymentMethod === 'momo'
                            ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#ffcc00] text-black font-extrabold text-[10px] flex items-center justify-center flex-shrink-0">
                          MoMo
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">MTN MoMo</div>
                          <div className="text-[10px] text-slate-500">Mobile Money</div>
                        </div>
                      </button>

                      {/* Moov Money */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('moov')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          paymentMethod === 'moov'
                            ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#005ba6] text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0">
                          Moov
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Moov Money</div>
                          <div className="text-[10px] text-slate-500">Flooz</div>
                        </div>
                      </button>

                      {/* Wave */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wave')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          paymentMethod === 'wave'
                            ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#1dc3ec] text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0">
                          Wave
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Wave</div>
                          <div className="text-[10px] text-slate-500">Sans frais</div>
                        </div>
                      </button>

                      {/* Celtiis Cash */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('celtiis')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          paymentMethod === 'celtiis'
                            ? 'border-purple-500 bg-purple-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#6a1b9a] text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0">
                          Celtiis
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Celtiis Cash</div>
                          <div className="text-[10px] text-slate-500">Bénin Telecom</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Phone input for prompt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Numéro de compte ({paymentMethod.toUpperCase()})
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        +229
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="97 XX XX XX"
                      />
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Lieu de livraison / Rendez-vous
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Ex: Cotonou, Carrefour Fidjrossè"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Prix de l'article</span>
                      <span>{new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Frais de livraison locale</span>
                      <span>{new Intl.NumberFormat('fr-FR').format(deliveryFee)} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Protection acheteur Mon Bazar</span>
                      <span>{new Intl.NumberFormat('fr-FR').format(buyerProtectionFee)} FCFA</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                      <span>Total à payer</span>
                      <span className="text-[#f95738]">
                        {new Intl.NumberFormat('fr-FR').format(totalAmount)} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Trust Banner */}
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 text-blue-900 rounded-xl text-xs">
                    <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>
                      L'argent reste bloqué sur Mon Bazar jusqu'à ce que vous receviez l'article en bon état.
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      id="btn-confirm-payment"
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#f95738] hover:bg-[#e04526] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-75"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Validation Mobile Money en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Payer {new Intl.NumberFormat('fr-FR').format(totalAmount)} FCFA</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
