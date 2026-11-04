import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

export default function Cart() {
  const { items, count, subtotal, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" text="Looks like you haven't added anything yet."
          action={<Link to="/shop" className="btn-primary">Continue Shopping</Link>} />
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="heading text-4xl">Your cart</h1>
      <p className="mt-2 text-muted">{count} item{count === 1 ? "" : "s"}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card divide-y divide-line">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${item._id}`} className="shrink-0">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/product/${item._id}`} className="font-semibold hover:text-brand">{item.name}</Link>
                    <p className="text-sm text-muted">{formatPrice(item.price)} each</p>
                  </div>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item._id, q)} max={item.stock} />
                  <button onClick={() => removeFromCart(item._id)} className="btn-ghost px-3 text-danger" aria-label="Remove"><Trash2 size={16} /> <span className="hidden sm:inline">Remove</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="card h-fit p-6">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>Free</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full py-3">Proceed to Checkout</button>
          <Link to="/shop" className="btn-ghost mt-2 w-full"><ArrowLeft size={15} /> Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}
