import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { colors } from '../../lib/theme';
import type { Product } from '../../lib/types';

const REPORT_REASONS = [
  { value: 'contrefacon', label: 'Contrefaçon / non conforme' },
  { value: 'arnaque', label: "Tentative d'arnaque" },
  { value: 'contenu_interdit', label: 'Contenu interdit' },
  { value: 'spam', label: 'Spam / doublon' },
  { value: 'autre', label: 'Autre' },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { authToken, currentUser } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    apiFetch<Product[]>('/api/products')
      .then((all) => setProduct(all.find((p) => p.id === id) || null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    apiFetch(`/api/follows/${product.seller.id}`, { token: authToken }).then((data: any) => {
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    }).catch(() => {});
  }, [product, authToken]);

  const isOwn = product && currentUser?.id === product.seller.id;

  const toggleFollow = async () => {
    if (!product) return;
    const data: any = await apiFetch(`/api/follows/${product.seller.id}`, {
      method: isFollowing ? 'DELETE' : 'POST',
      token: authToken,
    });
    setIsFollowing(data.isFollowing);
    setFollowersCount(data.followersCount);
  };

  const startChat = async () => {
    if (!product) return;
    try {
      await apiFetch('/api/conversations', {
        method: 'POST',
        token: authToken,
        body: {
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productImage: product.images[0],
          sellerId: product.seller.id,
          text: `Bonjour, "${product.title}" est-il toujours disponible ?`,
        },
      });
      router.push('/(tabs)/messages');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  const buyNow = async () => {
    if (!product) return;
    try {
      const data: any = await apiFetch('/api/payments', {
        method: 'POST',
        token: authToken,
        body: {
          productId: product.id,
          deliveryMethod: 'zem',
          deliveryAddress: currentUser?.city || 'Cotonou',
        },
      });
      await WebBrowser.openBrowserAsync(data.checkoutUrl);
      router.push('/(tabs)/messages');
    } catch (e: any) {
      Alert.alert('Paiement indisponible', e.message);
    }
  };

  const submitReport = async () => {
    if (!product || !reportReason) return;
    try {
      await apiFetch('/api/reports', {
        method: 'POST',
        token: authToken,
        body: { targetType: 'product', targetId: product.id, reason: reportReason },
      });
      setReportSent(true);
      setTimeout(() => setShowReport(false), 1500);
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  if (loading || !product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.emerald} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <ScrollView>
        <View>
          <Image source={{ uri: product.images[0] }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
          {!isOwn && (
            <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReport(true)}>
              <Ionicons name="flag-outline" size={16} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ padding: 16 }}>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.price)} FCFA</Text>

          <View style={styles.tagsRow}>
            <Text style={styles.tag}>★ {product.condition}</Text>
            <Text style={styles.tag}>{product.location}</Text>
          </View>

          <View style={styles.sellerCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {product.seller.avatar ? (
                <Image source={{ uri: product.seller.avatar }} style={styles.sellerAvatar} />
              ) : (
                <View style={[styles.sellerAvatar, { backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>{product.seller.initials}</Text>
                </View>
              )}
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.sellerName}>{product.seller.name}</Text>
                <Text style={styles.sellerMeta}>
                  {product.seller.salesCount} ventes{followersCount !== null ? ` · ${followersCount} abonnés` : ''}
                </Text>
              </View>
            </View>
            {!isOwn && (
              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                onPress={toggleFollow}
              >
                <Ionicons name={isFollowing ? 'checkmark' : 'person-add'} size={16} color={isFollowing ? '#fff' : colors.emerald} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {!isOwn && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.chatBtn} onPress={startChat}>
            <Text style={styles.chatBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={buyNow}>
            <Text style={styles.buyBtnText}>Acheter</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showReport} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Signaler cette annonce</Text>
            {reportSent ? (
              <Text style={{ color: colors.emerald, fontWeight: '700', marginTop: 12 }}>Signalement envoyé, merci.</Text>
            ) : (
              <>
                {REPORT_REASONS.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.reasonRow, reportReason === r.value && styles.reasonRowActive]}
                    onPress={() => setReportReason(r.value)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.reportSubmit} onPress={submitReport} disabled={!reportReason}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>Envoyer</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => setShowReport(false)} style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroImage: { width: '100%', height: 320, backgroundColor: '#F1F5F9' },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  reportBtn: { position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 11, fontWeight: '800', color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  price: { fontSize: 24, fontWeight: '900', color: colors.emeraldDark, marginTop: 6 },
  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  tag: { fontSize: 11, fontWeight: '700', color: colors.text, backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, overflow: 'hidden' },
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12, marginTop: 16 },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22 },
  sellerName: { fontWeight: '800', fontSize: 13, color: colors.text },
  sellerMeta: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  followBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.emerald, alignItems: 'center', justifyContent: 'center' },
  followBtnActive: { backgroundColor: colors.emerald },
  sectionTitle: { fontWeight: '800', fontSize: 14, color: colors.text, marginTop: 20, marginBottom: 6 },
  description: { fontSize: 13, color: colors.textMuted, lineHeight: 19, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  actionBar: { flexDirection: 'row', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: colors.border },
  chatBtn: { flex: 1, borderWidth: 2, borderColor: colors.emerald, borderRadius: 14, alignItems: 'center', paddingVertical: 13 },
  chatBtnText: { color: colors.emerald, fontWeight: '800' },
  buyBtn: { flex: 1, backgroundColor: colors.coral, borderRadius: 14, alignItems: 'center', paddingVertical: 13 },
  buyBtnText: { color: '#fff', fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%', maxWidth: 340 },
  modalTitle: { fontWeight: '800', fontSize: 15, color: colors.text, marginBottom: 12 },
  reasonRow: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 6 },
  reasonRowActive: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  reportSubmit: { backgroundColor: '#DC2626', borderRadius: 12, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
});
