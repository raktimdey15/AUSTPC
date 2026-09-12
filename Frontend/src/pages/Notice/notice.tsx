import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function NoticePage() {
  const { content } = useSiteContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.noticePage.eyebrow}
        title={content.noticePage.title}
        description={content.noticePage.description}
      />

      <section className="grid gap-6 text-center lg:grid-cols-2">
        {content.notices.map((notice) => (
          <div key={notice.title} className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-6">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <h2 className="text-xl font-semibold text-white">{notice.title}</h2>
              <span className="rounded-full border border-[#00FF66]/30 px-3 py-1 text-sm text-[#00FF66]">{notice.date}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{notice.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 px-3 py-2">{notice.attachment}</span>
              <button className="text-[#00FF66] transition hover:text-[#00ff74]">Read More</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
