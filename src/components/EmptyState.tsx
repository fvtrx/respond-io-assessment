import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { theme } from '@/lib/theme';

type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: ReactNode;
};

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  iconWrap: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.title,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
