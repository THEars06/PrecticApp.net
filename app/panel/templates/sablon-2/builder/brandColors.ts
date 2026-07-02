export const GISE_BRAND = {
  primary: '#ae256c',
  secondary: '#20213f',
  primaryLight: '#fdf2f7',
  textMuted: '#6b7280',
  textBody: '#4b4c5f',
  border: '#e5e7eb',
  white: '#ffffff',
  outerBg: '#f3f4f6',
  contentBg: '#ffffff',
} as const;

export const BRAND_BG_PRESETS = [
  { label: 'Beyaz', color: GISE_BRAND.white },
  { label: 'Açık', color: GISE_BRAND.primaryLight },
  { label: 'Pembe', color: GISE_BRAND.primary },
  { label: 'Lacivert', color: GISE_BRAND.secondary },
  { label: 'Gri', color: GISE_BRAND.outerBg },
] as const;
