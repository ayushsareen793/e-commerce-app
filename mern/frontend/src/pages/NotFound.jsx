import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="heading text-7xl text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <Link to="/" className="btn-primary mt-8">Go home</Link>
    </div>
  );
}
