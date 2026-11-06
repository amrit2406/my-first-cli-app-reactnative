import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from './api';
import { User } from './types';

// LESSON: AUTH FLOW
// 1. On app start, look for a saved session. Show a spinner meanwhile.
// 2. login() calls the API and saves the session.
// 3. The navigator shows Login or the app depending on whether `user` exists.
//
// NOTE: AsyncStorage is NOT encrypted. Real apps keep tokens in secure
// storage (Android Keystore / iOS Keychain) via a library like
// react-native-keychain. Fine for learning, not for production.

type AuthContextValue = {
  user: User | null;
  restoring: boolean; // true while checking for a saved session
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = 'auth-v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(saved => {
        if (saved) {
          setUser(JSON.parse(saved).user);
        }
      })
      .catch(() => {})
      .finally(() => setRestoring(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const session = await apiLogin(username, password); // throws on bad credentials
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(KEY).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, restoring, login, logout }),
    [user, restoring, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
