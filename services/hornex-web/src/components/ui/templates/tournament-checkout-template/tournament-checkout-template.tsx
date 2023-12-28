import Button from '../../atoms/button/button';
import Input from '../../atoms/form/input';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowLeft } from '../../atoms/icons/long-arrow-left';
import PaymentOptions from '../../molecules/payment-options/payment-options';
import { useModal } from '@/components/modal-views/context';
import { useToast } from '@/components/ui/use-toast';
import { dataLoader } from '@/lib/api';
import { Tournament } from '@/lib/models/types';
import {
  PayRegistrationParams,
  payRegistrationParams,
} from '@/lib/models/types/rest/pay-registration';
import { TrashIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const { post: payRegistration } = dataLoader<undefined, payRegistrationParams>(
  'payRegistration'
);

type TournamentCheckoutProps = {
  tournament: Tournament;
};

const TournamentCheckoutTemplate: FC<TournamentCheckoutProps> = ({
  tournament,
}) => {
  const { toast } = useToast();
  const { openModal } = useModal();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [inputErrors, setInputErrors] = useState({ name: '', cpf: '' });
  const router = useRouter();

  const registrationId = router.query.id as string;

  const handlePayment = useCallback(async () => {
    if (!cpf) {
      setInputErrors((prev) => ({ ...prev, cpf: 'CPF inválido' }));
    }

    if (!name) {
      setInputErrors((prev) => ({ ...prev, name: 'Nome inválido' }));
    }

    if (inputErrors.cpf || inputErrors.name) return;

    const { error, data } = await payRegistration(
      {},
      { registration: registrationId, name, cpf }
    );

    console.log('DATA', data);

    if (error?.response) {
      return toast({ title: 'error', description: error.response.message });
    }

    // router.push(`/registration/${registrationId}/success`);
  }, [name, cpf, registrationId]);

  return (
    <div className="container mx-auto space-y-8 sm:space-y-16 sm:pt-16">
      <div className="grid grid-cols-4 gap-8 divide-x divide-dashed divide-gray-700">
        <div className="col-span-2 space-y-12">
          <div>
            <h2 className="text-title text-2xl font-bold">
              Complete your registration
            </h2>
            <p className="text-body text-lg font-normal">
              Checkout to complete your registration and play the tournament
            </p>
          </div>

          <div className="">
            <div className="w-full">
              <InputLabel title="Payment Method" important />
              <PaymentOptions
                onChange={setPaymentMethod}
                value={paymentMethod}
              />
            </div>
            {paymentMethod === 'pix' && (
              <div className="mt-8 space-y-8">
                <div className="">
                  <InputLabel title="Nome no PIX" important />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    inputClassName={classnames(
                      inputErrors.name ? 'focus:ring-red-500' : ''
                    )}
                    placeholder="Nome no PIX"
                    error={inputErrors.name}
                  />
                </div>
                <div className="">
                  <InputLabel title="CPF no PIX" important />
                  <Input
                    value={cpf}
                    onChange={(e) => {
                      setCpf(e.target.value);
                      if (!/^\d{11}$/.test(e.target.value))
                        setInputErrors((prev) => ({
                          ...prev,
                          cpf: 'CPF inválido',
                        }));
                      else setInputErrors((prev) => ({ ...prev, cpf: '' }));
                    }}
                    inputClassName={classnames(
                      inputErrors ? 'focus:ring-red-500' : ''
                    )}
                    placeholder="CPF no PIX"
                    error={inputErrors.cpf}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => router.back()}
              color="gray"
              shape="rounded"
              className="mr-3"
              variant="ghost"
            >
              <div className="flex items-center">
                <LongArrowLeft className="mr-4 h-5 w-4" />
                <span>Back</span>
              </div>
            </Button>
            <Button
              onClick={() => handlePayment()}
              className="flex-1"
              shape="rounded"
            >
              Registrate
              <span className="font-display ml-2">
                ${tournament.entry_fee * tournament.team_size}
              </span>
            </Button>
          </div>
        </div>
        {/* <div className="col-span-2">
          <Image
            width={256}
            height={256}
            src="data:image/png;base64,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"
            alt="qrcode"
          />
        </div> */}
        <div className="col-span-2 pl-8">
          <div className="space-y-6">
            <div className="text-title text-lg tracking-wide">
              Purchase Details
            </div>
            <div className="flex space-x-5">
              <div className="block">
                <Image
                  className="shadow-card rounded-lg"
                  src={`/images/tournaments/${tournament.feature_image}`}
                  width={64}
                  height={64}
                  alt="Cover Image"
                />
              </div>

              {/* details */}
              <div className="flex-1">
                <h4 className="text-title text-sm">1x {tournament.name}</h4>
                <div className="text-title  bg-dark border-light-dark mt-2 flex items-center justify-between rounded border p-2 text-sm">
                  Team 1
                  <TrashIcon className="text-title ml-2 h-4 w-4 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="font-display space-y-5 px-4">
              <div className="text-body flex items-center justify-between text-sm">
                <div>Subtotal</div>
                <div>${tournament.entry_fee}</div>
              </div>
              <div className="text-body flex items-center justify-between text-sm">
                <div>Qty</div>
                <div>x{tournament.team_size}</div>
              </div>
              <div className="text-title flex items-center justify-between text-xl">
                <div>TOTAL</div>
                <div>${tournament.entry_fee * tournament.team_size}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCheckoutTemplate;
