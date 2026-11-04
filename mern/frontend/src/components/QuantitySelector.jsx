import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange, max }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface">
      <button onClick={() => onChange(value - 1)} disabled={value <= 1} className="grid h-9 w-9 place-items-center disabled:opacity-30" aria-label="Decrease quantity"><Minus size={14} /></button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={value >= max} className="grid h-9 w-9 place-items-center disabled:opacity-30" aria-label="Increase quantity"><Plus size={14} /></button>
    </div>
  );
}
