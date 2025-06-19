'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { BRAND } from '../../constants/branding';

const LoginForm = dynamic(() => import('../../features/auth/LoginForm'), { ssr: false });
const SignupForm = dynamic(() => import('../../features/auth/SignupForm'), { ssr: false });

const AuthPage: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br ${BRAND.gradientFrom} ${BRAND.gradientTo}`}
    >
      <header className="flex flex-col items-center mb-4">
        <Image src={BRAND.logoSrc} alt="Logo" width={80} height={32} className="mb-2" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{BRAND.appName}</h1>
      </header>
      {showSignup ? <SignupForm /> : <LoginForm />}
      <button
        className={`text-${BRAND.primaryColor}-600 underline text-sm mt-2`}
        onClick={() => setShowSignup((s) => !s)}
        aria-label={showSignup ? 'Switch to login form' : 'Switch to signup form'}
      >
        {showSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </main>
  );
};

export default AuthPage;
