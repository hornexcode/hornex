import { Filters } from '@/components/search/filters';
import TournamentCardInfo from '@/components/system-design/organisms/tournament-card-info/tournament-card-info';
import Button from '@/components/ui/button';
import { OptionIcon } from '@/components/ui/icons/option';
import { Tournament } from '@/lib/hx-app/types';
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

const TournamentsFeedPage: FC<TournamentsPageTemplateProps> = ({
  isLoading,
  tournaments,
}) => {
  return (
    <>
      <div className="4xl:grid-cols-[320px_minmax(auto,_1fr)] grid 2xl:grid-cols-[280px_minmax(auto,_1fr)]">
        <div className="hidden border-r border-dashed border-gray-200 pr-8 dark:border-gray-700 2xl:block">
          <Filters />
        </div>

        <div className="4xl:pl-10 2xl:pl-8">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
              5,686,066 items
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
          <div className="grid grid-cols-3 gap-5">
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
    </>
    // <section className="mx-auto flex flex-grow p-8">
    //   <div className="flex w-full flex-grow flex-col justify-between border-dashed border-gray-700 md:ml-auto md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[280px] lg:pl-12 rtl:lg:pr-12 xl:w-[320px] xl:pl-20 rtl:xl:pr-20">
    //     <div className="block">
    //       <div className="block">
    //         <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
    //           Filter
    //         </h2>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="4xl:max-w-[1760px] mx-auto flex w-full flex-grow flex-col space-y-8 transition-all xl:max-w-[1280px]">
    //   <div className="grid grid-cols-3 gap-5">
    //     {!isLoading &&
    //       tournaments.results.map((tournament) => (
    //         <TournamentCardInfo key={tournament.id} tournament={tournament} />
    //       ))}
    //   </div>
    // </div>
    // </section>
  );
};

export default TournamentsFeedPage;
