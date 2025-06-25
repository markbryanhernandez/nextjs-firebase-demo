'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/constants/branding';
import LoginForm from '@/features/auth/LoginForm';
import RequireNoAuth from '@/features/auth/RequireNoAuth';

export default function LoginPage() {
  const router = useRouter();
  return (
    <RequireNoAuth>
      <main
        className={`flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br ${BRAND.gradientFrom} ${BRAND.gradientTo}`}
      >
        <header className="flex flex-col items-center mb-4">
          <Image src={BRAND.logoSrc} alt="Logo" width={80} height={32} className="mb-2" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{BRAND.appName}</h1>
        </header>
        <LoginForm />
        <button
          className={`text-${BRAND.primaryColor}-600 underline text-sm mt-2`}
          onClick={() => router.push('/signup')}
          aria-label="Go to signup page"
        >
          {"Don't have an account? Sign up"}
        </button>
      </main>
    </RequireNoAuth>
  );
}
