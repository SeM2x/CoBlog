'use client';

import { useUserStore } from '@/lib/store';
import { getLocalUser } from '@/lib/utils/local-storage';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';

interface AppState {
  user: string;
  isAuthenticated: boolean;
}

interface AppStateContextProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const session = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) return;

    if (session.status !== 'authenticated') {
      session.update();
      return;
    }

    const localUser = getLocalUser();
    if (localUser) {
      setUser(localUser);
    } else signOut();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, session.data]);

  return (
    <AppStateContext.Provider value={undefined}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
