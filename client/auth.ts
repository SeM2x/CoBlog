import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

export { auth as middleware } from '@/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      authorize: async (credentials) => {
        if (credentials.token) {
          return { accessToken: credentials.token as string };
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});

declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
