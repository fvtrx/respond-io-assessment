import { Avatar } from "@/components/Avatar";
import { theme } from "@/lib/theme";
import type { ApiUser } from "@/lib/types";
import { useBlockedContactsStore } from "@/store/blockedContactStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ConversationRowProps = {
  user: ApiUser;
  onPress: (user: ApiUser) => void;
  lastMessage?: string;
  timestamp?: string;
};

export function ConversationRow({
  user,
  onPress,
  lastMessage,
  timestamp,
}: ConversationRowProps) {
  const isBlocked = useBlockedContactsStore((s) => s.isBlocked(user.id));

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(user)}
      activeOpacity={0.6}
    >
      <View style={styles.avatarWrap}>
        <Avatar uri={user.avatar} name={user.name} size={52} />
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          {timestamp ? <Text style={styles.time}>{timestamp}</Text> : null}
        </View>
        <View style={styles.previewRow}>
          {isBlocked ? (
            <View style={styles.blockedBadge}>
              <Text style={styles.blockedText}>Blocked</Text>
            </View>
          ) : null}
          <Text style={styles.preview} numberOfLines={1}>
            {lastMessage ?? "Tap to start chatting"}
          </Text>
        </View>
      </View>
      {!isBlocked ? (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>2</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  avatarWrap: {
    position: "relative",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: theme.colors.accent[500],
    borderWidth: 2.5,
    borderColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
    gap: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: theme.typography.bodyLarge,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
  },
  time: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  preview: {
    flex: 1,
    fontSize: theme.typography.body - 1,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
  },
  blockedBadge: {
    backgroundColor: theme.colors.error + "1a",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  blockedText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.error,
  },
  unreadBadge: {
    top: -9,
    left: 8,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[500],
  },
  unreadText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textInverse,
  },
});
