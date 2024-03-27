import { Skeleton } from '@/components/ui/skeleton';
import TournamentsFeedTemplate from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { tournamentSchema } from '@/lib/models/Tournament';
import { routes } from '@/lib/request';
import { Route } from '@/lib/routes';
import Head from 'next/head';
import { cookies } from 'next/headers';
import React, { Suspense } from 'react';
import z from 'zod';

const API_ROOT = process.env.API_URL;

const tournamentsResultSchema = z.object({
  results: z.array(tournamentSchema),
  count: z.number(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
});

async function TournamentsFeedTemplateContainer() {
  // TODO: move this to a factory function
  const { path, method } = routes['getTournaments'];
  const route = new Route(`${API_ROOT}/${path}`);
  const url = route.href({
    game: 'pc',
    platform: 'league-of-legends',
  });
  const cookieStore = cookies();
  const hxtoken = cookieStore.get('hx');

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hxtoken?.value}`,
    },
  });

  let results: z.infer<typeof tournamentsResultSchema> | null = null;
  try {
    const data = await response.json();
    results = tournamentsResultSchema.parse(data);
  } catch (error) {
    console.error('Error fetching tournaments', error);
  }

  if (!results) {
    return <p>Failed to load tournaments</p>;
  }
  return <TournamentsFeedTemplate data={results} />;
}

export default async function CompetePage() {
  return (
    <>
      <Head>
        <title>Compete</title>
      </Head>
      <div className="px-8">
        <section id="available-games">
          <Suspense fallback={<LoadingTournaments />}>
            <TournamentsFeedTemplateContainer />
          </Suspense>
        </section>
      </div>
    </>
  );
}

function LoadingTournaments() {
  return (
    <div className="pt-8">
      <div className="grid grid-cols-4 gap-8">
        <Skeleton className="mb-4 h-[360px] w-full rounded" />
        <Skeleton className="mb-4 h-[360px] w-full rounded" />
        <Skeleton className="mb-4 h-[360px] w-full rounded" />
        <Skeleton className="mb-4 h-[360px] w-full rounded" />
      </div>
    </div>
  );
}
