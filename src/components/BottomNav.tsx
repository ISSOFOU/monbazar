import React from 'react';
import { Home, LayoutGrid, Plus, MessageCircle, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSellModal: () => void;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenSellModal,
  unreadMessagesCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg select-none">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* 1. Accueil */}
        <button
          id="btn-tab-home"
          onClick={() => onTabChange('accueil')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'accueil'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'accueil' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Accueil</span>
        </button>

        {/* 2. Recherche */}
        <button
          id="btn-tab-search"
          onClick={() => onTabChange('recherche')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'recherche'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${currentTab === 'recherche' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Parcourir</span>
        </button>

        {/* 3. Center Orange Floating Action Button (+) matching screenshot */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-6">
          <button
            id="btn-tab-sell-fab"
            onClick={onOpenSellModal}
            aria-label="Vendre un article"
            className="w-13 h-13 rounded-full bg-[#FF6B47] hover:bg-[#E85A38] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all border-4 border-white"
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </button>
          <span className="text-[11px] font-bold text-[#FF6B47] mt-1">Vendre</span>
        </div>

        {/* 4. Messages */}
        <button
          id="btn-tab-messages"
          onClick={() => onTabChange('messages')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
            currentTab === 'messages'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <MessageCircle className={`w-5 h-5 ${currentTab === 'messages' ? 'stroke-[2.5]' : ''}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Messages</span>
        </button>

        {/* 5. Profil */}
        <button
          id="btn-tab-profile"
          onClick={() => onTabChange('profil')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'profil'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profil' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Profil</span>
        </button>
      </div>
    </nav>
  );
};
