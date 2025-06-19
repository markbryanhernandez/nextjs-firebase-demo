'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../features/auth/AuthProvider';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';

const LoadingPage = dynamic(() => import('./loading'), { ssr: false });

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage />;
  }
  if (!user) return null;

  return (
    <DashboardLayout>
      <main className="w-full flex flex-col items-center justify-center" role="main">
        <section className="text-center max-w-xl" aria-labelledby="dashboard-welcome-title">
          <h1 id="dashboard-welcome-title" className="text-4xl font-bold mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            This is your modern dashboard. Start building something amazing!
          </p>
        </section>
      </main>
    </DashboardLayout>
  );
}
