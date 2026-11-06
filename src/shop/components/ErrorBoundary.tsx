import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, useStyles } from '../theme';

// LESSON: ERROR BOUNDARY
// If a component throws while rendering, React unmounts the WHOLE app
// (white screen in production). An error boundary catches the crash and
// shows a fallback instead. Boundaries must be CLASS components; there is
// no hook equivalent yet.

type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real app, send this to Sentry / Firebase Crashlytics.
    console.error('Uncaught error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error;
  onReset: () => void;
}) {
  const { styles } = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😵</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message} numberOfLines={3}>
        {__DEV__ ? error.message : 'An unexpected error occurred.'}
      </Text>
      <Pressable
        style={styles.button}
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: c.background,
    },
    emoji: { fontSize: 56 },
    title: { fontSize: 22, fontWeight: 'bold', color: c.text, marginTop: 12 },
    message: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 24,
    },
    button: {
      backgroundColor: c.primary,
      borderRadius: 12,
      paddingHorizontal: 28,
      paddingVertical: 12,
    },
    buttonText: { color: c.onPrimary, fontWeight: 'bold', fontSize: 15 },
  });
