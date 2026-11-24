import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
};
