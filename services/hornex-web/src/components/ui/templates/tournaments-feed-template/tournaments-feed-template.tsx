import { Filters } from '@/components/search/filters';
import Button from '@/components/ui/atoms/button';
import { OptionIcon } from '@/components/ui/atoms/icons/option';
import TournamentCardInfo from '@/components/ui/molecules/tournament-feed-item/tournament-feed-item';
import { Tournament } from '@/lib/models/types';
import { FC } from 'react';

export type TournamentsPageTemplateProps = {
  tournaments: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tournament[];
  };
  isLoading: boolean;
};

const TournamentsFeedTemplate: FC<TournamentsPageTemplateProps> = ({
  isLoading,
  tournaments,
}) => {
  return (
    <div className="container mx-auto">
      {/* <div className="4xl:grid-cols-[320px_minmax(auto,_1fr)] grid
      2xl:grid-cols-[240px_minmax(auto,_1fr)]"> */}
      <div className="">
        {/* <div className="hidden border-r border-dashed border-gray-200 pr-8 dark:border-gray-700 2xl:block">
          <Filters />
        </div> */}

        {/* <div className="4xl:pl-10 2xl:pl-8"> */}
        <div className="">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
              23 items
            </span>

            <div className="3xl:gap-8 flex gap-6">
              {/* <SortList /> */}
              <div className="3xl:block hidden">{/* <GridSwitcher /> */}</div>
              <div className="hidden sm:block 2xl:hidden">
                <Button
                  shape="rounded"
                  size="small"
                  variant="ghost"
                  color="gray"
                  // onClick={() => openDrawer('DRAWER_SEARCH')}
                  className="!h-11 !p-3 hover:!translate-y-0 hover:!shadow-none focus:!translate-y-0 focus:!shadow-none"
                >
                  <OptionIcon className="relative h-auto w-[18px]" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5">
            {!isLoading &&
              tournaments.results.map((tournament) => (
                <TournamentCardInfo
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsFeedTemplate;
