import { render, waitFor, act } from '@testing-library/react';
import React from 'react';
import { mockOnAuthStateChanged, mockSignOut } from '../../../test-utils/mockFirebaseAuth';

// Setup the Firebase auth mocks
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: mockOnAuthStateChanged,
  signOut: mockSignOut,
  User: class {},
}));

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

describe('AuthProvider (Google Sign-In only)', () => {
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
