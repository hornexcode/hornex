import { getToken } from '../utils/token';
import { Tournament, columns } from './columns';
import { DataTable } from './data-table';

const GAME_SLUG = 'league-of-legends';
const PLATFORM_SLUG = 'pc';

async function getData(): Promise<Tournament[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      prize_pool: 100,
      phase: 'results_tracking',
      name: 'm@example.com',
    },
    // ...
  ];
}

async function getTournaments(accessToken: string): Promise<Tournament[]> {
  const res = await fetch(
    `http://localhost:8000/api/v1/${GAME_SLUG}/${PLATFORM_SLUG}/tournaments`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const tournaments: {
    count: number;
    results: { id: string; name: string; prize_pool: number }[];
  } = await res.json();

  return tournaments.results.map((t: any) => {
    const tournament: Tournament = {
      id: t.id,
      name: t.name,
      prize_pool: t.prize_pool,
      phase: 'results_tracking',
    };
    return tournament;
  });
}

export default async function TournamentsPage() {
  const token = await getToken();

  const tournaments = await getTournaments(token.access);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Tournaments</h1>
      <DataTable columns={columns} data={tournaments} />
    </div>
  );
}
