import { ComputerDesktopIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { GameItem, GameItemProps, PlatformPicker } from '@/components/compete';
import LolChar from '@/assets/images/lol-bg-char.png';
import DotaChar from '@/assets/images/dota-char.png';
import CSChar from '@/assets/images/cs-char.png';
import RocketLeagueChar from '@/assets/images/rl-char.png';
import {
  LolLogoIcon,
  RocketLeagueLogoIcon,
  CounterStrikeLogoIcon,
  DotaLogoIcon,
  PlayStationIcon,
  XboxIcon,
} from '@/components/ui/icons';
import { AppLayout } from '@/layouts';
import { NextPageWithLayout } from './_app';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookieFromRequest } from '@/lib/api/cookie';
import { useAuthContext } from '@/lib/auth';
import * as Cookies from 'es-cookie';
import { CurrentUser } from '@/infra/hx-core/responses/current-user';
import { User } from '@/domain';

const ProfilePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          Profile
        </h2>

        <PlatformPicker />
      </div>
    </div>
  );
};

ProfilePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = Cookies.parse(ctx.req.headers.cookie || '');

  if (cookies['hx-auth.token'] == undefined || cookies['hx-auth.token'] == '') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const res = await fetch('http://localhost:9234/api/v1/users/current', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${cookies['hx-auth.token']}`,
    },
  });

  try {
    if (res.ok) {
      const data = (await res.json()) as CurrentUser;
      return {
        props: {
          user: {
            id: data.user.id,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            email: data.user.email,
          } as User,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: true,
        },
      };
    }
  } catch (error) {
    console.log('Internal Server Error', error);
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
};

export default ProfilePage;
