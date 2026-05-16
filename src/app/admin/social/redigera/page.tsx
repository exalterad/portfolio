import { redirect } from "next/navigation";

import { SocialEditor } from "@/components/admin/social-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplaySocial, isSocialStorageConfigured } from "@/lib/social";

export const dynamic = "force-dynamic";

export default async function AdminEditSocialPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const social = await getDisplaySocial();

  return <SocialEditor initial={social} supabaseConfigured={isSocialStorageConfigured()} />;
}
