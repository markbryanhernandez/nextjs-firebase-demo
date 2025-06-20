import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from '@/features/auth/LogoutButton';
import React from 'react';

const mockLogout = jest.fn(() => Promise.resolve());
const mockUseAuth = jest.fn(() => ({
  logout: mockLogout,
  loading: false,
}));

jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/constants/branding', () => ({
  BRAND: {
    buttonFrom: 'from-indigo-500',
    buttonTo: 'to-blue-500',
    buttonHoverFrom: 'hover:from-indigo-600',
    buttonHoverTo: 'hover:to-blue-600',
    focusRing: 'ring-indigo-300',
  },
}));

jest.mock('@/utils/log', () => ({
  errorLog: jest.fn(),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockUseAuth.mockImplementation(() => ({
      logout: mockLogout,
      loading: false,
    }));
  });

  it('renders and calls logout on click', async () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when loading', () => {
    mockUseAuth.mockImplementation(() => ({
      logout: mockLogout,
      loading: true,
    }));

    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /logging out/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('shows error message when logout fails', async () => {
    const logoutError = new Error('Logout failed');
    mockLogout.mockRejectedValueOnce(logoutError);

    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/logout failed/i)).toBeInTheDocument();
    });
  });

  it('clears previous error when logout is attempted again', async () => {
    // First cause an error
    const logoutError = new Error('Logout failed');
    mockLogout.mockRejectedValueOnce(logoutError);

    render(<LogoutButton />);

    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/logout failed/i)).toBeInTheDocument();
    });

    // Then succeed on second attempt
    mockLogout.mockResolvedValueOnce(undefined);

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText(/logout failed/i)).not.toBeInTheDocument();
    });
  });
});
