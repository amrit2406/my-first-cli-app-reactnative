/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// LESSON: INTEGRATION TEST
// Renders the whole app (all providers + navigation) and checks what the
// user would see. AsyncStorage is mocked in jest.setup.js, so there is no
// saved session -> the app must show the Login screen.
test('a signed-out user sees the login screen', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });

  // let the "restore saved session" promise finish
  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  });

  const screen = JSON.stringify(tree.toJSON());
  expect(screen).toContain('Welcome back');
  expect(screen).toContain('Sign in');
});
