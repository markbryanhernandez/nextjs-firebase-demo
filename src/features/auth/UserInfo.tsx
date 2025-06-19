import React from 'react';
import { useAuth } from './AuthProvider';

const UserInfo: React.FC = React.memo(() => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 border border-gray-200 rounded-2xl mb-4 bg-white shadow flex flex-col items-center gap-2">
      <div className="font-bold text-lg text-gray-800">Welcome!</div>
      <div className="text-gray-600">
        Email: <span className="font-mono">{user.email}</span>
      </div>
      <div className="text-gray-400 text-xs">User ID: {user.uid}</div>
    </div>
  );
});

export default UserInfo;
