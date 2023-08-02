import type { NextAuthOptions, User, Session, Account } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  pages: {
    signIn: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        // await new Promise((resolve) => setTimeout(resolve, 4000));
        const user = { id: '1', name: 'Admin', email: 'admin@admin.com' };
        return user;
      },
    }),
  ],
  secret: 'w+fSnI6I0WYgrtIgLk/PFATt0Hk1QIXPo9WVrF54Lbs=',
  session: {
    strategy: 'jwt',
  },
};
