import Button from '../../atoms/button/button';
import Input from '../../atoms/form/input';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowLeft } from '../../atoms/icons/long-arrow-left';
import PaymentOptions from '../../molecules/payment-options/payment-options';
import { useModal } from '@/components/modal-views/context';
import { useToast } from '@/components/ui/use-toast';
import { dataLoader } from '@/lib/api';
import { Team } from '@/lib/models';
import { Tournament } from '@/lib/models/types';
import {
  PayRegistrationParams,
  payRegistrationParams,
} from '@/lib/models/types/rest/pay-registration';
import { toCurrency } from '@/lib/utils';
import { TrashIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { TimerIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type PixResponse = {
  qrcode: string;
  imagemQrcode: string;
  linkVisualizacao: string;
};

const { post: payRegistration } = dataLoader<
  PixResponse,
  payRegistrationParams
>('payRegistration');

type TournamentCheckoutProps = {
  tournament: Tournament;
  team: Team;
};

const TournamentCheckoutTemplate: FC<TournamentCheckoutProps> = ({
  tournament,
  team,
}) => {
  const { toast } = useToast();
  const { openModal } = useModal();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [inputErrors, setInputErrors] = useState({ name: '', cpf: '' });
  const [pix, setPix] = useState<PixResponse | null>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const registrationId = router.query.id as string;

  const handlePayment = useCallback(async () => {
    setLoading(true);

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

    setPix(data);

    if (error?.response) {
      return toast({ title: 'error', description: error.response.message });
    }

    setLoading(false);

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

          <div className="bg-medium-dark space-y-8 rounded p-5">
            <div>
              <InputLabel title="Team" important />
              <Input value={team.name} disabled />
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
                disabled={loading}
              >
                Registrate
                <span className="font-display ml-2">
                  ${tournament.entry_fee * tournament.team_size}
                </span>
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2 pl-8">
          <div className="space-y-6">
            <div className="text-title text-lg tracking-wide">
              Purchase Details
            </div>
            <div className="bg-medium-dark highlight-white-5 flex items-center justify-between space-x-5 rounded p-2">
              <div className="flex items-center">
                <Image
                  className="shadow-card mr-4 overflow-hidden rounded"
                  src={`/images/tournaments/${tournament.feature_image}`}
                  width={64}
                  height={64}
                  alt="Cover Image"
                />
                <div className="">
                  <div className="text-body text-xs">Tournament</div>
                  <div className="text-title text-sm">{tournament.name}</div>
                </div>
              </div>
              {/* details */}

              <div className="pr-4">
                <div className="text-title font-display text-sm">
                  ${toCurrency(tournament.entry_fee * tournament.team_size)}
                </div>
              </div>
              {/* <TrashIcon className="text-title ml-2 h-4 w-4 cursor-pointer hover:text-red-500" /> */}
            </div>

            <div className="font-display space-y-5 px-4 py-4">
              <div className="text-body flex items-end justify-between text-xs">
                <p className="leading-0 pr-2">Entry fee</p>
                <div className="flex-1 border-b border-dashed border-gray-600"></div>
                <div className="leading-2 pl-2">
                  ${tournament.entry_fee / 100}
                </div>
              </div>
              <div className="text-body flex items-end justify-between text-xs">
                <div className="pr-2">Teams qty</div>
                <div className="flex-1 border-b border-dashed border-gray-600"></div>
                <div>x{tournament.team_size}</div>
              </div>
              <div className="text-body flex items-center justify-between text-xs">
                <div className="pr-2">Subtotal</div>
                <div className="flex-1 border-b border-dashed border-gray-600"></div>
                <div className="leading-2 pl-2">
                  ${(tournament.entry_fee * tournament.team_size) / 100}
                </div>
              </div>
              <div className="text-title flex items-center justify-between text-xl">
                <div>TOTAL</div>
                <div>
                  <span className="text-body">BRL</span> $
                  {toCurrency(tournament.entry_fee * tournament.team_size)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type PixContentProps = {
  pix: PixResponse;
};

const PixContent = ({ pix }: PixContentProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <span className="text-title text-lg">PIX</span>
      <div className="bg-light-dark p-4 text-center">
        <Image width={256} height={256} src={pix.imagemQrcode} alt="qrcode" />
      </div>
      <Button
        shape="rounded"
        color="gray"
        variant="ghost"
        fullWidth
        onClick={() => router.back()}
        className="mt-4"
      >
        Copiar código
      </Button>
      <div className="bg-light-dark flex w-full items-center justify-center rounded p-10">
        <TimerIcon className="text-body mr-4 h-20 w-20" />
        <span className="text-body text-lg font-extralight">
          You have 15 minutes to complete the payment. Once the payment is done,
          you will be redirected to the tournament page.
        </span>
      </div>
    </div>
  );
};

export default TournamentCheckoutTemplate;
