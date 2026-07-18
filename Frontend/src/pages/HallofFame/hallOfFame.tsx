import { Link } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import { hallOfFameSemesters } from "../../data/siteContent";

export default function HallOfFame() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Hall of Fame"
        title="Semesters preserved as milestones of excellence"
        description="Each semester page highlights the leadership, projects, and achievements that marked that chapter of the club."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hallOfFameSemesters.map((semester) => (
          <Link key={semester.slug} to={`/hall-of-fame/${semester.slug}`} className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-6 transition hover:-translate-y-1 hover:border-[#00FF66]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{semester.year}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{semester.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{semester.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
