import { TrashIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TeamTab } from '@/components/teams/team-tab';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { TeamFind } from '@/infra/hx-core/responses/team-find';
import { AppLayout } from '@/layouts';
import { dataLoaders } from '@/lib/api';
import { getCookieFromRequest } from '@/lib/api/cookie';
import { useAuthContext } from '@/lib/auth';

type Member = {
  id: number;
  username: string;
};

const form = z.object({
  username: z.string().min(1, { message: 'Username is required' })
});
type MemberForm = z.infer<typeof form>;

type MemberListItemProps = {
  member: Member;
  onRemoveMember: (id: number) => void;
};

const MemberListItem: FC<MemberListItemProps> = ({
  member,
  onRemoveMember
}) => (
  <li className="flex items-center rounded bg-light-dark p-4">
    <span className="text-white">{member.username}</span>
    <div className="ml-auto">
      <Button
        color="danger"
        size="mini"
        shape="rounded"
        className="ml-auto"
        onClick={() => onRemoveMember(member.id)}
      >
        <div className="flex items-center">
          <TrashIcon className="mr-1 h-4 w-4" /> Remove
        </div>
      </Button>
    </div>
  </li>
);

type MemberListProps = {
  members: Member[];
  onRemoveMember: (id: number) => void;
};

const MemberList: FC<MemberListProps> = ({ members, onRemoveMember }) => {
  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <MemberListItem
          key={member.id}
          member={member}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </ul>
  );
};

const { find: findTeam } = dataLoaders<TeamFind>('findTeam');

const TeamsCreate = ({
  team
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { state } = useAuthContext();

  console.log('state at teams', state);
  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [router, state.isAuthenticated]);

  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);
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
    formState: { errors }
  } = useForm<MemberForm>({
    resolver: zodResolver(form)
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
          username: data.username.toLowerCase()
        }
      ];
    });

    reset();
    setFetching(false);
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          HX 🐐
        </h2>
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
                defaultValue={team.name}
                disabled={fetching || isLimitReached}
                inputClassName={classnames({
                  'border-red-500': errors.username,
                  'placeholder-red-500 hover:cursor-not-allowed': isLimitReached
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

TeamsCreate.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = getCookieFromRequest(ctx.req, 'hx-auth.token');

  const params = ctx.params;

  const { team } = await findTeam(params?.id as string, {
    Authorization: cookie ? `Bearer ${cookie}` : ''
  });

  if (!cookie) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
      team
    }
  };
};

export default TeamsCreate;
