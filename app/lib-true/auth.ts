// app/lib/auth.ts
import { auth } from "@/auth";

export async function getSession() {
  const session = await auth();
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.isAdmin;
}
