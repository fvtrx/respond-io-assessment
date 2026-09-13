import { StyleSheet, View } from 'react-native';
import { theme } from '@/lib/theme';

export function Skeleton({ width, height, radius = theme.radius.sm }: { width: number | string; height: number; radius?: number }) {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius: radius },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.neutral[200],
  },
});
