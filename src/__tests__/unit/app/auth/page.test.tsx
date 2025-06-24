import { render } from '@testing-library/react';
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
  it('renders login form', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );
    expect(getByText('Sign In')).toBeInTheDocument();
    expect(getByText('Sign in with Google')).toBeInTheDocument();
  });
});
