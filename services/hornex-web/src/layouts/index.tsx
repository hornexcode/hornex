import Header from './header';
import { Sidebar } from './sidebar';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <main className="3xl:px-10 relative rounded pt-16 md:pl-[230px] xl:pb-24">
        {children}
      </main>
    </div>
  );
};
