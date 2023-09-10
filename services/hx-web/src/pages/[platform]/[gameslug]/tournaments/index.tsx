import LeagueOfLegendsLogo from '@/assets/images/games/league-of-legends/logo.png';
import HornexVariantLogo from '@/assets/images/hornex/hornex-variant-logo.png';
import LeagueBanner from '@/assets/images/tournaments/leaguebanner.png';
import { TournamentListItem } from '@/components/tournaments/tournament-list-item';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import * as Cookies from 'es-cookie';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Tournaments = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  // const {} = useFormContext()
  return (
    <>
      <section className="relative mx-auto h-80 bg-[url('/images/summonersrift.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-amber-400/50">
          <div className="flex  p-4">
            <Image
              src={LeagueOfLegendsLogo}
              width={200}
              className="brightness-0 invert"
              alt="League of Legends"
            />
            {/* <ConnectButton /> */}
          </div>
        </div>
      </section>
      <section className="mx-auto space-y-8 p-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-2">
          <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
            Tournaments
          </h2>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-12">
            {/* grid-cols-1 gap-4 */}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5 ">
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: LeagueBanner }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: LeagueBanner }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: LeagueBanner }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: LeagueBanner }}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mx-auto hidden space-y-8 p-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-2">
          <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
            TFT
          </h2>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-12">
            {/* grid-cols-1 gap-4 */}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5 ">
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: HornexVariantLogo }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: HornexVariantLogo }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: HornexVariantLogo }}
                  />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem
                    tournament={{ thumbnail: HornexVariantLogo }}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

Tournaments.getLayout = (page: React.ReactElement) => {
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

export default Tournaments;
