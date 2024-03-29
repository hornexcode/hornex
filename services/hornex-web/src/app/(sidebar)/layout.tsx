import Header from '@/components/v2/layouts/header';
import Sidebar from '@/components/v2/layouts/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <main className="relative rounded pl-[230px] pt-16">{children}</main>
    </div>
  );
}
