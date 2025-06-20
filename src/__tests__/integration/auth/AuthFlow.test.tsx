import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AuthPage from '@/app/auth/page';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Mock the firebase/auth module before importing components that use it
jest.mock('firebase/auth', () => {
  const mockSignInWithEmailAndPassword = jest.fn().mockResolvedValue({});
  const mockCreateUserWithEmailAndPassword = jest.fn().mockResolvedValue({});
  const mockSignOut = jest.fn().mockResolvedValue({});

  return {
    getAuth: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn((_, cb) => {
      cb(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
    createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
    signOut: mockSignOut,
  };
});

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form by default', async () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    expect(await screen.findByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
  });

  it('switches between login and signup forms', async () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    // Click to switch to signup form
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    // Should now show signup form
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account\? log in/i)).toBeInTheDocument();
    });

    // Click to switch back to login form
    fireEvent.click(screen.getByText(/already have an account\? log in/i));

    // Should show login form again
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
    });
  });

  it('performs signup flow', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'newuser@example.com' },
    });

    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    // Switch to signup form
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    // Fill out the signup form
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'newuser@example.com' },
      });
      // Use getByLabelText for 'Password' and 'Confirm Password' specifically
      fireEvent.change(screen.getByLabelText(/^Password$/i), {
        target: { value: 'Password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      });
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Should call Firebase createUserWithEmailAndPassword
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'newuser@example.com',
        'Password123'
      );
      expect(screen.getByText(/account created/i)).toBeInTheDocument();
    });
  });

  it('performs login flow', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'user@example.com' },
    });

    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    // Fill out the login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Should call Firebase signInWithEmailAndPassword
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
        'Password123'
      );
    });
  });
});
