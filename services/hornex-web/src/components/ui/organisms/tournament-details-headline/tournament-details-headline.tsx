import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import { SwordsIcon } from '@/components/ui/atoms/icons';
import { Tournament } from '@/lib/hx-app/types';
import { calcPrizePool, toCurrency } from '@/lib/utils';
import { TrophyIcon } from '@heroicons/react/20/solid';
import { CalendarIcon, CoinsIcon } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { FC } from 'react';
import { LeagueOfLegendsLogo } from '../../atoms/icons/league-of-legends-icon';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { ConnectedGameId } from '../../molecules/connected-game-id';

const imageLoader = ({ src }: any) => {
  return `https://placehold.co/${src}`;
};

type TournamentHeadlineProps = {
  tournament: Tournament;
  connectedGameId?: GameID;
};
const TournamentDetailsHeadline: FC<TournamentHeadlineProps> = ({
  tournament,
  connectedGameId,
}) => {
  const { openModal } = useModal();
  return (
    <>
      <div className="3xl:h-[448px] relative h-36 w-full overflow-hidden sm:h-44 md:h-64 xl:h-52">
        <Image
          // loader={imageLoader}
          // src="1920x1080/232f48/jpg"
          src={`/images/tournaments/${tournament.feature_image}`}
          // placeholder="blur"
          quality={100}
          width={1920}
          height={1080}
          className="!h-full w-full !object-cover"
          alt="Cover Image"
        />
      </div>
      <div className="bg-medium-dark shadow-card  flex rounded-b p-4">
        <div className="flex w-full justify-between">
          <div className="block space-y-6">
            <div className="block">
              <h4 className="text-title text-sm font-semibold">
                {tournament.name}
              </h4>
              {/* headline */}
              <div className="flex items-center">
                <CalendarIcon className="w-4" />
                <div className="text-body ml-2 text-sm">
                  {moment(tournament.start_date).format('MMM Do YY')},{' '}
                  {tournament.start_time.substring(0, 5)} h{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center self-start">
            {/* TODO: make this a molecule component */}
            <div className="flex items-center">
              {/*  */}
              {/* Game */}
              <div className="border-r-2 border-dotted border-slate-700 px-8">
                <LeagueOfLegendsLogo className="text-title w-14" />
              </div>
              {/* Prize Pool */}
              <div className="flex items-center space-x-4 border-r-2 border-dotted border-gray-700 px-8">
                <div>
                  <TrophyIcon className="w-6 fill-cyan-500" />
                </div>
                <div>
                  <div className="text-md text-body">Prize Pool</div>

                  {!tournament.is_entry_free && (
                    <div className="text-title text-sm">
                      R${' '}
                      {calcPrizePool(
                        tournament.entry_fee,
                        tournament.max_teams * tournament.team_size,
                        0.7
                      )}
                      ,00
                    </div>
                  )}
                </div>
              </div>
              {/* Classification */}
              <div className="flex items-center space-x-4 border-r-2 border-dotted border-slate-700 px-8">
                <div>
                  <SwordsIcon className="w-6 fill-cyan-500" />
                </div>
                <div>
                  <div className="text-md text-body">Classification</div>
                  <div className="text-title text-xs">
                    {tournament.classifications.join(', ')}
                  </div>
                </div>
              </div>
              {!tournament.is_entry_free && (
                <div className="flex items-center space-x-4 px-8">
                  <div>
                    <CoinsIcon className="w-6 fill-cyan-500" />
                  </div>
                  <div>
                    <div className="text-md text-body">Entry fee</div>
                    <div className="text-title text-sm">
                      {toCurrency(tournament.entry_fee)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {connectedGameId && (
              <div className="mx-4 block">
                <ConnectedGameId gameId={connectedGameId} />
              </div>
            )}
            <div className="block">
              <Button
                size="small"
                onClick={() => openModal('REGISTRATION_VIEW')}
                shape="rounded"
              >
                Registrar time
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentDetailsHeadline;
