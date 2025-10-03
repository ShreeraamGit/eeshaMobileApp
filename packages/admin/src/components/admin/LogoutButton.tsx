'use client';

import React from 'react';
import { signOutAdminAction } from '@/app/admin/logout/actions';

export const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      await signOutAdminAction();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="
        h-10 px-6
        bg-white border border-gray-300
        text-sm text-gray-700
        hover:bg-gray-50 hover:border-gray-400
        transition-colors
      "
      style={{ fontFamily: 'Tenor Sans, serif' }}
    >
      Se déconnecter
    </button>
  );
};
