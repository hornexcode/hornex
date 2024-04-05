import { Tournament } from '@/lib/models/Tournament';
import { atom, useAtom } from 'jotai';

const tournamentAtom = atom<Tournament | null>(null);

export function useTournament() {
  const [state, setState] = useAtom(tournamentAtom);
  const setTournament = (tournament: Tournament) => setState(tournament);
  return {
    ...state,
    setTournament,
  };
}
