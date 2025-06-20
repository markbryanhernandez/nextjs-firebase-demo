import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/features/auth/useForm';

describe('useForm', () => {
  it('initializes with initial values', () => {
    const { result } = renderHook(() => useForm({ initialValues: { email: '', password: '' } }));
    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('updates values on change', () => {
    const { result } = renderHook(() => useForm({ initialValues: { email: '', password: '' } }));
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.values.email).toBe('test@example.com');
  });

  it('validates and sets errors', () => {
    const validate = (values: { email: string }) => {
      const errors: { email?: string } = {};
      if (!values.email) errors.email = 'Required';
      return errors;
    };
    const { result } = renderHook(() => useForm({ initialValues: { email: '' }, validate }));
    act(() => {
      result.current.handleSubmit(jest.fn())({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe('Required');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('calls onSubmit if no errors', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: 'a' }, validate: () => ({}) })
    );
    await act(async () => {
      result.current.handleSubmit(onSubmit)({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a' });
  });
});
