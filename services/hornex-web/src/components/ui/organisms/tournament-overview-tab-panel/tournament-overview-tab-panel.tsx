import { SwordsIcon } from '@/components/ui/atoms/icons';
import { Tournament } from '@/lib/hx-app/types';
import { ComputerDesktopIcon, LockOpenIcon } from '@heroicons/react/20/solid';
import { CoinsIcon } from 'lucide-react';
import { FC } from 'react';

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

const TournamentOverviewTabPanel: FC<TournamentOverviewTabPanelProps> = ({
  tournament,
}) => {
  return (
    <>
      <div className="bg-light-dark rounded-lg shadow-md">
        <div className="border-b border-gray-800 p-5">
          <h4 className="leading-2 text-sm font-medium uppercase text-gray-200">
            Tournament details
          </h4>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1 border-r border-gray-800 p-5">
            <div className="box space-y-3 text-center">
              <SwordsIcon className="mx-auto h-5 w-5 fill-gray-400" />
              <p className="text-xs font-bold text-gray-200">Format</p>
              <p className="text-xs font-bold text-gray-400">
                {tournament.team_size}v{tournament.team_size}
              </p>
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-800  p-5">
            <div className="box space-y-3 text-center">
              <ComputerDesktopIcon className="mx-auto h-5 w-5 fill-gray-400" />
              <p className="text-xs font-bold text-gray-200">Platform</p>
              <p className="text-xs font-bold text-gray-400">
                {tournament.platform}
              </p>
            </div>
          </div>
          <div className="col-span-1 border-r border-gray-800  p-5">
            <div className="box space-y-3 text-center">
              <LockOpenIcon className="mx-auto h-5 w-5 fill-gray-400" />
              <p className="text-xs font-bold text-gray-200">Classification</p>
              <p className="text-xs font-bold text-gray-400">
                {tournament.classification}
              </p>
            </div>
          </div>
          <div className="col-span-1 border-gray-800  p-5">
            <div className="box space-y-3 text-center">
              <CoinsIcon className="mx-auto h-5 w-5 fill-gray-400" />
              <p className="text-xs font-bold text-gray-200">Entry fee</p>
              <p className="text-xs font-bold text-gray-400">
                {tournament.entry_fee}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="box">
    //   <div className="block space-y-8">
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Informações Gerais
    //       </div>
    //       <p className="text-sm ">{tournament.description}</p>
    //     </div>
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Format
    //       </div>
    //       <span className="text-sm font-semibold">Single elimination</span>
    //     </div>

    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Team Size
    //       </div>
    //       <div className="text-sm">{tournament.team_size}</div>
    //     </div>
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Max Teams
    //       </div>
    //       <div className="text-sm">{tournament.max_teams}</div>
    //     </div>
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Game
    //       </div>
    //       <div className="text-sm">{tournament.game}</div>
    //     </div>
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Platform
    //       </div>
    //       <div className="text-sm">{tournament.platform}</div>
    //     </div>
    //     <div className="block">
    //       <div className="text-heading-style mb-2 uppercase text-gray-200">
    //         Organizer
    //       </div>
    //       <div className="text-sm">
    //         <UserIcon className="w-4" />
    //         {tournament.organizer}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default TournamentOverviewTabPanel;
