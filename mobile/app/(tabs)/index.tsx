import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { apiFetch } from '../../lib/api';
import { colors } from '../../lib/theme';
import { CATEGORIES_LIST, type Product } from '../../lib/types';
import { ProductCard } from '../../components/ProductCard';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<Product[]>('/api/products');
      setProducts(data);
    } catch {
      // ignore, keep previous state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products
    .filter((p) => category === 'Tous' || p.category === category)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="bag-handle" size={16} color="#fff" />
          </View>
          <Text style={styles.logoText}>
            Mon <Text style={{ color: colors.emerald }}>Bazar</Text>
          </Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={colors.textFaint} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un article..."
          placeholderTextColor={colors.textFaint}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={17}
            color={colors.textFaint}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES_LIST}
        keyExtractor={(c) => c}
        style={{ flexGrow: 0, marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        renderItem={({ item }) => {
          const active = item === category;
          return (
            <Text
              onPress={() => setCategory(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              {item}
            </Text>
          );
        }}
      />

      <View style={styles.banner}>
        <Ionicons name="shield-checkmark" size={22} color="#fff" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.bannerTitle}>Paiement sécurisé Mobile Money</Text>
          <Text style={styles.bannerSub}>Fonds bloqués jusqu'à la remise en main propre.</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.emerald} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          renderItem={({ item }) => <ProductCard product={item} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="bag-outline" size={40} color={colors.textFaint} />
              <Text style={{ color: colors.textMuted, marginTop: 8 }}>Aucune annonce pour le moment</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 18, fontWeight: '800', color: colors.text },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text, padding: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  chipActive: { backgroundColor: colors.emerald, color: '#fff', borderColor: colors.emerald },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emerald,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 14,
  },
  bannerTitle: { color: '#fff', fontWeight: '800', fontSize: 13 },
  bannerSub: { color: '#D1FAE5', fontSize: 11, marginTop: 2 },
});
