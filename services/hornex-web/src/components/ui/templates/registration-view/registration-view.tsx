import { ListboxOption } from '../../atoms/list-box';
import Loader from '../../atoms/loader';
import { CheckoutStep } from './checkout-step';
import { SelectTeamStep } from './select-team-step';
import { dataLoader } from '@/lib/api';
import { Team, Tournament } from '@/lib/proto';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

const { useData: getTeams } = dataLoader<Team[]>('getTeams');
const { useData: getTournament } = dataLoader<Tournament>('getTournament');

export type RegistrationSteps =
  | 'SELECT_TEAM'
  | 'CHECKOUT'
  | 'PAYMENT'
  | 'SUCCESS';

export const RegistrationContext = createContext<{
  step: RegistrationSteps;
  teams?: Team[];
  team?: ListboxOption;
  tournament?: Tournament;
  isFetching: boolean;
  setTeam: (team: ListboxOption) => void;
  nextStep: (step: RegistrationSteps) => void;
}>({
  step: 'SELECT_TEAM',
  teams: undefined,
  tournament: undefined,
  team: undefined,
  isFetching: false,
  setTeam: (team: ListboxOption) => {},
  nextStep: (step: RegistrationSteps) => {},
});

const RegistrationView = () => {
  const [step, setStep] = useState<RegistrationSteps>('SELECT_TEAM');
  const [team, setTeam] = useState<ListboxOption | undefined>(undefined);

  const nextStep = (step: RegistrationSteps) => setStep(step);
  const selectTeam = (team: ListboxOption) => setTeam(team);

  // get params
  const router = useRouter();

  const {
    data: teams,
    error: teamsError,
    isLoading,
  } = getTeams({
    platform: router.query.platform || '',
    game: router.query.game || '',
  });

  const { data: tournament, error: tournamentError } = getTournament({
    tournamentId: router.query.id || '',
    platform: router.query.platform || '',
    game: router.query.game || '',
  });

  const teamsList = teams && teams?.length > 0 ? teams : [];

  return (
    <div className="">
      {/* {isFetching && (
        <div className="flex flex-col p-8 text-center">
          <p>Aguarde enquanto conferimos sua inscrição no torneio.</p>
          <Loader className="mx-auto mt-10" variant="blink" />
        </div>
      )} */}
      {/*  */}
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
        {tournament && teams && renderStep(step)}
        {(!teams || !tournament) && (
          <p className="mt-8 text-center text-sm text-gray-400">
            failed to load step
          </p>
        )}
      </RegistrationContext.Provider>
    </div>
  );
};

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
