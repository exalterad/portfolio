import { redirect } from "next/navigation";

import { ProjectsEditor } from "@/components/admin/projects-editor";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayProjects } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";

export const dynamic = "force-dynamic";

export default async function AdminEditProjectsPage() {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const projects = await getDisplayProjects();

  return <ProjectsEditor projects={projects} supabaseConfigured={isSupabaseConfigured()} />;
}
