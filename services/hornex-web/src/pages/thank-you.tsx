import Button from '@/components/ui/atoms/button/button';
import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { AppLayout } from '@/layouts';
import { Game, GetAvailableGamesResponse } from '@/lib/models/types';
import { dataLoader as dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const ThankYouPage = () => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <>Thank you for your registration!</>
      <>
        <Link href="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
      </>
    </div>
  );
};

ThankYouPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default ThankYouPage;
