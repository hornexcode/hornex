import Button from './button';
import LeagueOfLegendsLogoMarkBlack from '@/assets/images/games/league-of-legends/logomark-black.png';
import { useModal } from '@/components/modal-views/context';
import Image from 'next/image';

export const ConnectAccountButton = () => {
  const { openModal } = useModal();

  return (
    <div className="bg-dark shadow-card mb-4 p-6">
      <h2 className="text-title font-roboto-condensed text-xl font-bold">
        Connect your account
      </h2>
      <p className="text-title font-source-sans font-normal">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
        nostrum!
      </p>
      <div className="pt-6">
        <Button
          shape="rounded"
          size="small"
          onClick={() => openModal('CONNECT_ACCOUNT_VIEW')}
        >
          <div className="flex items-center">
            <Image
              alt="League of Legends Logo"
              src={LeagueOfLegendsLogoMarkBlack}
              width={20}
              height={20}
              className="mr-4"
            />
            <span>Connect account</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
