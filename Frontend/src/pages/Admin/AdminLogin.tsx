import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, session, isAdmin, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard immediately
  if (!authLoading && session && isAdmin) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const authError = await signIn(email, password);

      if (authError) {
        if (
          authError.message.toLowerCase().includes("invalid") ||
          authError.message.toLowerCase().includes("credentials")
        ) {
          setError("Unauthorized access. Invalid email or password.");
        } else {
          setError("Login failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // After signIn succeeds, isAdmin is checked in AuthContext.
      // Wait briefly for the admin check, then redirect.
      // The AdminRoute will handle the redirect if isAdmin is false.
      navigate("/admin/dashboard");
    } catch (loginError) {
      console.error("Admin login failed:", loginError);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full text-center">
        <PageHero
          eyebrow="Restricted Access"
          title="Admin Control Panel"
          description="AUSTPC core content management. Enter your secure credentials to proceed."
        />
      </div>

      <section className="w-full max-w-md rounded-[32px] border border-white/10 bg-zinc-900/90 p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            <span>Admin Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              autoComplete="email"
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
              placeholder="admin@austpc.org"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            <span>Security Key</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="mt-2 flex items-center justify-center rounded-full bg-[#00FF66] px-4 py-3.5 text-sm font-bold text-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {isLoading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </section>
    </div>
  );
}