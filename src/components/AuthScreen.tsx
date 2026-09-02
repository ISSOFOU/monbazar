import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import type { CurrentUser } from '../App';

interface AuthScreenProps {
  onAuthenticated: (token: string, user: CurrentUser) => void;
}

type Step = 'phone' | 'code';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('+229');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevCode(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible d'envoyer le code.");
        return;
      }
      if (!data.sent && data.devCode) {
        setDevCode(data.devCode);
        setCode(data.devCode);
      }
      setStep('code');
    } catch {
      setError('Erreur réseau, réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Code invalide.');
        return;
      }
      onAuthenticated(data.token, data.user);
    } catch {
      setError('Erreur réseau, réessaie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 flex items-center justify-center mb-3">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <path d="M37,40 Q37,22 50,22 Q63,22 63,40" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M26,40 L74,40 L69,89 Q68.5,94 63,94 L37,94 Q31.5,94 31,89 Z" fill="#FFFFFF" />
              <path d="M40,54 Q50,65 60,54" stroke="#0B8457" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-display">
            Mon <span className="text-emerald-700">Bazar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Achète &amp; vends près de chez toi</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Ton prénom et nom</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Espoir A."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Numéro de téléphone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 97 12 34 56"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            {error && <div className="text-xs text-red-600 font-semibold">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#FF6B47] text-white font-bold text-sm shadow-sm disabled:opacity-60"
            >
              {loading ? 'Envoi du code...' : 'Recevoir un code par SMS'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-xs text-slate-500 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Changer de numéro
            </button>

            {devCode && (
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold">Mode test :</span> l'envoi SMS n'est pas encore activé, voici ton code directement : <span className="font-extrabold tracking-widest">{devCode}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                Code reçu par SMS au {phone}
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            {error && <div className="text-xs text-red-600 font-semibold">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-sm disabled:opacity-60"
            >
              {loading ? 'Vérification...' : 'Confirmer et me connecter'}
            </button>
          </form>
        )}

        <div className="flex items-center gap-1.5 justify-center mt-6 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Connexion sécurisée par vérification SMS
        </div>
      </motion.div>
    </div>
  );
};
