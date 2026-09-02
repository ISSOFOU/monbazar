import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  Heart,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  MapPin,
  Phone,
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import type { CurrentUser } from '../App';

interface ProfileViewProps {
  currentUser: CurrentUser;
  userProducts: Product[];
  favoriteProducts: Product[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  onOpenSellModal: () => void;
  onDeleteUserProduct: (id: string) => void;
  onToggleSoldStatus: (id: string) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userProducts,
  favoriteProducts,
  favorites,
  onToggleFavorite,
  onSelectProduct,
  onOpenSellModal,
  onDeleteUserProduct,
  onToggleSoldStatus,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'wallet' | 'settings'>('listings');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('10000');

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || Number(topupAmount) <= 0) return;
    setWalletBalance((prev) => prev + Number(topupAmount));
    setShowTopupModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="relative">
          <img
            src={currentUser.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}&backgroundColor=0B8457`}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold text-slate-900 font-display">
              {currentUser.name}
            </h1>
            {currentUser.verifiedMobileMoney ? (
              <span className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Compte vérifié Mobile Money
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
                Mobile Money non lié
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.city || 'Bénin'}
            </span>
            <span>·</span>
            <span>Membre depuis {currentUser.memberSince}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.phone}
            </span>
          </div>

          {/* User Stats Badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 max-w-sm mx-auto sm:mx-0">
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-base font-extrabold text-slate-900 font-display">
                {userProducts.length}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Annonces</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-base font-extrabold text-slate-900 font-display">
                {currentUser.salesCount}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Ventes</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-base font-extrabold text-slate-900 font-display">
                {currentUser.purchasesCount}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Achats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Mes Annonces ({userProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Mes Favoris ({favoriteProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Portefeuille MoMo</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </button>
      </div>

      {/* Tab 1: Mes Annonces */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Mes articles en vente</h3>
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B47] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#E85A38] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un article</span>
            </button>
          </div>

          {userProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-3 justify-between shadow-2xs"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{p.title}</h4>
                    <p className="text-xs font-extrabold text-[#FF6B47]">
                      {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                    </p>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 ${
                        p.isSold ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.isSold ? 'Vendu' : 'En ligne'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => onToggleSoldStatus(p.id)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200"
                    >
                      {p.isSold ? 'Remettre' : 'Vendu'}
                    </button>
                    <button
                      onClick={() => onDeleteUserProduct(p.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg self-center"
                      title="Supprimer l'annonce"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Vous n'avez pas encore d'annonces</p>
              <p className="text-xs text-slate-400 mt-1">Vendez des vêtements, téléphones, meubles facilement !</p>
              <button
                onClick={onOpenSellModal}
                className="mt-4 px-4 py-2 bg-[#FF6B47] text-white rounded-xl text-xs font-bold"
              >
                Vendre mon premier article
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Mes Favoris */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">Articles enregistrés</h3>
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favoriteProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Aucun coup de cœur pour le moment</p>
              <p className="text-xs text-slate-400 mt-1">Cliquez sur le cœur d'une annonce pour la retrouver ici.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Portefeuille Mobile Money */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Solde Garanti Mon Bazar
                </span>
              </div>
              <span className="text-xs bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                MTN / Moov / Wave
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black font-display mb-1">
              {new Intl.NumberFormat('fr-FR').format(walletBalance)}{' '}
              <span className="text-lg font-bold text-emerald-200">FCFA</span>
            </div>
            <p className="text-xs text-emerald-100/80 mb-6">
              Fonds disponibles pour achat ou virement instantané sur votre Mobile Money.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTopupModal(true)}
                className="flex-1 py-3 px-4 bg-white text-emerald-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 shadow-md"
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
                <span>Recharger solde</span>
              </button>

              <button
                onClick={() => alert('Virement instantané initié vers votre compte MTN MoMo (+229 97 12 34 56) !')}
                className="flex-1 py-3 px-4 bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-400/30 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Retirer vers MoMo</span>
              </button>
            </div>
          </div>

          {/* Quick Topup Modal */}
          {showTopupModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recharger mon solde</h3>
                  <button onClick={() => setShowTopupModal(false)} className="text-slate-400">✕</button>
                </div>
                <form onSubmit={handleTopup} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">Montant (FCFA)</label>
                    <input
                      type="number"
                      step="1000"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                  >
                    Valider le rechargement Mobile Money
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Dernières opérations sécurisées
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Vente Robe Wax (Amina K.)</div>
                  <div className="text-[10px] text-slate-400">Mobile Money validé · Hier</div>
                </div>
                <span className="font-bold text-emerald-600">+7 500 FCFA</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Achat Table Basse Bois</div>
                  <div className="text-[10px] text-slate-400">Paiement bloqué · 24 août</div>
                </div>
                <span className="font-bold text-slate-700">-12 000 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Paramètres */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 text-xs sm:text-sm">
          <h3 className="font-bold text-slate-800">Paramètres et Sécurité</h3>
          <div className="space-y-3 divide-y divide-slate-100">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Numéro de connexion</div>
                <div className="text-xs text-slate-500">{currentUser.phone}</div>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Zone de livraison par défaut</div>
                <div className="text-xs text-slate-500">Cotonou, Fidjrossè</div>
              </div>
              <button className="text-xs text-emerald-700 font-bold">Changer</button>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Notifications SMS de vente</div>
                <div className="text-xs text-slate-500">Activé pour chaque offre reçue</div>
              </div>
              <span className="text-emerald-600 font-bold">Actif</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};
