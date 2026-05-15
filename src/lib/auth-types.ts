/** Session snapshot for nav / UI (serializable from server components). */
export type NavSessionUser = {
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};
