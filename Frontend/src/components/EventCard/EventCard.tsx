import { Link } from "react-router-dom";

interface EventCardProps {
  title: string;
  category: string;
  description: string;
  date: string;
  venue: string;
  image: string;
  slug: string;
}

export default function EventCard({ title, category, description, date, venue, image, slug }: EventCardProps) {
  return (
    <Link to={`/events/${slug}`} className="group overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40">
      <img src={image} alt={title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{category}</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
        <div className="mt-5 space-y-1 text-sm text-zinc-300">
          <p>{date}</p>
          <p>{venue}</p>
        </div>
      </div>
    </Link>
  );
}
