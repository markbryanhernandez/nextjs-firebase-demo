import { render } from '@testing-library/react';
import RequireNoAuth from '@/features/auth/RequireNoAuth';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() })
}));

const mockUseAuth = (user: any, loading: boolean) => {
  jest.spyOn(require('@/features/auth/AuthProvider'), 'useAuth').mockReturnValue({
    user,
    loading,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
  });
};

describe('RequireNoAuth', () => {
  afterEach(() => jest.resetAllMocks());

  it('renders children when not authenticated', () => {
    mockUseAuth(null, false);
    const { getByText } = render(
      <RequireNoAuth>
        <div>Visible Content</div>
      </RequireNoAuth>
    );
    expect(getByText('Visible Content')).toBeInTheDocument();
  });

  it('renders nothing when loading', () => {
    mockUseAuth(null, true);
    const { container } = render(
      <RequireNoAuth>
        <div>Should not show</div>
      </RequireNoAuth>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when authenticated', () => {
    mockUseAuth({ uid: '123' }, false);
    const { container } = render(
      <RequireNoAuth>
        <div>Should not show</div>
      </RequireNoAuth>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
