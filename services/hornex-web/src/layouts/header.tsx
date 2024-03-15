import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import ProfileMenuItem from '@/components/profile/profile-menu-item';
import Loader from '@/components/ui/atoms/loader';
import { Logo } from '@/components/ui/atoms/logo';
import { Skeleton } from '@/components/ui/skeleton';
import routes from '@/config/routes';
import { LoggedUser } from '@/domain';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { Loader2, LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';

interface HeaderRightAreaProps {
  user: LoggedUser;
}

const HeaderRightArea: FC<HeaderRightAreaProps> = ({ user }) => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      <ProfileMenuItem user={user} />
    </div>
  );
};

const Header = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [session]);

  const renderHeaderRightArea = () => {
    if (loading) {
      return <Skeleton className="h-6 w-[200px] rounded" />;
    }

    if (session) {
      return (
        <HeaderRightArea
          user={{
            email: session.user?.email!,
            name: session.user?.name!,
          }}
        />
      );
    }

    return (
      <div className="flex items-center justify-center space-x-4">
        <Link href={routes.login}>
          <div className=" flex items-center font-medium">
            Login <LogInIcon className=" ml-2 h-5 w-5" />
          </div>
        </Link>
        <Link href={routes.signup}>
          <div className=" flex items-center font-medium">
            Create account <ArrowUpRightIcon className=" ml-2 h-5 w-5" />
          </div>
        </Link>
      </div>
    );
  };

  return (
    <header className="border-border/40 fixed top-0 z-40 h-16 w-full border-b px-8 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[2160px] items-center justify-between">
        <div className=" flex w-[230px] items-center text-xl font-bold">
          <Link className="text-title mr-4 flex items-center" href="/">
            <Logo size="xs" className="mr-2" />
            <span className="font-extrabold">HORNEX</span>
          </Link>
        </div>

        {renderHeaderRightArea()}
      </div>
    </header>
  );
};

export default Header;
