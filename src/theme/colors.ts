export interface ColorPalette {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryTextOnAccent: string;
  accentSurface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFocus: string;
  success: string;
  warning: string;
  error: string;
  overlay: string;
  skeletonHighlight: string;
  skeletonBackground: string;
  inputBackground: string;
}

export const darkColors: ColorPalette = {
  background: '#101820',
  surface: '#18232D',
  card: '#202C36',
  primary: '#C5F451',
  primaryTextOnAccent: '#101820',
  accentSurface: '#243427',
  textPrimary: '#F8FAFC',
  textSecondary: '#AAB4C0',
  textMuted: '#6B7A88',
  border: '#34414D',
  borderFocus: '#C5F451',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeletonHighlight: '#2A3845',
  skeletonBackground: '#1A2530',
  inputBackground: '#18232D',
};

export const lightColors: ColorPalette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#365314',
  primaryTextOnAccent: '#FFFFFF',
  accentSurface: '#E9F8D0',
  textPrimary: '#101820',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderFocus: '#365314',
  success: '#15803D',
  warning: '#B45309',
  error: '#DC2626',
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeletonHighlight: '#F1F5F9',
  skeletonBackground: '#E2E8F0',
  inputBackground: '#F1F5F9',
};
