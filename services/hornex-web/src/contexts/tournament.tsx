import { Registration, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import {
  combineDateAndTime,
  isCheckInClosed,
  isCheckInOpen,
} from '@/lib/utils';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react';

const { get: getRegistrations } =
  dataLoader<Registration[]>('getRegistrations');

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
};

export const TournamentContextProvider = ({
  children,
  tournament,
}: TournamentContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckInOpened, setIsCheckInOpened] = useState(false);

  useEffect(() => {
    async function loadRegistrations() {
      const { data: registrations } = await getRegistrations({}, {});
      const currentRegistration = registrations?.find(
        (registration) => registration.tournament === tournament.id
      );
      if (currentRegistration) {
        setIsRegistered(true);
      }
    }
    loadRegistrations();
  }, []);

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
      value={{ tournament, isRegistered, isCheckInOpened, isLoading }}
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
