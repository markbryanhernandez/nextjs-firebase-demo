import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AuthPage from '@/app/auth/page';
import { AuthProvider } from '@/features/auth/AuthProvider';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe('AuthPage (Google Sign-In only)', () => {
  it('renders the Google Sign-In button', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('calls Google Sign-In when button is clicked', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );
    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);
    // You can add more logic here if you want to mock and check loginWithGoogle
  });
});
