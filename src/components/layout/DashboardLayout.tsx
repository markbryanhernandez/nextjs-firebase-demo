import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/features/auth/LogoutButton';
import { BRAND } from '@/constants/branding';
import ErrorBoundary from './ErrorBoundary';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen w-screen bg-gray-50">
        <aside
          className={`w-60 flex flex-col items-center py-6 shadow-lg bg-gradient-to-b ${BRAND.gradientFrom} ${BRAND.gradientTo}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <Image src={BRAND.logoSrc} alt="Logo" width={40} height={40} />
            <span
              className="text-xl font-bold"
              style={{ color: `var(--${BRAND.primaryColor}-700, #4338ca)` }}
            >
              {BRAND.appName}
            </span>
          </div>
          <nav className="flex flex-col gap-4 w-full items-center">
            <Link
              href="/"
              prefetch={true}
              className={`text-base font-medium px-4 py-2 rounded-lg transition ${`text-${BRAND.primaryColor}-700`} ${`hover:bg-${BRAND.primaryColor}-100`} ${`hover:text-${BRAND.primaryColor}-800`}`}
            >
              Dashboard
            </Link>
          </nav>
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-12">{children}</main>
      </div>
    </ErrorBoundary>
  );
}
