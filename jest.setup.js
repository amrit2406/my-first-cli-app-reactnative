/* eslint-env jest */
// LESSON: MOCKING NATIVE MODULES
// Jest runs on your computer, in Node, where there is no Android/iOS.
// Libraries that call native code must be replaced ("mocked") with simple
// JavaScript stand-ins for tests.

// In-memory AsyncStorage: same API, but data lives in a plain object.
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  const api = {
    getItem: async key => (key in store ? store[key] : null),
    setItem: async (key, value) => {
      store[key] = value;
    },
    removeItem: async key => {
      delete store[key];
    },
    clear: async () => {
      store = {};
    },
  };
  return { __esModule: true, default: api, ...api };
});

// The safe-area library ships its own official mock.
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});
