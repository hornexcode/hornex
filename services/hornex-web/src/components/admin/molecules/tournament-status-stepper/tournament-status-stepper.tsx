import { TournamentStatusStepperProps } from './tournament-status-stepper.types';
import clsx from 'clsx';
import React, { FC } from 'react';

const TournamentStatusStepper: FC<TournamentStatusStepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative flex h-[12px] w-[100%] items-center">
      {/* gray bar */}
      <div
        role="stepper"
        className="absolute left-[2px] flex h-[2px] w-[calc(100%-2px)] items-center justify-between bg-gray-100"
      ></div>
      {/* green bar */}
      <div
        className={clsx(
          'absolute top-0 flex h-[100%]  items-center justify-between rounded-lg bg-amber-400',
          `w-[calc(${(currentStep - 1 / (steps - 1)) * 100}%+1px)]`
        )}
      ></div>
      <div className="relative flex w-[calc(100%-4px)] items-center justify-between">
        <div></div>
        {/* current */}
        {new Array(currentStep - 1).fill(0).map((_, idx) => (
          <div
            className="relative h-2 w-2 rounded-full bg-black/40"
            key={idx}
          ></div>
        ))}
        {new Array(steps - currentStep).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="ring-dark bg-title relative h-2 w-2 rounded-full ring"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TournamentStatusStepper;
