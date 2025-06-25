import { render, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/features/auth/SignupForm';
import { AuthProvider } from '@/features/auth/AuthProvider';

describe('SignupForm', () => {
  it('renders email, password, confirm password fields and signup button', () => {
    const { getByLabelText, getByRole } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password456' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('shows error if email is missing', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Email is required')).toBeInTheDocument();
  });

  it('shows error if password is missing', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  it('shows error if confirm password is missing', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Please confirm your password')).toBeInTheDocument();
  });

  it('shows error if email is invalid', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'invalid' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Invalid email address')).toBeInTheDocument();
  });

  it('shows error if password is too short', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: '123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: '123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('calls signup and shows success on valid submit', async () => {
    const mockSignup = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('@/features/auth/AuthProvider'), 'useAuth').mockReturnValue({
      signup: mockSignup,
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
      loading: false,
    });
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText('Account created! You can now log in.')).toBeInTheDocument();
    expect(mockSignup).toHaveBeenCalledWith('user@example.com', 'Password123');
  });

  it('shows error if signup fails', async () => {
    const mockSignup = jest.fn().mockRejectedValue(new Error('Signup error'));
    jest.spyOn(require('@/features/auth/AuthProvider'), 'useAuth').mockReturnValue({
      signup: mockSignup,
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
      loading: false,
    });
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'Password123' } });
    fireEvent.click(getByRole('button', { name: /sign up/i }));
    expect(await findByText(/Signup failed: Signup error/)).toBeInTheDocument();
  });

  it('renders Google sign-up button', () => {
    const { getByRole } = render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
    expect(getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });
});
