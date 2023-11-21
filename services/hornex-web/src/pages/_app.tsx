import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/websocket/app'; // websocket

import ModalsContainer from '@/components/modal-views/container';
import { AuthContextProvider } from '@/lib/auth/auth-context';
import { NotificationContextProvider } from '@/lib/notification';
import { WebSocketContextProvider } from '@/websocket/context';
import classnames from 'classnames';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { JetBrains_Mono, Kanit, Red_Hat_Display } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

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

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const jetBrains_Mono = JetBrains_Mono({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <div
        className={classnames(
          'bg-dark text-xs font-semibold text-slate-500 antialiased',
          redHatDisplay.className
        )}
      >
        <AuthContextProvider>
          <NotificationContextProvider>
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
          </NotificationContextProvider>
          {/* <SettingsDrawer /> */}
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
