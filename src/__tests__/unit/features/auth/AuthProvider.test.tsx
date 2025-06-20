import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides user as null initially', async () => {
    let user: ReturnType<typeof useAuth>['user'] | undefined;
    function TestComponent() {
      user = useAuth().user;
      return <div>Test</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => expect(user).toBeNull());
  });

  it('calls login, signup, and logout', async () => {
    let context: ReturnType<typeof useAuth> | undefined;
    function TestComponent() {
      context = useAuth();
      return <div>Test</div>;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    if (!context) throw new Error('Context not set');
    await context.login('test@example.com', 'password');
    await context.signup('test@example.com', 'password');
    await context.logout();
    expect(context.user).toBeNull();
  });

  it('throws if useAuth is used outside AuthProvider', () => {
    function TestComponent() {
      useAuth();
      return <div />;
    }
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
