'use client';
import '@/assets/css/globals.css';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import localFont from 'next/font/local';

const Goldman_Sans = localFont({
  src: [
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Blk.woff2',
      weight: '800',
      style: 'black',
    },
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Bd.woff2',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Rg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Md.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Lt.woff2',
      weight: '300',
      style: 'light',
    },
  ],
  preload: true,
  display: 'swap',
  variable: '--font-goldman-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={cn('dark', Goldman_Sans.className)}>
      <head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
      </head>
      <body>
        {/* Layout UI */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
