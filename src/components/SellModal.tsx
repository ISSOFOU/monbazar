import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Image as ImageIcon, Trash2, CheckCircle, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Condition, Category, Product } from '../types';
import { BENIN_LOCATIONS } from '../data/mockData';
import { uploadImage } from '../utils/uploadImage';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishProduct: (product: Partial<Product>) => void;
  authToken: string;
}

const MAX_PHOTOS = 10;

const CATEGORIES: Category[] = [
  'Femmes',
  'Hommes',
  'High-Tech',
  'Maison',
  'Beauté & Santé',
  'Enfants & Bébés',
  'Artisanat',
  'Véhicules',
  'Loisirs & Sport',
];

const CONDITIONS: Condition[] = [
  'Neuf avec étiquette',
  'Très bon état',
  'Bon état',
  'État correct',
];

export const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  onPublishProduct,
  authToken,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Femmes');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<Condition>('Très bon état');
  const [price, setPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [location, setLocation] = useState('Cotonou, Fidjrossè');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    e.target.value = '';

    setUploadError(null);
    setUploading(true);

    try {
      const selectedFiles = (Array.from(files) as File[]).slice(0, MAX_PHOTOS - images.length);
      for (const file of selectedFiles) {
        const url = await uploadImage(file, authToken);
        setImages((prev) => [...prev, url].slice(0, MAX_PHOTOS));
      }
    } catch (err: any) {
      setUploadError(err.message === 'upload failed' ? "Échec de l'envoi de la photo." : err.message || 'Erreur lors de l\'envoi.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()].slice(0, MAX_PHOTOS));
      setImageUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || images.length === 0) return;

    onPublishProduct({
      title: title.trim(),
      price: Number(price),
      category,
      brand: brand.trim() || undefined,
      condition,
      location,
      city: location.split(',')[0].trim(),
      description: description.trim() || 'Article en très bon état, disponible pour remise en main propre ou livraison.',
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
      ],
      isNegotiable,
    });

    // Reset
    setTitle('');
    setPrice('');
    setDescription('');
    setBrand('');
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

          {/* Modal Card matching Image 3 */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Header matching Image 3 */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-20">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Vendre un article
              </h2>
              <button
                id="btn-close-sell-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-6 flex-1 pb-28">
              {/* 1. Photos Section matching Image 3 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  Photos <span className="text-xs font-normal text-slate-500">(5 à 10, la 1ère fera la couverture)</span>
                </label>

                {/* Photo Slots Row */}
                <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded-md tracking-wide">
                          Couverture
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add Image Button slot */}
                  {images.length < MAX_PHOTOS && (
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-700 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-6 h-6 stroke-[2.5]" />
                            <span className="text-[10px] font-semibold mt-1">Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {uploadError && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{uploadError}</p>
                )}

                {/* Quick Add photo by link */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Ajouter via un lien d'image</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Ajouter
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Titre de l'annonce matching Image 3 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Titre de l'annonce
                </label>
                <input
                  id="input-sell-title"
                  type="text"
                  required
                  placeholder="Ex : Robe wax imprimée, taille M"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* 3. Catégorie matching Image 3 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Catégorie
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3b. Marque (optionnel, utile pour la mode/enfants) */}
              {(category === 'Femmes' || category === 'Hommes' || category === 'Enfants & Bébés') && (
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Marque <span className="text-xs font-normal text-slate-500">(optionnel)</span>
                  </label>
                  <input
                    id="input-sell-brand"
                    type="text"
                    placeholder="Ex : Nike, Zara, Samsung..."
                    value={brand}
                    onChange={(e) => setBrand(e.target.value.slice(0, 40))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* 4. État de l'article matching Image 3 custom radio items */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  État de l'article
                </label>
                <div className="space-y-2.5">
                  {CONDITIONS.map((cond) => {
                    const isSelected = condition === cond;
                    return (
                      <div
                        key={cond}
                        onClick={() => setCondition(cond)}
                        className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            isSelected ? 'text-emerald-950' : 'text-slate-700'
                          }`}
                        >
                          {cond}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-4 h-4 fill-emerald-600 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Prix & Négociable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Prix (FCFA)
                  </label>
                  <div className="relative">
                    <input
                      id="input-sell-price"
                      type="number"
                      required
                      min="500"
                      step="500"
                      placeholder="Ex : 15 000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-display"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      FCFA
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Ville / Quartier
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {BENIN_LOCATIONS.filter((l) => l !== 'Tout le Bénin').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. Description */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Description détaillée
                </label>
                <textarea
                  id="textarea-sell-desc"
                  rows={3}
                  placeholder="Décrivez votre article (matière, taille, raison de vente, état des accessoires...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Sticky Submit Button matching Image 3 */}
              <div className="fixed sm:absolute bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30">
                <button
                  id="btn-publish-listing"
                  type="submit"
                  disabled={uploading || images.length === 0}
                  className="w-full py-4 bg-[#FF6B47] hover:bg-[#E85A38] text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-98 transition-all text-base font-display disabled:opacity-50"
                >
                  {uploading ? 'Envoi des photos...' : "Publier l'annonce"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
