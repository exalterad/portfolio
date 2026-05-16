import { redirect } from "next/navigation";

import { RegisterForm } from "@/app/(auth)/register/register-form";
import { getAuthState } from "@/lib/admin-auth";

export default async function RegisterPage() {
  const { isAdmin, isLoggedIn } = await getAuthState();
  if (isAdmin) redirect("/");
  if (isLoggedIn) redirect("/ingen-admin");

  const urlOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <RegisterForm configError={!urlOk} />;
}
