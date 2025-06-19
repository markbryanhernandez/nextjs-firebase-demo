import React from 'react';
import { useAuth } from './AuthProvider';
import { BRAND } from '@/constants/branding';

const LogoutButton: React.FC = React.memo(() => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-gradient-to-r ${BRAND.buttonFrom} ${BRAND.buttonTo} text-white px-6 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-50 ${BRAND.buttonHoverFrom} ${BRAND.buttonHoverTo} focus:outline-none ${BRAND.focusRing}`}
      disabled={loading}
      aria-label={loading ? 'Logging out' : 'Logout'}
      type="button"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
});
LogoutButton.displayName = "LogoutButton";

export default LogoutButton;
