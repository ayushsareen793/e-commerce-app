import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import useFetch from "../hooks/useFetch.js";
import { orderApi } from "../services/storeService.js";
import { formatDate, formatPrice } from "../utils/format.js";

export default function MyOrders() {
  const { data: orders, loading, error, reload } = useFetch(() => orderApi.mine(), []);

  return (
    <div className="container-x py-10">
      <h1 className="heading text-4xl">My orders</h1>
      <div className="mt-8 space-y-4">
        {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={reload} /> : orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" text="When you place an order it will appear here." action={<Link to="/shop" className="btn-primary">Start shopping</Link>} />
        ) : orders.map((o) => (
          <div key={o._id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="font-mono text-sm font-semibold">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-muted">Placed {formatDate(o.createdAt)} · {o.paymentMethod}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={o.status} />
                <span className="font-bold">{formatPrice(o.totalAmount)}</span>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {o.products.map((p) => (
                <li key={p.product} className="flex items-center gap-3 text-sm">
                  <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <span className="flex-1">{p.name} <span className="text-muted">× {p.quantity}</span></span>
                  <span>{formatPrice(p.price * p.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
