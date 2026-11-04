import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Loader from "../../components/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import ProductForm from "./ProductForm.jsx";
import useFetch from "../../hooks/useFetch.js";
import { productApi } from "../../services/storeService.js";
import { getErrorMessage } from "../../services/api.js";
import { CATEGORIES, formatPrice } from "../../utils/format.js";

export default function AdminProducts() {
  const { data: products, setData, loading, error, reload } = useFetch(() => productApi.list(), []);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [actionError, setActionError] = useState("");

  const save = async (form) => {
    try {
      if (editing._id) {
        const updated = await productApi.update(editing._id, form);
        setData(products.map((p) => (p._id === updated._id ? updated : p)));
      } else {
        const created = await productApi.create(form);
        setData([created, ...products]);
      }
      setEditing(null);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await productApi.remove(p._id);
      setData(products.filter((x) => x._id !== p._id));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const updateStock = async (p, value) => {
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0 || stock === p.stock) return;
    try {
      const updated = await productApi.update(p._id, { stock });
      setData(products.map((x) => (x._id === updated._id ? updated : x)));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const visible = products.filter((p) => (!category || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="heading text-3xl">Products</h2>
        <button onClick={() => setEditing({})} className="btn-primary"><Plus size={16} /> Add product</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="input pl-10" /></div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto"><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <div className="mt-4"><ErrorMessage message={actionError} /></div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase text-muted"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Rating</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {visible.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="font-medium">{p.name}</span></div></td>
                <td className="px-5 py-3"><span className="badge">{p.category}</span></td>
                <td className="px-5 py-3">{formatPrice(p.price)}</td>
                <td className="px-5 py-3"><input type="number" min="0" defaultValue={p.stock} key={p.stock} onBlur={(e) => updateStock(p, e.target.value)} className={`input w-20 py-1.5 ${p.stock === 0 ? "border-danger" : ""}`} aria-label="Stock" /></td>
                <td className="px-5 py-3">{p.numReviews ? `${p.averageRating.toFixed(1)} (${p.numReviews})` : "–"}</td>
                <td className="px-5 py-3"><div className="flex justify-end gap-1"><button onClick={() => setEditing(p)} className="btn-ghost px-2.5" aria-label="Edit"><Pencil size={15} /></button><button onClick={() => remove(p)} className="btn-ghost px-2.5 text-danger" aria-label="Delete"><Trash2 size={15} /></button></div></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No products match.</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && <ProductForm product={editing._id ? editing : null} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
