import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/admin-auth";

export default async function AdminPage() {
  const { isAdmin } = await getAuthState();
  if (isAdmin) redirect("/");
  redirect("/ingen-admin");
}
