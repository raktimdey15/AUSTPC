import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import type { Member } from "../../data/siteContent";

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-[200px] group">
      {/* Circular Profile Photo */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 mb-2 md:mb-3 transition-transform duration-500 group-hover:scale-105">
        <img
          src={member.photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=500&q=80"}
          alt={member.name}
          className="w-full h-full object-cover rounded-full bg-zinc-800 border-2 border-zinc-700/50"
        />
      </div>

      {/* Text Info */}
      <h2 className="text-sm md:text-base font-semibold text-zinc-100 mb-0.5 leading-tight">{member.name}</h2>
      <p className="text-[15px] font-medium text-zinc-400 mb-0.5 leading-tight">{member.position}</p>

      {member.department && (
        <p className="text-[10px] text-zinc-500 mb-2 leading-tight">{member.department}</p>
      )}

      {/* Spacer if no department */}
      {!member.department && <div className="h-4" />}

      {/* Social Icons */}
      <div className="flex items-center gap-2.5 mt-1">
        {member.facebook && (
          <a
            href={member.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1877F2] hover:opacity-80 transition-opacity"
            aria-label={`${member.name} Facebook`}
          >
            <FaFacebookF size={12} />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077b5] hover:opacity-80 transition-opacity"
            aria-label={`${member.name} LinkedIn`}
          >
            <FaLinkedinIn size={12} />
          </a>
        )}
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E1306C] hover:opacity-80 transition-opacity"
            aria-label={`${member.name} Instagram`}
          >
            <FaInstagram size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
