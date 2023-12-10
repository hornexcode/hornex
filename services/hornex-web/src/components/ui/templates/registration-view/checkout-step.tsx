import { useStepContext } from './registration-view';
import Button from '@/components/ui/atoms/button';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { LongArrowLeft } from '@/components/ui/atoms/icons/long-arrow-left';
import { LongArrowRight } from '@/components/ui/atoms/icons/long-arrow-right';
import PaymentOptions from '@/components/ui/molecules/payment-options';
import { dataLoader } from '@/lib/api';
import React, { FC, useState } from 'react';

const { post: registerTeam } = dataLoader<undefined>('registerTeam');

export type CheckoutStepProps = {};

export const CheckoutStep: FC<CheckoutStepProps> = () => {
  const { nextStep, step, tournament, team } = useStepContext();
  let [paymentMethod, setPaymentMethod] = useState('pix');
  if (!tournament) {
    return (
      <div className="flex flex-col p-8 text-center">
        <p>Something went wrong</p>
      </div>
    );
  }

  async function submitHandler(data: any) {}

  return (
    <>
      {/* <RegistrationStepper /> */}
      <h4 className="mb-4 text-center text-lg font-semibold">
        Subscription Checkout
      </h4>
      {/* <div className="rounded bg-blue-400 p-4 text-left text-sm text-white">
        <InfoIcon className="mr-2 inline-block w-4" />
        Para registrar um time no torneio o líder do time deve realizar o
        pagamento total da inscrição de todos os membros incluindo a sua.
      </div> */}
      <form
        action=""
        className="space-y-8"
        // onSubmit={handleSubmit(submitHandler)}
      >
        <div className="bg-light-dark space-y-2 rounded border-gray-600 p-8">
          <h4 className="mb-4 uppercase tracking-wider">Details</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="">Team:</div>
            <div className="">{team?.name}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="">Entry fee:</div>
            <div className="">${tournament.entry_fee}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="">Number of members:</div>
            <div className="">x{tournament.team_size}</div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-gray-600 pt-2 text-sm">
            <div className="font-semibold">Total</div>
            <div className="text-2xl font-semibold">
              ${tournament.entry_fee * tournament.team_size}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-dashed border-gray-600 pt-4">
          <Button
            color="gray"
            shape="rounded"
            size="small"
            className="mr-4"
            onClick={() => nextStep('SELECT_TEAM')}
          >
            <div className="flex items-center">
              <LongArrowLeft className="mr-2 w-5" />
              <div className="font-semibold">Voltar</div>
            </div>
          </Button>
          <Button color="warning" shape="rounded" size="small" type="submit">
            <div className="flex items-center">
              <div className="font-semibold">Registrar</div>
            </div>
          </Button>
        </div>
      </form>
    </>
  );
};
