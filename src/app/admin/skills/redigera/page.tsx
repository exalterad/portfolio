import { redirect } from "next/navigation";

import { SkillsEditor } from "@/components/admin/skills-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplaySkills, isSkillsStorageConfigured } from "@/lib/skills";

export const dynamic = "force-dynamic";

export default async function AdminEditSkillsPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const skills = await getDisplaySkills();

  return <SkillsEditor initial={skills} supabaseConfigured={isSkillsStorageConfigured()} />;
}
