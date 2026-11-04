import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Package } from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop", end: true },
  { to: "/#categories", label: "Categories" },
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-brand" : "text-muted hover:text-ink"}`;

  const handleLogout = () => {
    logout();
    setMenu(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.to.includes("#") ? (
              <a key={l.to} href={l.to} className="text-sm font-medium text-muted hover:text-ink">{l.label}</a>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
            )
          )}
        </nav>
        <div className="flex items-center gap-1">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="btn-ghost px-3" aria-label="Account menu">
                <User size={18} /> <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>
              {menu && (
                <div className="card absolute right-0 mt-2 w-52 p-1.5" onMouseLeave={() => setMenu(false)}>
                  <MenuLink to="/profile" icon={User} onClick={() => setMenu(false)}>Profile</MenuLink>
                  <MenuLink to="/my-orders" icon={Package} onClick={() => setMenu(false)}>My Orders</MenuLink>
                  {isAdmin && <MenuLink to="/admin" icon={LayoutDashboard} onClick={() => setMenu(false)}>Admin dashboard</MenuLink>}
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-sand">
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-ghost px-3"><User size={18} /> <span className="hidden sm:inline">Login</span></Link>
          )}
          <Link to="/cart" className="btn-ghost relative px-3" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-bg">{count}</span>
            )}
          </Link>
          <button className="btn-ghost px-3 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-x flex flex-col gap-3 border-t border-line py-4 md:hidden">
          {links.map((l) => (
            <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">{l.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-sand">
      <Icon size={16} /> {children}
    </Link>
  );
}
