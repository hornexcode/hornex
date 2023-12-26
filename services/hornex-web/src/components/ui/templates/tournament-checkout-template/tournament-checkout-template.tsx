import { Tournament } from '@/lib/hx-app/types';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Button from '../../atoms/button/button';
import Image from 'next/image';

import LeagueOfLegendsLogoMarkBlack from '@/assets/images/games/league-of-legends/logomark-black.png';
import { useModal } from '@/components/modal-views/context';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { calcPrizePool } from '@/lib/utils';
import { TrashIcon } from '@heroicons/react/20/solid';
import { LongArrowLeft } from '../../atoms/icons/long-arrow-left';
import PaymentOptions from '../../molecules/payment-options/payment-options';
import InputLabel from '../../atoms/form/input-label';
import { useRouter } from 'next/router';

type TournamentCheckoutProps = {
  tournament: Tournament;
  gameIds: GameID[];
};

const TournamentCheckoutTemplate: FC<TournamentCheckoutProps> = ({
  tournament,
  gameIds,
}) => {
  const { toast } = useToast();
  const { openModal } = useModal();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const router = useRouter();
  const gameId =
    (gameIds.length > 0 &&
      gameIds.find((gameId) => gameId.game === 'league-of-legends')) ||
    undefined;

  return (
    <div className="container space-y-8 sm:space-y-16 sm:pt-16">
      <div className="grid grid-cols-4 gap-8 divide-x divide-dashed divide-gray-700">
        <div className="col-span-2 space-y-12">
          <div>
            <h2 className="text-title text-2xl font-bold">
              Complete your registration
            </h2>
            <p className="text-body text-lg font-normal">
              Checkout to complete your registration and play the tournament
            </p>
          </div>
          {/* Payment method */}
          <div className="">
            <div className="w-full">
              <InputLabel title="Payment Method" important />
              <PaymentOptions
                onChange={setPaymentMethod}
                value={paymentMethod}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => router.back()}
              color="gray"
              shape="rounded"
              className="mr-3"
              variant="ghost"
            >
              <div className="flex items-center">
                <LongArrowLeft className="mr-4 h-5 w-4" />
                <span>Back</span>
              </div>
            </Button>
            <Button className="flex-1" shape="rounded">
              Registrate ${tournament.entry_fee * tournament.team_size}
            </Button>
          </div>
        </div>
        <div className="col-span-2 pl-8">
          <div className="space-y-6">
            <div className="text-title text-lg tracking-wide">
              Purchase Details
            </div>
            <div className="flex space-x-5">
              <div className="block">
                <Image
                  className="shadow-card rounded-lg"
                  src={`/images/tournaments/${tournament.feature_image}`}
                  width={64}
                  height={64}
                  alt="Cover Image"
                />
              </div>

              {/* details */}
              <div className="flex-1">
                <h4 className="text-title text-sm">1x {tournament.name}</h4>
                <div className="text-title  bg-dark border-light-dark mt-2 flex items-center justify-between rounded border p-2 text-sm">
                  Team 1
                  <TrashIcon className="text-title ml-2 h-4 w-4 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="space-y-5 px-4">
              <div className="text-body flex items-center justify-between text-sm">
                <div>Subtotal</div>
                <div>${tournament.entry_fee}</div>
              </div>
              <div className="text-body flex items-center justify-between text-sm">
                <div>Qty</div>
                <div>x{tournament.team_size}</div>
              </div>
              <div className="text-title flex items-center justify-between text-lg">
                <div>Total</div>
                <div>${tournament.entry_fee}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCheckoutTemplate;
