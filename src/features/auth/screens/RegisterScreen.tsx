import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
  AppHeader,
  ConfirmationDialog,
} from '../../../components/common';
import { registerSchema, RegisterFormData } from '../schemas/authSchemas';
import { useRegisterMutation } from '../api/authApi';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { colors, spacing, radii } = useTheme();
  const [register, { isLoading }] = useRegisterMutation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const response = await register({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        username: data.username.trim().toLowerCase(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }).unwrap();

      setRegisteredUsername(response.username || data.username);
      setShowSimulatedModal(true);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        (err?.status === 'FETCH_ERROR'
          ? 'Network error. Please check your internet connection.'
          : 'Registration failed. Please check your details and try again.');
      setApiError(message);
    }
  };

  const handleSimulatedSuccessConfirm = () => {
    setShowSimulatedModal(false);
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding withTopInset>
      <AppHeader
        showBack
        onBack={() => navigation.goBack()}
        title="Create Account"
      />

      <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
        <AppText variant="screenTitle" style={styles.title}>
          Join Scoreline
        </AppText>
        <AppText variant="body" secondary style={styles.subtitle}>
          Create an account to track your favourite clubs and leagues.
        </AppText>

        {/* DummyJSON Notice Banner */}
        <View
          style={[
            styles.noticeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.card,
            },
          ]}>
          <Feather name="info" size={18} color={colors.primary} style={styles.noticeIcon} />
          <AppText variant="caption" secondary style={styles.noticeText}>
            Note: DummyJSON mock API simulates user creation. Real authentication on the next screen uses the verified demo credentials (emilys / emilyspass).
          </AppText>
        </View>

        {/* Error Banner */}
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
            <AppText variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
              {apiError}
            </AppText>
          </View>
        ) : null}

        {/* Registration Fields */}
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  label="First Name"
                  placeholder="John"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                />
              )}
            />
          </View>
          <View style={styles.nameField}>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  label="Last Name"
                  placeholder="Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Username"
              placeholder="e.g. johndoe"
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
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Email"
              placeholder="john@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Feather name="mail" size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label="Password"
              placeholder="Minimum 8 characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              leftIcon={<Feather name="lock" size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              leftIcon={<Feather name="shield" size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <AppButton
          title="Create Account"
          onPress={() => handleSubmit(onSubmit)()}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.loginRow}>
          <AppText variant="bodySmall" secondary>
            Already have an account?{' '}
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppText variant="bodyBold" style={{ color: colors.primary }}>
              Sign In
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation of Simulated Registration */}
      <ConfirmationDialog
        visible={showSimulatedModal}
        icon="check-circle"
        title="Registration Simulated"
        message={`Welcome ${registeredUsername}! DummyJSON registration is simulated and does not store live credentials on its public mock server. Please sign in with the official demo account (emilys / emilyspass).`}
        confirmText="Go to Sign In"
        cancelText="Close"
        onConfirm={handleSimulatedSuccessConfirm}
        onCancel={handleSimulatedSuccessConfirm}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 16,
  },
  noticeCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  noticeIcon: {
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    lineHeight: 18,
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
  errorText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
