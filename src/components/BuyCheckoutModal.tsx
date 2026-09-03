import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, ArrowRight, Lock, Bike, Handshake, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface BuyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  authToken: string;
}

export const BuyCheckoutModal: React.FC<BuyCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  authToken,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'moov' | 'wave' | 'celtiis' | 'cash'>('momo');
  const [deliveryMethod, setDeliveryMethod] = useState<'zem' | 'pickup'>('zem');
  const [phoneNumber, setPhoneNumber] = useState('97 00 11 22');
  const [deliveryAddress, setDeliveryAddress] = useState('Cotonou, Fidjrossè');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = deliveryMethod === 'zem' ? 1000 : 0;
  const buyerProtectionFee = 500;
  const totalAmount = product.price + deliveryFee + buyerProtectionFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          productId: product.id,
          deliveryMethod,
          deliveryAddress: `+229 ${phoneNumber} · ${deliveryAddress}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Paiement impossible pour le moment.');
        setIsProcessing(false);
        return;
      }
      // Redirect to Fedapay's secure hosted checkout page.
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Erreur réseau, réessaie.');
      setIsProcessing(false);
    }
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
            {isProcessing ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="text-base font-bold text-slate-900">Redirection vers le paiement sécurisé...</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Tu vas être redirigé vers la page Fedapay pour payer avec {paymentMethod === 'momo' ? 'MTN MoMo' : paymentMethod === 'moov' ? 'Moov Money' : paymentMethod === 'wave' ? 'Wave' : 'Celtiis Cash'}.
                </p>
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
                    <p className="text-base font-extrabold text-[#FF6B47] mt-0.5">
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

                  {/* Delivery Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mode de remise
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('zem')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          deliveryMethod === 'zem'
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Livraison Zémidjan</div>
                          <div className="text-[10px] text-slate-500">~1 000 FCFA</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          deliveryMethod === 'pickup'
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Handshake className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Main propre</div>
                          <div className="text-[10px] text-slate-500">Gratuit</div>
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
                      {deliveryMethod === 'zem' ? 'Adresse de livraison (zémidjan)' : 'Lieu de rendez-vous'}
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Ex: Cotonou, Carrefour Fidjrossè"
                    />
                    {deliveryMethod === 'zem' && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Un zémidjan partenaire récupère l'article chez le vendeur et te le livre à cette adresse.
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Prix de l'article</span>
                      <span>{new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{deliveryMethod === 'zem' ? 'Course zémidjan' : 'Remise en main propre'}</span>
                      <span>{deliveryFee > 0 ? `${new Intl.NumberFormat('fr-FR').format(deliveryFee)} FCFA` : 'Gratuit'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Protection acheteur Mon Bazar</span>
                      <span>{new Intl.NumberFormat('fr-FR').format(buyerProtectionFee)} FCFA</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                      <span>Total à payer</span>
                      <span className="text-[#FF6B47]">
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

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      id="btn-confirm-payment"
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#FF6B47] hover:bg-[#E85A38] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-75"
                    >
                      <span>Payer {new Intl.NumberFormat('fr-FR').format(totalAmount)} FCFA</span>
                      <ArrowRight className="w-4 h-4" />
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
