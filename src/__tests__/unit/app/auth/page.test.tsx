import { render, fireEvent } from '@testing-library/react';
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
import AuthPage from '@/app/auth/page';
import { AuthProvider } from '@/features/auth/AuthProvider';

describe('AuthPage', () => {
  it('renders login form by default', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );
    expect(getByText("Don't have an account? Sign up")).toBeInTheDocument();
  });

  it('toggles to signup form when button is clicked', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );
    const toggleButton = getByText("Don't have an account? Sign up");
    fireEvent.click(toggleButton);
    expect(getByText('Already have an account? Log in')).toBeInTheDocument();
  });
});
