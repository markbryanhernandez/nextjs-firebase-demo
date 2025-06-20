import { render, screen, fireEvent } from '@testing-library/react';
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

describe('LogoutButton', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockUseAuth.mockImplementation(() => ({
      logout: mockLogout,
      loading: false,
    }));
  });

  it('renders and calls logout on click', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    expect(mockLogout).toHaveBeenCalled();
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    mockUseAuth.mockImplementation(() => ({
      logout: mockLogout,
      loading: true,
    }));
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /logging out/i })).toBeInTheDocument();
  });
});
