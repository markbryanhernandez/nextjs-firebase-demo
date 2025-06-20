/**
 * Centralized Firebase auth mocking strategy for tests
 *
 * This file provides a consistent approach to mocking Firebase authentication
 * across all tests. It simulates the behavior of Firebase Auth in a controlled way
 * and provides helper methods for changing auth state during tests.
 */

type MockUser = {
  uid: string;
  email: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  [key: string]: unknown;
};

// Create a more sophisticated mock
class MockFirebaseAuth {
  private authStateListeners: Array<(user: MockUser | null) => void> = [];
  private _currentUser: MockUser | null = null;

  get currentUser() {
    return this._currentUser;
  }

  // Helper to manually change auth state during tests
  setCurrentUser(user: MockUser | null) {
    this._currentUser = user;
    // Notify all listeners
    this.authStateListeners.forEach((callback) => setTimeout(() => callback(user), 0));
  }

  // Mock implementation for onAuthStateChanged
  onAuthStateChanged = jest.fn((_, callback) => {
    this.authStateListeners.push(callback);

    // Initial callback with current user state
    setTimeout(() => callback(this._currentUser), 0);

    // Return unsubscribe function
    return jest.fn(() => {
      this.authStateListeners = this.authStateListeners.filter((cb) => cb !== callback);
    });
  });

  // Mock implementations for auth methods
  signInWithEmailAndPassword = jest.fn((_, email, password) => {
    if (password === 'error') {
      return Promise.reject(new Error('Auth error'));
    }

    const user = { uid: 'test-uid', email };
    this.setCurrentUser(user);
    return Promise.resolve({ user });
  });

  createUserWithEmailAndPassword = jest.fn((_, email, password) => {
    if (password === 'error') {
      return Promise.reject(new Error('Auth error'));
    }

    const user = { uid: `uid-${Date.now()}`, email };
    this.setCurrentUser(user);
    return Promise.resolve({ user });
  });

  signOut = jest.fn(() => {
    this.setCurrentUser(null);
    return Promise.resolve();
  });
}

// Create a singleton instance
const mockAuth = new MockFirebaseAuth();

// Export individual methods for direct use in mock implementations
export const mockOnAuthStateChanged = mockAuth.onAuthStateChanged;
export const mockSignInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword;
export const mockCreateUserWithEmailAndPassword = mockAuth.createUserWithEmailAndPassword;
export const mockSignOut = mockAuth.signOut;

// Export a function to simulate auth state changes in tests
export function simulateAuthChange(user: MockUser | null) {
  mockAuth.setCurrentUser(user);
}

// Setup function to be called in jest.setup.ts or individual test files
export function setupFirebaseAuthMock() {
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => ({})),
    initializeApp: jest.fn(() => ({})),
    onAuthStateChanged: mockOnAuthStateChanged,
    signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
    createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
    signOut: mockSignOut,
    User: class {},
  }));

  jest.mock('@/lib/firebase', () => ({
    auth: {},
    app: {},
  }));
}
