// app/api/auth/[...nextauth]/route.ts
import { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { handlers } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUser } from "@/auth";
import { NextRequest } from "next/server";

//import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
declare module "next-auth" {
  interface User {
    _id: string;
    isAdmin?: boolean;
    name: string;
    email: string;
  }

  interface Session {
    user: User & {
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isAdmin?: boolean;
    name: string;
    email: string;
  }
}

export const authOptions = {
  /*  adapter: MongoDBAdapter(clientPromise), */
  providers: [
    Credentials({
      async authorize(credentials): Promise<any | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        console.log("zinedine");
        if (parsedCredentials.success) {
          console.log("zidane");
          const { email, password } = parsedCredentials.data;
          console.log({ email, password });
          const user = await getUser(email);
          console.log(user);
          console.log("kokko");
          if (!user) return null;
          console.log("kokko1");
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("kokko2");
          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async authorized({ req }: { req: NextRequest }) {
      console.log("fofo1");
      // Autoriser l'accès aux routes API publiques
      const adminRoutes = req.nextUrl?.pathname.startsWith("/admin");
      console.log({ adminRoutes });
      if (!adminRoutes) {
        return true;
      }

      // Vérifier l'authentification pour les autres routes
      /*  const session = await getToken({ req });
      return !!session; */
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?._id) {
        console.log("fofo1");
        token._id = user._id;
      }

      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("fofo1");
      if (token?._id) {
        session.user._id = token._id;
      }

      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  secret: process.env.AUTH_SECRET,
  //useSecureCookies: process.env.NODE_ENV === "production",
  skipSessionMiddleware: true, // ← Désactive le middleware de session automatique
};

//const handler = NextAuth(authOptions);
export const { GET, POST } = handlers;
//export { handlers as GET, handlers as POST };
