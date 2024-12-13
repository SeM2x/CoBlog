import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(credentials);

        return { id: '1', email: 'admin@email.com' };
      },
    }),
  ],
});
