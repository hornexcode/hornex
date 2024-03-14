// import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
