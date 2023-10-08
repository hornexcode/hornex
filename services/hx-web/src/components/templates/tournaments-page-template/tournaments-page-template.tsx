import TournamentCardInfo from '@/components/molecules/tournament-card-info/tournament-card-info';
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

const TournamentsPageTemplate: FC<TournamentsPageTemplateProps> = ({
  isLoading,
  tournaments,
}) => {
  return (
    <section className="mx-auto flex flex-grow p-8">
      <div className="flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[280px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[320px] ltr:xl:pl-20 rtl:xl:pr-20">
        <div className="block">
          <div className="block">
            <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
              Filter
            </h2>
          </div>
        </div>
      </div>
      <div className="4xl:max-w-[1760px] mx-auto flex w-full flex-grow flex-col space-y-8 transition-all xl:max-w-[1280px]">
        <div className="flex items-end justify-between border-b border-slate-800 pb-2">
          <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
            Tournaments
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {!isLoading &&
            tournaments.results.map((tournament) => (
              <TournamentCardInfo key={tournament.id} tournament={tournament} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentsPageTemplate;
