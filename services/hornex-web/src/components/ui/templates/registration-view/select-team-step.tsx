import Button from '../../atoms/button';
import InputLabel from '../../atoms/form/input-label';
import { LongArrowRight } from '../../atoms/icons/long-arrow-right';
import Listbox, { ListboxOption } from '../../atoms/list-box';
import Loader from '../../atoms/loader';
import PaymentOptions from '../../molecules/payment-options';
import { useStepContext } from './registration-view';
import { dataLoader } from '@/lib/api';
import { Registration } from '@/lib/models';
import { Team, Tournament } from '@/lib/proto';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'es-cookie';
import { InfoIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { FC, FormEventHandler, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const { post: registerTeam } = dataLoader<
  Registration,
  {
    team: string;
  }
>('registerTeam');

const submitRegistrationFormSchema = z.object({
  team: z.string(),
});

type SubmitRegistrationFormType = z.infer<typeof submitRegistrationFormSchema>;

export type SelectTeamStepProps = {};

export const SelectTeamStep: FC<SelectTeamStepProps> = ({}) => {
  const { nextStep, setTeam, teams, tournament } = useStepContext();
  const router = useRouter();
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

  const [isFetching, setIsFetching] = useState(false);

  const [teamOption, setTeamOption] = useState({
    name: 'Please select a team',
    value: '',
  });

  const [error, setError] = useState<string | undefined>(undefined);

  const teamOptions: ListboxOption[] =
    teams?.map((team) => ({
      name: team.name,
      value: team.id,
    })) || [];

  async function submitHandler(data: SubmitRegistrationFormType) {
    setIsFetching(true);

    const { data: registration, error } = await registerTeam(
      {
        tournamentId: tournament?.id || '',
        platform: router.query.platform || '',
        game: router.query.game || '',
      },
      { team: teamOption.value }
    );

    setIsFetching(false);
    setError(error?.message);

    if (registration) {
      router.push(`/registration/${registration.id}/checkout`);
    }
  }

  return (
    <div className="bg-dark h-min-[200px] w-[350px] rounded p-6">
      {/* <RegistrationStepper /> */}
      <h4 className="text-title mb-4 text-left text-lg font-semibold">
        Registration
      </h4>
      {isFetching && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {!isFetching && (
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
                  selectedOption={teamOption}
                  onChange={(option) => {
                    setTeamOption(option);
                    setValue(name, teamOption.value);
                  }}
                />
              )}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>

          <div className="flex items-center justify-end ">
            <Button
              color="gray"
              variant="ghost"
              shape="rounded"
              size="small"
              className="mr-4"
              type="submit"
            >
              Cancelar
            </Button>
            <Button color="warning" shape="rounded" size="small" type="submit">
              <div className="flex items-center">
                Continuar
                <LongArrowRight className="ml-2 w-5" />
              </div>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
