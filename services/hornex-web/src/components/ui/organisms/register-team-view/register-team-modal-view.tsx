import { ListboxOption } from '../../atoms/list-box';
import Loader from '../../atoms/loader';
import { CheckoutStep } from './checkout-step';
import { SelectTeamStep } from './select-team-step';
import { Team, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const { useData: getTeams } = dataLoader<Team[]>('getTeams');
const { useData: getTournament } = dataLoader<Tournament>('getTournament');

export type RegistrationSteps =
  | 'SELECT_TEAM'
  | 'CHECKOUT'
  | 'PAYMENT'
  | 'SUCCESS';

const RegistrationView = () => {
  const [step, setStep] = useState<RegistrationSteps>('SELECT_TEAM');
  const [team, setTeam] = useState<ListboxOption | undefined>(undefined);

  const nextStep = (step: RegistrationSteps) => setStep(step);
  const selectTeam = (team: ListboxOption) => setTeam(team);

  useEffect(() => {
    if (team) {
      setStep('CHECKOUT');
    }
  }, []);

  // get params
  const router = useRouter();

  const { data: teams, isLoading: loadingTeams } = getTeams(
    {
      platform: router.query.platform as string,
      game: router.query.game as string,
    },
    {
      revalidateIfStale: false,
    }
  );

  const {
    data: tournament,
    error: tournamentError,
    isLoading: loadingTournament,
  } = getTournament(
    {
      tournamentId: router.query.id as string,
      platform: router.query.platform as string,
      game: router.query.game as string,
    },
    {
      revalidateIfStale: false,
    }
  );

  if (loadingTeams || loadingTournament) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="mx-auto mt-10" variant="blink" />
      </div>
    );
  }

  if (tournamentError || !tournament) {
    return (
      <p className="mt-8 text-center text-sm text-gray-400">
        failed to fetch tournament
      </p>
    );
  }

  const teamsList = teams && teams?.length > 0 ? teams : [];

  return (
    <div className="">
      <RegistrationContext.Provider
        value={{
          step,
          teams: teamsList,
          team,
          tournament,
          isFetching: true,
          nextStep,
          setTeam,
        }}
      >
        {renderStep(step)}
      </RegistrationContext.Provider>
    </div>
  );
};

export const RegistrationContext = createContext<{
  step: RegistrationSteps;
  teams?: Team[];
  team?: ListboxOption;
  tournament: Tournament;
  isFetching: boolean;
  setTeam: (team: ListboxOption) => void;
  nextStep: (step: RegistrationSteps) => void;
}>({
  step: 'SELECT_TEAM',
  teams: undefined,
  tournament: {} as Tournament,
  team: undefined,
  isFetching: false,
  setTeam: (team: ListboxOption) => {},
  nextStep: (step: RegistrationSteps) => {},
});

function renderStep(step: RegistrationSteps) {
  switch (step) {
    case 'SELECT_TEAM':
      return (
        <motion.div
          layout
          initial="exit"
          animate="enter"
          exit="exit"
          variants={fadeInBottom('easeIn', 0.25, 16)}
        >
          <SelectTeamStep />
        </motion.div>
      );
    case 'CHECKOUT':
      return (
        <motion.div
          layout
          initial="exit"
          animate="enter"
          exit="exit"
          variants={fadeInBottom('easeIn', 0.25, 16)}
        >
          <CheckoutStep />
        </motion.div>
      );
    default:
      break;
  }
}

export const useStepContext = () => {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error('useStepContext must be used within a RegistrationContext');
  }

  return context;
};

export function fadeInBottom(
  type: string = 'spring',
  duration: number = 0.5,
  translateY: number = 60
) {
  return {
    enter: {
      y: 0,
      opacity: 1,
      transition: { type, duration },
    },
    exit: {
      y: translateY,
      opacity: 0,
      transition: { type, duration },
    },
  };
}

export default RegistrationView;
