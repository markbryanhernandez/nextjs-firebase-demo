import React from 'react';
import { useAuth } from './AuthProvider';

const LogoutButton: React.FC = React.memo(() => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-red-600 hover:to-pink-600 transition disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
});

export default LogoutButton;
