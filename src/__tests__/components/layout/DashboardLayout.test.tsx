import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import React from 'react';

jest.mock('../../../features/auth/LogoutButton', () => {
  const MockLogoutButton = function MockLogoutButton() {
    return <button>Logout</button>;
  };
  Object.defineProperty(MockLogoutButton, 'displayName', { value: 'MockLogoutButton' });
  return MockLogoutButton;
});

jest.mock('next/image', () => {
  const MockNextImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="mock" {...props} />
  );
  (MockNextImage as React.FC).displayName = 'MockNextImage';
  return MockNextImage;
});

jest.mock('../../../constants/branding', () => ({
  BRAND: {
    logoSrc: '/logo.svg',
    appName: 'DemoApp',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-blue-500',
    primaryColor: 'indigo',
    buttonFrom: 'from-indigo-500',
    buttonTo: 'to-blue-500',
    buttonHoverFrom: 'hover:from-indigo-600',
    buttonHoverTo: 'hover:to-blue-600',
    focusRing: 'ring-indigo-300',
  },
}));

jest.mock('../../../components/layout/ErrorBoundary', () => {
  const MockErrorBoundary = function MockErrorBoundary({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  };
  Object.defineProperty(MockErrorBoundary, 'displayName', { value: 'MockErrorBoundary' });
  return MockErrorBoundary;
});

describe('DashboardLayout', () => {
  it('renders sidebar, nav, and children', () => {
    render(
      <DashboardLayout>
        <main>Dashboard Content</main>
      </DashboardLayout>
    );
    expect(screen.getByText('DemoApp')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
});
