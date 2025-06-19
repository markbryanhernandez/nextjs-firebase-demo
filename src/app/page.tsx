'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '../features/auth/LogoutButton';
import UserInfo from '../features/auth/UserInfo';
import { useAuth } from '../features/auth/AuthProvider';

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
    <main className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <UserInfo />
        <LogoutButton />
      </section>
    </main>
  );
}
