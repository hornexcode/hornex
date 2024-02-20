import Button from '@/components/ui/atoms/button';
import { Button as Btn, buttonVariants } from '@/components/ui/button';
import { TournamentLayout } from '@/layouts/tournament';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { Edit2Icon } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');

export type TournamentDetailsProps = {
  tournament: Tournament;
};

const TournamentDetails = ({
  pageProps: { tournament },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="container mx-auto space-y-8 pt-8">
      {/* General info */}
      <div className="flex items-center pb-4">
        <h1 className="text-title text-xl font-bold">{tournament.name}</h1>
        <Button className="ml-auto" size="mini">
          <div className="flex items-center">
            <Edit2Icon size={14} className="mr-2" />
            Edit
          </div>
        </Button>
      </div>

      {/*  */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="text-body border-light-dark flex border-t">
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Start date</div>
              <div className="text-title font-normal">
                {tournament.start_date} {tournament.start_time}
              </div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Teams registered</div>
              <div className="text-title font-normal">
                {tournament.teams.length}/{tournament.max_teams}
              </div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Status</div>
              <div className="text-title font-normal">Registration open</div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Classification</div>
              <div className="text-title font-normal">Bronze I, II, III</div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Entry Fee</div>
              <div className="text-title font-normal">Free</div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="text-sm">Prize Pool</div>
              <div className="text-title font-normal">R$ 0</div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <span className="text-body text-sm">Tournament status</span>
          <div className="flex items-center justify-between pb-2">
            <span className="font-semibold text-amber-500">
              Registration open
            </span>
            <div className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-500">
              step 3 / 4
            </div>
          </div>
          <ProgressBar steps={5} currentStep={2} />
          <p className="text-body py-2 font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
            debitis.
          </p>
          <Button shape="rounded" className="mt-4" size="mini">
            Close registration
          </Button>
        </div>
      </div>

      {/* prizes */}
      <div className="text-title border-light-dark space-y-3 rounded border p-4">
        <div>
          <p className="font-bold">Prizes</p>
        </div>
        {/* 1 */}
        <div className="border-light-dark flex items-center justify-between rounded border p-3">
          <div>
            <p className="text-sm font-bold">#1 place</p>
            <p className="font-normal">R$ 100,00</p>
          </div>
          <Btn size={'sm'} variant="outline">
            Edit
          </Btn>
        </div>
        {/* 2 */}
        <div className="border-light-dark flex items-center justify-between rounded border p-3">
          <div>
            <p className="text-sm font-bold">#2 place</p>
            <p className="font-normal">R$ 40,00</p>
          </div>
          <Button shape="rounded" size="mini">
            Edit
          </Button>
        </div>
      </div>

      {/* danger zone */}
      <div className="text-title border-light-dark flex items-center justify-between rounded border p-4">
        <div>
          <p className="font-bold">Delete this tournament</p>
          <p className="font-normal">
            Once you delete a tournament, there is no going back. Please be
            certain.{' '}
          </p>
        </div>
        <Button color="danger" shape="rounded" size="mini">
          Delete
        </Button>
      </div>
    </div>
  );
};

type ProgressBarProps = {
  steps: number;
  currentStep: number;
};
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative flex h-[12px] w-[100%] items-center">
      {/* gray bar */}
      <div
        role="progressbar"
        className="absolute left-[2px] flex h-[2px] w-[calc(100%-2px)] items-center justify-between bg-gray-100"
      ></div>
      {/* green bar */}
      <div className="absolute top-0 flex h-[100%] w-[calc(25%+1px)] items-center justify-between rounded-lg bg-amber-400"></div>
      <div className="relative flex w-[calc(100%-4px)] items-center justify-between">
        <div></div>
        <div className="relative h-2 w-2 rounded-full bg-black/40"></div>
        <div className="ring-dark relative h-2 w-2 rounded-full bg-white ring"></div>
        <div className="ring-dark relative h-2 w-2 rounded-full bg-white ring"></div>
        <div className="ring-dark relative h-2 w-2 rounded-full bg-white ring"></div>
      </div>
    </div>
  );
};

TournamentDetails.getLayout = (page: React.ReactElement) => {
  return <TournamentLayout>{page}</TournamentLayout>;
};

export const getServerSideProps = (async ({
  query: { game, platform, id },
  req,
}) => {
  const { data: tournament, error } = await getTournament(
    { game: game, platform, tournamentId: id },
    req
  );
  console.log(error);

  if (!tournament || error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageProps: {
        tournament,
      },
    },
  };
}) satisfies GetServerSideProps<{
  pageProps: TournamentDetailsProps;
}>;
export default TournamentDetails;
