import PageHero from "../../components/Common/PageHero";
import { subExecutiveMembers } from "../../data/siteContent";

export default function SubExecutive() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Sub Executive Panel"
        title="Dedicated contributors driving every initiative"
        description="The sub-executive team supports the club’s programming with energy, specialized skills, and consistent execution."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {subExecutiveMembers.map((member) => (
          <div key={member.name} className="rounded-[24px] border border-white/10 bg-zinc-900/80 p-4">
            <img src={member.photo} alt={member.name} className="h-48 w-full rounded-[20px] object-cover" />
            <h2 className="mt-4 text-lg font-semibold text-white">{member.name}</h2>
            <p className="mt-2 text-sm text-[#00FF66]">{member.position}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
