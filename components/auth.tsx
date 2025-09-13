// app/components/auth.tsx
"use client"; // Mark as Client Component

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Auth({
  children,
  adminOnly,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  console.log({ zout: session?.user });
  /*  if (adminOnly && !session?.user?.isAdmin) {
    router.push("/unauthorized?message=admin login required");
    return null;
  } */

  /* 
  useEffect(() => {
      if (status === "loading") return;
      if (!session || session.user.role !== requiredRole) {
        router.replace("/unauthorized");
      }
    }, [session, status]);

*/

  return children;
}
