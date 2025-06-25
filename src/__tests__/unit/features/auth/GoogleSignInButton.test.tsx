import { render, fireEvent, waitFor } from '@testing-library/react';
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  getAuth: jest.fn(),
}));
jest.mock('firebase/app', () => ({
  getApps: () => [],
  initializeApp: jest.fn(),
  getApp: jest.fn(),
}));
import { signInWithPopup } from 'firebase/auth';
import GoogleSignInButton from '@/features/auth/GoogleSignInButton';

describe('GoogleSignInButton', () => {
  it('renders with default label', () => {
    const { getByRole } = render(<GoogleSignInButton />);
    expect(getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    const { getByText } = render(<GoogleSignInButton label="Custom Google Label" />);
    expect(getByText(/custom google label/i)).toBeInTheDocument();
  });

  it('calls onError if sign-in fails', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(new Error('Popup failed'));
    const onError = jest.fn();
    const { getByRole } = render(<GoogleSignInButton onError={onError} />);
    fireEvent.click(getByRole('button', { name: /sign in with google/i }));
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Popup failed' }));
    });
  });

  it('shows loading state when clicked', async () => {
    (signInWithPopup as jest.Mock).mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const { getByRole, findByText } = render(<GoogleSignInButton />);
    fireEvent.click(getByRole('button', { name: /sign in with google/i }));
    expect(await findByText(/signing in/i)).toBeInTheDocument();
  });
});
