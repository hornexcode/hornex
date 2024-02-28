import { Participant, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import React, { createContext, ReactNode, useState } from 'react';

export const AdminTournamentContext = createContext<{
  tournament: Tournament;
  isLoading: boolean;
}>({
  tournament: {} as Tournament,
  isLoading: false,
});

export type AdminTournamentContextProviderProps = {
  children: ReactNode;
  tournament: Tournament;
};

export const AdminTournamentContextProvider = ({
  children,
  tournament,
}: AdminTournamentContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminTournamentContext.Provider
      value={{
        tournament,
        isLoading,
      }}
    >
      {children}
    </AdminTournamentContext.Provider>
  );
};

export const useAdminTournament = () => {
  const context = React.useContext(AdminTournamentContext);
  if (context === undefined) {
    throw new Error(
      'useTournament must be used within a AdminTournamentContext'
    );
  }
  return context;
};
