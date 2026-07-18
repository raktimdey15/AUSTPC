import { useParams } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import EventCard from "../../components/EventCard/EventCard";
import { useSiteContent } from "../../context/ContentContext";

export default function Events() {
  const { content } = useSiteContent();
  const { slug } = useParams();
  const event = content.allEvents.find((item) => item.slug === slug);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Events"
        title={event ? event.title : content.eventsPage.title}
        description={event ? event.longDescription : content.eventsPage.description}
      />

      {event ? (
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
          <img src={event.image} alt={event.title} className="h-72 w-full rounded-[24px] object-cover" />
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{event.category}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{event.title}</h2>
            <p className="mt-4 text-base leading-8 text-zinc-400">{event.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 px-4 py-2">{event.date}</span>
              <span className="rounded-full border border-white/10 px-4 py-2">{event.venue}</span>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        {content.allEvents.map((eventItem) => (
          <EventCard key={eventItem.slug} {...eventItem} />
        ))}
      </section>
    </div>
  );
}
