import { TournamentStatusStepperProps } from './tournament-status-stepper.types';
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
        className="absolute left-[2px] flex h-[2px] w-[calc(100%-2px)] items-center justify-between bg-gray-100"
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
            className="bg-dark relative h-2 w-2 rounded-full"
            key={idx}
          ></div>
        ))}
        {new Array(steps - currentStep).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="ring-medium-dark bg-title relative h-2 w-2 rounded-full ring"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AdminTournamentStatusStepper;
