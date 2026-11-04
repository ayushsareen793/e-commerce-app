import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Rating from "./Rating.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock < 1;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5">
      <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-sand">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="badge absolute left-3 top-3 bg-surface/90">{product.category}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product._id}`} className="font-semibold leading-snug hover:text-brand">{product.name}</Link>
        <div className="mt-1.5"><Rating value={product.averageRating} count={product.numReviews} /></div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <button onClick={() => addToCart(product)} disabled={outOfStock} className="btn-primary px-4 py-2">
            <ShoppingBag size={15} /> {outOfStock ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
