import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/features/auth/LoginForm';
import React from 'react';

jest.mock('../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve()),
  }),
}));
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../../../components/ui/Spinner', () => {
  const MockSpinner = () => <div>Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return MockSpinner;
});

describe('LoginForm', () => {
  it('renders form fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit', async () => {
    const { container } = render(<LoginForm />);

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const emailError = container.querySelector('#email-error');
      const passwordError = container.querySelector('#password-error');

      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(emailError?.textContent).toMatch(/email is required/i);
      expect(passwordError?.textContent).toMatch(/password is required/i);
    });
  });
});
