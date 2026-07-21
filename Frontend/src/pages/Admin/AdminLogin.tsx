import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";

// Phase 1 Secure Credentials
const VALID_USERNAME = "austpc_admin";
const VALID_PASSWORD = "Admin@2026!";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem("austpc_auth_token", "active");
      navigate("/admin/dashboard");
    } else {
      setError("Unauthorized access. Invalid username or password.");
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
            <span>Admin ID</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isLoading}
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
              placeholder="Enter username"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            <span>Security Key</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
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
            disabled={isLoading || !username || !password}
            className="mt-2 flex items-center justify-center rounded-full bg-[#00FF66] px-4 py-3.5 text-sm font-bold text-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {isLoading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </section>
    </div>
  );
}