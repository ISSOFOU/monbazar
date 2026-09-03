import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { colors } from '../../lib/theme';
import type { Conversation, Message } from '../../lib/types';

function formatTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { authToken, currentUser } = useAuth();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [payment, setPayment] = useState<{ id: string; status: string } | null>(null);
  const [releasing, setReleasing] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    apiFetch<Conversation>(`/api/conversations/${id}`, { token: authToken })
      .then(setConv)
      .finally(() => setLoading(false));
  }, [id, authToken]);

  useEffect(() => {
    if (!conv) return;
    apiFetch(`/api/payments?productId=${conv.productId}`, { token: authToken })
      .then(setPayment)
      .catch(() => {});
  }, [conv, authToken]);

  const isSellerView = conv?.sellerId === currentUser?.id;

  const send = async () => {
    if (!input.trim() || !conv) return;
    const text = input.trim();
    setInput('');
    const updated: any = await apiFetch(`/api/conversations/${conv.id}/messages`, {
      method: 'POST',
      token: authToken,
      body: { text },
    });
    setConv((prev) => (prev ? { ...prev, messages: updated.messages, lastMessage: updated.lastMessage } : prev));
  };

  const confirmReceipt = async () => {
    if (!payment) return;
    setReleasing(true);
    try {
      await apiFetch(`/api/payments/${payment.id}/release`, { method: 'POST', token: authToken });
      setPayment({ ...payment, status: 'released' });
    } finally {
      setReleasing(false);
    }
  };

  if (loading || !conv) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.emerald} />
      </View>
    );
  }

  const counterpart = isSellerView ? conv.buyer : conv.seller;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </TouchableOpacity>
        {counterpart?.avatar ? (
          <Image source={{ uri: counterpart.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{counterpart?.initials}</Text>
          </View>
        )}
        <Text style={styles.headerName}>{counterpart?.name}</Text>
      </View>

      <View style={styles.paymentBanner}>
        <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
        <Text style={styles.paymentText}>
          {payment?.status === 'held' && 'Paiement reçu, fonds sécurisés'}
          {payment?.status === 'released' && 'Transaction terminée, fonds libérés'}
          {payment?.status === 'pending' && 'Paiement en cours de validation'}
          {!payment && 'Transaction protégée par Mon Bazar'}
        </Text>
        {!isSellerView && payment?.status === 'held' && (
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmReceipt} disabled={releasing}>
            <Text style={styles.confirmBtnText}>{releasing ? '...' : 'Confirmer'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={conv.messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }: { item: Message }) => {
            const isMe = item.senderId === currentUser?.id;
            return (
              <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={{ color: isMe ? '#fff' : colors.text, fontSize: 13 }}>{item.text}</Text>
                </View>
                <Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>
              </View>
            );
          }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez votre message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={!input.trim()}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  headerName: { fontWeight: '800', fontSize: 14, color: colors.text },
  paymentBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', padding: 10, borderBottomWidth: 1, borderBottomColor: '#DCFCE7' },
  paymentText: { flex: 1, fontSize: 11, fontWeight: '600', color: colors.emeraldDark },
  confirmBtn: { backgroundColor: colors.emerald, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  confirmBtnText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  bubbleMe: { backgroundColor: colors.emerald, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  msgTime: { fontSize: 9, color: colors.textFaint, marginTop: 2 },
  inputRow: { flexDirection: 'row', gap: 8, padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' },
});
