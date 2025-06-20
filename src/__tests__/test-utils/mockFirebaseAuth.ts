export const mockOnAuthStateChanged = jest.fn((auth, cb) => {
  cb(null);
  return jest.fn();
});

export const mockSignInWithEmailAndPassword = jest.fn(() => Promise.resolve());
export const mockCreateUserWithEmailAndPassword = jest.fn(() => Promise.resolve());
export const mockSignOut = jest.fn(() => Promise.resolve());

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
}
