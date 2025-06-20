import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/features/auth/SignupForm';
import React from 'react';

jest.mock('../../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    signup: jest.fn(() => Promise.resolve()),
  }),
}));
jest.mock('../../../../components/ui/Spinner', () => {
  const MockSpinner = () => <div>Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return MockSpinner;
});

describe('SignupForm', () => {
  it('renders form fields and submit button', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit', async () => {
    const { container } = render(<SignupForm />);

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const emailError = container.querySelector('#email-error');
      const passwordError = container.querySelector('#password-error');
      const confirmPasswordError = container.querySelector('#confirmPassword-error');

      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(confirmPasswordError).toBeInTheDocument();
      expect(emailError?.textContent).toMatch(/email is required/i);
      expect(passwordError?.textContent).toMatch(/password is required/i);
      expect(confirmPasswordError?.textContent).toMatch(/please confirm your password/i);
    });
  });
});
