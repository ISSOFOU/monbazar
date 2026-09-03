import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons/Ionicons';
import type { Product } from '../lib/types';
import { colors } from '../lib/theme';

function formatPrice(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        <View style={styles.favBtn}>
          <Ionicons name="heart-outline" size={16} color={colors.text} />
        </View>
        {product.isSold && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>Vendu</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 8 }}>
        <Text style={styles.price}>{formatPrice(product.price)} FCFA</Text>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {product.location || product.city}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    margin: 5,
  },
  imageWrap: { aspectRatio: 1, backgroundColor: '#F1F5F9' },
  image: { width: '100%', height: '100%' },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  soldText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  price: { color: colors.coral, fontWeight: '800', fontSize: 14 },
  title: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 2 },
  location: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
});
