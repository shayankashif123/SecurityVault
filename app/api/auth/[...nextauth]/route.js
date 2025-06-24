import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import bcrypt from 'bcryptjs';
import { connectDB } from "@/app/Lib/connect";
import Auth from "@/app/model/userSchema";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const { email, password } = credentials;
          const user = await Auth.findOne({ email });

          if (!user) throw new Error("No user found with the email");

          const isPassword = await bcrypt.compare(password, user.password);
          if (!isPassword) throw new Error("Incorrect password");

          return {
            id: user._id,
            name: user.username,
            email: user.email,
          };
        } catch (err) {
          console.error("Authorization error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },
   jwt: {
    maxAge: 30 * 24 * 60 * 60, 
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}
