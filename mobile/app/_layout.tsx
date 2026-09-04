import React, { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../lib/auth-context';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../lib/theme';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from '../lib/notifications';

function RootNavigator() {
  const { isLoading, authToken } = useAuth();
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (authToken) registerForPushNotifications(authToken);
  }, [authToken]);

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string; conversationId?: string; productId?: string };
      if (data?.type === 'new_message' && data.conversationId) {
        router.push(`/conversation/${data.conversationId}`);
      } else if (data?.type === 'new_product' && data.productId) {
        router.push(`/product/${data.productId}`);
      }
    });
    return () => responseListener.current?.remove();
  }, [router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.emerald} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!authToken}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="conversation/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!authToken}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
