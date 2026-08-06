interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = true,
}: SectionTitleProps) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00FF66]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}
