import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FC, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { AppLayout } from '@/layouts';
import { ssrAuthGuard } from '@/lib/utils/ssrAuthGuard';

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

const TeamsCreate = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
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
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Create Team
        </h2>
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

export const getServerSideProps: GetServerSideProps = ssrAuthGuard(
  async (ctx) => {
    return {
      props: {
        user: {}
      }
    };
  }
);

export default TeamsCreate;
