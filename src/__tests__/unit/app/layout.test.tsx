import { render } from '@testing-library/react';
jest.mock('next/font/google');
import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<RootLayout>{<div>Test Child</div>}</RootLayout>);
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
