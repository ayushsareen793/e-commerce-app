import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Your neighbourhood store, online. Thoughtfully picked electronics, fashion, home goods and accessories — delivered to your door.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li><Link to="/shop" className="hover:text-ink">Shop</Link></li>
            <li><Link to="/cart" className="hover:text-ink">Cart</Link></li>
            <li><Link to="/my-orders" className="hover:text-ink">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li className="flex items-center gap-2"><MapPin size={15} /> 12 Market Street, Your City</li>
            <li className="flex items-center gap-2"><Phone size={15} /> +1 (555) 012-3456</li>
            <li className="flex items-center gap-2"><Mail size={15} /> hello@localstore.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} LOCAL STORE. All rights reserved.</div>
    </footer>
  );
}
