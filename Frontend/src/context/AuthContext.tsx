import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthError, Session } from "@supabase/supabase-js";
import {
  signInWithEmail,
  signOut as authSignOut,
  onAuthStateChange,
  isAdminUser,
} from "../services/authService";

interface AuthContextValue {
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Subscribe to auth state changes (handles session restore on page refresh)
    const unsubscribe = onAuthStateChange(async (newSession) => {
      if (!isMounted) return;

      setSession(newSession);

      if (newSession?.user?.id) {
        const adminStatus = await isAdminUser(newSession.user.id);
        if (isMounted) setIsAdmin(adminStatus);
      } else {
        if (isMounted) setIsAdmin(false);
      }

      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthError | null> => {
    const { error, session: newSession } = await signInWithEmail(email, password);
    if (!error && newSession?.user?.id) {
      const adminStatus = await isAdminUser(newSession.user.id);
      setIsAdmin(adminStatus);
    }
    return error;
  };

  const signOut = async () => {
    await authSignOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
