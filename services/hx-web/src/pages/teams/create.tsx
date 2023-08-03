import { ComputerDesktopIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import * as Cookies from 'es-cookie';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import CSChar from '@/assets/images/cs-char.png';
import DotaChar from '@/assets/images/dota-char.png';
import LolChar from '@/assets/images/lol-bg-char.png';
import RocketLeagueChar from '@/assets/images/rl-char.png';
import { GameItem, GameItemProps, PlatformPicker } from '@/components/compete';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import {
  CounterStrikeLogoIcon,
  DotaLogoIcon,
  LolLogoIcon,
  PlayStationIcon,
  RocketLeagueLogoIcon,
  XboxIcon,
} from '@/components/ui/icons';
import { AppLayout } from '@/layouts';
import { getCookieFromRequest } from '@/lib/api/cookie';
import { useAuthContext } from '@/lib/auth';

import { NextPageWithLayout } from '../_app';

const TeamsCreate = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          New Team
        </h2>
      </div>

      <form action="" className="space-y-4">
        {/* Email */}
        <div>
          <InputLabel title="Team name" important />
          <Input placeholder="Choose a name for your team" />
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = Cookies.parse(ctx.req.headers.cookie || '');
  if (
    cookies['hx-auth.token'] !== undefined &&
    cookies['hx-auth.token'] !== ''
  ) {
    return {
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default TeamsCreate;
