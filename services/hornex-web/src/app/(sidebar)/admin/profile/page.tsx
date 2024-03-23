import ProfileForm from '@/components/v2/profile-form';
import { Profile, profileSchema } from '@/lib/models/Profile';
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
  code: number;
};

async function getProfile(): Promise<HTTPResponse<Profile>> {
  const { path, method } = routes['profile'];
  const route = new Route(`${API_ROOT}/${path}`);
  const url = route.href();
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
      const result = profileSchema.safeParse(data);
      if (result.success) {
        return {
          data: result.data,
          code: res.status,
        };
      } else {
        console.error('Error parsing profile zod schema', result.error);
        return {
          error: new HTTPError(500, 'Error parsing profile zod schema'),
          code: 500,
        };
      }
    } else {
      // Error response
      const errRes = await res.json();
      return {
        code: res.status,
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
      code: 500,
      error: new HTTPError(500, 'Unable to fetch'),
    };
  }
}

export default async function ProfilePage() {
  const { data: profile, error } = await getProfile();
  if (error && error.code === 500) {
    return <p>{error.cause}</p>;
  }

  return (
    <div className="container mx-auto space-y-8 pt-12">
      <h1 className="text-title text-3xl font-bold">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
