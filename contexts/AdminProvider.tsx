import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';

type ClerkUser = {
  id: string;
  publicMetadata?: {
    role?: string;
  };
};

type AdminContextType = {
  isAdmin: boolean;
  isLoading: boolean;
};

const defaultContext: AdminContextType = {
  isAdmin: false,
  isLoading: true
};

const AdminContext = createContext<AdminContextType>(defaultContext);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminContextType>(defaultContext);
  const { isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const checkAdminStatus = useCallback(() => {
    // Only proceed if both auth and user data are loaded
    if (!isAuthLoaded || !isUserLoaded) {
      return;
    }

    try {
      const clerkUser = user as ClerkUser | null | undefined;
      const role = clerkUser?.publicMetadata?.role;
      const isAdmin = role === 'admin';

      setState({
        isAdmin,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking admin status:', error);
      setState({
        isAdmin: false,
        isLoading: false
      });
    }
  }, [isAuthLoaded, isUserLoaded, user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return (
    <AdminContext.Provider value={state}>
      {children}
    </AdminContext.Provider>
  );
}
