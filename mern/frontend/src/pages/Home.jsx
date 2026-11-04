import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Wallet, Truck, Headphones, Shirt, Sofa, Watch } from "lucide-react";
import hero from "../assets/hero.jpg";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { productApi } from "../services/storeService.js";

const categories = [
  { name: "Electronics", icon: Headphones, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { name: "Fashion", icon: Shirt, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80" },
  { name: "Home & Living", icon: Sofa, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80" },
  { name: "Accessories", icon: Watch, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80" },
];

const reasons = [
  { icon: BadgeCheck, title: "Quality products", text: "Every item is hand-picked and checked by our team before it reaches the shelf." },
  { icon: Wallet, title: "Affordable pricing", text: "Fair, local prices with no hidden fees. Pay in cash when your order arrives." },
  { icon: Truck, title: "Convenient shopping", text: "Browse online, order in minutes and get it delivered right to your doorstep." },
];

export default function Home() {
  const { data: products, loading, error, reload } = useFetch(() => productApi.list({ sort: "rating" }), []);

  return (
    <>
      <section className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="badge bg-brand-soft text-brand">New season, same neighbourhood store</span>
          <h1 className="heading mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">Everything You Need, All in One Place.</h1>
          <p className="mt-5 max-w-lg text-lg text-muted">Discover quality electronics, fashion, home essentials and accessories from your trusted local store — now just a click away.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary px-7 py-3">Shop Now <ArrowRight size={16} /></Link>
            <a href="#categories" className="btn-outline px-7 py-3">Browse categories</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img src={hero} alt="Curated products from LOCAL STORE" className="aspect-[5/4] w-full object-cover" />
        </div>
      </section>

      <section id="categories" className="container-x scroll-mt-20 py-12">
        <h2 className="heading text-3xl">Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map(({ name, icon: Icon, image }) => (
            <Link key={name} to={`/shop?category=${encodeURIComponent(name)}`} className="group relative overflow-hidden rounded-2xl">
              <img src={image} alt={name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-bg">
                <Icon size={18} /> <span className="font-semibold">{name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x py-12">
        <div className="flex items-end justify-between">
          <h2 className="heading text-3xl">Trending now</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">View all</Link>
        </div>
        <div className="mt-8">
          {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={reload} /> : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="container-x py-12">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-brand p-8 text-bg sm:p-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-bg/70">Limited offer</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">Free home delivery on every order this month.</h2>
            <p className="mt-3 text-bg/80">Pay with cash when it arrives. No cards, no fuss.</p>
          </div>
          <div className="md:text-right">
            <Link to="/shop" className="btn bg-bg px-7 py-3 text-brand hover:bg-sand">Start shopping <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="heading text-center text-3xl">Why shop with us</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={22} /></span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
