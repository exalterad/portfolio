import { redirect } from "next/navigation";

import { SetupEditor } from "@/components/admin/setup-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplaySetup, isSetupStorageConfigured } from "@/lib/setup";

export const dynamic = "force-dynamic";

export default async function AdminEditSetupPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const setup = await getDisplaySetup();

  return <SetupEditor initial={setup} supabaseConfigured={isSetupStorageConfigured()} />;
}
