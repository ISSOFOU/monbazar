import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { colors } from '../../lib/theme';
import type { Conversation } from '../../lib/types';

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return 'Hier';
  if (diffD < 7) return `Il y a ${diffD} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function MessagesScreen() {
  const { authToken, currentUser } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!authToken) return;
    apiFetch<Conversation[]>('/api/conversations', { token: authToken })
      .then(setConversations)
      .finally(() => setLoading(false));
  }, [authToken]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerCount}>{conversations.length} conversation{conversations.length > 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.emerald} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => {
            const other = item.sellerId === currentUser?.id ? item.buyer : item.seller;
            return (
              <TouchableOpacity style={styles.row} onPress={() => router.push(`/conversation/${item.id}`)}>
                <View>
                  {other?.avatar ? (
                    <Image source={{ uri: other.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={{ color: '#fff', fontWeight: '800' }}>{other?.initials}</Text>
                    </View>
                  )}
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.name}>{other?.name}</Text>
                    <Text style={styles.time}>{formatRelativeTime(item.lastMessageTime)}</Text>
                  </View>
                  <Text style={styles.product} numberOfLines={1}>Article : {item.productTitle}</Text>
                  <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
                </View>
                <Image source={{ uri: item.productImage }} style={styles.productThumb} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: colors.textMuted }}>Aucune conversation pour le moment</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerCount: { fontSize: 11, fontWeight: '700', color: colors.emerald, backgroundColor: '#E9F6F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#DC2626', borderWidth: 2, borderColor: '#fff' },
  name: { fontWeight: '800', fontSize: 13, color: colors.text },
  time: { fontSize: 10, color: colors.textFaint },
  product: { fontSize: 11, color: colors.emerald, fontWeight: '600', marginTop: 1 },
  lastMsg: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  productThumb: { width: 38, height: 38, borderRadius: 10, marginLeft: 8 },
});
