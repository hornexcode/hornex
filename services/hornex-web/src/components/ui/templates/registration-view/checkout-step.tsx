import Button from '../../atoms/button';
import Input from '../../atoms/form/input';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowLeft } from '../../atoms/icons/long-arrow-left';
import { LongArrowRight } from '../../atoms/icons/long-arrow-right';
import Listbox, { ListboxOption } from '../../atoms/list-box';
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

  if (!tournament) {
    return (
      <div className="flex flex-col p-8 text-center">
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <>
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
        <div className="space-y-2 border-y border-dashed border-gray-400 py-4">
          <h4 className="mb-4 uppercase tracking-wider text-gray-400">
            Details
          </h4>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Team:</div>
            <div className="font-semibold">{team?.name}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Entry fee:</div>
            <div className="font-semibold">${tournament.entry_fee}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Number of members:</div>
            <div className="font-semibold">x{tournament.team_size}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">$100</div>
          </div>
        </div>

        <div className="space-y-2 border-b border-dashed border-gray-400 pb-4">
          <h4 className="mb-4 uppercase tracking-wider text-gray-400">
            Payment
          </h4>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Team:</div>
            <div className="font-semibold">{team?.name}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Entry fee:</div>
            <div className="font-semibold">${tournament.entry_fee}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Number of members:</div>
            <div className="font-semibold">x{tournament.team_size}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">$100</div>
          </div>
        </div>

        <div className="flex items-center justify-end ">
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
              <div className="font-semibold">Continuar</div>
              <LongArrowRight className="ml-2 w-5" />
            </div>
          </Button>
        </div>
      </form>
    </>
  );
};
