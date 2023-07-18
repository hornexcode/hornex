'use client';
import Header from '@/layouts/header';
import { Sidebar } from '@/components/ui/sidebar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />
      <Sidebar />
      <main className="3xl:px-10 relative min-h-[100vh] pb-16 pl-16 sm:pb-20 xl:pb-24">
        {children}
      </main>
    </div>
  );
}
