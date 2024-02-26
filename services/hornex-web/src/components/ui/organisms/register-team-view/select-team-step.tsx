import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import SelectTeamTab from '@/components/ui/molecules/select-team-tab';
import { FC } from 'react';

export type SelectTeamStepProps = {};

export const SelectTeamStep: FC<SelectTeamStepProps> = ({}) => {
  return (
    <div className="bg-light-dark h-min-[200px] w-[500px] rounded border border-gray-700">
      <div className="bg-medium-dark flex items-center p-5">
        <LolFlatIcon className="mr-2 h-8 w-8" />
        <h4 className="text-title text-left text-xl font-bold -tracking-tight">
          Registration
        </h4>
      </div>
      <div className="mx-auto p-3">
        <SelectTeamTab />
      </div>
    </div>
  );
};
