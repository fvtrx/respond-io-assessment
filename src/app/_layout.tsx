import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { queryClient } from "@/lib/queryClient";
import { theme } from "@/lib/theme";
import { useAuthStore } from "@/store/authStore";
import { useBlockedContactsStore } from "@/store/blockedContactStore";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  const user = useAuthStore((s) => s.user);
  const init = useAuthStore((s) => s.init);
  const resetBlocked = useBlockedContactsStore((s) => s.reset);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!user) resetBlocked();
  }, [user, resetBlocked]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="profile/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
