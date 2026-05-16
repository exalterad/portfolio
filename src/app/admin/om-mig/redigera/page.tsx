import { redirect } from "next/navigation";

import { AboutEditor } from "@/components/admin/about-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayAbout } from "@/lib/about";
import { isAboutStorageConfigured } from "@/lib/about-store";

export const dynamic = "force-dynamic";

export default async function AdminEditAboutPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const about = await getDisplayAbout();

  return <AboutEditor initial={about} supabaseConfigured={isAboutStorageConfigured()} />;
}
