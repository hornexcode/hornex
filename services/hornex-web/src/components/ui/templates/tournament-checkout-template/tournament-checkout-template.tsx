import {
  PaymentMethod,
  PixContentProps,
  PixResponse,
  TournamentCheckoutProps,
} from './tournament-checkout-template.types';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import Input from '@/components/ui/atoms/form/input';
import InputLabel from '@/components/ui/atoms/form/input-label';
import PaymentOptions from '@/components/ui/molecules/payment-options/payment-options';
import { dataLoader } from '@/lib/request';
import { toCurrency } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { AlertCircle, TimerIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

export const PayRegistrationParams = z.object({
  registration: z.string().uuid(),
  name: z.string(),
  cpf: z.string().regex(/^\d{11}$/, { message: 'CPF inválido' }),
});
export type payRegistrationParams = z.infer<typeof PayRegistrationParams>;

const { post: createPixPayment } = dataLoader<
  PixResponse,
  payRegistrationParams
>('payRegistration');

export const createStripePaymentIntentParams = z.object({
  registration: z.string().uuid(),
});

type StripePaymentIntent = {
  id: string;
  client_secret: string;
};
const { post: createStripePaymentIntent } = dataLoader<
  StripePaymentIntent,
  z.infer<typeof createStripePaymentIntentParams>
>('payRegistration');

const createPixPaymentForm = z.object({
  name: z.string(),
  cpf: z.string(),
});

const createStripePaymentForm = z.object({
  cep: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const TournamentCheckoutTemplate: FC<TournamentCheckoutProps> = ({
  tournament,
  team,
}) => {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('credit-card');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal } = useModal();

  const registrationId = router.query.id as string;

  const mountPaymentForm = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'pix':
        return <PixPaymentForm />;
      case 'credit-card':
        return <StripePaymentForm />;
      default:
        break;
    }
  };

  const resolver =
    paymentMethod === 'pix'
      ? zodResolver(createPixPaymentForm)
      : zodResolver(createStripePaymentForm);

  const methods = useForm<
    | z.infer<typeof createPixPaymentForm>
    | z.infer<typeof createStripePaymentForm>
  >({
    resolver,
  });

  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (data: any) => {
    openModal('PROCESSING_PAYMENT_VIEW');
    switch (paymentMethod) {
      case 'pix':
        const pixFormData = data as z.infer<typeof createPixPaymentForm>;
        setLoading(true);
        const { error } = await createPixPayment(
          {},
          {
            registration: registrationId,
            name: pixFormData.name,
            cpf: pixFormData.cpf,
          }
        );
        setLoading(false);
        if (error) {
          console.log(error);
        } else {
          // router.push(`/tournaments/${tournament.id}`);
          console.log('success');
        }
        break;
      case 'credit-card':
        const stripeFormData = data as z.infer<typeof createStripePaymentForm>;
        setLoading(true);

        if (!stripe || !elements) {
          break;
        }

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          setLoading(false);
          break;
        }

        const cardholder = `${stripeFormData.firstName} ${stripeFormData.lastName}`;

        const { data: paymentIntent, error: stripeError } =
          await createStripePaymentIntent(
            {
              credit_card: '1',
            },
            {
              registration: registrationId,
            }
          );

        if (stripeError || !paymentIntent) {
          console.log(stripeError);
          setLoading(false);
          break;
        }

        const { error: stripePaymentError } = await stripe.confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: cardholder,
                address: {
                  postal_code: stripeFormData.cep,
                },
              },
            },
          }
        );

        if (stripePaymentError) {
          console.log(stripePaymentError);
          setLoading(false);
          break;
        }
        closeModal();
        console.log('success!');
        window.location.href = `/thank-you`;
        break;
      default:
        break;
    }
    setLoading(false);
    closeModal();
  };

  return (
    <div className="pace-y-8 container sm:space-y-16 sm:pt-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Summary */}
        <div className="col-span-1 hidden">
          <div className="mb-4">
            <h2 className="text-title text-xl">Resumo</h2>
          </div>
          {/* <div className="bg-medium-dark shadow-card flex items-center rounded p-6">
            <div className="block">
              <AlertCircle className="text-body mr-4" />
            </div>
            <div className="block">
              <h2 className="text-title text-xl">Confirmação de inscrição</h2>
              <p className="text-body text-sm font-light tracking-wide">
                Sua inscrição foi criada porém ainda não foi paga. Para garantir
                sua vaga no torneio, realize o pagamento.
              </p>
            </div>
          </div> */}
        </div>

        <div className="col-span-1 p-6">
          <div className="mb-4">
            <h2 className="text-title text-xl">Purchase Resume</h2>
          </div>
          <div className="bg-light-dark mb-10 space-y-4 rounded">
            {/* tournament name */}
            <div className="bg-medium-dark highlight-white-5 block border-b  border-gray-700">
              <div className="text-title p-6 text-sm font-light">
                Inscrição para torneio de{' '}
                <span className="text-body font-bold">League of Legends</span>:{' '}
                <span className="font-bold">{tournament.name}</span>
              </div>
            </div>
            {/* team name */}
            <div className="text-body flex items-center justify-between px-6 text-sm font-light">
              <div className="">Team</div>
              <div className="">{team.name} </div>
            </div>
            <div className="text-body flex items-center justify-between px-6 text-sm font-light">
              <div className="">
                {tournament.team_size} x{' '}
                <span className="font-semibold">
                  {tournament.name} inscrições
                </span>{' '}
              </div>
              <div className="flex items-center">
                ${' '}
                <span className="font-display">
                  {toCurrency(tournament.entry_fee * tournament.team_size)}
                </span>
                <span className="ml-2 text-xs">BRL</span>
              </div>
            </div>
            <div className="text-title px-6 pb-6 text-sm font-extrabold">
              <div className="flex items-center justify-between border-t border-dashed border-gray-700 pt-4">
                <div className="">Total Charge</div>
                <div className="flex items-center">
                  ${' '}
                  <span className="font-display">
                    {toCurrency(tournament.entry_fee * tournament.team_size)}
                  </span>
                  <span className="ml-2 text-xs">BRL</span>
                </div>
              </div>
            </div>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="space-y-8">
                <div className="">
                  <div>
                    <InputLabel title="Payment Method" important />
                    <PaymentOptions
                      onChange={setPaymentMethod}
                      value={paymentMethod}
                    />
                  </div>
                  {mountPaymentForm(paymentMethod)}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    shape="rounded"
                    fullWidth
                    disabled={loading}
                    isLoading={loading}
                    loaderVariant="scaleUp"
                  >
                    {paymentMethod === 'pix' ? 'Pay with PIX' : 'Pay with Card'}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

const PixPaymentForm = () => {
  const { register } = useFormContext();
  return (
    <div className="mt-8 space-y-8">
      <div className="">
        <InputLabel title="Nome" important />
        <Input {...register('name')} placeholder="Nome" />
      </div>
      <div className="">
        <InputLabel title="CPF" important />
        <Input {...register('cpf')} />
      </div>
    </div>
  );
};

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  console.log(errors);

  if (!stripe || !elements) {
    return null;
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="grid w-full grid-cols-2 gap-4">
        <div>
          <InputLabel title="First Name" important />
          <Input {...register('firstName')} placeholder="First Name" />
        </div>
        <div>
          <InputLabel title="Last Name" important />
          <Input {...register('lastName')} placeholder="Last Name" />
        </div>
      </div>
      <div className="w-full">
        <InputLabel title="Card Number" important />
        <CardNumberElement
          options={{
            style: {
              base: {
                lineHeight: '24px',
                padding: '10px 12px',
                color: '#fff',
                '::placeholder': {
                  color: 'rgb(107, 114, 128)',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="dark:bg-dark mt-1 block h-8 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm  placeholder-gray-400 transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-500 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-600 sm:h-10 sm:rounded"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <InputLabel title="Expiration" important />
          <CardExpiryElement
            options={{
              style: {
                base: {
                  lineHeight: '24px',
                  padding: '10px 12px',
                  color: '#fff',
                  '::placeholder': {
                    color: 'rgb(107, 114, 128)',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            className="dark:bg-dark mt-1 block h-8 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm  placeholder-gray-400 transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-500 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-600 sm:h-10 sm:rounded"
          />
        </div>
        <div className="w-full">
          <InputLabel title="CVC" important />
          <CardCvcElement
            options={{
              style: {
                base: {
                  lineHeight: '24px',
                  padding: '10px 12px',
                  color: '#fff',
                  '::placeholder': {
                    color: 'rgb(107, 114, 128)',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            className="dark:bg-dark mt-1 block h-8 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm  placeholder-gray-400 transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-500 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-600 sm:h-10 sm:rounded"
          />
        </div>
      </div>
      <div className="w-full">
        <InputLabel title="Postal Code" important />
        <Input {...register('cep')} placeholder="Postal Code" />
      </div>
    </div>
  );
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
