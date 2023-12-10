import { useStepContext } from './registration-view';
import Button from '@/components/ui/atoms/button';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { LongArrowLeft } from '@/components/ui/atoms/icons/long-arrow-left';
import { LongArrowRight } from '@/components/ui/atoms/icons/long-arrow-right';
import PaymentOptions from '@/components/ui/molecules/payment-options';
import { dataLoader } from '@/lib/api';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

const { post: registerTeam } = dataLoader<undefined>('registerTeam');

export type PaymentMethodStepProps = {};

export const PaymentMethodStep: FC<PaymentMethodStepProps> = () => {
  const { nextStep, step, tournament, team } = useStepContext();
  let [paymentMethod, setPaymentMethod] = useState('pix');

  const { handleSubmit } = useForm<{}>({});

  if (!tournament) {
    return (
      <div className="flex flex-col p-8 text-center">
        <p>Something went wrong</p>
      </div>
    );
  }

  async function submitHandler() {
    nextStep('CHECKOUT');
  }

  return (
    <>
      <form
        action=""
        className="space-y-8"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="w-full">
          <InputLabel title="Payment method" important />
          <PaymentOptions onChange={setPaymentMethod} value={paymentMethod} />
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
              <div className="font-semibold">Continuar</div>
              <LongArrowRight className="ml-2 w-5" />
            </div>
          </Button>
        </div>
      </form>
    </>
  );
};
