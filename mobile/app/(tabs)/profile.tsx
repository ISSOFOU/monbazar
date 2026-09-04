import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { colors } from '../../lib/theme';
import { BENIN_LOCATIONS, CATEGORIES_LIST, CATEGORY_COLORS, type Product } from '../../lib/types';
import { ProductCard } from '../../components/ProductCard';

const INTEREST_CATEGORIES = CATEGORIES_LIST.filter((c) => c !== 'Tous');

export default function ProfileScreen() {
  const { authToken, currentUser, logout, updateUser } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'listings' | 'settings'>('listings');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const load = useCallback(() => {
    if (!authToken || !currentUser) return;
    apiFetch<Product[]>('/api/products')
      .then((all) => setMyProducts(all.filter((p) => p.seller.id === currentUser.id)))
      .finally(() => setLoading(false));
    apiFetch<string[]>('/api/interests', { token: authToken })
      .then(setInterests)
      .catch(() => {});
  }, [authToken, currentUser]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleInterest = async (category: string) => {
    const next = interests.includes(category)
      ? interests.filter((c) => c !== category)
      : [...interests, category];
    setInterests(next);
    if (!authToken) return;
    try {
      await apiFetch('/api/interests', { method: 'PUT', token: authToken, body: { categories: next } });
    } catch {
      setInterests(interests);
    }
  };

  const saveBio = async () => {
    if (!authToken) return;
    setSaving(true);
    try {
      const updated = await apiFetch('/api/me', { method: 'PATCH', token: authToken, body: { bio: bio.trim() } });
      updateUser(updated as any);
    } finally {
      setSaving(false);
    }
  };

  const changeCity = async (city: string) => {
    if (!authToken) return;
    const updated = await apiFetch('/api/me', { method: 'PATCH', token: authToken, body: { city } });
    updateUser(updated as any);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6, base64: true });
    if (result.canceled || !result.assets[0].base64) return;
    setUploadingAvatar(true);
    try {
      const dataUrl = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const { url } = await apiFetch<{ url: string }>('/api/upload', { method: 'POST', token: authToken, body: { dataUrl } });
      const updated = await apiFetch('/api/me', { method: 'PATCH', token: authToken, body: { avatar: url } });
      updateUser(updated as any);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!currentUser) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center' }}>
            <View>
              {currentUser.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>
                    {currentUser.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.camBtn} onPress={pickAvatar} disabled={uploadingAvatar}>
                <Ionicons name={uploadingAvatar ? 'hourglass' : 'camera'} size={13} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{currentUser.name}</Text>
            {currentUser.verifiedMobileMoney ? (
              <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Compte vérifié Mobile Money</Text></View>
            ) : (
              <View style={styles.unverifiedBadge}><Text style={styles.unverifiedText}>Mobile Money non lié</Text></View>
            )}
            {currentUser.bio ? <Text style={styles.bioDisplay}>{currentUser.bio}</Text> : null}
            <Text style={styles.meta}>{currentUser.city || 'Bénin'} · Membre depuis {currentUser.memberSince}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statTile}><Text style={styles.statNum}>{myProducts.length}</Text><Text style={styles.statLabel}>Annonces</Text></View>
            <View style={styles.statTile}><Text style={styles.statNum}>{currentUser.salesCount}</Text><Text style={styles.statLabel}>Ventes</Text></View>
            <View style={styles.statTile}><Text style={styles.statNum}>{currentUser.purchasesCount}</Text><Text style={styles.statLabel}>Achats</Text></View>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tabBtn, tab === 'listings' && styles.tabBtnActive]} onPress={() => setTab('listings')}>
            <Text style={[styles.tabText, tab === 'listings' && styles.tabTextActive]}>Mes annonces ({myProducts.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, tab === 'settings' && styles.tabBtnActive]} onPress={() => setTab('settings')}>
            <Text style={[styles.tabText, tab === 'settings' && styles.tabTextActive]}>Paramètres</Text>
          </TouchableOpacity>
        </View>

        {tab === 'listings' ? (
          loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} color={colors.emerald} />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {myProducts.map((p) => (
                <View key={p.id} style={{ width: '50%' }}>
                  <ProductCard product={p} />
                </View>
              ))}
              {myProducts.length === 0 && (
                <Text style={{ color: colors.textMuted, margin: 12 }}>Tu n'as pas encore d'annonces.</Text>
              )}
            </View>
          )
        ) : (
          <View style={styles.settingsCard}>
            <Text style={styles.settingsRowLabel}>Numéro de connexion</Text>
            <Text style={styles.settingsRowValue}>{currentUser.phone}</Text>

            <Text style={[styles.settingsRowLabel, { marginTop: 16 }]}>Ma bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={(t) => setBio(t.slice(0, 150))}
              multiline
              placeholder="Parle un peu de toi..."
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveBio} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
            </TouchableOpacity>

            <Text style={[styles.settingsRowLabel, { marginTop: 16 }]}>Ville</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {BENIN_LOCATIONS.slice(1).map((c) => (
                <Text
                  key={c}
                  onPress={() => changeCity(c)}
                  style={[styles.cityChip, currentUser.city === c && styles.cityChipActive]}
                >
                  {c}
                </Text>
              ))}
            </ScrollView>

            <Text style={[styles.settingsRowLabel, { marginTop: 16 }]}>Centres d'intérêt</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2, marginBottom: 6 }}>
              Reçois une notification dès qu'une nouvelle annonce est publiée dans ces catégories.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {INTEREST_CATEGORIES.map((c) => {
                const active = interests.includes(c);
                const palette = CATEGORY_COLORS[c] ?? CATEGORY_COLORS.Tous;
                return (
                  <Text
                    key={c}
                    onPress={() => toggleInterest(c)}
                    style={[
                      styles.cityChip,
                      active && { backgroundColor: palette.color, borderColor: palette.color, color: '#fff' },
                    ]}
                  >
                    {c}
                  </Text>
                );
              })}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: colors.emerald },
  camBtn: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 10 },
  verifiedBadge: { backgroundColor: '#E9F6F0', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  verifiedText: { color: colors.emeraldDark, fontSize: 10, fontWeight: '800' },
  unverifiedBadge: { backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  unverifiedText: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  bioDisplay: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 8, paddingHorizontal: 10 },
  meta: { fontSize: 11, color: colors.textFaint, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  statTile: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center', paddingVertical: 10 },
  statNum: { fontWeight: '800', fontSize: 16, color: colors.text },
  statLabel: { fontSize: 10, color: colors.textMuted },
  tabsRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 8 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  tabBtnActive: { backgroundColor: colors.emerald, borderColor: colors.emerald },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.text },
  tabTextActive: { color: '#fff' },
  settingsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  settingsRowLabel: { fontWeight: '700', fontSize: 13, color: colors.text },
  settingsRowValue: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  bioInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, marginTop: 6, minHeight: 70, textAlignVertical: 'top', fontSize: 13 },
  saveBtn: { backgroundColor: colors.emerald, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  cityChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 11, fontWeight: '700', marginRight: 8, overflow: 'hidden' },
  cityChipActive: { backgroundColor: colors.emerald, color: '#fff', borderColor: colors.emerald },
  logoutBtn: { marginTop: 20, borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  logoutText: { color: '#DC2626', fontWeight: '800', fontSize: 13 },
});
