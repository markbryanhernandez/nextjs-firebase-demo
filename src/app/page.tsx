'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '../features/auth/LogoutButton';
import UserInfo from '../features/auth/UserInfo';
import { useAuth } from '../features/auth/AuthProvider';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Home user state:', user);
    if (!user) {
      router.replace('/auth');
    }
  }, [user, router]);

  if (!user) return <div className="text-center mt-20 text-gray-500">Loading user...</div>;

  return (
    <DashboardLayout>
      <main className="w-full flex flex-col items-center justify-center" role="main">
        <section
          className="text-center max-w-xl"
          aria-labelledby="dashboard-welcome-title"
        >
          <h1
            id="dashboard-welcome-title"
            className="text-4xl font-bold mb-4"
          >
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
