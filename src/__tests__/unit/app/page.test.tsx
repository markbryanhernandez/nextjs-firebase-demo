import { render, waitFor } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { AuthContextType } from '@/features/auth/AuthProvider';
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
import * as AuthProviderModule from '@/features/auth/AuthProvider';

const mockUser = {
  uid: '1',
  email: 'test@example.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  displayName: 'Test User',
  photoURL: null,
  phoneNumber: null,
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  providerId: 'firebase',
};

const mockAuthContext = (user: User | null, loading: boolean): AuthContextType => ({
  user,
  loading,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
});

describe('Home Page', () => {
  const useAuthMock = jest.spyOn(AuthProviderModule, 'useAuth');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /auth if not authenticated', async () => {
    useAuthMock.mockReturnValue(mockAuthContext(null, false));
    const { container } = render(<Home />);
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('shows loading page when loading', async () => {
    useAuthMock.mockReturnValue(mockAuthContext(null, true));
    const { container } = render(<Home />);
    await waitFor(() => {
      expect(container).toHaveTextContent('Loading your experience...');
    });
  });

  it('renders dashboard when authenticated', async () => {
    useAuthMock.mockReturnValue(mockAuthContext(mockUser, false));
    const { container } = render(<Home />);
    await waitFor(() => {
      expect(container).toHaveTextContent('Welcome to your Dashboard');
    });
  });
});
