import { StyleSheet, View } from 'react-native';
import { theme } from '@/lib/theme';
import { Skeleton } from '@/components/Skeleton';

export function ChatRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={52} height={52} radius={26} />
      <View style={styles.content}>
        <View style={styles.lineRow}>
          <Skeleton width={140} height={16} />
          <Skeleton width={40} height={12} />
        </View>
        <Skeleton width={210} height={14} />
      </View>
    </View>
  );
}

export function ChatListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <ChatRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
