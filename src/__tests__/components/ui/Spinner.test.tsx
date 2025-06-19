import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });

  it('applies custom size and color', () => {
    render(<Spinner size={40} colorClass="text-red-500" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveClass('text-red-500');
  });
});
