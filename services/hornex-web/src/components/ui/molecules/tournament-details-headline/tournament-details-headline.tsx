import { TournamentHeadlineProps } from './tournament-details-headline.types';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { RegisterButton } from '@/components/ui/atoms/register-button';
import { ConnectedGameIds } from '@/components/ui/molecules/connected-game-ids';
import { useGameId } from '@/contexts/gameid';
import { useTournament } from '@/contexts/tournament';
import { TeamCheckInStatus } from '@/lib/models';
import { Profile } from '@/lib/models/Profile';
import { getStatus, Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import {
  combineDateAndTime,
  getCheckInCountdownValue,
  isCheckInClosed,
  isCheckInOpen,
  toCurrency,
} from '@/lib/utils';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import clsx from 'clsx';
import { CheckCheckIcon, RefreshCcw, Twitch } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';

const { useData: useProfileQuery } = dataLoader<Profile>('profile');
const { post: createUserCheckIn } = dataLoader<Tournament>('createUserCheckIn');
const { useData: useTeamCheckIns } = dataLoader<TeamCheckInStatus>(
  'getTeamCheckInStatus'
);

const TournamentDetailsHeadline: FC<TournamentHeadlineProps> = ({
  isCheckedIn: initialIsCheckedIn,
}) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [isCheckedIn, setCheckedIn] = useState(initialIsCheckedIn);
  const { tournament, isRegistered } = useTournament();
  const { status } = useSession();
  const { gameIds } = useGameId();
  const router = useRouter();
  const { openModal } = useModal();
  const { data: profile } = useProfileQuery();

  // Controll the check in state
  useEffect(() => {
    const checkinIsNotOpenAndHasNotClosed =
      !isCheckInOpen(tournament) && !isCheckInClosed(tournament);

    // if check in is not open and the check in opens in the future
    if (checkinIsNotOpenAndHasNotClosed) {
      const checkInClosesAt = +combineDateAndTime(
        tournament.start_date,
        tournament.start_time
      );
      const checkInClosesIn = checkInClosesAt - +new Date();
      const closeIn = setTimeout(() => setCheckInOpen(false), checkInClosesIn);

      // set a timeout to update the state when the check in opens
      const checkInOpensIn =
        checkInClosesAt -
        tournament.check_in_duration * 60 * 1000 -
        +new Date();
      const opensIn = setTimeout(() => setCheckInOpen(true), checkInOpensIn);

      // avoid memory leak
      return () => {
        clearTimeout(closeIn);
        clearTimeout(opensIn);
      };
    }
  }, [tournament]);

  useEffect(() => {
    setCheckInOpen(isCheckInOpen(tournament));
  }, []);

  const {
    data: checkInStatusData,
    isLoading: checkInStatusIsLoading,
    mutate: checkInStatusMutate,
  } = useTeamCheckIns({
    tournamentId: tournament.id,
  });

  const renderCheckInStatus = (checkedInTotal: number, teamSize: number) => {
    return (
      <div className="flex flex-col justify-between space-y-2">
        <div className="font-body text-sm text-gray-400">Check-in status</div>
        <div
          className={classnames(
            'flex w-20 items-center justify-between',
            { block: isCheckedIn },
            { hidden: !isCheckedIn }
          )}
        >
          {Array.from({ length: checkedInTotal }).map((_, i) => (
            <div
              key={i}
              className="ring-medium-dark h-2 w-2 rounded-full bg-green-500 p-1 ring "
            ></div>
          ))}
          {Array.from({ length: teamSize - checkedInTotal }).map((_, i) => (
            <div
              key={i}
              className="bg-dark ring-medium-dark h-2 w-2 rounded-full ring"
            ></div>
          ))}
        </div>
        <div className="text-title flex justify-between text-sm">
          <div className="font-display text-sm">
            {checkedInTotal}/{teamSize}
          </div>
          <div
            className="hover:pointer"
            onClick={(e) => checkInStatusMutate(checkInStatusData)}
          >
            <RefreshCcw className="h-3 w-3" />
          </div>
        </div>
      </div>
    );
  };

  const handleCheckIn = async () => {
    const { error } = await createUserCheckIn({
      tournamentId: tournament.id,
      // teamId: registration?.team,
    });

    if (!error) {
      setCheckedIn(true);
      checkInStatusMutate(checkInStatusData);
    }
  };

  const renderRegisterButton = () => {
    const { game } = router.query;
    const hasGameId = gameIds?.find((g) => g.game === game);
    if (!hasGameId) {
      return (
        <Button
          shape="rounded"
          className="ml-4"
          size="small"
          onClick={() => openModal('CONNECT_ACCOUNT_VIEW')}
        >
          Register
        </Button>
      );
    }

    if (tournament.status == 'registering') {
      return <RegisterButton className="ml-4" isRegistered={isRegistered} />;
    } else {
      return (
        <div className="mx-4 my-2 w-[100px] text-center font-bold">
          {getStatus(tournament)}
        </div>
      );
    }
  };

  const renderSocialLinks = () => {
    if (!profile) return null;
    return (
      <div className="border-border flex h-full items-center space-x-4 border-r-2 border-dotted px-8">
        <Link
          target="_blank"
          href={`https://twitter.com/${profile?.twitter_username}`}
        >
          <TwitterLogoIcon className="h-6 w-6" />
        </Link>
        <Link
          target="_blank"
          href={`https://twitch.tv/${profile?.twitch_username}`}
        >
          <Twitch className="h-5 w-5" />
        </Link>
      </div>
    );
  };

  return (
    <div className="border-border bg-muted/40 rounded border">
      {/* end debugger */}
      <div className="3xl:h-[448px] md:h-42 relative h-24 w-full sm:h-44">
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
        <div className="bg-dark/60 absolute top-0 h-full w-full"></div>
        <div className="absolute right-0 top-4">
          <div className="mx-4 block">
            {status === 'authenticated' && <ConnectedGameIds />}
          </div>
        </div>
      </div>
      <div className="bg-medium-dark flex rounded-b p-4">
        <div className="flex w-full justify-between">
          {/* Tournament name */}
          <div className="flex items-center">
            <LolFlatIcon className="mr-4 h-10 w-10" />
            <div className="block leading-3">
              <h4 className="text-title mr-4 text-lg font-extrabold">
                {tournament.name}
              </h4>
              <div className="text-body">
                {moment(tournament.start_date).format('MMMM Do, h:mm a')}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {renderSocialLinks()}
            {/* Prize Pool */}
            <div
              className={clsx(
                'flex items-center border-r-2 border-dotted border-gray-700 px-8',
                !tournament.prize_pool_enabled && 'hidden'
              )}
            >
              <div>
                <div className="text-body text-sm">Potential Prize Pool</div>
                <div className="text-title font-display text-sm">
                  R${' '}
                  {toCurrency(
                    tournament?.entry_fee ||
                      0 * tournament.max_teams * tournament.team_size * 0.7
                  )}
                </div>
              </div>
            </div>

            {/* Entry fee */}
            <div className="border-border flex flex-col  border-r-2 border-dotted px-8">
              <div className="text-body text-sm">Entry fee</div>
              <div className="text-title font-bold">
                {tournament.is_entry_free
                  ? 'Free'
                  : `R$ ${toCurrency(tournament?.entry_fee || 0)}`}
              </div>
            </div>

            {/* Register button */}
            {renderRegisterButton()}

            {/* Check-in button */}
            {checkInOpen && (checkInStatusData || { total: 0 }).total != 5 && (
              <div className="flex items-center space-x-4 pl-4">
                <div
                  className={classnames(
                    { block: !isCheckedIn },
                    { hidden: isCheckedIn }
                  )}
                >
                  <div className="text-body text-sm">Check-in ends in:</div>
                  <div className="mb-1 mr-2 flex items-center">
                    <div className="text-title font-display text-sm">
                      <Countdown date={getCheckInCountdownValue(tournament)} />
                    </div>
                  </div>
                </div>
                <div
                  className={classnames(
                    { block: !isCheckedIn },
                    { hidden: isCheckedIn }
                  )}
                >
                  <Button
                    color="danger"
                    onClick={handleCheckIn}
                    size="mini"
                    shape="rounded"
                    isLoading={checkInStatusIsLoading}
                    loaderSize="small"
                    loaderVariant="blink"
                  >
                    Check-in
                  </Button>
                </div>
                {/*  */}
                {isCheckedIn &&
                  renderCheckInStatus(
                    (checkInStatusData || { total: 0 }).total,
                    tournament.team_size
                  )}
              </div>
            )}

            {/* If all members has registered successsfully */}
            {checkInOpen && (checkInStatusData || { total: 0 }).total == 5 && (
              <div className="flex items-center space-x-2 pl-4 text-sm text-green-500">
                <CheckCheckIcon className="h-4 w-4 " />
                <span>Team checked-in</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsHeadline;
