import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            console.log('No credentials provided');
            return null;
          }

          await connectDB();
          console.log('Connected to database for sign-in');

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log('No user found with this email');
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            console.log('Invalid password');
            return null;
          }

          console.log('Authentication successful');

          // Mengembalikan objek user dengan properti yang sesuai dengan tipe Session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,  
            points: user.points,
            tier: user.tier,
            linkedin: user.linkedin,
            github: user.github,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Mengisi properti token dengan data yang sesuai
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.points = user.points;
        token.tier = user.tier;
        token.linkedin = user.linkedin;
        token.github = user.github;
      }
      return token;
    },
    async session({ session, token }) {
      // Mengambil data dari token dan memasukkannya ke dalam session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.points = token.points;
      session.user.tier = token.tier;
      session.user.linkedin = token.linkedin;
      session.user.github = token.github;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
