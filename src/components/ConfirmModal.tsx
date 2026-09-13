import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import { theme } from '@/lib/theme';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <View style={[styles.iconCircle, destructive && styles.iconCircleDestructive]}>
              <Shield size={24} color={destructive ? theme.colors.error : theme.colors.primary[500]} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, destructive ? styles.destructiveButton : styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  iconWrap: { marginBottom: theme.spacing.md },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[50],
  },
  iconCircleDestructive: {
    backgroundColor: theme.colors.error + '1a',
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
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.neutral[100],
  },
  confirmButton: {
    backgroundColor: theme.colors.primary[500],
  },
  destructiveButton: {
    backgroundColor: theme.colors.error,
  },
  cancelText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
  },
  confirmText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textInverse,
  },
});
