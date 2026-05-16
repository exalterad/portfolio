import { notFound, redirect } from "next/navigation";

import { ProjectWizard } from "@/components/admin/project-wizard";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayProjects, getProjectBySlug } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminEditProjectPage({ params }: PageProps) {
  const { isAdmin } = await getAuthState();
  if (!isAdmin) redirect("/ingen-admin");

  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getDisplayProjects();
  return (
    <ProjectWizard
      mode="edit"
      projects={projects}
      supabaseConfigured={isSupabaseConfigured()}
      initialProject={project}
    />
  );
}
