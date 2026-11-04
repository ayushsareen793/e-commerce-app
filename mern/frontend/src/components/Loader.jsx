export default function Loader({ full = false, label = "Loading..." }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-sm text-muted ${full ? "min-h-[60vh]" : "py-16"}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  );
}
