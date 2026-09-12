interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/80 p-8 text-center sm:p-10 lg:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00FF66]">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-400">{description}</p>
    </section>
  );
}
