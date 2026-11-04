import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/format.js";

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  return (
    <div className="container-x py-10">
      <h1 className="heading text-4xl">Profile</h1>
      <div className="card mt-8 max-w-lg p-8">
        <dl className="space-y-4 text-sm">
          <div><dt className="text-muted">Name</dt><dd className="font-semibold">{user.name}</dd></div>
          <div><dt className="text-muted">Email</dt><dd className="font-semibold">{user.email}</dd></div>
          <div><dt className="text-muted">Role</dt><dd className="font-semibold capitalize">{user.role}</dd></div>
          {user.createdAt && <div><dt className="text-muted">Member since</dt><dd className="font-semibold">{formatDate(user.createdAt)}</dd></div>}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/my-orders" className="btn-primary">My Orders</Link>
          {isAdmin && <Link to="/admin" className="btn-outline">Admin dashboard</Link>}
          <button onClick={logout} className="btn-ghost text-danger">Log out</button>
        </div>
      </div>
    </div>
  );
}
