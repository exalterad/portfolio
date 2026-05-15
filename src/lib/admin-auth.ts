import type { NavSessionUser } from "@/lib/auth-types";
import { createSupabaseSessionClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

function navSessionUserFromAuthUser(user: User): NavSessionUser {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const avatarUrl =
    (typeof meta?.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta?.picture === "string" && meta.picture) ||
    null;
  const displayName =
    (typeof meta?.full_name === "string" && meta.full_name) ||
    (typeof meta?.name === "string" && meta.name) ||
    null;
  return {
    email: user.email ?? null,
    displayName,
    avatarUrl,
  };
}

export async function getAuthUser() {
  try {
    const supabase = await createSupabaseSessionClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getProfileRole(userId: string): Promise<string | null> {
  try {
    const supabase = await createSupabaseSessionClient();
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    if (error || !data) return null;
    return data.role;
  } catch {
    return null;
  }
}

export async function getAuthState(): Promise<{
  isLoggedIn: boolean;
  isAdmin: boolean;
  navUser: NavSessionUser | null;
}> {
  const user = await getAuthUser();
  if (!user) return { isLoggedIn: false, isAdmin: false, navUser: null };
  const role = await getProfileRole(user.id);
  return {
    isLoggedIn: true,
    isAdmin: role === "admin",
    navUser: navSessionUserFromAuthUser(user),
  };
}

/** Inloggad användare med roll `admin` i `profiles`. */
export async function isAdminFromSession(): Promise<boolean> {
  const { isAdmin } = await getAuthState();
  return isAdmin;
}
