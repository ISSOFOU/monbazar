import React, { useState } from 'react';
import { Send, ArrowLeft, ShieldCheck, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { Conversation, Product } from '../types';
import { formatRelativeTime, formatMessageTime } from '../utils/formatDate';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUserId: string;
  onSendMessage: (conversationId: string, text: string) => void;
  onOpenConversation: (conversationId: string) => void;
  onOpenCheckoutFromChat: (productInfo: { id: string; title: string; price: number; images: string[]; location: string; seller: any }) => void;
  onSelectProductById: (productId: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUserId,
  onSendMessage,
  onOpenConversation,
  onOpenCheckoutFromChat,
  onSelectProductById,
}) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const isSellerView = activeConversation?.sellerId === currentUserId;
  const counterpart = activeConversation
    ? (isSellerView ? activeConversation.buyer : activeConversation.seller)
    : null;

  const openConversation = (id: string) => {
    setActiveConvId(id);
    onOpenConversation(id);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    onSendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 h-[calc(100vh-80px)] flex flex-col">
      {activeConversation ? (
        /* Chat Detail View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConvId(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {counterpart?.avatar ? (
                <img
                  src={counterpart.avatar}
                  alt={counterpart.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  {counterpart?.initials}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-slate-900">
                    {counterpart?.name}
                  </span>
                  {counterpart?.isVerified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                      Vérifié
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">En ligne</span>
              </div>
            </div>

            {/* Product Quick Thumbnail */}
            <button
              onClick={() => onSelectProductById(activeConversation.productId)}
              className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-all text-left"
            >
              <img
                src={activeConversation.productImage}
                alt={activeConversation.productTitle}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                  {activeConversation.productTitle}
                </p>
                <p className="text-[10px] text-emerald-600 font-extrabold">
                  {new Intl.NumberFormat('fr-FR').format(activeConversation.productPrice)} FCFA
                </p>
              </div>
            </button>
          </div>

          {/* Product Banner Inside Chat */}
          <div className="px-4 py-2 bg-emerald-50/50 border-b border-emerald-100/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-900 font-semibold">
                Transaction protégée par Mon Bazar Mobile Money
              </span>
            </div>
            {!isSellerView && (
              <button
                onClick={() =>
                  onOpenCheckoutFromChat({
                    id: activeConversation.productId,
                    title: activeConversation.productTitle,
                    price: activeConversation.productPrice,
                    images: [activeConversation.productImage],
                    location: 'Cotonou',
                    seller: activeConversation.seller,
                  })
                }
                className="px-3 py-1 bg-[#FF6B47] hover:bg-[#E85A38] text-white font-bold rounded-lg text-xs shadow-xs"
              >
                Acheter ({new Intl.NumberFormat('fr-FR').format(activeConversation.productPrice)} FCFA)
              </button>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                      isMe
                        ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {msg.isOffer && (
                      <div className="mb-2 p-2 rounded-xl bg-black/10 flex items-center gap-2 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Offre reçue : {new Intl.NumberFormat('fr-FR').format(msg.offerAmount || 0)} FCFA</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{formatMessageTime(msg.timestamp)}</span>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List */
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Messages</h2>
              <p className="text-xs text-slate-500">Discussions avec les vendeurs et acheteurs</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 mt-2">
            {conversations.map((conv) => {
              const other = conv.sellerId === currentUserId ? conv.buyer : conv.seller;
              return (
                <div
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className="py-3.5 px-2 flex items-center gap-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {other?.avatar ? (
                      <img
                        src={other.avatar}
                        alt={other.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center">
                        {other?.initials}
                      </div>
                    )}
                    {conv.unread && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {other?.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{formatRelativeTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs font-medium text-emerald-600 truncate mb-0.5">
                      Article : {conv.productTitle}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>

                  {/* Product Thumbnail */}
                  <img
                    src={conv.productImage}
                    alt={conv.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
