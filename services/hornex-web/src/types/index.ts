import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export * from './common';
export * from './game';
export * from './team';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
