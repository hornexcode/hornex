import AdminTournamentDashboardTemplate from '@/components/v2/admin-tournament-dashboard/admin-tournament-dashboard';
import { AdminTournamentContextProvider } from '@/contexts';
import { Tournament, tournamentSchema } from '@/lib/models/Tournament';
import { routes } from '@/lib/request';
import { Route } from '@/lib/routes';
import { cookies } from 'next/headers';

const API_ROOT = process.env.API_URL;

class HTTPError extends Error {
  code: number;
  cause: string;

  constructor(code: number, cause: string) {
    super(cause);
    this.code = code;
    this.cause = cause;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

type HTTPResponse<T> = {
  data?: T;
  error?: HTTPError;
};

async function getAdminTournament(
  id: string
): Promise<HTTPResponse<Tournament>> {
  const { path, method } = routes['org:tournament:details'];
  const route = new Route(`${API_ROOT}/${path}`);
  const url = route.href({ id });
  const cookieStore = cookies();
  const hxtoken = cookieStore.get('hx');

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hxtoken?.value}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const result = tournamentSchema.safeParse(data);
      if (result.success) {
        return {
          data: result.data,
        };
      } else {
        console.error('Error parsing tournament zod schema', result.error);
        return {
          error: new HTTPError(500, 'Error parsing tournament zod schema'),
        };
      }
    } else {
      // Error response
      const errRes = await res.json();
      return {
        error: new HTTPError(
          res.status,
          errRes?.error || errRes?.detail || 'Internal server error'
        ),
      };
    }
  } catch (error) {
    // Unable to fetch
    console.error('Error fetching', error);
    return {
      error: new HTTPError(500, 'Unable to fetch'),
    };
  }
}

type AdminTournamentDashboardPage = {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};
async function AdminTournamentDashboardPage(
  props: AdminTournamentDashboardPage
) {
  console.log(props);
  const { data: tournament, error } = await getAdminTournament(props.params.id);
  if (error || !tournament) {
    return <div>Error fetching tournament</div>;
  }

  return (
    <AdminTournamentContextProvider tournament={tournament}>
      <AdminTournamentDashboardTemplate />{' '}
    </AdminTournamentContextProvider>
  );
}

export default AdminTournamentDashboardPage;
