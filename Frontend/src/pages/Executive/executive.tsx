import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function Executive() {
  const { content } = useSiteContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.executivePage.eyebrow}
        title={content.executivePage.title}
        description={content.executivePage.description}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {content.executiveMembers.map((member) => (
          <div key={member.name} className="overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900/80">
            <img src={member.photo} alt={member.name} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">{member.name}</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#00FF66]">{member.position}</p>
              <div className="mt-4 flex gap-3 text-sm text-zinc-400">
                <a href={member.facebook} className="transition hover:text-[#00FF66]">Facebook</a>
                <a href={member.linkedin} className="transition hover:text-[#00FF66]">LinkedIn</a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
