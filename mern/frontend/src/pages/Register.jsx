import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

const validate = (f) => {
  if (f.name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address.";
  if (f.password.length < 6) return "Password must be at least 6 characters.";
  if (f.password !== f.confirm) return "Passwords do not match.";
  return "";
};

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from || "/"} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    if (v) return setError(v);
    setLoading(true);
    setError("");
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate(from || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Join LOCAL STORE in under a minute.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div><label className="label" htmlFor="name">Name</label><input id="name" className="input" value={form.name} onChange={set("name")} /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" value={form.email} onChange={set("email")} /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" className="input" value={form.password} onChange={set("password")} /></div>
        <div><label className="label" htmlFor="confirm">Confirm password</label><input id="confirm" type="password" className="input" value={form.confirm} onChange={set("confirm")} /></div>
        <ErrorMessage message={error} />
        <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Creating account..." : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" state={{ from }} className="font-semibold text-brand">Log in</Link></p>
    </AuthCard>
  );
}
