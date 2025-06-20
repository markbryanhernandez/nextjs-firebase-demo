import { render } from '@testing-library/react';
import LoadingPage from '@/app/loading';

describe('LoadingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingPage />);
    expect(container).toBeInTheDocument();
  });
});
