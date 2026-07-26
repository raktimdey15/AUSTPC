import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function About() {
  const { content } = useSiteContent();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero eyebrow={content.about.eyebrow} title={content.about.title} description={content.about.description} />

      <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8 text-zinc-300">
        <p className="max-w-3xl text-lg leading-8">{content.about.description}</p>
      </section>
    </div>
  );
}