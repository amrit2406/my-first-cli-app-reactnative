import React, {
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import { usePersistentState } from './usePersistentState';

// LESSON: THEMING
// Never hard-code colours inside components. Give every colour a ROLE
// ("card", "text", "primary") and define each role once per theme.
// Components ask for roles, so switching theme = swapping one object.

export type Colors = {
  background: string; // screen background
  card: string; // cards, inputs, sheets
  surface: string; // chips, placeholders, subtle fills
  text: string; // main text
  textSubtle: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primarySoft: string;
  onPrimary: string; // text/icons on top of `primary`
  danger: string;
  warning: string;
};

const light: Colors = {
  background: '#F1F5F9',
  card: '#FFFFFF',
  surface: '#E2E8F0',
  text: '#0F172A',
  textSubtle: '#475569',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  onPrimary: '#FFFFFF',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const dark: Colors = {
  background: '#0B1120',
  card: '#1E293B',
  surface: '#334155',
  text: '#F1F5F9',
  textSubtle: '#CBD5E1',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  primary: '#3B82F6',
  primarySoft: '#1E3A8A',
  onPrimary: '#FFFFFF',
  danger: '#F87171',
  warning: '#FBBF24',
};

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeValue = {
  colors: Colors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // the phone's own light/dark setting
  const [mode, setMode] = usePersistentState<ThemeMode>('theme-v1', 'system');

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const value = useMemo<ThemeValue>(
    () => ({ colors: isDark ? dark : light, isDark, mode, setMode }),
    [isDark, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

// Pattern used by every screen:
//   const makeStyles = (c: Colors) => StyleSheet.create({ ... });   // module level
//   const { styles, colors } = useStyles(makeStyles);                // in component
// The styles are rebuilt only when the theme changes.
export function useStyles<T>(factory: (c: Colors) => T) {
  const { colors } = useTheme();
  const styles = useMemo(() => factory(colors), [factory, colors]);
  return { styles, colors };
}
