import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../theme';
import {
  AppText,
  AppButton,
  AppTextInput,
  PasswordInput,
  ScreenContainer,
} from '../../../components/common';
import { loginSchema, LoginFormData } from '../schemas/authSchemas';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../authSlice';
import { saveSecureTokens } from '../../../storage/secureStorage';
import { saveCachedUserProfile } from '../../../storage/preferencesStorage';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors, spacing, radii } = useTheme();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await login({
        username: data.username.trim(),
        password: data.password,
        expiresInMins: 1440,
      }).unwrap();

      const token = response.accessToken || response.token || '';
      const refreshToken = response.refreshToken || '';

      // Securely persist tokens in Keychain/Keystore
      await saveSecureTokens(token, refreshToken);

      const userProfile = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        image: response.image,
      };

      // Save non-sensitive user profile in AsyncStorage for offline usage
      await saveCachedUserProfile(userProfile);

      // Update Redux state
      dispatch(
        setCredentials({
          user: userProfile,
        })
      );
    } catch (err: any) {
      const message =
        err?.data?.message ||
        (err?.status === 'FETCH_ERROR'
          ? 'Network error. Please check your internet connection.'
          : 'Invalid username or password.');
      setApiError(message);
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
    setApiError(null);
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding withTopInset>
      <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={[styles.logoBadge, { backgroundColor: colors.accentSurface }]}>
            <Feather name="activity" size={32} color={colors.primary} />
          </View>
          <AppText variant="display" style={styles.brandTitle}>
            Scoreline
          </AppText>
          <AppText variant="screenTitle" style={styles.tagline}>
            Your game. Your world.
          </AppText>
          <AppText variant="body" secondary style={styles.description}>
            Discover teams, follow leagues, and stay connected with real sports updates.
          </AppText>
        </View>

        {/* Demo Credentials Quick-Fill Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={fillDemoCredentials}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Auto-fill demo credentials: emilys / emilyspass"
          style={[
            styles.demoBanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.card,
            },
          ]}>
          <View style={[styles.demoIcon, { backgroundColor: colors.accentSurface }]}>
            <Feather name="key" size={16} color={colors.primary} />
          </View>
          <View style={styles.demoContent}>
            <AppText variant="label" style={{ color: colors.primary }}>
              Quick Demo Login
            </AppText>
            <AppText variant="caption" secondary>
              Tap to auto-fill (emilys / emilyspass)
            </AppText>
          </View>
          <Feather name="arrow-right" size={16} color={colors.primary} />
        </TouchableOpacity>

        {/* API Error Feedback */}
        {apiError ? (
          <View
            accessible={true}
            accessibilityRole="alert"
            style={[
              styles.errorBanner,
              {
                backgroundColor: colors.error + '18',
                borderColor: colors.error,
                borderRadius: radii.input,
              },
            ]}>
            <Feather name="alert-triangle" size={18} color={colors.error} style={styles.errorIcon} />
            <AppText variant="bodySmall" style={{ color: colors.error, flex: 1 }}>
              {apiError}
            </AppText>
          </View>
        ) : null}

        {/* Login Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="Username"
                placeholder="Enter your username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Feather name="user" size={18} color={colors.textSecondary} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={<Feather name="lock" size={18} color={colors.textSecondary} />}
              />
            )}
          />

          <AppButton
            title="Sign In"
            onPress={() => handleSubmit(onSubmit)()}
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.registerRow}>
            <AppText variant="bodySmall" secondary>
              Don't have an account?{' '}
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppText variant="bodyBold" style={{ color: colors.primary }}>
                Create Account
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  demoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demoContent: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 10,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
