import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../AuthContext';
import { Colors, useStyles } from '../theme';

export default function LoginScreen() {
  const { styles, colors } = useStyles(makeStyles);
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // LESSON: useMutation = Query's tool for actions that CHANGE things
  // (login, post, delete). It tracks isPending / error for us.
  const mutation = useMutation({
    mutationFn: ({ u, p }: { u: string; p: string }) => login(u, p),
    // On success `user` becomes non-null and the navigator swaps to the
    // app by itself. There is no navigate() call here.
  });

  // useRef on a TextInput lets us control it from code (e.g. focus()).
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const submitting = mutation.isPending;
  const error = formError ?? mutation.error?.message ?? null;

  const submit = () => {
    if (!username.trim() || !password) {
      setFormError('Please enter your username and password.');
      return;
    }
    setFormError(null);
    mutation.mutate({ u: username.trim(), p: password });
  };

  const fillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setFormError(null);
    mutation.reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Moves content up when the keyboard opens */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>🛍</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.textFaint}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textFaint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={submit}
          />

          {error && <Text style={styles.error}>⚠ {error}</Text>}

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={submit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>

          <View style={styles.demo}>
            <Text style={styles.demoText}>Just exploring?</Text>
            <Pressable onPress={fillDemo}>
              <Text style={styles.demoLink}>Use the demo account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) => StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: c.card },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 56, textAlign: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: c.text,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  input: {
    backgroundColor: c.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: c.text,
    marginBottom: 12,
  },
  error: { color: c.danger, marginBottom: 12, fontSize: 14 },
  button: {
    backgroundColor: c.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: c.onPrimary, fontSize: 16, fontWeight: 'bold' },
  demo: { alignItems: 'center', marginTop: 24, gap: 4 },
  demoText: { color: c.textFaint, fontSize: 13 },
  demoLink: { color: c.primary, fontSize: 14, fontWeight: '600' },
});
