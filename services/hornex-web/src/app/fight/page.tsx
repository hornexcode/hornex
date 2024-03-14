import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { Suspense } from 'react';

export default async function Fight() {
  const data = await fetch(
    'http://localhost:9876/api/v1/pc/league-of-legends/tournaments'
  )
    .then((res) => res.json())
    .then((data: GetTournamentsResponse) => data);

  return (
    <div>
      <h1>Fight</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ul>
          {data?.results.map((tournament, id) => (
            <li key={id}>{tournament.name}</li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
