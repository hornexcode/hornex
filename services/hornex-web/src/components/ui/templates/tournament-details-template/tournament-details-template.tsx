import { ConnectAccountButton } from '../../atoms/connect-account-button';
import TournamentDetailsTabPanels from '../../organisms/tournament-details-tab-panels/tournament-details-tab-panels';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import { Registration, Tournament } from '@/lib/models';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  tournament: Tournament;
  gameIds: GameID[];
  participantCheckedInStatus?: boolean;
  registrations: Registration[];
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({
  tournament,
  gameIds,
  participantCheckedInStatus,
  registrations,
}) => {
  const gameId =
    (gameIds.length > 0 &&
      gameIds.find((gameId) => gameId.game === 'league-of-legends')) ||
    undefined;

  const currentRegistration = registrations.find(
    (registration) => registration.tournament === tournament.id
  );

  return (
    <div className="container mx-auto pt-8">
      {/* connect account */}
      {!gameId && <ConnectAccountButton />}
      <TournamentDetailsHeadline
        connectedGameId={gameId}
        tournament={tournament}
        registration={currentRegistration}
        isCheckedIn={participantCheckedInStatus}
      />
      <TournamentDetailsTabPanels tournament={tournament} />
    </div>
  );
};

export default TournamentDetailsTemplate;
