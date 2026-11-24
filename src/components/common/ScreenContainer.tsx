import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  withTopInset?: boolean;
  withBottomInset?: boolean;
  refreshControl?: React.ReactElement;
  keyboardAvoiding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  contentContainerStyle,
  style,
  withTopInset = true,
  withBottomInset = false,
  refreshControl,
  keyboardAvoiding = false,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.(colors.background, true);
    }
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [colors.background, isDark]);

  const containerPadding = {
    paddingTop: withTopInset ? insets.top : 0,
    paddingBottom: withBottomInset ? insets.bottom : 0,
  };

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        containerPadding,
        style,
      ]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  fixedContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
