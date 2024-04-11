import { TwitchStruded } from '../../atoms/icons/twitch-extruded';
import { TournamentPhasesWidget } from '../../molecules';
import { Skeleton } from '../../skeleton';
import { TournamentDetailsWidgetsProps } from './tournament-details-widgets.types';
import { FC } from 'react';

const TournamentDetailsWidgets: FC<TournamentDetailsWidgetsProps> = ({ profile, loading,  tournament, registered}) => {

  const twitchIframeSrc = `https://player.twitch.tv/?channel=${profile?.twitch_username}&parent=localhost&muted=true`;
  const discordIframeSrc = `https://discord.com/widget?id=${profile?.discord_widget_id}&theme=dark`;

  return (
        <div className="w-[400px] space-y-8">
          <TournamentPhasesWidget
            tournament={tournament}
            isRegistered={registered}
          />

          <div>
            <TwitchStruded className="h-8" />
            <div className="border-border rounded border">
              {loading && (
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
            {loading && (
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
  );
};

export default TournamentDetailsWidgets;
