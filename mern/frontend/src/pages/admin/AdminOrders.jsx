import { useState } from "react";
import { X } from "lucide-react";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import useFetch from "../../hooks/useFetch.js";
import { orderApi } from "../../services/storeService.js";
import { getErrorMessage } from "../../services/api.js";
import { ORDER_STATUSES, formatDate, formatPrice } from "../../utils/format.js";

export default function AdminOrders() {
  const [status, setStatus] = useState("");
  const { data: orders, setData, loading, error, reload } = useFetch(() => orderApi.all({ status: status || undefined }), [status]);
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState("");

  const changeStatus = async (order, next) => {
    if (next === "Cancelled" && !window.confirm("Cancel this order? Stock will be returned.")) return;
    try {
      const updated = await orderApi.setStatus(order._id, next);
      setData(orders.map((o) => (o._id === updated._id ? updated : o)));
      if (selected?._id === updated._id) setSelected(updated);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="heading text-3xl">Orders</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto"><option value="">All statuses</option>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="mt-4"><ErrorMessage message={actionError} /></div>
      {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={reload} /> : (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-sand/60 text-xs uppercase text-muted"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Items</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr></thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-5 py-3 font-mono">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">{o.user?.name || "Deleted user"}<div className="text-xs text-muted">{o.user?.email}</div></td>
                  <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3">{o.products.reduce((s, p) => s + p.quantity, 0)}</td>
                  <td className="px-5 py-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <select value={o.status} disabled={o.status === "Cancelled"} onChange={(e) => changeStatus(o, e.target.value)} className="input w-36 py-1.5">{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                  </td>
                  <td className="px-5 py-3 text-right"><button onClick={() => setSelected(o)} className="text-sm font-semibold text-brand">Details</button></td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setSelected(null)}>
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="heading text-xl">Order #{selected._id.slice(-8).toUpperCase()}</h3><button onClick={() => setSelected(null)} aria-label="Close"><X size={20} /></button></div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">{formatDate(selected.createdAt)} · {selected.paymentMethod} <StatusBadge status={selected.status} /></div>
            <h4 className="mt-6 text-sm font-semibold">Ship to</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted">{selected.shippingAddress.fullName}<br />{selected.shippingAddress.address}, {selected.shippingAddress.city} {selected.shippingAddress.postalCode}<br />{selected.shippingAddress.phone} · {selected.shippingAddress.email}</p>
            <h4 className="mt-6 text-sm font-semibold">Items</h4>
            <ul className="mt-2 space-y-3">{selected.products.map((p) => (<li key={p.product} className="flex items-center gap-3 text-sm"><img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1">{p.name} × {p.quantity}</span><span>{formatPrice(p.price * p.quantity)}</span></li>))}</ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-bold"><span>Total</span><span>{formatPrice(selected.totalAmount)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
