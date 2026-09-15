import { theme } from "@/lib/theme";
import { useAuthStore } from "@/store/authStore";
import { useBlockedContactsStore } from "@/store/blockedContactStore";
import { router } from "expo-router";
import { ChevronRight, Info, LogOut, Phone } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const resetBlocked = useBlockedContactsStore((s) => s.reset);
  const name = user?.name;

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return value; // e.g. "Unknown"

    if (digits.startsWith("60")) {
      const m = digits.slice(2).match(/^(\d{2})(\d+)(\d{4})$/);
      return m ? `+60 ${m[1]}-${m[2]} ${m[3]}` : `+${digits}`;
    }

    const m = digits.match(/^(\d{3})(\d{3})(\d{1,4})$/);
    return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          resetBlocked();
          await signOut();
        },
      },
    ]);
  };

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}
      >
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitial}>
              {name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <RowItem
              icon={
                <Phone
                  size={20}
                  color={theme.colors.primary[500]}
                  strokeWidth={2}
                />
              }
              label="Phone"
              value={formatPhoneNumber(user?.phone ?? "Unknown")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <RowItem
              icon={
                <Info
                  size={20}
                  color={theme.colors.primary[500]}
                  strokeWidth={2}
                />
              }
              label="App Version"
              value="1.0.0"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={theme.colors.error} strokeWidth={2} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Built with React Native, Expo, React Query & Zustand
        </Text>
      </ScrollView>
    </View>
  );
}

function RowItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.rowItem}>
      <View style={styles.rowIconWrap}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function NavRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.rowItem}>
      <View style={styles.rowIconWrap}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight
        size={18}
        color={theme.colors.neutral[300]}
        strokeWidth={2}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primary[500],
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  profileIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[500],
  },
  profileInitial: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textInverse,
  },
  profileInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.bodyLarge,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
  },
  profileHandle: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[50],
    marginRight: theme.spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
  },
  rowValue: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    maxWidth: 140,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.neutral[100],
    marginLeft: 36 + theme.spacing.md + theme.spacing.md,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.error + "33",
    marginBottom: theme.spacing.lg,
  },
  signOutText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.error,
  },
  footer: {
    textAlign: "center",
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.neutral[400],
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});
