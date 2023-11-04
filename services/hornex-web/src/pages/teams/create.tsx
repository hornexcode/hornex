import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
import Loader from '@/components/ui/loader';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const gameOptions: ListboxOption[] = [
  {
    name: 'League of Legends',
    value: 'league-of-legends',
  },
];

const platformOptions: ListboxOption[] = [
  { name: 'PC', value: 'pc' },
  { name: 'PS4', value: 'ps4' },
  { name: 'XBOX', value: 'xbox' },
  { name: 'MOBILE', value: 'mobile' },
];

const createTeamFormSchema = z.object({
  name: z.string().min(2, { message: 'Minimum 2 characters for team name' }),
  description: z.string(),
  game: z.string(),
  platform: z.string(),
});

type CreateTeamForm = z.infer<typeof createTeamFormSchema>;

const { post: createTeam } = dataLoader<undefined, CreateTeamForm>(
  'createTeam'
);

const TeamCreate = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const route = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [gameOption, setGameOption] = React.useState(gameOptions[0]);
  const [platformOption, setPlatformOption] = React.useState(
    platformOptions[0]
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamFormSchema),
  });

  const submitHandler: SubmitHandler<CreateTeamForm> = async (form) => {
    setIsSubmitting(true);
    const { error } = await createTeam(form);
    if (!error) {
      toast.success('Team created successfully');
    }
    setIsSubmitting(false);
    route.push('/teams');
  };

  React.useEffect(() => {
    setValue('platform', platformOption.value);
    setValue('game', gameOption.value);
  }, []);

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between pb-2">
        <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white  sm:text-2xl">
          Create New Team
        </h2>
      </div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="w-full sm:w-80 lg:w-2/3">
          <InputLabel title="Nome do time" important />
          <Input
            inputClassName={classnames(
              errors.name?.message ? 'focus:ring-red-500' : ''
            )}
            placeholder="Nome do time"
            error={errors.name?.message}
            {...register('name', { required: true })}
          />
        </div>
        <div className="mt-5 w-full sm:w-80 lg:w-2/3">
          <InputLabel title="Descrição do time" />
          <Input
            inputClassName={classnames(
              errors.description?.message ? 'focus:ring-red-500' : ''
            )}
            placeholder="Descrição do time"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
        <div className="mt-5 w-full sm:w-80 lg:w-2/3">
          <InputLabel title="Plaform" important />

          <Controller
            name="platform"
            control={control}
            rules={{
              required: 'Please select an platfrom',
            }}
            render={({ field: { name } }) => (
              <Listbox
                options={platformOptions}
                selectedOption={platformOption}
                onChange={(option) => {
                  setPlatformOption(option);
                  setValue(name, platformOption.value);
                }}
              />
            )}
          />
        </div>
        <div className="mt-5 w-full sm:w-80 lg:w-2/3">
          <InputLabel title="Game" important />

          <Controller
            name="game"
            control={control}
            rules={{
              required: 'Please select a game',
            }}
            render={({ field: { name } }) => (
              <Listbox
                options={gameOptions}
                selectedOption={gameOption}
                onChange={(option) => {
                  setGameOption(option);
                  setValue(name, gameOption.value);
                }}
              />
            )}
          />
        </div>
        <div className="mt-10">
          <Button shape="rounded" type="submit">
            {isSubmitting ? <Loader /> : 'CREATE'}
          </Button>
        </div>
      </form>
    </div>
  );
};

TeamCreate.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};

export default TeamCreate;
