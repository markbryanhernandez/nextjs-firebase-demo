import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../../features/auth/AuthProvider';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
  initializeApp: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
  User: class {},
}));

describe('AuthProvider', () => {
  it('provides user as null initially', async () => {
    let user: ReturnType<typeof useAuth>['user'] | undefined;
    function TestComponent() {
      user = useAuth().user;
      return <div>Test</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => expect(user).toBeNull());
  });

  it('calls login, signup, and logout', async () => {
    let context: ReturnType<typeof useAuth> | undefined;
    function TestComponent() {
      context = useAuth();
      return <div>Test</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    if (!context) throw new Error('Context not set');
    await context.login('test@example.com', 'password');
    await context.signup('test@example.com', 'password');
    await context.logout();
    expect(context.user).toBeNull();
  });
});
