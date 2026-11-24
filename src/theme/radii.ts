export const radii = {
  xs: 4,
  sm: 8,
  input: 12,
  button: 14,
  card: 16,
  modal: 20,
  chip: 20,
  full: 9999,
} as const;

export type Radii = typeof radii;
