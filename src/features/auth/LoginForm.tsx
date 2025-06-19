'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { BRAND } from '@/constants/branding';
import Spinner from '@/components/ui/Spinner';
import TextInput from '@/components/ui/TextInput';
import { useForm } from './useForm';
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { debugLog, errorLog } from '@/utils/log';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const {
    values: { email, password },
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: { email: '', password: '' },
    validate: (values: { email: string; password: string }) => {
      const errors: { email?: string; password?: string } = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    },
  });
  const [error, setError] = React.useState('');

  const onSubmit = async (values: { email: string; password: string }) => {
    setError('');
    if (!isValidEmail(values.email)) {
      setError('Invalid email address');
      return;
    }
    if (!isValidPassword(values.password)) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      debugLog('[LoginForm] Attempting login', { email: values.email });
      await login(values.email, values.password);
      debugLog('[LoginForm] Login successful', { email: values.email });
      router.replace('/');
    } catch (err) {
      errorLog('[LoginForm] Login failed', err);
      setError('Login failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-xl rounded-2xl p-8 space-y-6 max-w-md w-full border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Sign In</h2>
      <TextInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        required
        className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${BRAND.focusRing} transition`}
        error={errors.email}
        autoComplete="email"
      />
      <TextInput
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={handleChange}
        required
        className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${BRAND.focusRing} transition`}
        error={errors.password}
        autoComplete="current-password"
      />
      {error && <div className="text-red-500 text-center font-medium">{error}</div>}
      <button
        type="submit"
        className={`w-full bg-gradient-to-r ${BRAND.buttonFrom} ${BRAND.buttonTo} text-white py-2 rounded-lg font-semibold shadow-md ${BRAND.buttonHoverFrom} ${BRAND.buttonHoverTo} transition disabled:opacity-50 flex items-center justify-center gap-2`}
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner size={20} />} {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
