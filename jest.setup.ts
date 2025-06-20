import '@testing-library/jest-dom';

// Custom Firebase mocks for all tests
defineFirebaseMocks();
defineNextFontGoogleMock();

function defineFirebaseMocks() {
  jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({})),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => ({})),
  }));
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn((auth, cb) => {
      cb(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    User: class {},
  }));
}

function defineNextFontGoogleMock() {
  jest.mock('next/font/google', () => ({
    Geist: jest.fn(() => ({ variable: '--font-geist-sans' })),
    Geist_Mono: jest.fn(() => ({ variable: '--font-geist-mono' })),
  }));
}
