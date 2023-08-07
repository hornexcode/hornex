import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';

import classnames from 'classnames';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Cabin, Kanit, Nunito, Oswald } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { AuthContextProvider } from '@/lib/auth/auth.context';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <div
        className={classnames(
          'bg-dark text-xs text-slate-500 antialiased',
          kanit.className
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
    </NextThemesProvider>
  );
}

export default App;
