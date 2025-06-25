import { render, fireEvent, waitFor } from '@testing-library/react';
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));
import LoginForm from '@/features/auth/LoginForm';
import { AuthProvider } from '@/features/auth/AuthProvider';

describe('LoginForm', () => {
  it('renders email and password fields and login button', () => {
    const { getByLabelText, getByRole } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error if email is invalid', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'invalid' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText('Invalid email address')).toBeInTheDocument();
  });

  it('shows error if email is missing', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText('Email is required')).toBeInTheDocument();
  });

  it('shows error if password is missing', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  it('shows error if password is too short', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('calls login and navigates on successful submit', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('@/features/auth/AuthProvider'), 'useAuth').mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      signup: jest.fn(),
      user: null,
      loading: false,
    });
    const mockReplace = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    });
    const { getByLabelText, getByRole } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('displays error if login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    jest.spyOn(require('@/features/auth/AuthProvider'), 'useAuth').mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      signup: jest.fn(),
      user: null,
      loading: false,
    });
    const { getByLabelText, getByRole, findByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText(/Login failed: Invalid credentials/)).toBeInTheDocument();
  });

  it('renders Google sign-in button', () => {
    const { getByRole } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    expect(getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });
});
