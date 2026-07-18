import PageHero from "../../components/Common/PageHero";

export default function JoinPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Join AUSTPC"
        title="Apply to become a part of the club"
        description="Fill in your details and share your interests so the club can welcome you into its next chapter."
      />

      <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Department</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Semester</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Phone</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Skills</label>
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
            </div>
          </div>
        </div>
        <button className="mt-8 rounded-full border border-[#00FF66]/40 bg-[#00FF66] px-6 py-3 text-sm font-semibold text-black">
          Submit Application
        </button>
      </section>
    </div>
  );
}
