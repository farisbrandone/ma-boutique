import NextAuth, { Session, User as Users } from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { userType } from "./models/User";
import dbConnect from "./app/lib/mongodb";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { JWT } from "next-auth/jwt";
import User from "./models/User";

//import { authOptions } from "./app/api/auth/[...nextauth]/route";

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
    /*   authorized({ auth, request }: { auth: any; request: any }) {
     
      if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return true;
      }

      // 2. Routes absolument publiques
      const publicPaths = ["/", "/home"];

      const isPublic = publicPaths.some((path) =>
        request.nextUrl.pathname.match(
          new RegExp(`^${path.replace("*", ".*")}$`)
        )
      );

      // 3. Autoriser l'accès si route publique OU utilisateur authentifié
      return isPublic ? true : !!auth?.user;
    }, */

    async jwt({ token, user }: { token: JWT; user?: Users }) {
      console.log("toutou");
      if (user?._id) {
        token._id = user._id;
      }

      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("toutou2");
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
};

export async function getUser(email: string): Promise<userType | undefined> {
  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (user) {
      return {
        _id: user?._id as string,
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
      };
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authOptions,
  /*   trustHost: true, */
});

/* export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<any | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
}); 
 */
