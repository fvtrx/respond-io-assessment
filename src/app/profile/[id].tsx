import { Avatar } from "@/components/Avatar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useContact } from "@/hooks/queries";
import { theme } from "@/lib/theme";
import { useBlockedContactsStore } from "@/store/blockedContactStore";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ShieldOff,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const userId = Number(params.id);
  const fallbackName = params.name ?? "Contact";
  const fallbackAvatar = params.avatar || undefined;
  const insets = useSafeAreaInsets();

  const { data: user, isLoading, isError } = useContact(userId);
  const blocked = useBlockedContactsStore();
  const isBlocked = blocked.isBlocked(userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const name = user?.name ?? fallbackName;
  const avatar = user?.avatar ?? fallbackAvatar;

  const handleToggleBlock = () => {
    setActionError(null);
    setModalVisible(true);
  };

  const confirmToggle = async () => {
    setModalVisible(false);
    setToggling(true);
    setActionError(null);
    try {
      if (isBlocked) {
        await blocked.unblockContact(userId);
      } else {
        await blocked.blockContact(userId, name, avatar ?? null);
      }
    } catch {
      setActionError(
        isBlocked
          ? "Unable to unblock. Please try again."
          : "Unable to block. Please try again.",
      );
    } finally {
      setToggling(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary[400], theme.colors.primary[600]]}
        style={[
          styles.heroGradient,
          { paddingTop: insets.top + theme.spacing.lg },
        ]}
      >
        <View style={styles.heroHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <ArrowLeft
              size={22}
              color={theme.colors.textInverse}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>Profile</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.heroContent}>
          <Avatar uri={avatar} name={name} size={96} />
          <Text style={styles.heroName}>{name}</Text>
          <Text style={styles.heroHandle}>@{user?.username ?? "user"}</Text>
          {isBlocked ? (
            <View style={styles.blockedPill}>
              <ShieldOff size={14} color={theme.colors.error} strokeWidth={2} />
              <Text style={styles.blockedPillText}>Blocked</Text>
            </View>
          ) : null}
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <AlertCircle
            size={40}
            color={theme.colors.neutral[300]}
            strokeWidth={2}
          />
          <Text style={styles.errorTitle}>Couldn't load profile</Text>
          <Text style={styles.errorMessage}>
            Please check your connection and try again.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MessageCircle
              size={20}
              color={theme.colors.primary[500]}
              strokeWidth={2}
            />
            <Text style={styles.messageBtnText}>Send Message</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <InfoRow
              icon={
                <Phone
                  size={20}
                  color={theme.colors.primary[500]}
                  strokeWidth={2}
                />
              }
              label="Phone"
              value={user?.phone ?? "—"}
            />
            <Divider />
            <InfoRow
              icon={
                <Mail
                  size={20}
                  color={theme.colors.primary[500]}
                  strokeWidth={2}
                />
              }
              label="Email"
              value={user?.email ?? "—"}
            />
            {user?.website ? (
              <>
                <Divider />
                <InfoRow
                  icon={
                    <Globe
                      size={20}
                      color={theme.colors.primary[500]}
                      strokeWidth={2}
                    />
                  }
                  label="Website"
                  value={user.website}
                />
              </>
            ) : null}
            {user?.address ? (
              <>
                <Divider />
                <InfoRow
                  icon={
                    <MapPin
                      size={20}
                      color={theme.colors.primary[500]}
                      strokeWidth={2}
                    />
                  }
                  label="Address"
                  value={
                    [user.address.street, user.address.city]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
              </>
            ) : null}
          </View>

          {actionError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{actionError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              isBlocked ? styles.unblockBtn : styles.blockBtn,
            ]}
            onPress={handleToggleBlock}
            disabled={toggling}
            activeOpacity={0.7}
          >
            {toggling ? (
              <ActivityIndicator
                size="small"
                color={
                  isBlocked
                    ? theme.colors.primary[500]
                    : theme.colors.textInverse
                }
              />
            ) : (
              <>
                {isBlocked ? (
                  <ShieldOff
                    size={20}
                    color={theme.colors.primary[500]}
                    strokeWidth={2}
                  />
                ) : (
                  <Shield
                    size={20}
                    color={theme.colors.textInverse}
                    strokeWidth={2}
                  />
                )}
                <Text
                  style={[
                    styles.toggleBtnText,
                    isBlocked ? styles.unblockBtnText : styles.blockBtnText,
                  ]}
                >
                  {isBlocked ? "Unblock Contact" : "Block Contact"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ConfirmModal
        visible={modalVisible}
        title={isBlocked ? "Unblock this contact?" : "Block this contact?"}
        message={
          isBlocked
            ? `${name} will be able to send you messages again.`
            : `${name} will no longer be able to send you messages. You can unblock them at any time.`
        }
        confirmLabel={isBlocked ? "Unblock" : "Block"}
        destructive={!isBlocked}
        onConfirm={confirmToggle}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
  heroGradient: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: theme.typography.bodyLarge,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textInverse,
  },
  heroContent: {
    alignItems: "center",
  },
  heroName: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.headline,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textInverse,
  },
  heroHandle: {
    marginTop: 2,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textInverse,
    opacity: 0.8,
  },
  blockedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: theme.spacing.sm,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
  },
  blockedPillText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textInverse,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  messageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 13,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[50],
    marginBottom: theme.spacing.md,
  },
  messageBtnText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.primary[500],
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[50],
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.neutral[100],
    marginLeft: 36 + theme.spacing.md + theme.spacing.md,
  },
  errorBox: {
    backgroundColor: theme.colors.error + "1a",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    marginBottom: theme.spacing.md,
  },
  errorBoxText: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.error,
    textAlign: "center",
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
  },
  blockBtn: {
    backgroundColor: theme.colors.error,
  },
  unblockBtn: {
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  toggleBtnText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
  },
  blockBtnText: {
    color: theme.colors.textInverse,
  },
  unblockBtnText: {
    color: theme.colors.primary[500],
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  errorTitle: {
    fontSize: theme.typography.title,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
  },
  errorMessage: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
