import { Link, useParams } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function HallOfFame() {
  const { content } = useSiteContent();
  const { slug } = useParams();
  const selectedSemester = content.hallOfFameSemesters.find((semester) => semester.slug === slug);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.hallOfFamePage.eyebrow}
        title={content.hallOfFamePage.title}
        description={content.hallOfFamePage.description}
      />

      {selectedSemester ? (
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8 text-center">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{selectedSemester.year}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{selectedSemester.title}</h2>
            </div>
            <Link to="/hall-of-fame" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300">
              Back to semesters
            </Link>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400 md:mx-0">{selectedSemester.description}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {selectedSemester.panelists.map((panelist) => (
              <div key={`${panelist.name}-${panelist.role}`} className="rounded-[24px] border border-white/10 bg-black/30 p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{panelist.role}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{panelist.name}</h3>
                {panelist.email ? <p className="mt-2 text-sm text-zinc-400">{panelist.email}</p> : null}
                {panelist.bio ? <p className="mt-4 text-sm leading-7 text-zinc-400">{panelist.bio}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-6 text-center md:grid-cols-2 xl:grid-cols-3">
          {content.hallOfFameSemesters.map((semester) => (
            <Link key={semester.slug} to={`/hall-of-fame/${semester.slug}`} className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-6 transition hover:-translate-y-1 hover:border-[#00FF66]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{semester.year}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{semester.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{semester.description}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
