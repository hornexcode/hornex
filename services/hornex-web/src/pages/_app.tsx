import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';

import { ni18nConfig } from '../../ni18n.config';
import ModalsContainer from '@/components/modal-views/container';
import { Toaster } from '@/components/ui/toaster';
import classnames from 'classnames';
import { NextPage } from 'next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import {
  JetBrains_Mono,
  Kanit,
  Roboto_Condensed,
  Source_Sans_3,
} from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { appWithI18Next } from 'ni18n';
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

const roboto_condensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains_mono = JetBrains_Mono({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

const source_Sans_3 = Source_Sans_3({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-source-sans',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-kanit',
});
function HornexApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SWRConfig>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div
          className={classnames(
            'dark:bg-background text-muted min-h-[100vh] font-semibold antialiased',
            // jetbrains_mono.className,
            source_Sans_3.variable,
            roboto_condensed.className,
            kanit.variable
          )}
        >
          <SessionProvider session={pageProps.session}>
            {getLayout(<Component {...pageProps} />)}
            <ModalsContainer />
            {/* <SettingsDrawer /> */}
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

export default appWithI18Next(HornexApp, ni18nConfig);
