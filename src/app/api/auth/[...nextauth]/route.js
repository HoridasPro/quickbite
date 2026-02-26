import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/dbConnect";

export const authOptions = {
  providers: [
    // Credentials Login
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user) return null;

        const isPasswordOk = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordOk) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || "User",
          image: user.image || null,
          role: user.role || "user",
        };
      },
    }),

    // GitHub Login
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (
        account.provider === "google" ||
        account.provider === "github"
      ) {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existingUser) {
          await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            provider: account.provider,
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = user.role || "user";
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };