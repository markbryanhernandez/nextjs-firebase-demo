'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { BRAND } from '@/constants/branding';
import Spinner from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const { loginWithGoogle, loading } = useAuth();
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
      router.replace('/');
    } catch {
      setError('Google Sign-In failed.');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 max-w-md w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Sign In</h2>
      {error && <div className="text-red-500 text-center font-medium">{error}</div>}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className={`w-full bg-gradient-to-r ${BRAND.buttonFrom} ${BRAND.buttonTo} text-white py-2 rounded-lg font-semibold shadow-md ${BRAND.buttonHoverFrom} ${BRAND.buttonHoverTo} transition disabled:opacity-50 flex items-center justify-center gap-2`}
        disabled={loading}
      >
        {loading ? <Spinner size={20} /> : null} Sign in with Google
      </button>
    </div>
  );
};

export default LoginForm;
