import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';

import { ni18nConfig } from '../../ni18n.config';
import ModalsContainer from '@/components/modal-views/container';
import { Toaster } from '@/components/ui/toaster';
import classnames from 'classnames';
import { NextPage } from 'next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Roboto_Condensed } from 'next/font/google';
import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { appWithI18Next } from 'ni18n';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

// Font files can be colocated inside of `pages`
const Beaufort_for_LOL = localFont({
  src: [
    {
      path: '../styles/fonts/BeaufortforLOL/BeaufortforLOL-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  preload: true,
  variable: '--font-beaufort',
});

const Goldman_Sans = localFont({
  src: [
    {
      path: '../styles/fonts/GoldmanSans/GoldmanSans_W_Bd.woff2',
      weight: '700',
      style: 'normal',
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
  variable: '--font-roboto-condensed',
});

function HornexApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${Goldman_Sans.style.fontFamily};
        }
      `}</style>
      <SWRConfig>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <div
            className={classnames(
              'min-h-[100vh] antialiased',
              Goldman_Sans.className,
              Beaufort_for_LOL.variable,
              roboto_condensed.variable
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
    </>
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
