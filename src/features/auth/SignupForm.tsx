import React from 'react';
import { useAuth } from './AuthProvider';
import { useForm } from './useForm';
import { BRAND } from '@/constants/branding';
import Spinner from '@/components/ui/Spinner';
import TextInput from '@/components/ui/TextInput';
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { debugLog, errorLog } from '@/utils/log';
import GoogleSignInButton from './GoogleSignInButton';

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const {
    values: { email, password, confirmPassword },
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
  } = useForm({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validate: (values: { email: string; password: string; confirmPassword: string }) => {
      const errors: { email?: string; password?: string; confirmPassword?: string } = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
      if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      return errors;
    },
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleGoogleError = (err: Error) => setError('Google sign-up failed: ' + err.message);

  const onSubmit = async (values: { email: string; password: string; confirmPassword: string }) => {
    setError('');
    setSuccess('');
    if (!isValidEmail(values.email)) {
      setError('Invalid email address');
      return;
    }
    if (!isValidPassword(values.password)) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      debugLog('[SignupForm] Attempting signup', { email: values.email });
      await signup(values.email, values.password);
      setSuccess('Account created! You can now log in.');
      setValues({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      errorLog('[SignupForm] Signup failed', err);
      setError('Signup failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-xl rounded-2xl p-8 space-y-6 max-w-md w-full border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Sign Up</h2>
      <TextInput
        label="Email"
        name="email"
        type="text"
        value={email}
        onChange={handleChange}
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
        className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${BRAND.focusRing} transition`}
        error={errors.password}
        autoComplete="new-password"
      />
      <TextInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={handleChange}
        className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${BRAND.focusRing} transition`}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />
      {error && <div className="text-red-500 text-center font-medium">{error}</div>}
      {success && <div className="text-green-600 text-center font-medium">{success}</div>}
      <button
        type="submit"
        className={`w-full bg-gradient-to-r ${BRAND.buttonFrom} ${BRAND.buttonTo} text-white py-2 rounded-lg font-semibold shadow-md ${BRAND.buttonHoverFrom} ${BRAND.buttonHoverTo} transition disabled:opacity-50 flex items-center justify-center gap-2`}
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner size={20} />} {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-3 text-gray-400 text-sm font-medium">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <GoogleSignInButton onError={handleGoogleError} label="Sign up with Google" />
    </form>
  );
};

export default SignupForm;
