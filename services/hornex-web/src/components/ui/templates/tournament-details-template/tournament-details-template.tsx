import { TwitchStruded } from '../../atoms/icons/twitch-extruded';
import { TournamentPhasesWidget } from '../../molecules';
import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import { Skeleton } from '../../skeleton';
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
import { Profile } from '@/lib/models/Profile';
import { dataLoader } from '@/lib/request';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const { useData: usePublicOrganizerProfile } = dataLoader<Profile>(
  'getPublicOrganizerProfile'
);

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();

  const { data: profile, isLoading: isLoadingProfile } =
    usePublicOrganizerProfile({
      id: tournament.organizer,
    });

  const twitchIframeSrc = `https://player.twitch.tv/?channel=${profile?.twitch_username}&parent=localhost&muted=true`;
  const discordIframeSrc = `https://discord.com/widget?id=${profile?.discord_widget_id}&theme=dark`;

  return (
    <div className="mx-auto px-8 pt-8">
      {/* breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hover:text-title">
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
              {isLoadingProfile && (
                <Skeleton className="bg-light-dark h-[200px] w-[100%]" />
              )}
              {profile?.twitch_username && (
                <iframe
                  src={twitchIframeSrc}
                  height="200"
                  width="100%"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
          <div className="border-border rounded border">
            {isLoadingProfile && (
              <Skeleton className="bg-light-dark h-[420px] w-[100%]" />
            )}

            {profile?.discord_widget_id && (
              <iframe
                src={discordIframeSrc}
                width="100%"
                height="420"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              ></iframe>
            )}
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
