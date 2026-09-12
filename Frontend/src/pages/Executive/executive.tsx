import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";
import OrgChart from "../../components/Executive/OrgChart";

export default function Executive() {
  const { content } = useSiteContent();
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-16 overflow-hidden">
      <PageHero
        eyebrow={content.executivePage.eyebrow}
        title={content.executivePage.title}
        description={content.executivePage.description}
      />

      <section className="w-full">
        {content.executiveMembers.length > 0 ? (
          <OrgChart members={content.executiveMembers} />
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <p>No active executive panel currently.</p>
            <p className="mt-2 text-sm">Check the Hall of Fame for past panels.</p>
          </div>
        )}
      </section>
    </div>
  );
}
