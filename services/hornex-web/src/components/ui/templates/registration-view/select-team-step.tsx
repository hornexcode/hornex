import Button from '../../atoms/button';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowRight } from '../../atoms/icons/long-arrow-right';
import Listbox, { ListboxOption } from '../../atoms/list-box';
import PaymentOptions from '../../molecules/payment-options';
import { useStepContext } from './registration-view';
import { dataLoader } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import React, {
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const { post: registerTeam } = dataLoader<undefined>('registerTeam');

const submitRegistrationFormSchema = z.object({
  team: z.string(),
});

type SubmitRegistrationFormType = z.infer<typeof submitRegistrationFormSchema>;

export type SelectTeamStepProps = {};

export const SelectTeamStep: FC<SelectTeamStepProps> = ({}) => {
  const { nextStep, setTeam, teams, team, step } = useStepContext();
  // react hook form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubmitRegistrationFormType>({
    resolver: zodResolver(submitRegistrationFormSchema),
  });

  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  const setTeamHandler = useCallback(
    (team: ListboxOption) => {
      setValue('team', team.value);
    },
    [team]
  );

  useEffect(() => {
    team && setTeamHandler(team);
  }, [step]);

  const teamOptions: ListboxOption[] =
    teams?.map((team) => ({
      name: team.name,
      value: team.id,
    })) || [];

  async function submitHandler(data: SubmitRegistrationFormType) {
    console.log(data);
    // set payment method into url params
    if (team)
      router.query = {
        ...router.query,
        step: 'PAYMENT_METHOD',
      };

    nextStep('PAYMENT_METHOD');
  }

  return (
    <>
      {/* <RegistrationStepper /> */}
      <h4 className="mb-4 text-left text-lg font-semibold">Registration</h4>
      <div className="bg-light-dark rounded p-4 text-left text-sm text-white">
        <InfoIcon className="mr-2 inline-block w-4" />
        Para registrar um time no torneio o líder do time deve realizar o
        pagamento total da inscrição de todos os membros incluindo a sua.
      </div>
      <form
        action=""
        className="space-y-8"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="mt-5 w-full">
          <InputLabel title="Team" important />

          <Controller
            name="team"
            control={control}
            rules={{
              required: 'Please select a team',
            }}
            render={({ field: { name } }) => (
              <Listbox
                options={teamOptions}
                selectedOption={team}
                onChange={(option) => {
                  setTeam && setTeam(option);
                  setValue(name, option.name);
                }}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-end ">
          <Button
            color="gray"
            shape="rounded"
            size="small"
            className="mr-4"
            type="submit"
          >
            <div className="font-semibold">Cancelar</div>
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
