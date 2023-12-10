import { ListboxOption } from '../../atoms/list-box';
import Loader from '../../atoms/loader';
import { CheckoutStep } from './checkout-step';
import { PaymentMethodStep } from './payment-method-step';
import { SelectTeamStep } from './select-team-step';
import { dataLoader } from '@/lib/api';
import { Team, Tournament } from '@/lib/proto';
import { motion } from 'framer-motion';
import { SetStateAction } from 'jotai';
import { useRouter } from 'next/router';
import { createContext, Dispatch, useContext, useState } from 'react';

const { useData: getTeams } = dataLoader<Team[]>('getTeams');
const { useData: getTournament } = dataLoader<Tournament>('getTournament');

export type RegistrationSteps =
  | 'SELECT_TEAM'
  | 'CHECKOUT'
  | 'PAYMENT_METHOD'
  | 'SUCCESS';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export const RegistrationContext = createContext<{
  step: RegistrationSteps;
  teams?: Team[];
  team: ListboxOption;
  paymentMethod: PaymentMethod;
  tournament?: Tournament;
  isFetching: boolean;
  setTeam?: Dispatch<SetStateAction<ListboxOption>>;
  setPaymentMethod: (method: PaymentMethod) => void;
  nextStep: (step: RegistrationSteps) => void;
}>({
  step: 'SELECT_TEAM',
  teams: undefined,
  tournament: undefined,
  team: {
    name: 'Please select a team',
    value: '',
  },
  paymentMethod: 'PIX',
  isFetching: false,
  nextStep: (step: RegistrationSteps) => {},
  setPaymentMethod: (method: PaymentMethod) => {},
});

const RegistrationView = () => {
  const [step, setStep] = useState<RegistrationSteps>('SELECT_TEAM');
  const [team, setTeam] = useState<ListboxOption>({
    name: 'Please select a team',
    value: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  const nextStep = (step: RegistrationSteps) => setStep(step);

  // get params
  const router = useRouter();

  const { data: teams, error: teamsError } = getTeams({
    platform: router.query.platform || '',
    game: router.query.game || '',
  });

  const { data: tournament, error: tournamentError } = getTournament({
    tournamentId: router.query.id || '',
    platform: router.query.platform || '',
    game: router.query.game || '',
  });

  if (teams?.length === 0 || !tournament?.id) {
    return (
      <div className="flex flex-col p-8 text-center">
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="bg-dark rounded-lg p-8 sm:w-[500px]">
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
          teams,
          team,
          tournament,
          isFetching: false,
          paymentMethod,
          nextStep,
          setTeam,
          setPaymentMethod,
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
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        >
          <SelectTeamStep />
        </motion.div>
      );
    case 'PAYMENT_METHOD':
      return (
        <motion.div
          layout
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        >
          <PaymentMethodStep />
        </motion.div>
      );
    case 'CHECKOUT':
      return (
        <motion.div
          layout
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
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

export function fadeInLeft(
  type: string = 'spring',
  duration: number = 0.5,
  translateX: number = 60
) {
  return {
    enter: {
      x: 0,
      opacity: 1,
      transition: { type, duration },
    },
    exit: {
      x: translateX,
      opacity: 0,
      transition: { type, duration },
    },
  };
}

export default RegistrationView;
