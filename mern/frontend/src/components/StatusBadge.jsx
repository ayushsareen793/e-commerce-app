const styles = {
  Pending: "bg-sand text-ink",
  Processing: "bg-star/15 text-ink",
  Shipped: "bg-brand-soft text-brand",
  Delivered: "bg-brand text-bg",
  Cancelled: "bg-danger/10 text-danger",
};

export default function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || styles.Pending}`}>{status}</span>;
}
