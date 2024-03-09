import { TournamentStatusStepperProps } from './tournament-status-stepper.types';
import {
  CheckCircledIcon,
  DotFilledIcon,
  DotIcon,
} from '@radix-ui/react-icons';
import clsx from 'clsx';
import React, { FC } from 'react';

const AdminTournamentStatusStepper: FC<TournamentStatusStepperProps> = ({
  steps,
  currentStep,
}) => {
  const progressBarWidth = (currentStep / steps) * 100;
  return (
    <div className="relative flex h-[12px] w-[100%] items-center">
      {/* gray bar */}
      <div
        role="stepper"
        className="absolute left-[2px] flex h-[2px] w-[calc(100%-2px)] items-center justify-between bg-gray-400"
      ></div>
      {/* green bar */}
      <div
        style={{ width: `${progressBarWidth + 0.5}%` }}
        className={clsx('bg-brand absolute  top-0 h-[100%] rounded-lg')}
      ></div>
      <div className="relative flex w-[calc(100%-4px)] items-center justify-between">
        <div></div>
        {/* current */}
        {new Array(currentStep).fill(0).map((_, idx) => (
          <div
            className="bg-dark/20 relative h-2.5 w-2.5 rounded-full"
            key={idx}
          ></div>
        ))}
        {new Array(steps - currentStep).fill(0).map((_, idx) => (
          <div key={idx} className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
        ))}
      </div>
    </div>
  );
};

export default AdminTournamentStatusStepper;
