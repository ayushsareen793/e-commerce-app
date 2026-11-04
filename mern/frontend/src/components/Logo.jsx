import { Link } from "react-router-dom";

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg font-semibold text-bg">L</span>
      <span className="text-[15px] font-bold tracking-[0.18em]">LOCAL STORE</span>
    </Link>
  );
}
