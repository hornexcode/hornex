import { Participant, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import {
  combineDateAndTime,
  isCheckInClosed,
  isCheckInOpen,
} from '@/lib/utils';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export const TournamentContext = createContext<{
  tournament: Tournament;
  participants: Participant[];
  isRegistered: boolean;
  isCheckInOpened: boolean;
  isLoading: boolean;
  refreshParticipants: () => Promise<void>;
}>({
  tournament: {} as Tournament,
  isRegistered: false,
  isCheckInOpened: false,
  isLoading: false,
  participants: [],
  refreshParticipants: async () => {},
});

export type TournamentContextProviderProps = {
  children: ReactNode;
  tournament: Tournament;
  participants: Participant[];
  isRegistered: boolean;
};

const { submit: listTournamentParticipants } = dataLoader<
  Participant[],
  { id: string }
>('listTournamentParticipants');

export const TournamentContextProvider = ({
  children,
  tournament,
  participants: initialParticipants,
  isRegistered: initialRegistrationState,
}: TournamentContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [isCheckInOpened, setIsCheckInOpened] = useState(false);

  const [isRegistered, setIsRegistered] = useState(initialRegistrationState);

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

  const refreshParticipants = async () => {
    setIsLoading(true);
    // fetch participants
    const { data: participants } = await listTournamentParticipants({
      id: tournament.id,
    });
    if (participants) {
      setParticipants(participants);
    }
    setIsLoading(false);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        isRegistered,
        isCheckInOpened,
        isLoading,
        participants,
        refreshParticipants,
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
