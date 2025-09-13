import NextAuth, { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
/* import  NextAuthOptions from "next-auth" */
import GoogleProvider from "next-auth/providers/google";
/* export const { handlers, auth } = NextAuth({ providers: [GitHub] }) */
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUser } from "@/auth";
import type { NextAuthConfig } from "next-auth";

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

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, method } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Ajoutez isAdmin au token JWT
      console.log("ponpon3");
      if (user?._id) {
        token._id = user._id;
      }
      console.log("ponpon4");
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      console.log("ponpon5");
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Passez les données personnalisées à la session
      console.log("ponpon6");
      if (token?._id) {
        session.user._id = token._id;
      }
      console.log("ponpon7");
      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }
      console.log("ponpon8");
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
