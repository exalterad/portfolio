import { redirect } from "next/navigation";

import { ProjectWizard } from "@/components/admin/project-wizard";
import { getAuthState } from "@/lib/admin-auth";
import { createEmptyProject } from "@/lib/project-draft";
import { getDisplayProjects } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";

export const dynamic = "force-dynamic";

export default async function AdminNewProjectPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const projects = await getDisplayProjects();
  return (
    <ProjectWizard
      mode="create"
      projects={projects}
      supabaseConfigured={isSupabaseConfigured()}
      initialProject={createEmptyProject()}
    />
  );
}
