import { useSession } from "next-auth/react";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map(e => e.trim().toLowerCase());

export function useAdmin() {
  const { data: session, status } = useSession();
  const email = session?.user?.email?.toLowerCase() || "";
  const isAdmin = ADMIN_EMAILS.includes(email);
  return { isAdmin, loading: status === "loading" };
}