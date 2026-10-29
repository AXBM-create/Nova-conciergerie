export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  gold: string;
  goldText: string;
  heroStart: string;
  heroEnd: string;
  onHero: string;
  onHeroMuted: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
};

export const light: Palette = {
  bg: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F2ECE2',
  text: '#0B132B',
  textMuted: '#555C6E',
  border: '#E5DCCD',
  primary: '#0B132B',
  onPrimary: '#FAF7F2',
  gold: '#C5A880',
  goldText: '#7E5F2C',
  heroStart: '#0B132B',
  heroEnd: '#1F2B4D',
  onHero: '#FAF7F2',
  onHeroMuted: '#C9CEDB',
  success: '#22704F',
  warning: '#94570A',
  danger: '#A8261E',
  overlay: 'rgba(11,19,43,0.55)',
};

export const dark: Palette = {
  bg: '#070D1F',
  surface: '#0F1830',
  surfaceAlt: '#17223F',
  text: '#F4EFE6',
  textMuted: '#AEB5C6',
  border: '#26324F',
  primary: '#D4B47A',
  onPrimary: '#0B132B',
  gold: '#D4B47A',
  goldText: '#D9BC86',
  heroStart: '#111B36',
  heroEnd: '#22305A',
  onHero: '#F4EFE6',
  onHeroMuted: '#BCC3D4',
  success: '#5CC495',
  warning: '#E5A54B',
  danger: '#F08A80',
  overlay: 'rgba(0,0,0,0.6)',
};

export const fonts = {
  title: 'PlayfairDisplay_700Bold',
  titleSemi: 'PlayfairDisplay_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semi: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
