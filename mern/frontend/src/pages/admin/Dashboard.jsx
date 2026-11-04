import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import useFetch from "../../hooks/useFetch.js";
import { adminApi } from "../../services/storeService.js";
import { formatDate, formatPrice } from "../../utils/format.js";

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(() => adminApi.stats(), []);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const cards = [
    { label: "Total products", value: data.totalProducts, icon: Package },
    { label: "Total orders", value: data.totalOrders, icon: ShoppingCart },
    { label: "Total customers", value: data.totalCustomers, icon: Users },
    { label: "Total sales", value: formatPrice(data.totalSales), icon: DollarSign },
  ];

  return (
    <div>
      <h2 className="heading text-3xl">Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between text-sm text-muted">{label}<span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand"><Icon size={17} /></span></div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between p-5"><h3 className="font-semibold">Recent orders</h3><Link to="/admin/orders" className="text-sm font-semibold text-brand">View all</Link></div>
        {data.recentOrders.length === 0 ? <p className="px-5 pb-6 text-sm text-muted">No orders yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/60 text-xs uppercase text-muted"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.recentOrders.map((o) => (
                  <tr key={o._id}><td className="px-5 py-3 font-mono">#{o._id.slice(-8).toUpperCase()}</td><td className="px-5 py-3">{o.user?.name || "Deleted user"}</td><td className="px-5 py-3">{formatDate(o.createdAt)}</td><td className="px-5 py-3 font-semibold">{formatPrice(o.totalAmount)}</td><td className="px-5 py-3"><StatusBadge status={o.status} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
