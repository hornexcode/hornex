import Loader from '../../atoms/loader';
import { Separator } from '../../separator';
import { useModal } from '@/components/modal-views/context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Button from '@/components/ui/atoms/button';
import InputLabel from '@/components/ui/atoms/form/input-label';
import Listbox, { ListboxOption } from '@/components/ui/atoms/list-box';
import { useStepContext } from '@/components/ui/organisms/register-team-view/register-team-modal-view';
import { Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { FC, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const submitRegistrationFormSchema = z.object({
  team: z.string(),
});
type SubmitRegistrationFormType = z.infer<typeof submitRegistrationFormSchema>;

const { post: registerTeam } = dataLoader<
  Registration,
  {
    team: string;
    platform: string;
    game: string;
  }
>('registerTeam');

const SelectTeamForm: FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const { nextStep, setTeam, teams, tournament } = useStepContext();

  const router = useRouter();
  const { closeModal } = useModal();
  // react hook form
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubmitRegistrationFormType>({
    resolver: zodResolver(submitRegistrationFormSchema),
  });

  // create ref for button
  const formRef = useRef(null);
  const [teamOption, setTeamOption] = useState({
    name: 'Please select a team',
    value: '',
  });

  const teamOptions: ListboxOption[] =
    teams?.map((team) => ({
      name: team.name,
      value: team.id,
    })) || [];

  async function submitHandler() {
    setIsFetching(true);

    const { data: registration, error } = await registerTeam(
      {
        tournamentId: tournament?.id || '',
      },
      {
        team: teamOption.value,
        platform: router.query.platform as string,
        game: router.query.game as string,
      }
    );

    setError(error?.message);
    setIsFetching(false);
    if (registration) {
      router.push(`/registration/${registration.id}/checkout`);
    }
  }

  return (
    <div className="relative">
      <div
        className={classnames(
          't-0 r-0 bg-light-dark absolute z-10 h-full w-full',
          isFetching ? 'flex flex-col items-center justify-center' : 'hidden'
        )}
      >
        <p className="text-title mb-2 text-lg font-semibold">Validating team</p>
        <Loader variant="scaleUp" className="w-12" />
      </div>
      <form
        action=""
        className="space-y-8 p-5"
        onSubmit={handleSubmit(submitHandler)}
        ref={formRef}
      >
        <div className="w-full">
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
          {errors.team && (
            <span className="text-sm text-red-500">{errors.team.message}</span>
          )}
        </div>

        <div className="flex items-center">
          <Separator className="flex-1 bg-gray-400" />
          <div className="px-2">OR</div>
          <Separator className="flex-1 bg-gray-400" />
        </div>

        <div className="flex items-center">
          <Button
            onClick={() => closeModal()}
            color="gray"
            variant="ghost"
            shape="rounded"
            size="small"
            className="mr-4"
          >
            Cancelar
          </Button>
          <ConfirmRegistrationAlert isDisabled={isFetching} formRef={formRef} />
        </div>
      </form>
    </div>
  );
};

export { SelectTeamForm };

const ConfirmRegistrationAlert = ({
  formRef,
  isDisabled,
}: {
  formRef: any;
  isDisabled: boolean;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex-1" color="warning" shape="rounded" size="small">
          <div className="flex items-center">Registrar</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You are creating a new registration
          </AlertDialogTitle>
          <AlertDialogDescription>
            After creating a registration you will need to pay an entry fee to
            join in the tournament. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={(e) => {
                formRef.current?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true })
                );
              }}
              type="submit"
              shape="rounded"
              size="small"
              color="primary"
              isLoading={isDisabled}
              disabled={isDisabled}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
