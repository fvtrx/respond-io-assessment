import { theme } from "@/lib/theme";
import { useAuth } from "@/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function IndexScreen() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  }

  return <Redirect href={user ? "/(tabs)" : "/auth"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});
