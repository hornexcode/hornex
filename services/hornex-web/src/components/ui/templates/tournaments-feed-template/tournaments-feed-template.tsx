import { Star } from '../../atoms/icons/star';
import TournamentFeedItem from '@/components/ui/molecules/tournament-feed-item/tournament-feed-item';
import { TournamentsPageTemplateProps } from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template.types';
import { FC } from 'react';

const TournamentsFeedTemplate: FC<TournamentsPageTemplateProps> = ({
  isLoading,
  data,
}) => {
  return (
    <div className="pt-8">
      {/* <div
        className="4xl:grid-cols-[320px_minmax(auto,_1fr)] grid
      gap-5 2xl:grid-cols-[minmax(auto,_1fr)_240px]"
      > */}
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          data.results.map((tournament) => (
            <TournamentFeedItem
              key={tournament.id}
              tournament={tournament}
              className="mx-2 mb-4 first:ml-2"
            />
          ))}

        <div className="hidden">
          {/* <Filters /> */}
          <div className="bg-medium-dark highlight-white-5 rounded">
            <div className="text-title shadow-light p-4 font-bold">
              Tournaments Recents
            </div>
            <ul className="bg-light-dark py-4 text-sm font-light text-slate-400">
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    First enabler tournament
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    Torneio summer eletro hits
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    All win tournament
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    Lorem ipsum dolor sit.
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    Lorem ipsum dolor sit amet .
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    First enabler tournament v2
                  </div>
                </a>
              </li>
              <li className="px-4 py-1 underline">
                <a href="#" className="text-body hover:text-amber-400">
                  <div className="flex items-center">
                    <Star className="mr-1 h-2" />
                    First enabler
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsFeedTemplate;
