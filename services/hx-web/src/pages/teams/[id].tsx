import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { MemberList } from '@/components/teams';
import { TeamTab } from '@/components/teams/team-tab';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { Member } from '@/domain';
import { CurrentUser } from '@/infra/hx-core/responses/current-user';
import { TeamFind } from '@/infra/hx-core/responses/team-find';
import { AppLayout } from '@/layouts';
import { dataLoaders, dataLoadersV2 } from '@/lib/api';
import { getCookieFromRequest } from '@/lib/api/cookie';
import { useAuthContext } from '@/lib/auth';
import {
  UpdateTeamInput,
  UpdateTeamOutput,
  updateTeamSchemaInput,
} from '@/services/hx-core/updateTeam';

const inviteForm = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
});

type MemberForm = z.infer<typeof inviteForm>;

const updateTeamForm = z.object({
  team: z.string().min(2, { message: 'Minimum 2 characters for team name' }),
});

const { patch: updateTeam } = dataLoadersV2<UpdateTeamOutput, UpdateTeamInput>(
  'updateTeam',
);

const TeamDetail = ({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { state } = useAuthContext();

  console.log(state);
  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [router, state.isAuthenticated]);

  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const removeHandler = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
    setIsLimitReached(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(inviteForm),
  });

  const addMember = async (data: MemberForm) => {
    if (members.find((member) => member.username === data.username)) {
      setError('username', { message: 'User already belongs to the team' });
      setFetching(false);
      return;
    }

    setFetching(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (members.length === 4) {
      setIsLimitReached(true);
    }

    setMembers((prev) => {
      return [
        ...prev,
        {
          id: Math.random() + members.length,
          username: data.username.toLowerCase(),
        },
      ];
    });

    reset();
    setFetching(false);
  };

  const {
    register: teamRegister,
    handleSubmit: teamSubmit,
    formState: { errors: teamErro },
  } = useForm<UpdateTeamInput>({
    resolver: zodResolver(updateTeamSchemaInput),
  });

  const teamSubmitHandler = async (data: UpdateTeamInput) => {
    try {
      setIsUpdating(true);
      const { name } = await updateTeam(team.id, data);

      toast.success('Team updated successfully');

      router.push(`${team.id}`);
    } catch (err) {
      const { error } = err as { error: string };
      toast.error(error);
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          {team.name}
        </h2>
      </div>

      <div className="space-y-4">
        <form onSubmit={teamSubmit(teamSubmitHandler)}>
          <div>
            <InputLabel title="Change team name" important />
            <Input
              defaultValue={team.name}
              inputClassName={classnames({
                'border-red-500': teamErro.name,
              })}
              error={teamErro.name?.message}
              {...teamRegister('name', { required: true })}
              placeholder="Enter team name"
            />
          </div>
          <Button
            isLoading={fetching}
            loaderSize="small"
            type="submit"
            color="info"
            size="small"
            shape="rounded"
            className="mt-4"
          >
            Change
          </Button>
        </form>
      </div>

      <div className="grow pb-9 pt-6">
        <TeamTab />
      </div>

      <div className="space-y-4">
        {/* TODO: Implement user search */}
        {/*
          <div className="block">
            <InputLabel title="Add user" important />
            <UserSearchList onSelect={() => console.log('')} />
          </div>
        */}

        <div className="block">
          <form onSubmit={handleSubmit(addMember)}>
            <div>
              <InputLabel title="Add team member" important />
              <Input
                disabled={fetching || isLimitReached}
                inputClassName={classnames({
                  'border-red-500': errors.username,
                  'placeholder-red-500 hover:cursor-not-allowed':
                    isLimitReached,
                })}
                error={errors.username?.message}
                {...register('username', { required: true })}
                placeholder={
                  isLimitReached
                    ? 'Limit of members reached'
                    : 'Enter member username'
                }
              />
            </div>
            <Button
              disabled={isLimitReached}
              isLoading={fetching}
              loaderSize="small"
              type="submit"
              color="info"
              size="small"
              shape="rounded"
              className="mt-4"
            >
              Invite
            </Button>
          </form>

          <div className="py-10">
            <MemberList members={members} onRemoveMember={removeHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

TeamDetail.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

const { get: current } = dataLoaders<CurrentUser>('currentUser');
const { find: findTeam } = dataLoaders<TeamFind>('findTeam');

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

  const params = ctx.params;

  const { team } = await findTeam(params?.id as string, {
    Authorization: cookie ? `Bearer ${cookie}` : '',
  });

  return {
    props: {
      team,
    },
  };
};

export default TeamDetail;
