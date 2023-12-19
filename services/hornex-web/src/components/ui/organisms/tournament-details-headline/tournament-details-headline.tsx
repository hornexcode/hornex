import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import { SwordsIcon } from '@/components/ui/atoms/icons';
import { Tournament } from '@/lib/hx-app/types';
import { calcPrizePool, toCurrency } from '@/lib/utils';
import { CurrencyDollarIcon, TrophyIcon } from '@heroicons/react/20/solid';
import { CalendarIcon, CoinsIcon } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { FC } from 'react';

const imageLoader = ({ src }: any) => {
  return `https://placehold.co/${src}`;
};

type TournamentHeadlineProps = {
  tournament: Tournament;
};
const TournamentDetailsHeadline: FC<TournamentHeadlineProps> = ({
  tournament,
}) => {
  const { openModal } = useModal();
  return (
    <>
      <div className="3xl:h-[448px] shadow-card relative h-36 w-full overflow-hidden sm:h-44 md:h-64 xl:h-52">
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
      <div className="bg-medium-dark flex rounded-b-md p-4">
        <div className="flex w-full justify-between">
          <div className="block space-y-6">
            <div className="block">
              <h4 className="text-sm font-semibold text-gray-200">
                {tournament.name}
              </h4>
              {/* headline */}
              <div className="flex items-center">
                <CalendarIcon className="w-4" />
                <div className="ml-2 text-sm text-gray-400">
                  {moment(tournament.start_date).format('MMM Do YY')},{' '}
                  {tournament.start_time.substring(0, 5)} h{' '}
                </div>
              </div>

              {/* classification */}
            </div>
          </div>
          <div className="flex items-center self-start">
            {/* TODO: make this a molecule component */}
            <div className="flex items-center">
              {/*  */}
              <div className="flex items-center space-x-4 border-r-2 border-dotted border-gray-700 pr-8">
                <div>
                  <TrophyIcon className="w-6 fill-gray-400" />
                </div>
                <div>
                  <div className="text-md text-gray-400">Prize Pool</div>

                  {!tournament.is_entry_free && (
                    <div className="text-sm text-white">
                      R${' '}
                      {calcPrizePool(
                        tournament.entry_fee,
                        tournament.max_teams * tournament.team_size,
                        0.7
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/*  */}
              <div className="flex items-center space-x-4 border-r-2 border-dotted border-slate-700 px-8">
                <div>
                  <SwordsIcon className="w-6 fill-gray-400" />
                </div>
                <div>
                  <div className="text-md text-gray-400">Classification</div>
                  <div className="text-sm text-white">
                    {tournament.classification}
                  </div>
                </div>
              </div>
              {!tournament.is_entry_free && (
                <div className="flex items-center space-x-4 px-8">
                  <div>
                    <CoinsIcon className="w-6 fill-gray-400" />
                  </div>
                  <div>
                    <div className="text-md text-gray-400">Entry fee</div>
                    <div className="text-sm text-white">
                      {toCurrency(tournament.entry_fee)}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
