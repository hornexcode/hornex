import Header from './header';
import { Sidebar } from '@/components/ui/atoms/sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Header />
      <Sidebar />
      <main className="3xl:px-10 relative h-[100vh] rounded pt-14 md:pl-20 xl:pb-24">
        {children}
      </main>
    </div>
  );
};
