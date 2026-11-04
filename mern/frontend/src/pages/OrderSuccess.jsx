import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "../utils/format.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useLocation().state?.order;

  return (
    <div className="container-x py-16">
      <div className="card mx-auto max-w-lg p-10 text-center">
        <CheckCircle2 size={56} className="mx-auto text-brand" />
        <h1 className="heading mt-5 text-3xl">Thank you for your order!</h1>
        <p className="mt-3 text-muted">Your order has been placed and will be paid by Cash on Delivery.</p>
        <p className="mt-6 text-sm">Order ID: <span className="font-mono font-semibold">#{id.slice(-8).toUpperCase()}</span></p>
        {order && <p className="mt-1 text-sm">Total: <span className="font-semibold">{formatPrice(order.totalAmount)}</span></p>}
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/my-orders" className="btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
