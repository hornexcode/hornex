import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { AppLayout } from '@/layouts';
import { ssrAuthGuard } from '@/lib/utils/ssrAuthGuard';

const form = z.object({
  team: z.string().min(2, { message: 'Minimum 2 characters for team name' })
});

type CreateTeamForm = z.infer<typeof form>;

const TeamsCreate = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors }
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(form)
  });

  const submitHandler = (data: CreateTeamForm) => {
    router.push(`uuid123example456/details`);
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          New Team
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        {/* Email */}
        <div>
          <InputLabel title="Team name" important />
          <Input
            inputClassName={classnames(
              errors.team?.message ? 'focus:ring-red-500' : ''
            )}
            placeholder="Choose a name for your team"
            error={errors.team?.message}
            {...register('team', { required: true })}
          />
        </div>
        <Button color="info" size="small" shape="rounded">
          Create
        </Button>
      </form>
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
