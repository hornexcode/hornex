import Button from '../../atoms/button';
import Input from '../../atoms/form/input';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowLeft } from '../../atoms/icons/long-arrow-left';
import { LongArrowRight } from '../../atoms/icons/long-arrow-right';
import Listbox, { ListboxOption } from '../../atoms/list-box';
import PaymentOptions from '../../molecules/payment-options';
import { useStepContext } from './registration-view';
import { dataLoader } from '@/lib/api';
import { Team, Tournament } from '@/lib/proto';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';
import React, { FC, FormEventHandler, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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

  return (
    <div className="bg-dark w-[350px] rounded p-6">
      <div className="text-body flex items-center text-sm">
        <LongArrowLeft className="mr-2 w-4" />
        Escolher time
      </div>
      {/* <RegistrationStepper /> */}
      <h4 className="mb-4 text-left text-lg font-semibold">Checkout</h4>
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
        <div className="space-y-2 border-t border-dashed border-gray-600 pt-4">
          <h4 className="text-body mb-4 uppercase tracking-wider">
            Payment Method
          </h4>
          <div className="w-full">
            <PaymentOptions onChange={setPaymentMethod} value={paymentMethod} />
          </div>
        </div>
        <div className="space-y-2 border-t border-dashed border-gray-600 pt-4">
          <h4 className="text-body mb-4 uppercase tracking-wider">Details</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="">Team:</div>
            <div className="">{team?.name}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="">Entry fee:</div>
            <div className="font-display">${tournament.entry_fee}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="">Number of members:</div>
            <div className="font-display">x{tournament.team_size}</div>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-gray-600 pt-4 text-sm">
            <div className="">Total</div>
            <div className="font-display text-2xl font-semibold">
              ${tournament.entry_fee * tournament.team_size}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-gray-600 pt-4">
          <Button
            color="gray"
            variant="ghost"
            shape="rounded"
            size="small"
            className="mr-4"
            onClick={() => nextStep('SELECT_TEAM')}
          >
            Cancelar
          </Button>
          <Button
            color="warning"
            className="flex-1"
            shape="rounded"
            size="small"
            type="submit"
          >
            <div className="flex items-center">
              Continuar
              <LongArrowRight className="ml-2 w-5" />
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};
