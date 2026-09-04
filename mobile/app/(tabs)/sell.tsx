import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch, API_BASE } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { colors } from '../../lib/theme';
import { BENIN_LOCATIONS, CATEGORY_COLORS } from '../../lib/types';
import { useRouter } from 'expo-router';

const CATEGORIES = ['Femmes', 'Hommes', 'High-Tech', 'Maison', 'Beauté & Santé', 'Enfants & Bébés', 'Artisanat', 'Véhicules', 'Loisirs & Sport'];
const CONDITIONS = ['Neuf avec étiquette', 'Très bon état', 'Bon état', 'État correct'];
const MAX_PHOTOS = 10;

export default function SellScreen() {
  const { authToken } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Femmes');
  const [condition, setCondition] = useState('Très bon état');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(BENIN_LOCATIONS[1]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    if (images.length >= MAX_PHOTOS) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - images.length,
    });
    if (result.canceled) return;

    setUploading(true);
    try {
      for (const asset of result.assets) {
        if (!asset.base64) continue;
        const dataUrl = `data:image/jpeg;base64,${asset.base64}`;
        const data = await apiFetch<{ url: string }>('/api/upload', {
          method: 'POST',
          token: authToken,
          body: { dataUrl },
        });
        setImages((prev) => [...prev, data.url].slice(0, MAX_PHOTOS));
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message || "Échec de l'envoi de la photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price || images.length === 0) {
      Alert.alert('Formulaire incomplet', 'Ajoute un titre, un prix et au moins une photo.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/products', {
        method: 'POST',
        token: authToken,
        body: {
          title: title.trim(),
          price: Number(price),
          category,
          brand: brand.trim() || undefined,
          condition,
          location,
          city: location.split(',')[0].trim(),
          description: description.trim() || 'Article en très bon état.',
          images,
          isNegotiable: true,
        },
      });
      setTitle('');
      setBrand('');
      setPrice('');
      setDescription('');
      setImages([]);
      Alert.alert('Publié !', 'Ton annonce est en ligne.');
      router.push('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Publication impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.header}>Vendre un article</Text>

        <Text style={styles.label}>Photos ({images.length}/{MAX_PHOTOS})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {images.map((uri, i) => (
            <View key={i} style={styles.photoThumb}>
              <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
              <TouchableOpacity
                style={styles.removePhoto}
                onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Ionicons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.addPhoto} onPress={pickImage} disabled={uploading}>
              <Ionicons name={uploading ? 'hourglass' : 'add'} size={22} color={colors.emerald} />
            </TouchableOpacity>
          )}
        </ScrollView>

        <Text style={styles.label}>Titre de l'annonce</Text>
        <TextInput style={styles.input} placeholder="Ex : Robe wax imprimée, taille M" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            const palette = CATEGORY_COLORS[c] ?? CATEGORY_COLORS.Tous;
            return (
              <Text
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  active && { backgroundColor: palette.color, borderColor: palette.color, color: '#fff' },
                ]}
              >
                {c}
              </Text>
            );
          })}
        </View>

        {(category === 'Femmes' || category === 'Hommes' || category === 'Enfants & Bébés') && (
          <>
            <Text style={styles.label}>Marque (optionnel)</Text>
            <TextInput style={styles.input} placeholder="Ex : Nike, Zara..." value={brand} onChangeText={setBrand} />
          </>
        )}

        <Text style={styles.label}>État</Text>
        <View style={styles.chipsRow}>
          {CONDITIONS.map((c) => (
            <Text
              key={c}
              onPress={() => setCondition(c)}
              style={[styles.chip, condition === c && styles.chipActive]}
            >
              {c}
            </Text>
          ))}
        </View>

        <Text style={styles.label}>Prix (FCFA)</Text>
        <TextInput style={styles.input} placeholder="8500" value={price} onChangeText={setPrice} keyboardType="number-pad" />

        <Text style={styles.label}>Localisation</Text>
        <View style={styles.chipsRow}>
          {BENIN_LOCATIONS.slice(1).map((c) => (
            <Text
              key={c}
              onPress={() => setLocation(c)}
              style={[styles.chip, location === c && styles.chipActive]}
            >
              {c}
            </Text>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Décris ton article..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Publication...' : "Publier l'annonce"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  chipActive: { backgroundColor: colors.emerald, color: '#fff', borderColor: colors.emerald },
  photoThumb: { width: 84, height: 84, borderRadius: 12, marginRight: 8, backgroundColor: '#F1F5F9' },
  removePhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    width: 84,
    height: 84,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    backgroundColor: colors.coral,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
