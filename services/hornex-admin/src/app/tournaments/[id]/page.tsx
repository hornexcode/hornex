'use client';

import { PageHeader } from '@/components/system-design/page-header/page-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

import {
  Check,
  CheckCircle2,
  ChevronRight,
  ListStartIcon,
  Loader,
  LoaderIcon,
  PlayCircle,
} from 'lucide-react';
import React from 'react';

export default async function TournamentPage() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="container mx-auto py-10 space-y-4">
      <PageHeader title="Tournament name" />
      <div className="w-[400px]">
        <ProgressBar steps={5} currentStep={3} />
      </div>
      <div className="">
        <div className="flex items-center">
          <div className="pr-5">
            <div className="font-medium text-sm">Status</div>
            <div className="text-sm">Registration Open</div>
          </div>
          <div className="px-5">
            <div className="font-medium text-sm">Teams registered</div>
            <div className="text-sm">10/32</div>
          </div>
          <div className="px-5">
            <div className="font-medium text-sm">Teams confirmed</div>
            <div className="text-sm">6/32</div>
          </div>
          <div className="px-5">
            <div className="font-medium text-sm">Potential Prize Pool</div>
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
  );
}

type ProgressBarProps = {
  steps: number;
  currentStep: number;
};
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const progressWidth = `${((currentStep - 1) / (steps - 1)) * 100}%`;

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <div
            key={index}
            className={`w-1/4 ${
              index + 1 === currentStep ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`flex-1 h-2 ${
                index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'
              } rounded-full`}
            />
          </div>
        ))}
      </div>
      <div className="flex mb-2 items-center justify-between">
        {Array.from({ length: steps - 1 }).map((_, index) => (
          <div key={index} className="w-1/4" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <div
            key={index}
            className={`w-1/4 ${
              index + 1 <= currentStep ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-left text-xs text-gray-600">
          Step {currentStep} of {steps}
        </div>
        <div className="text-right text-xs text-gray-600">{progressWidth}</div>
      </div>
    </div>
  );
};
