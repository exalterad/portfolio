import { redirect } from "next/navigation";

import { RegisterForm } from "@/app/(auth)/register/register-form";
import { getAuthState } from "@/lib/admin-auth";

export default async function RegisterPage() {
  const { isLoggedIn } = await getAuthState();
  if (isLoggedIn) redirect("/");

  const urlOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return <RegisterForm configError={!urlOk} />;
}
