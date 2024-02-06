'use client';

import { getToken } from '@/app/utils/token';
import { PageHeader } from '@/components/system-design/page-header/page-header';
import { Button } from '@/components/ui/button';

import { CheckCircle2, ChevronRight, LoaderIcon } from 'lucide-react';
import React, { Suspense } from 'react';

const GAME_SLUG = 'league-of-legends';
const PLATFORM_SLUG = 'pc';

type Tournament = {
  id: string;
  prize_pool: number;
  phase: string;
  name: string;
};

async function getTournament(id: string): Promise<Tournament> {
  const token = await getToken();

  const res = await fetch(
    `http://localhost:8000/api/v1/${GAME_SLUG}/${PLATFORM_SLUG}/tournaments/${id}/details`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch tournaments');

  return res.json();
}

export default async function TournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const tournament = await getTournament(params.id);

  return (
    <Suspense fallback={<LoaderIcon className="animate-spin" />}>
      <div className="container mx-auto space-y-4">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <PageHeader title="Tournament name" />
          <div className="actions pt-5 flex items-center space-x-2">
            <Button disabled>
              {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> */}
              Publish
            </Button>
            <Button>Start</Button>
            <Button>
              <CheckCircle2 className="mr-2 w-4 h-4" />
              Check-in
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 py-6">
          <div className="col-span-8">
            <div className="block">
              <span className="font-semibold">Info</span>
              <div className="flex items-center">
                <div className="pr-5">
                  <div className="font-medium text-sm">Teams registered</div>
                  <div className="text-sm">10/32</div>
                </div>
                <div className="px-5">
                  <div className="font-medium text-sm">Teams confirmed</div>
                  <div className="text-sm">6/32</div>
                </div>
                <div className="px-5">
                  <div className="font-medium text-sm">
                    Potential Prize Pool
                  </div>
                  <div className="text-sm">$400</div>
                </div>
                <div className="px-5">
                  <div className="font-medium text-sm">Current Prize Pool</div>
                  <div className="text-sm">$200</div>
                </div>
                <div className="px-5">
                  <div className="font-medium text-sm">Round</div>
                  <div className="text-sm">0/5</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <span className="text-sm">Tournament status</span>
            <div className="flex items-center justify-between pb-2">
              <span className="text-green-500 font-semibold">
                Results tracking
              </span>
              <div className="bg-gray-200 rounded text-gray-500 text-xs px-2 py-1">
                step 3 / 4
              </div>
            </div>
            <ProgressBar steps={5} currentStep={3} />
          </div>
        </div>

        <div className="">
          <div className="border rounded shadow">
            <div className="border-b p-4">Logs</div>
            <div className="flex flex-col px-4 py-2">
              {/* row */}
              <div className="flex items-center hover:bg-gray-100 p-2 rounded cursor-pointer">
                <div className="mr-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="mr-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Create tournament</div>
                </div>
              </div>
              {/* ./row */}
              {/* row */}
              <div className="flex items-center hover:bg-gray-100 p-2 rounded cursor-pointer">
                <div className="mr-2">
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                </div>
                <div className="mr-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Start tournament</div>
                </div>
              </div>
              {/* ./row */}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

type ProgressBarProps = {
  steps: number;
  currentStep: number;
};
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex relative items-center w-[100%] h-[12px]">
      {/* gray bar */}
      <div
        role="progressbar"
        className="absolute bg-gray-100 items-center flex justify-between left-[2px] h-[2px] w-[calc(100%-2px)]"
      ></div>
      {/* green bar */}
      <div className="flex items-center justify-between h-[100%] absolute top-0 w-[calc(75%+1px)] rounded-lg bg-green-400"></div>
      <div className="relative flex items-center justify-between w-[calc(100%-4px)]">
        <div></div>
        <div className="relative h-2 w-2 bg-black/15 rounded-full"></div>
        <div className="relative h-2 w-2 bg-black/15 rounded-full"></div>
        <div className="relative h-2 w-2 bg-black/15 rounded-full"></div>
        <div className="relative h-2 w-2 bg-gray-100 ring ring-white rounded-full"></div>
      </div>
    </div>
  );
};
