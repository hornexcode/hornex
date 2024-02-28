import Header from './header';
import { Sidebar } from '@/components/ui/atoms/sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Sidebar />
      <Header />
      <main className="3xl:px-10 relative rounded pt-14 md:pl-[250px] xl:pb-24">
        {children}
      </main>
    </div>
  );
};
