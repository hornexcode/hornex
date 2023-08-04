import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';

import classnames from 'classnames';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Fira_Code, Khula, Nunito, Oswald } from 'next/font/google';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { AuthContextProvider } from '@/lib/auth/auth.context';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <div
      className={classnames(
        'bg-dark font-sans text-xs text-slate-500 antialiased'
      )}
    >
      <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthContextProvider>
      <ToastContainer
        theme="dark"
        style={{
          fontSize: '0.925rem',
        }}
      />
    </div>
  );
}

export default App;
