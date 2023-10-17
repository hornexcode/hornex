import { AppLayout } from '@/layouts';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const ProfilePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          Profile
        </h2>
      </div>
    </div>
  );
};

ProfilePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      user: {},
    },
  };
};

export default ProfilePage;
