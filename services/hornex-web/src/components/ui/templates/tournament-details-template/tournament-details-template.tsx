import { TwitchStruded } from '../../atoms/icons/twitch-extruded';
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
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();

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

      {/* headline */}
      <TournamentDetailsHeadline isCheckedIn={false} />

      <div className="mt-8 flex space-x-8">
        <div className="w-[400px] space-y-8">
          <TournamentPhasesWidget
            tournament={tournament}
            isRegistered={isRegistered}
          />

          <div>
            <TwitchStruded className="h-8" />
            <div className="border-border rounded border">
              <iframe
                src="https://player.twitch.tv/?channel=gaules&parent=localhost&muted=true"
                height="200"
                width="100%"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="border-border rounded border">
            <iframe
              src="https://discord.com/widget?id=976554121475797134&theme=dark"
              width="100%"
              height="420"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
        <div className="grid w-full">
          <TournamentTabPanels tournament={tournament} />
          <div className="mt-10">
            <div className="flex items-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
