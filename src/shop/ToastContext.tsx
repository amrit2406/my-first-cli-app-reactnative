import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, useStyles } from './theme';

// LESSON: GLOBAL UI FEEDBACK
// A toast is a short message that fades in, then out ("Added to cart").
// Any component can call `showToast(...)` from anywhere via context, and
// ONE <ToastHost> near the root draws it above everything else.

type ToastValue = { showToast: (message: string) => void };
const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { styles } = useStyles(makeStyles);

  const showToast = useCallback(
    (text: string) => {
      if (timer.current) {
        clearTimeout(timer.current); // a new toast replaces the old one
      }
      setMessage(text);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setMessage(null));
      }, 1800);
    },
    [opacity],
  );

  // cleanup if the provider ever unmounts
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.fill}>
        {children}
        {message !== null && (
          // pointerEvents none = taps pass through to the screen below
          <Animated.View
            pointerEvents="none"
            style={[styles.toast, { opacity }]}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.text}>{message}</Text>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    fill: { flex: 1 },
    toast: {
      position: 'absolute',
      bottom: 100, // above the tab bar
      alignSelf: 'center',
      maxWidth: '85%',
      backgroundColor: c.text,
      borderRadius: 24,
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    text: { color: c.background, fontSize: 14, fontWeight: '600' },
  });
