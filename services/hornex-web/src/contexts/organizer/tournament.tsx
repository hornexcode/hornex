import { Tournament } from '@/lib/models';
import { atom, useAtom } from 'jotai';

export type TournamentContext = {
  tournament?: Tournament;
};

const modalAtom = atom<TournamentContext>({});

export const useTournament = () => {
  const [state, setState] = useAtom(modalAtom);
  const setTournament = (tournament?: Tournament) =>
    setState({ ...state, tournament });

  return {
    ...state,
    setTournament,
  };
};
