import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// LESSON: CUSTOM HOOK
// A custom hook is just a function starting with "use" that bundles
// useState/useEffect logic so you can reuse it.
//
// This one behaves like useState, but the value is also saved to phone
// storage and restored on the next app start.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  // 1) Load once on start
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then(saved => {
        if (!cancelled && saved) {
          setValue(JSON.parse(saved));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  // 2) Save whenever the value changes (but only after the first load,
  //    otherwise we'd overwrite saved data with the initial value)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
