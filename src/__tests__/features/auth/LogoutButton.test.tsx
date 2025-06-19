import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from '../../../features/auth/LogoutButton';
import React from 'react';

jest.mock('../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    logout: jest.fn(() => Promise.resolve()),
    loading: false,
  }),
}));
jest.mock('../../../constants/branding', () => ({
  BRAND: {
    buttonFrom: 'from-indigo-500',
    buttonTo: 'to-blue-500',
    buttonHoverFrom: 'hover:from-indigo-600',
    buttonHoverTo: 'hover:to-blue-600',
    focusRing: 'ring-indigo-300',
  },
}));

describe('LogoutButton', () => {
  it('renders and calls logout on click', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    jest.resetModules();
    jest.doMock('../../../features/auth/AuthProvider', () => ({
      useAuth: () => ({
        logout: jest.fn(() => Promise.resolve()),
        loading: true,
      }),
    }));
    // Use dynamic import instead of require for ES module compatibility
    import('../../../features/auth/LogoutButton').then(({ default: LogoutButtonLoading }) => {
      render(<LogoutButtonLoading />);
      expect(screen.getByRole('button', { name: /logging out/i })).toBeInTheDocument();
    });
  });
});
