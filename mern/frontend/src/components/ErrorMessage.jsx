export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
      {message}
      {onRetry && <button onClick={onRetry} className="ml-3 font-semibold underline">Try again</button>}
    </div>
  );
}
