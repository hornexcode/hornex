import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import {
  combineDateAndTime,
  isCheckInClosed,
  isCheckInOpen,
} from '@/lib/utils';
import React, {
  createContext,
  ReactNode,
  use,
  useEffect,
  useState,
} from 'react';

const { useData: useGetTournamentQuery } =
  dataLoader<Tournament>('getTournament');

export const TournamentContext = createContext<{
  tournament: Tournament;
  isRegistered: boolean;
  isCheckInOpened: boolean;
  isLoading: boolean;
}>({
  tournament: {} as Tournament,
  isRegistered: false,
  isCheckInOpened: false,
  isLoading: false,
});

export type TournamentContextProviderProps = {
  children: ReactNode;
  tournament: Tournament;
  isRegistered: boolean;
};

export const TournamentContextProvider = ({
  children,
  tournament: initialTournament,
  isRegistered,
}: TournamentContextProviderProps) => {
  const [tournament, setTournament] = useState(initialTournament);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckInOpened, setIsCheckInOpened] = useState(false);

  const { data, mutate } = useGetTournamentQuery({
    platform: tournament.platform,
    game: tournament.game,
    tournamentId: tournament.uuid,
  });

  useEffect(() => {
    if (data) {
      setTournament({ ...tournament, ...data });
    }
  }, [mutate, data]);

  useEffect(() => {
    const checkinIsNotOpenAndHasNotClosed =
      !isCheckInOpen(tournament) && !isCheckInClosed(tournament);

    // if check in is not open and the check in opens in the future
    if (checkinIsNotOpenAndHasNotClosed) {
      const checkInClosesAt = +combineDateAndTime(
        tournament.start_date,
        tournament.start_time
      );
      const checkInClosesIn = checkInClosesAt - +new Date();
      const closeIn = setTimeout(
        () => setIsCheckInOpened(false),
        checkInClosesIn
      );

      // set a timeout to update the state when the check in opens
      const checkInOpensIn =
        checkInClosesAt -
        tournament.check_in_duration * 60 * 1000 -
        +new Date();
      const opensIn = setTimeout(
        () => setIsCheckInOpened(true),
        checkInOpensIn
      );

      setIsLoading(false);

      // avoid memory leak
      return () => {
        clearTimeout(closeIn);
        clearTimeout(opensIn);
        setIsLoading(false);
      };
    }
  }, [tournament]);

  useEffect(() => {
    setIsCheckInOpened(isCheckInOpen(tournament));
  }, []);

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        isRegistered,
        isCheckInOpened,
        isLoading,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = React.useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentContext');
  }
  return context;
};
