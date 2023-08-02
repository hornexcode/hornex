import type { AppProps } from 'next/app';

import '@/styles/global.css';
import { Fira_Code, Nunito, Inter_Tight, Inter } from 'next/font/google';

import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

const fira = Fira_Code({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <div className={classnames(' bg-dark text-xs text-slate-500 antialiased')}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default App;
