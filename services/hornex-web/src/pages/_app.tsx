import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/websocket/app'; // websocket

import ModalsContainer from '@/components/modal-views/container';
import { Toaster } from '@/components/ui/sonner';
import { AuthContextProvider } from '@/lib/auth/auth-context';
import { NotificationContextProvider } from '@/lib/websocket';
import classnames from 'classnames';
import { NextPage } from 'next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Source_Sans_3 } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  game?: string;
  Component: NextPageWithLayout;
};

const source_Sans_3 = Source_Sans_3({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

function HornexApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SWRConfig>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div
          className={classnames(
            'bg-dark/90 font-semibold text-zinc-500 antialiased',
            source_Sans_3.className
          )}
        >
          <SessionProvider session={pageProps.session}>
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
          </SessionProvider>
          <Toaster />
        </div>
      </NextThemesProvider>
    </SWRConfig>
  );
}

HornexApp.getInitialProps = async (context: AppContext) => {
  const props = await App.getInitialProps(context);
  // check if user has token set on document.cookie
  return {
    ...props,
    pageProps: {
      ...props.pageProps,
      game: undefined,
    },
  };
};

export default appWithTranslation(HornexApp);
