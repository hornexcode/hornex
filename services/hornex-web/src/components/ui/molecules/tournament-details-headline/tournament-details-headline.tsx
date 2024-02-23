import { RegisterButton } from '../../atoms/register-button';
import { TournamentHeadlineProps } from './tournament-details-headline.types';
import Button from '@/components/ui/atoms/button/button';
import { ConnectedGameIds } from '@/components/ui/molecules/connected-game-ids';
import { useTournament } from '@/contexts/tournament';
import { TeamCheckInStatus, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import {
  combineDateAndTime,
  getCheckInCountdownValue,
  isCheckInClosed,
  isCheckInOpen,
  toCurrency,
} from '@/lib/utils';
import classnames from 'classnames';
import { CheckCheckIcon, RefreshCcw } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';

const { useData: useTeamCheckIns } = dataLoader<TeamCheckInStatus>(
  'getTeamCheckInStatus'
);
const { post: createUserCheckIn } = dataLoader<Tournament>('createUserCheckIn');

const TournamentDetailsHeadline: FC<TournamentHeadlineProps> = ({
  connectedGameId,
  registration,
  isCheckedIn: initialIsCheckedIn,
}) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCheckedIn, setCheckedIn] = useState(initialIsCheckedIn);
  const { tournament, isRegistered } = useTournament();
  console.log(isRegistered);

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
    teamId: registration?.team,
  });

  const renderCheckInStatus = (checkedInTotal: number, teamSize: number) => {
    return (
      <div className="flex flex-col justify-between space-y-2">
        <div className="font-body text-xs text-gray-400">Check-in status</div>
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
          <div className="font-display text-xs">
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
    setLoading(true);
    const { error } = await createUserCheckIn({
      tournamentId: tournament.id,
      teamId: registration?.team,
    });

    if (!error) {
      setCheckedIn(true);
      checkInStatusMutate(checkInStatusData);
    }
    setLoading(false);
  };

  return (
    <>
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
          {connectedGameId && (
            <div className="mx-4 block">
              <ConnectedGameIds gameId={connectedGameId} />
            </div>
          )}
        </div>
      </div>
      <div className="shadow-card bg-medium-dark flex rounded-b p-4">
        <div className="i flex w-full justify-between">
          {/* Tournament name */}
          <div className="flex items-start">
            <h4 className="text-title text-lg font-extrabold">
              {tournament.name}
              <div className="text-body text-xs">
                Organized by <span className="text-title">@hornex</span>
              </div>
            </h4>
          </div>

          {/* right */}
          <div className="flex items-center self-start">
            {/* TODO: make this a molecule component */}
            <div className="flex items-center">
              {/* Classification */}
              <div className="flex flex-col border-r-2 border-dotted border-gray-700 px-8">
                <div className="text-body text-xs">Classifications</div>
                <div className="text-title font-display text-sm">
                  {!tournament.open_classification
                    ? tournament.classifications.map((c) => c).join(', ')
                    : 'all'}
                </div>
              </div>

              {/* Prize Pool */}
              <div className="flex items-center border-r-2 border-dotted border-gray-700 px-8">
                <div>
                  <div className="text-body text-xs">Potential Prize Pool</div>
                  {!tournament.is_entry_free && (
                    <div className="text-title font-display text-sm">
                      R${' '}
                      {toCurrency(
                        tournament.entry_fee *
                          tournament.max_teams *
                          tournament.team_size *
                          0.7
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Entry fee */}
              {!tournament.is_entry_free && (
                <div className="flex flex-col border-r-2  border-dotted border-gray-700 px-8">
                  <div className="text-body text-xs">Entry fee</div>
                  <div className="text-title font-display text-sm">
                    R$ {toCurrency(tournament.entry_fee)}
                  </div>
                </div>
              )}
            </div>

            {/* Register button */}
            <RegisterButton className="ml-4" isRegistered={isRegistered} />

            {/* Check-in button */}
            {registration &&
              checkInOpen &&
              (checkInStatusData || { total: 0 }).total != 5 && (
                <div className="flex items-center space-x-4 pl-4">
                  <div
                    className={classnames(
                      { block: !isCheckedIn },
                      { hidden: isCheckedIn }
                    )}
                  >
                    <div className="text-body text-xs">Check-in ends in:</div>
                    <div className="mb-1 mr-2 flex items-center">
                      <div className="text-title font-display text-sm">
                        <Countdown
                          date={getCheckInCountdownValue(tournament)}
                        />
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
            {registration &&
              checkInOpen &&
              (checkInStatusData || { total: 0 }).total == 5 && (
                <div className="flex items-center space-x-2 pl-4 text-sm text-green-500">
                  <CheckCheckIcon className="h-4 w-4 " />
                  <span>Team checked-in</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentDetailsHeadline;
