import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { colors } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

type Step = 'phone' | 'code';

export default function AuthScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+229');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<{ sent: boolean; devCode?: string }>('/api/auth/request-otp', {
        method: 'POST',
        body: { phone: phone.trim() },
      });
      if (!data.sent && data.devCode) {
        setDevCode(data.devCode);
        setCode(data.devCode);
      }
      setStep('code');
    } catch (e: any) {
      setError(e.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<{ token: string; user: any }>('/api/auth/verify-otp', {
        method: 'POST',
        body: { phone: phone.trim(), code: code.trim(), name: name.trim() },
      });
      login(data.token, data.user);
    } catch (e: any) {
      setError(e.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="bag-handle" size={30} color="#fff" />
            </View>
            <View style={styles.heartBadge}>
              <Ionicons name="heart" size={11} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>
            Mon <Text style={{ color: colors.emerald }}>Bazar</Text>
          </Text>
          <Text style={styles.subtitle}>Achète & vends près de chez toi</Text>

          {step === 'phone' ? (
            <View style={{ width: '100%', marginTop: 24 }}>
              <Text style={styles.label}>Ton prénom et nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : Espoir A."
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>Numéro de téléphone</Text>
              <TextInput
                style={styles.input}
                placeholder="+229 97 12 34 56"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity
                style={[styles.buttonCoral, loading && styles.disabled]}
                onPress={requestOtp}
                disabled={loading || !name.trim() || !phone.trim()}
              >
                <Text style={styles.buttonCoralText}>
                  {loading ? 'Envoi du code...' : 'Recevoir un code par SMS'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: '100%', marginTop: 24 }}>
              <TouchableOpacity onPress={() => setStep('phone')} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>
                  ← Changer de numéro
                </Text>
              </TouchableOpacity>

              {devCode && (
                <View style={styles.devBanner}>
                  <Text style={{ fontSize: 12, color: '#78350F' }}>
                    <Text style={{ fontWeight: '800' }}>Mode test : </Text>
                    l'envoi SMS n'est pas encore activé, voici ton code : {devCode}
                  </Text>
                </View>
              )}

              <Text style={styles.label}>Code reçu par SMS au {phone}</Text>
              <TextInput
                style={[styles.input, { textAlign: 'center', letterSpacing: 6, fontWeight: '800' }]}
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity
                style={[styles.buttonEmerald, loading && styles.disabled]}
                onPress={verifyOtp}
                disabled={loading || !code.trim()}
              >
                <Text style={styles.buttonCoralText}>
                  {loading ? 'Vérification...' : 'Confirmer et me connecter'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoWrap: { marginBottom: 12 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.coral,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  buttonCoral: {
    backgroundColor: colors.coral,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonEmerald: {
    backgroundColor: colors.emerald,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonCoralText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  disabled: { opacity: 0.6 },
  error: { color: '#DC2626', fontSize: 12, fontWeight: '600', marginTop: 10 },
  devBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
});
