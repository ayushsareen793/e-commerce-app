import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Banknote } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { orderApi } from "../services/storeService.js";
import { getErrorMessage } from "../services/api.js";
import { formatPrice } from "../utils/format.js";

const fields = [
  { name: "fullName", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "address", label: "Shipping address", type: "text", wide: true },
  { name: "city", label: "City", type: "text" },
  { name: "postalCode", label: "Postal code", type: "text" },
];

const validate = (f) => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
  if (!/^[0-9+\-\s()]{7,15}$/.test(f.phone)) e.phone = "Enter a valid phone number";
  if (f.address.trim().length < 5) e.address = "Enter your street address";
  if (f.city.trim().length < 2) e.city = "Enter your city";
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(f.postalCode)) e.postalCode = "Enter a valid postal code";
  return e;
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user.name, email: user.email, phone: "", address: "", city: "", postalCode: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0 && !placing) return <Navigate to="/cart" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setPlacing(true);
    setServerError("");
    try {
      const order = await orderApi.create({
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: form,
      });
      clearCart();
      navigate(`/order-success/${order._id}`, { replace: true, state: { order } });
    } catch (err) {
      setServerError(getErrorMessage(err));
      setPlacing(false);
    }
  };

  return (
    <div className="container-x py-10">
      <h1 className="heading text-4xl">Checkout</h1>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="card p-6 sm:p-8">
          <h2 className="font-semibold">Shipping details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="label">{f.label}</label>
                <input id={f.name} type={f.type} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="input" />
                {errors[f.name] && <p className="mt-1 text-xs text-danger">{errors[f.name]}</p>}
              </div>
            ))}
          </div>
          <h2 className="mt-8 font-semibold">Payment</h2>
          <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-brand bg-brand-soft p-4 text-sm">
            <Banknote className="text-brand" /> <div><p className="font-semibold">Cash on Delivery</p><p className="text-muted">Pay when your order arrives.</p></div>
          </div>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i._id} className="flex items-center gap-3 text-sm">
                <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1">{i.name} <span className="text-muted">× {i.quantity}</span></span>
                <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <div className="mt-4"><ErrorMessage message={serverError} /></div>
          <button disabled={placing} className="btn-primary mt-4 w-full py-3">{placing ? "Placing order..." : "Place Order"}</button>
        </aside>
      </form>
    </div>
  );
}
