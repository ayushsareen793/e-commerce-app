import { Star } from "lucide-react";

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={size} className={n <= Math.round(value) ? "fill-star text-star" : "text-line"} />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-muted">{count > 0 ? `${Number(value).toFixed(1)} (${count})` : "No reviews"}</span>}
    </div>
  );
}
