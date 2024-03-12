import Button from '@/components/ui/atoms/button/button';
import Input from '@/components/ui/atoms/form/input';
import InputLabel from '@/components/ui/atoms/form/input-label';
import Listbox, { ListboxOption } from '@/components/ui/atoms/list-box';
import Loader from '@/components/ui/atoms/loader';
import { AppLayout } from '@/layouts';
import { Team } from '@/lib/models';
import { dataLoader } from '@/lib/request';
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

const { post: createTeam } = dataLoader<Team, CreateTeamForm>('createTeam');

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
    const { error } = await createTeam({}, form);
    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    route.push('/teams');
  };

  React.useEffect(() => {
    setValue('platform', platformOption.value);
    setValue('game', gameOption.value);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="w-2/4 p-8">
        <div className="mb-4">
          <div className="flex items-end justify-between">
            <h2 className="text-title text-sm font-bold sm:text-lg">
              Create New Team
            </h2>
          </div>
        </div>

        <div className="">
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="w-full">
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
            <div className="mt-5 w-full">
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
            <div className="mt-5 w-full">
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
            <div className="mt-5 w-full">
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
              <Button
                className="mr-4"
                size="small"
                color="gray"
                variant="ghost"
                shape="rounded"
                type="button"
                onClick={() => route.back()}
              >
                Cancel
              </Button>
              <Button size="small" shape="rounded" type="submit">
                {isSubmitting ? <Loader /> : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
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
