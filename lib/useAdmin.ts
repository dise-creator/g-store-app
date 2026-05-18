import { useSession } from "next-auth/react";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function useAdmin() {
  const { data: session, status } = useSession();
  const email = session?.user?.email?.toLowerCase() ?? "";
  
  console.log("ADMIN CHECK:", { email, ADMIN_EMAILS, isAdmin: ADMIN_EMAILS.includes(email) });
  
  const isAdmin = email.length > 0 && ADMIN_EMAILS.includes(email);
  return { isAdmin, loading: status === "loading" };
}