import { LoginResponse } from '@/infra/hx-core/responses/login';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        console.log(credentials);
        const res = await fetch('http://localhost:9234/api/v1/auth/login', {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.username,
            password: credentials?.password,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = (await res.json()) as LoginResponse;

        // If no error and we have user data, return it
        if (res.ok && data) {
          return data.user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    GoogleProvider({
      clientId: '',
      clientSecret: '',
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }) {
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      //
      return session;
    },
    async jwt({ token }) {
      // token.userRole = 'admin';
      console.log(token);
      return token;
    },
  },
};

export default NextAuth(authOptions);
