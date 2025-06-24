import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/features/auth/LoginForm';
import React from 'react';

const mockLoginWithGoogle = jest.fn(() => Promise.resolve());
const mockReplace = jest.fn();

jest.mock('../../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    loginWithGoogle: mockLoginWithGoogle,
    loading: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('../../../../components/ui/Spinner', () => {
  const MockSpinner = () => <div>Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return MockSpinner;
});

describe('LoginForm (Google Sign-In only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Google Sign-In button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('calls loginWithGoogle and redirects on success', async () => {
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    // Simulate redirect after login
    await Promise.resolve();
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('shows error message when Google Sign-In fails', async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error('Google error'));
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);
    await screen.findByText(/google sign-in failed/i);
    expect(screen.getByText(/google sign-in failed/i)).toBeInTheDocument();
  });
});
