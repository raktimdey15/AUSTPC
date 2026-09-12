import { supabase } from "../lib/supabase";
import type { AuthError, Session } from "@supabase/supabase-js";

export interface AuthResult {
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign in an admin user with email and password via Supabase Auth.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, error };
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get the current session (may be null if not authenticated).
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (session: Session | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

/**
 * Check whether a given Supabase auth user ID is in the admin_users table.
 * This is a lightweight check — RLS on the table also enforces this on the DB side.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[authService] isAdminUser check failed:", error.message);
    return false;
  }
  return data !== null;
}
