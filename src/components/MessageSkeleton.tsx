import { Skeleton } from "@/components/Skeleton";
import { theme } from "@/lib/theme";
import { StyleSheet, View } from "react-native";

export function MessageSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.rowIncoming}>
        <View style={styles.bubbleIncoming}>
          <Skeleton width={180} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={120} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={80} height={10} />
        </View>
      </View>
      <View style={styles.rowOutgoing}>
        <View style={styles.bubbleOutgoing}>
          <Skeleton width={140} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={60} height={10} />
        </View>
      </View>
      <View style={styles.rowIncoming}>
        <View style={styles.bubbleIncoming}>
          <Skeleton width={200} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={150} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={80} height={10} />
        </View>
      </View>
      <View style={styles.rowOutgoing}>
        <View style={styles.bubbleOutgoing}>
          <Skeleton width={100} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={60} height={10} />
        </View>
      </View>
      <View style={styles.rowIncoming}>
        <View style={styles.bubbleIncoming}>
          <Skeleton width={160} height={14} />
          <View style={{ height: 6 }} />
          <Skeleton width={80} height={10} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  rowIncoming: {
    width: "100%",
    paddingHorizontal: theme.spacing.md,
    alignItems: "flex-start",
    marginVertical: 3,
  },
  rowOutgoing: {
    width: "100%",
    paddingHorizontal: theme.spacing.md,
    alignItems: "flex-end",
    marginVertical: 3,
  },
  bubbleIncoming: {
    maxWidth: "75%",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.colors.incomingBubble,
  },
  bubbleOutgoing: {
    maxWidth: "75%",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderBottomRightRadius: 4,
    backgroundColor: theme.colors.neutral[100],
  },
});
