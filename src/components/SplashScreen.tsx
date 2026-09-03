import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <motion.div
      id="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#fbfbfa] p-8 select-none overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end">
        <button
          id="btn-skip-splash"
          onClick={onDismiss}
          className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Passer
        </button>
      </div>

      {/* Main Center Brand Identity matching Image 1, 5, 7 */}
      <div className="flex flex-col items-center text-center my-auto">
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative mb-8"
        >
          {/* Main Logo Container */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 bg-[#0B8457] rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-800/30">
            <svg
              viewBox="0 0 24 24"
              className="w-20 h-20 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Bag Body */}
              <path
                d="M6 9l1.5 11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2L22 9H2z"
                fill="currentColor"
                stroke="none"
              />
              {/* Bag handle cutout */}
              <path
                d="M9 11a3 3 0 0 0 6 0"
                stroke="#0B8457"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              {/* Upper handle */}
              <path
                d="M9 9V6a3 3 0 0 1 6 0v3"
                stroke="#ffffff"
                strokeWidth="2.4"
                fill="none"
              />
              {/* Smile curve */}
              <path
                d="M9.5 14.5a2.7 2.7 0 0 0 5 0"
                stroke="#0B8457"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Coral heart accent badge */}
          <div className="absolute -top-1 -right-1 w-9 h-9 bg-[#FF6B47] border-4 border-[#fbfbfa] rounded-full shadow-md animate-bounce flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" fill="currentColor" strokeWidth={0} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 mb-2.5"
        >
          Mon <span className="text-[#0B8457]">Bazar</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-slate-500 font-medium text-base sm:text-lg max-w-xs"
        >
          Achète & vends près de chez toi
        </motion.p>
      </div>

      {/* Action CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-xs flex flex-col items-center gap-3 mb-4"
      >
        <button
          id="btn-enter-mon-bazar"
          onClick={onDismiss}
          className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200/80 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-98 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0B8457] flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M6 9l1.5 11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2L22 9H2z" fill="currentColor" />
              <path d="M9.5 14.5a2.7 2.7 0 0 0 5 0" stroke="#0B8457" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-slate-800 text-lg">
            Mon <span className="text-[#0B8457]">Bazar</span>
          </span>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all ml-auto" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Paiement sécurisé Mobile Money disponible</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
