import PageHero from "../../components/Common/PageHero";

const cards = [
  "Members",
  "Executive Panel",
  "Hall of Fame",
  "Events",
  "Gallery",
  "Notice",
  "Upcoming Events",
  "Recruitment Toggle",
];

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Admin"
        title="Control the club management system"
        description="The admin dashboard is designed as the operations hub for members, events, notices, recruitment, and content publishing."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card} className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-6">
            <h2 className="text-lg font-semibold text-white">{card}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">Manage and optimize this section from a central dashboard experience.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
