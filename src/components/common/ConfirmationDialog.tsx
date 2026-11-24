import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  icon = 'alert-triangle',
}) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onCancel}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.dialog,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: radii.modal,
              padding: spacing.xl,
            },
          ]}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDestructive
                  ? colors.error + '20'
                  : colors.accentSurface,
              },
            ]}>
            <Feather
              name={icon}
              size={24}
              color={isDestructive ? colors.error : colors.primary}
            />
          </View>
          <AppText variant="sectionTitle" center style={styles.title}>
            {title}
          </AppText>
          <AppText variant="body" secondary center style={styles.message}>
            {message}
          </AppText>
          <View style={styles.actions}>
            <AppButton
              title={cancelText}
              variant="secondary"
              onPress={onCancel}
              style={styles.actionBtn}
              size="small"
            />
            <AppButton
              title={confirmText}
              variant={isDestructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.actionBtn}
              size="small"
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
