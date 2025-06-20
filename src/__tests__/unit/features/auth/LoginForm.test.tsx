import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/features/auth/LoginForm';
import React from 'react';

const mockLogin = jest.fn(() => Promise.resolve());
const mockReplace = jest.fn();

jest.mock('../../../../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    login: mockLogin,
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

jest.mock('@/utils/log', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
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

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows error for invalid email format', async () => {
    const { container } = render(<LoginForm />);

    // Fill out the form with invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows error for too short password', async () => {
    const { container } = render(<LoginForm />);

    // Fill out the form with too short password
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '12345' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login function with valid form data and redirects on success', async () => {
    const { container } = render(<LoginForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { container } = render(<LoginForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/login failed: invalid credentials/i)).toBeInTheDocument();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
