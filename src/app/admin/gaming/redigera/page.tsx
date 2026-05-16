import { redirect } from "next/navigation";

import { GamingEditor } from "@/components/admin/gaming-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayGaming, isGamingStorageConfigured } from "@/lib/gaming-store";

export const dynamic = "force-dynamic";

export default async function AdminEditGamingPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const gaming = await getDisplayGaming();

  return <GamingEditor initial={gaming} supabaseConfigured={isGamingStorageConfigured()} />;
}
