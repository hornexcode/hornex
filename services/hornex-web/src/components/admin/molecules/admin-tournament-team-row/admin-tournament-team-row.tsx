import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import Image from 'next/image';

const AdminTournamentTeamRow = () => {
  return (
    <div className="bg-medium-dark flex items-center border-b border-neutral-800 p-4">
      <div className="flex items-center space-x-4">
        <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
        <div className="text-title">Team number 1</div>
      </div>
      <div className="ml-auto flex items-center">
        <div className="text-muted ml-4">
          <Button shape="rounded" color="danger" size="mini">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentTeamRow;
