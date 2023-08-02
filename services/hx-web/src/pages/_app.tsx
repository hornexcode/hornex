import type { AppProps } from 'next/app';

import '@/styles/global.css';
import { Nunito } from 'next/font/google';

import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

const font = Nunito({
  weight: ['400', '500', '600', '700', '800'],
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
    <div className={classnames('bg-dark text-slate-400', font.className)}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default App;
