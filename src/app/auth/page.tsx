'use client';

import React from 'react';
import Image from 'next/image';

import { BRAND } from '@/constants/branding';
import LoginForm from '../../features/auth/LoginForm';

const AuthPage: React.FC = () => {
  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br ${BRAND.gradientFrom} ${BRAND.gradientTo}`}
    >
      <header className="flex flex-col items-center mb-4">
        <Image src={BRAND.logoSrc} alt="Logo" width={80} height={32} className="mb-2" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{BRAND.appName}</h1>
      </header>
      <LoginForm />
    </main>
  );
};

export default AuthPage;
