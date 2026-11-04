import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, RotateCcw, PackageSearch } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useFetch from "../hooks/useFetch.js";
import { productApi } from "../services/storeService.js";
import { CATEGORIES } from "../utils/format.js";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  // Debounce the search box before updating the URL / querying the backend.
  useEffect(() => {
    const t = setTimeout(() => updateParam("search", searchInput.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data: products, loading, error, reload } = useFetch(
    () => productApi.list({ category: category || undefined, sort: sort || undefined, search: search || undefined }),
    [category, sort, search]
  );

  function updateParam(key, value) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });
  }

  const resetFilters = () => {
    setSearchInput("");
    setParams({}, { replace: true });
  };

  const hasFilters = category || sort || search;

  return (
    <div className="container-x py-10">
      <h1 className="heading text-4xl">Shop</h1>
      <p className="mt-2 text-muted">Browse everything in store.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products" className="input pl-10" />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Category</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {["", ...CATEGORIES].map((c) => (
                <button key={c || "all"} onClick={() => updateParam("category", c)}
                  className={`rounded-full px-4 py-2 text-left text-sm transition lg:rounded-xl ${category === c ? "bg-brand text-bg" : "bg-surface hover:bg-sand"}`}>
                  {c || "All products"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Sort by</h3>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input">
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          {hasFilters && (
            <button onClick={resetFilters} className="btn-outline w-full"><RotateCcw size={15} /> Reset filters</button>
          )}
        </aside>

        <section>
          {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={reload} /> : products.length === 0 ? (
            <EmptyState icon={PackageSearch} title="No products found" text="Try a different search or category."
              action={<button onClick={resetFilters} className="btn-primary">Reset filters</button>} />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">{products.length} products</p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
