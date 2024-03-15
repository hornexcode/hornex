import { ConnectAccountButton } from '../../atoms/connect-account-button';
import { TournamentPhasesWidget } from '../../molecules';
import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import { useTournament } from '@/contexts';
import { GameId } from '@/lib/models/Account';
import { getStatusStep } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const { useData: useGameIdsQuery } = dataLoader<GameId[]>('getGameIds');

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();

  const { data: gameIds } = useGameIdsQuery({});

  const renderConnectAccount = !gameIds;

  return (
    <div className="mx-auto px-8 pt-8">
      {/* breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/compete">Compete</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tournament.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* connect account */}
      {renderConnectAccount && <ConnectAccountButton />}

      {/* headline */}
      <TournamentDetailsHeadline isCheckedIn={false} />

      <div className="mt-8 flex space-x-8">
        <div className="w-[280px] space-y-8">
          <TournamentPhasesWidget
            tournament={tournament}
            isRegistered={isRegistered}
          />
          <div className="">
            <iframe
              src="https://discord.com/widget?id=976554121475797134&theme=dark"
              width="280px"
              height="420"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
        <div className="flex flex-1">
          <TournamentTabPanels tournament={tournament} />
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
