import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import Listbox from '@/components/ui/list-box';
import { CurrentUser } from '@/infra/hx-core/responses/current-user';
import { TeamCreated } from '@/infra/hx-core/responses/team-created';
import { AppLayout } from '@/layouts';
import { dataLoaders, dataLoadersV2 } from '@/lib/api';
import { getCookieFromRequest } from '@/lib/api/cookie';
import {
  GetGamesOutput,
  getGamesSchemaOutput as schema,
} from '@/services/hx-core/get-games';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const createTeamFormSchema = z.object({
  name: z.string().min(2, { message: 'Minimum 2 characters for team name' }),
  game_id: z.string().uuid({ message: 'You have to chose a game' }),
});

type CreateTeamForm = z.infer<typeof createTeamFormSchema>;

const { post: createTeam } = dataLoadersV2<TeamCreated, CreateTeamForm>(
  'createTeam'
);

const TeamCreate = ({
  games,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const gameOptions = games.map((game) => ({
    value: game.id,
    name: game.name,
  }));

  const [gameOption, setGameOption] = useState(gameOptions[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamFormSchema),
  });

  const submitHandler = async (form: CreateTeamForm) => {
    try {
      setIsFetching(true);
      const { data, error } = await createTeam({
        name: form.name,
        game_id: gameOption.value,
      });
      if (error) toast.error(error.message);
      if (data?.team && !error) toast.success('Team created successfully');

      router.push(`${data?.team.id}`);
    } catch (err) {
      const { error } = err as { error: string };
      toast.error(error);
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          New Team
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        {/* Email */}
        <div>
          <InputLabel title="Team name" important />
          <Input
            disabled={isFetching}
            inputClassName={classnames(
              errors.name?.message ? 'focus:ring-red-500' : ''
            )}
            placeholder="Choose a cool name like: #1 HX 🐐"
            error={errors.name?.message}
            {...register('name', { required: true })}
          />
        </div>

        {/* Game */}
        <div>
          <InputLabel title="Game" important />
          <Listbox
            className="w-full sm:w-80"
            options={gameOptions}
            selectedOption={gameOption}
            onChange={setGameOption}
          />
        </div>
        <Button
          isLoading={isFetching}
          disabled={isFetching}
          color="secondary"
          size="small"
          shape="rounded"
        >
          Create
        </Button>
      </form>
    </div>
  );
};

TeamCreate.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

const { get: current } = dataLoaders<CurrentUser>('currentUser');
const { get: getGames } = dataLoadersV2<GetGamesOutput>('getGames', schema);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = getCookieFromRequest(ctx.req, 'hx-auth.token');

  // Check token existence
  if (!cookie) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const currentUser = await current({
    Authorization: cookie ? `Bearer ${cookie}` : '',
  });

  // Check token validity
  if (!currentUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { data: games } = await getGames({
    headers: {
      Authorization: cookie ? `Bearer ${cookie}` : '',
    },
  });

  if (!games) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      games,
    },
  };
};

export default TeamCreate;
