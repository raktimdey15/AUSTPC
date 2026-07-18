import { Link } from "react-router-dom";

interface PrimaryButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function PrimaryButton({ to, children, className = "" }: PrimaryButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-full border border-[#00FF66]/40 bg-[#00FF66] px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#00ff74] ${className}`}
    >
      {children}
    </Link>
  );
}
