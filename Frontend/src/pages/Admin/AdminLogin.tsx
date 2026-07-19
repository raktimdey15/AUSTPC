import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";

const VALID_USERNAME = "austpc";
const VALID_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem("austpc-admin-auth", "true");
      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid username or password. Please try again.");
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Admin Access"
        title="Sign in to manage the website"
        description="Only authorized admins can view and edit the club content, members, and applications."
      />

      <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span>Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button type="submit" className="rounded-full border border-[#00FF66]/30 bg-[#00FF66] px-4 py-3 text-sm font-semibold text-black">
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}
