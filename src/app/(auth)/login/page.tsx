import { redirect } from "next/navigation";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { getAuthState } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<{ registered?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const { isAdmin, isLoggedIn } = await getAuthState();
  if (isAdmin) redirect("/");
  if (isLoggedIn) redirect("/ingen-admin");

  const urlOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <LoginForm
      configError={!urlOk}
      registered={q.registered === "1"}
      errorParam={q.error}
    />
  );
}
