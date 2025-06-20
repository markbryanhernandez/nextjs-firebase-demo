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
import Home from '@/app/page';
import { AuthProvider } from '@/features/auth/AuthProvider';

describe('Home Page', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
