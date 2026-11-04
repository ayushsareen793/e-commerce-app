import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Check, Star } from "lucide-react";
import Rating from "../components/Rating.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import useFetch from "../hooks/useFetch.js";
import { productApi, reviewApi } from "../services/storeService.js";
import { getErrorMessage } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate, formatPrice } from "../utils/format.js";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = useFetch(() => productApi.get(id), [id]);
  const reviews = useFetch(() => reviewApi.list(id), [id]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.loading) return <Loader full />;
  if (product.error) return <div className="container-x py-16"><ErrorMessage message={product.error} /></div>;
  const p = product.data;

  const handleAdd = () => {
    addToCart(p, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onReviewAdded = async () => {
    await Promise.all([reviews.reload(), product.reload()]);
  };

  return (
    <div className="container-x py-10">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={15} /> Back to shop</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-sand">
          <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="badge w-fit">{p.category}</span>
          <h1 className="heading mt-4 text-4xl">{p.name}</h1>
          <div className="mt-3"><Rating value={p.averageRating} count={p.numReviews} size={16} /></div>
          <p className="mt-6 text-3xl font-bold">{formatPrice(p.price)}</p>
          <p className="mt-6 leading-relaxed text-muted">{p.description}</p>
          <p className={`mt-6 text-sm font-medium ${p.stock > 0 ? "text-brand" : "text-danger"}`}>
            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
          </p>
          {p.stock > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <QuantitySelector value={qty} onChange={setQty} max={p.stock} />
              <button onClick={handleAdd} className="btn-primary px-8 py-3">
                {added ? <><Check size={16} /> Added to cart</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>
            </div>
          )}
          <p className="mt-8 border-t border-line pt-6 text-sm text-muted">Cash on Delivery available · Free local delivery</p>
        </div>
      </div>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="heading text-2xl">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted">
            <span className="text-3xl font-bold text-ink">{p.numReviews ? p.averageRating.toFixed(1) : "–"}</span>
            <div><Rating value={p.averageRating} size={16} /><span>{p.numReviews} review{p.numReviews === 1 ? "" : "s"}</span></div>
          </div>
          <div className="mt-6 space-y-4">
            {reviews.loading ? <Loader /> : reviews.error ? <ErrorMessage message={reviews.error} /> : reviews.data.length === 0 ? (
              <p className="card p-6 text-sm text-muted">No reviews yet. Be the first to share your thoughts.</p>
            ) : reviews.data.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.user?.name || "Customer"}</span>
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-1.5"><Rating value={r.rating} /></div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <ReviewForm productId={p._id} reviews={reviews.data || []} onAdded={onReviewAdded} />
      </section>
    </div>
  );
}

function ReviewForm({ productId, reviews, onAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="card h-fit p-6">
        <h3 className="font-semibold">Write a review</h3>
        <p className="mt-2 text-sm text-muted">Please log in to share your experience.</p>
        <Link to="/login" state={{ from: `/product/${productId}` }} className="btn-primary mt-4">Log in to review</Link>
      </div>
    );
  }
  if (reviews.some((r) => r.user?._id === user._id)) {
    return <div className="card h-fit p-6 text-sm text-muted">Thanks — you have already reviewed this product.</div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    if (comment.trim().length < 3) return setError("Please write a short comment.");
    setSaving(true);
    setError("");
    try {
      await reviewApi.create(productId, { rating, comment });
      setRating(0);
      setComment("");
      await onAdded();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card h-fit space-y-4 p-6">
      <h3 className="font-semibold">Write a review</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star size={26} className={n <= rating ? "fill-star text-star" : "text-line"} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={500} placeholder="What did you like or dislike?" className="input" />
      <ErrorMessage message={error} />
      <button disabled={saving} className="btn-primary w-full">{saving ? "Submitting..." : "Submit review"}</button>
    </form>
  );
}
