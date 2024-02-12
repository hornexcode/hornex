import Header from './header';
import { Sidebar } from '@/components/ui/atoms/sidebar';
import { HelpCircleIcon } from 'lucide-react';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Header />
      <Sidebar />
      <main className="3xl:px-10 relative rounded pt-14 md:pl-[64px] xl:pb-24">
        {children}
        <div className="bg-light-dark fixed bottom-0 left-0 w-full">
          <div className="flex items-center">
            <HelpCircleIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </main>
    </div>
  );
};
