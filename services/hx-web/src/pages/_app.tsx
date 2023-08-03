import type { AppProps } from 'next/app';

import '@/styles/global.css';
import '@/styles/scrollbar.css';

import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { AuthContextProvider } from '@/lib/auth/auth.context';

import { Fira_Code } from 'next/font/google';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const fira_code = Fira_Code({
  display: 'swap',
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
});

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <div
      className={classnames(
        ' bg-dark text-xs text-slate-500 antialiased',
        fira_code.className
      )}
    >
      <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthContextProvider>
    </div>
  );
}

export default App;
