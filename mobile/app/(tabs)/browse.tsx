import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons/Ionicons';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';
import type { Product } from '../../lib/types';
import { ProductCard } from '../../components/ProductCard';

const TILES: { name: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  { name: 'Femmes', icon: 'female', color: '#E85A38', bg: '#FFF1EC' },
  { name: 'Hommes', icon: 'male', color: '#0B8457', bg: '#E9F6F0' },
  { name: 'High-Tech', icon: 'phone-portrait', color: '#1D4ED8', bg: '#EAF0FE' },
  { name: 'Maison', icon: 'home', color: '#B45309', bg: '#FEF4E6' },
  { name: 'Beauté & Santé', icon: 'sparkles', color: '#BE185D', bg: '#FDF0F6' },
  { name: 'Enfants & Bébés', icon: 'happy', color: '#7C3AED', bg: '#F3EEFE' },
  { name: 'Artisanat', icon: 'color-palette', color: '#C2410C', bg: '#FEEEE6' },
  { name: 'Véhicules', icon: 'car', color: '#0369A1', bg: '#E9F6FE' },
  { name: 'Loisirs & Sport', icon: 'barbell', color: '#15803D', bg: '#EDF9EF' },
];

export default function BrowseScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Product[]>('/api/products')
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const isBrowsing = query.trim() === '' && !category;

  const results = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q);
    const matchCat = !category || p.category === category;
    return matchQuery && matchCat;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={styles.searchRow}>
        {!isBrowsing && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setCategory(null);
              setQuery('');
            }}
          >
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un article, une marque..."
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.emerald} />
      ) : isBrowsing ? (
        <FlatList
          data={TILES}
          numColumns={2}
          keyExtractor={(t) => t.name}
          contentContainerStyle={{ padding: 10 }}
          ListHeaderComponent={<Text style={styles.sectionTitle}>Parcourir par catégorie</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tile} onPress={() => setCategory(item.name)}>
              <View style={[styles.tileIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.tileLabel}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 8 }}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length} article{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </Text>
          }
          renderItem={({ item }) => <ProductCard product={item} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="search-outline" size={40} color={colors.textFaint} />
              <Text style={{ color: colors.textMuted, marginTop: 8 }}>Aucun article trouvé</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text },
  sectionTitle: { fontWeight: '800', fontSize: 14, color: colors.text, margin: 8 },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    margin: 5,
  },
  tileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontWeight: '700', fontSize: 12, color: colors.text, flexShrink: 1 },
  resultsCount: { fontWeight: '700', fontSize: 12, color: colors.textMuted, margin: 8 },
});
