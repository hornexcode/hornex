import { LoginRequest, Token } from '@/lib/auth/auth-context.types';
import { dataLoader } from '@/lib/request';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { setCookie } from 'nookies';

const { fetch: authenticateUser } = dataLoader<Token, LoginRequest>('login');

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const nextAuthOptions: NextAuthOptionsCallback = (req, res) => ({
  // https://next-auth.js.org/configuration/providers/oauth
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Sign in with email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🪲 API_URL', process.env.API_URL);
        const response = await fetch(`${process.env.API_URL}/v1/token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const token = (await response.json()) as Token;

        const payload = JSON.parse(atob(token.access.split('.')[1])) as {
          user_id: string;
          user_name: string;
          exp: number;
        };

        setCookie({ res }, 'hx.auth.token', token.access, {
          maxAge: payload.exp - Date.now() / 1000,
          path: '/',
          httpOnly: true,
        });

        return {
          id: payload.user_id,
          name: payload.user_name,
          email: credentials?.email,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {},
});

const nextauthwrapper = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

export default nextauthwrapper;
