import { Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

const { useData: useGetTournamentQuery } = dataLoader<Tournament>(
  'org:tournament:details'
);

export const AdminTournamentContext = createContext<{
  tournament: Tournament;
  isLoading: boolean;
  refreshTournament: (tournament: Tournament) => void;
}>({
  tournament: {} as Tournament,
  isLoading: false,
  refreshTournament: async () => {},
});

export type AdminTournamentContextProviderProps = {
  children: ReactNode;
  tournament: Tournament;
};

export const AdminTournamentContextProvider = ({
  children,
  tournament: initialTournament,
}: AdminTournamentContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [tournament, setTournament] = useState(initialTournament);

  const { data, mutate } = useGetTournamentQuery({
    id: tournament.id,
  });

  useEffect(() => {
    if (data) {
      setTournament({ ...tournament, ...data });
    }
  }, [data]);

  const refreshTournament = async (tournament: Tournament) => {
    mutate({ ...data, ...tournament });
  };

  return (
    <AdminTournamentContext.Provider
      value={{
        tournament,
        isLoading,
        refreshTournament,
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
