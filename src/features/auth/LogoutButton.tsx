import React from 'react';
import { useAuth } from './AuthProvider';
import { BRAND } from '@/constants/branding';
import { errorLog } from '@/utils/log';

const LogoutButton: React.FC = React.memo(() => {
  const { logout, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
    } catch (err) {
      errorLog('[LogoutButton] Logout failed', err);
      setError('Logout failed. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className={`bg-gradient-to-r ${BRAND.buttonFrom} ${BRAND.buttonTo} text-white px-6 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-50 ${BRAND.buttonHoverFrom} ${BRAND.buttonHoverTo} focus:outline-none ${BRAND.focusRing}`}
        disabled={loading}
        aria-label={loading ? 'Logging out' : 'Logout'}
        type="button"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </>
  );
});
LogoutButton.displayName = 'LogoutButton';

export default LogoutButton;
