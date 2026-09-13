import { theme } from "@/lib/theme";
import { formatTime } from "@/utils/format";
import { CheckCheck } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type MessageBubbleProps = {
  body: string;
  direction: "incoming" | "outgoing";
  createdAt?: string;
};

export function MessageBubble({
  body,
  direction,
  createdAt,
}: MessageBubbleProps) {
  const isOutgoing = direction === "outgoing";
  return (
    <View
      style={[styles.row, isOutgoing ? styles.rowOutgoing : styles.rowIncoming]}
    >
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
        ]}
      >
        <Text
          style={[
            styles.body,
            isOutgoing ? styles.bodyOutgoing : styles.bodyIncoming,
          ]}
        >
          {body}
        </Text>
        <View style={styles.metaRow}>
          {isOutgoing ? (
            <CheckCheck
              size={14}
              color={theme.colors.textInverse}
              strokeWidth={2}
              opacity={0.7}
            />
          ) : null}
          {createdAt ? (
            <Text
              style={[
                styles.time,
                isOutgoing ? styles.timeOutgoing : styles.timeIncoming,
              ]}
            >
              {formatTime(createdAt)}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: theme.spacing.md,
    marginVertical: 3,
  },
  rowIncoming: { alignItems: "flex-start" },
  rowOutgoing: { alignItems: "flex-end" },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
  },
  bubbleIncoming: {
    backgroundColor: theme.colors.incomingBubble,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  bubbleOutgoing: {
    backgroundColor: theme.colors.outgoingBubble,
    borderBottomRightRadius: 4,
  },
  body: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: 21,
  },
  bodyIncoming: { color: theme.colors.incomingText },
  bodyOutgoing: { color: theme.colors.outgoingText },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  time: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyRegular,
  },
  timeIncoming: { color: theme.colors.textSecondary },
  timeOutgoing: { color: theme.colors.textInverse, opacity: 0.7 },
});
