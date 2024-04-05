import { Star } from '../../atoms/icons/star';
import TournamentFeedItem from '@/components/ui/molecules/tournament-feed-item/tournament-feed-item';
import { TournamentsPageTemplateProps } from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template.types';
import { FC } from 'react';

const TournamentsFeedTemplate: FC<TournamentsPageTemplateProps> = ({
  data,
}) => {
  return (
    <div className="pt-8">
      {/* <div
        className="4xl:grid-cols-[320px_minmax(auto,_1fr)] grid
      gap-5 2xl:grid-cols-[minmax(auto,_1fr)_240px]"
      > */}
      <div className="3xl:grid-cols-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {data.results.map((tournament) => (
          <TournamentFeedItem
            key={tournament.id}
            tournament={tournament}
            className="mx-2 mb-4 first:ml-2"
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentsFeedTemplate;
