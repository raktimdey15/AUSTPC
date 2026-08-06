import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function UpcomingEventsPage() {
  const { content } = useSiteContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.upcomingEventsPage.eyebrow}
        title={content.upcomingEventsPage.title}
        description={content.upcomingEventsPage.description}
      />

      <section className="grid gap-6 text-center lg:grid-cols-2">
        {content.upcomingEventsList.map((event) => (
          <div key={event.title} className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/80">
            <img src={event.poster} alt={event.title} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{event.description}</p>
              <div className="mt-4 space-y-1 text-sm text-zinc-300">
                <p>{event.date}</p>
                <p>{event.venue}</p>
              </div>
              <button className="mt-6 rounded-full border border-[#00FF66]/40 bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
