import Logo from "./Logo.jsx";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="container-x flex justify-center py-16">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <Logo />
        <h1 className="heading mt-8 text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
