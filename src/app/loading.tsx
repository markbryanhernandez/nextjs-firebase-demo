import React from 'react';
import Spinner from '@/components/ui/Spinner';
import { BRAND } from '@/constants/branding';
import Image from 'next/image';

const LoadingPage: React.FC = () => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${BRAND.gradientFrom} ${BRAND.gradientTo}`}
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size={48} colorClass={`text-${BRAND.primaryColor}-700`} />
        <h2 className={`text-xl font-semibold text-${BRAND.primaryColor}-700 animate-pulse`}>
          Loading your experience...
        </h2>
        <p className="text-gray-500 text-sm">Please wait while we prepare your dashboard</p>
        <div className="flex items-center gap-2 mt-4">
          <Image src={BRAND.logoSrc} alt="Logo" width={32} height={32} />
          <span className="text-base font-bold text-gray-700">{BRAND.appName}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
