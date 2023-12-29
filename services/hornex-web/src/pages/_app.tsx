import '@/styles/global.css';
import '@/styles/scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/websocket/app'; // websocket

import ModalsContainer from '@/components/modal-views/container';
import { Toaster } from '@/components/ui/sonner';
import { AuthContextProvider } from '@/lib/auth/auth-context';
import { NotificationContextProvider } from '@/lib/notification';
import classnames from 'classnames';
import { NextPage } from 'next';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Source_Sans_3 } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  game: string;
  Component: NextPageWithLayout;
};

const source_Sans_3 = Source_Sans_3({
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
          source_Sans_3.className
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
        <Toaster />
      </div>
    </NextThemesProvider>
  );
}

// App.getInitialProps = async (
//   context: AppContext
// ): Promise<AppPropsWithLayout & AppInitialProps> => {
//   const ctx = await App.getInitialProps(context);

//   return { ...ctx, game: 'league-of-legends' };
// };

export default App;
