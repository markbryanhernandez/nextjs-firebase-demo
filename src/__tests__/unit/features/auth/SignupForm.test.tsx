import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/features/auth/SignupForm';
import React from 'react';

const mockSignup = jest.fn(() => Promise.resolve());
jest.mock('../../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    signup: mockSignup,
  }),
}));

jest.mock('../../../../components/ui/Spinner', () => {
  const MockSpinner = () => <div>Loading...</div>;
  MockSpinner.displayName = 'MockSpinner';
  return MockSpinner;
});

jest.mock('@/utils/log', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and submit button', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
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

    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    const { container } = render(<SignupForm />);

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password456' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const confirmPasswordError = container.querySelector('#confirmPassword-error');
      expect(confirmPasswordError).toBeInTheDocument();
      expect(confirmPasswordError?.textContent).toMatch(/passwords do not match/i);
    });

    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('shows error for invalid email format', async () => {
    const { container } = render(<SignupForm />);

    // Fill out the form with invalid email
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('shows error for too short password', async () => {
    const { container } = render(<SignupForm />);

    // Fill out the form with too short password
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: '12345' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('calls signup function with valid form data', async () => {
    const { container } = render(<SignupForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows success message after successful signup', async () => {
    const { container } = render(<SignupForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/account created! you can now log in/i)).toBeInTheDocument();
    });

    // Form should be reset
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByLabelText('Confirm Password')).toHaveValue('');
  });

  it('shows error message when signup fails', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Email already in use'));

    const { container } = render(<SignupForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/signup failed: email already in use/i)).toBeInTheDocument();
    });
  });
});
