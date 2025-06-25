import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { BRAND } from '@/constants/branding';
import { FcGoogle } from 'react-icons/fc';

interface GoogleSignInButtonProps {
  onError?: (error: Error) => void;
  label?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onError, label }) => {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (onError && err instanceof Error) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 ${BRAND.focusRing} disabled:opacity-60`}
      aria-label="Sign in with Google"
    >
      <FcGoogle size={22} />
      {loading ? 'Signing in...' : label || 'Sign in with Google'}
    </button>
  );
};

export default GoogleSignInButton;
