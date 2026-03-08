// import CredentialsProvider from "next-auth/providers/credentials";
// import { loginUser } from "@/actions/server/auth";

// export const authOption = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},
//       async authorize(credentials, req) {
//         const user = await loginUser(credentials);
//         return user;
//       },
//     }),
//   ],
// };
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/actions/server/auth";

export const authOption = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const user = await loginUser(credentials.email, credentials.password);

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};
