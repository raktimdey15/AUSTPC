import type { Member } from "../../data/siteContent";
import MemberCard from "./MemberCard";

export default function OrgChart({ members }: { members: Member[] }) {
  // Group members based on predefined hierarchy
  const advisorAndTreasurer = members.filter(
    (m) =>
      m.position.toLowerCase().includes("advisor") ||
      m.position.toLowerCase().includes("treasurer")
  );

  const president = members.filter(
    (m) =>
      m.position.toLowerCase().includes("president") &&
      !m.position.toLowerCase().includes("vice")
  );

  const vpAndGS = members
    .filter(
      (m) =>
        m.position.toLowerCase().includes("general secretary") ||
        m.position.toLowerCase().includes("vice president")
    )
    .sort((a, b) => {
      const aIsGS = a.position.toLowerCase().includes("general secretary");
      const bIsGS = b.position.toLowerCase().includes("general secretary");
      if (aIsGS && !bIsGS) return -1;
      if (!aIsGS && bIsGS) return 1;
      return 0;
    });

  const others = members.filter(
    (m) =>
      !advisorAndTreasurer.includes(m) &&
      !president.includes(m) &&
      !vpAndGS.includes(m)
  );

  return (
    <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto py-8">

      {/* Row 1: Advisor & Treasurer */}
      {advisorAndTreasurer.length > 0 && (
        <div className="flex flex-wrap justify-center gap-16 md:gap-48 w-full">
          {advisorAndTreasurer.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}

      {/* Row 2: President */}
      {president.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 w-full mt-8 md:mt-12">
          {president.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}

      {/* Row 3: VP & GS */}
      {vpAndGS.length > 0 && (
        <div className="flex flex-wrap justify-center gap-16 md:gap-40 w-full mt-8 md:mt-12">
          {vpAndGS.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}

      {/* Row 4: Others */}
      {others.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 w-full mt-10 md:mt-16 place-items-center">
          {others.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      )}

    </div>
  );
}
