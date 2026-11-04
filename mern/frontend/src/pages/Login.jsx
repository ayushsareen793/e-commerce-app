import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from || (user.role === "admin" ? "/admin" : "/")} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (!form.password) return setError("Enter your password.");
    setLoading(true);
    setError("");
    try {
      const u = await login(form.email, form.password);
      navigate(from || (u.role === "admin" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue shopping.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <ErrorMessage message={error} />
        <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Logging in..." : "Log in"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">New here? <Link to="/register" state={{ from }} className="font-semibold text-brand">Create an account</Link></p>
    </AuthCard>
  );
}
