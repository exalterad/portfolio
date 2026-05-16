import { redirect } from "next/navigation";

import { ExperienceEditor } from "@/components/admin/experience-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayExperience } from "@/lib/experience";
import { isExperienceStorageConfigured } from "@/lib/experience-store";

export const dynamic = "force-dynamic";

export default async function AdminEditExperiencePage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const experience = await getDisplayExperience();

  return <ExperienceEditor initial={experience} supabaseConfigured={isExperienceStorageConfigured()} />;
}
