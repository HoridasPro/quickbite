import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const collection = await dbConnect("users");
        const user = await collection.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "github") {
        const { name, email, image } = user;
        try {
          const collection = await dbConnect("users");
          const userExists = await collection.findOne({ email });

          if (!userExists) {
            await collection.insertOne({
              name,
              email,
              image,
              role: "user",
              createdAt: new Date(),
            });
          } else {
            await collection.updateOne(
              { email },
              { 
                $set: { 
                  image: userExists.image || image, 
                  name: userExists.name || name 
                } 
              }
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account || user) {
        token.id = user?.id || token.id;
        token.name = user?.name || token.name;
        token.email = user?.email || token.email;
        token.image = user?.image || token.image;
        token.role = user?.role || "user";

        if (account?.provider === "google" || account?.provider === "github") {
          try {
            const collection = await dbConnect("users");
            const dbUser = await collection.findOne({ email: token.email });
            if (dbUser) {
              token.role = dbUser.role || "user";
              token.id = dbUser._id.toString();
              token.name = dbUser.name || token.name;
              token.image = dbUser.image || token.image;
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };