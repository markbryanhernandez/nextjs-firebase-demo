import { render, waitFor, act } from '@testing-library/react';
import React from 'react';
import {
  mockOnAuthStateChanged,
  mockSignInWithEmailAndPassword,
  mockCreateUserWithEmailAndPassword,
  mockSignOut,
} from '../../../test-utils/mockFirebaseAuth';

// Setup the Firebase auth mocks
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: mockOnAuthStateChanged,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signOut: mockSignOut,
  User: class {},
}));

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('updates user when auth state changes', async () => {
    let context: ReturnType<typeof useAuth> | undefined;
    function TestComponent() {
      context = useAuth();
      return <div>Test</div>;
    }

    // Setup mock to return a user
    const mockUser = { uid: '123', email: 'test@example.com' };
    mockOnAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(context?.user).toEqual(mockUser);
      expect(context?.loading).toBe(false);
    });
  });

  it('calls Firebase signInWithEmailAndPassword during login', async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    let auth: ReturnType<typeof useAuth>;
    function TestComponent() {
      auth = useAuth();
      return <div>Test</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await auth.login(testEmail, testPassword);
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      testEmail,
      testPassword
    );
  });

  it('calls Firebase createUserWithEmailAndPassword during signup', async () => {
    const testEmail = 'newuser@example.com';
    const testPassword = 'newpassword123';

    let auth: ReturnType<typeof useAuth>;
    function TestComponent() {
      auth = useAuth();
      return <div>Test</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await auth.signup(testEmail, testPassword);
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      testEmail,
      testPassword
    );
  });

  it('calls Firebase signOut during logout', async () => {
    let auth: ReturnType<typeof useAuth>;
    function TestComponent() {
      auth = useAuth();
      return <div>Test</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await auth.logout();
    });

    expect(mockSignOut).toHaveBeenCalledWith(expect.anything());
  });

  it('handles login errors properly', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('Auth error'));

    let auth!: ReturnType<typeof useAuth>;
    function TestComponent() {
      auth = useAuth();
      return <div>Test</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await expect(auth.login('test@example.com', 'password')).rejects.toThrow('Auth error');
  });

  it('throws if useAuth is used outside AuthProvider', () => {
    function TestComponent() {
      useAuth();
      return <div />;
    }
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
