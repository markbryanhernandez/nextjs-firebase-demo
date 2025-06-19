import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../../../components/ui/TextInput';

describe('TextInput', () => {
  it('renders with label and value', () => {
    render(<TextInput label="Email" name="email" value="test@example.com" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<TextInput label="Password" name="password" value="" onChange={handleChange} />);
    const input = screen.getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'secret' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message and sets aria attributes', () => {
    render(
      <TextInput label="Username" name="username" value="" onChange={() => {}} error="Required" />
    );
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'username-error');
  });
});
