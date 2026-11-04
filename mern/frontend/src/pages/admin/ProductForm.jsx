import { useState } from "react";
import { X } from "lucide-react";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import { CATEGORIES } from "../../utils/format.js";

const empty = { name: "", description: "", price: "", image: "", category: CATEGORIES[0], stock: "" };

export default function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState(product ? { ...product } : empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Name is required.");
    if (form.description.trim().length < 10) return setError("Description must be at least 10 characters.");
    if (!(Number(form.price) >= 0) || form.price === "") return setError("Enter a valid price.");
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) return setError("Stock must be a whole number.");
    if (!/^https?:\/\//.test(form.image)) return setError("Image must be a valid URL.");
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <form onSubmit={submit} noValidate onClick={(e) => e.stopPropagation()} className="card max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto p-6">
        <div className="flex items-center justify-between"><h3 className="heading text-xl">{product ? "Edit product" : "Add product"}</h3><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <div><label className="label">Name</label><input className="input" value={form.name} onChange={set("name")} /></div>
        <div><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={set("description")} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Price (USD)</label><input type="number" min="0" step="0.01" className="input" value={form.price} onChange={set("price")} /></div>
          <div><label className="label">Stock</label><input type="number" min="0" className="input" value={form.stock} onChange={set("stock")} /></div>
        </div>
        <div><label className="label">Category</label><select className="input" value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Image URL</label><input className="input" value={form.image} onChange={set("image")} placeholder="https://..." /></div>
        {form.image && /^https?:\/\//.test(form.image) && <img src={form.image} alt="" className="h-28 w-28 rounded-xl object-cover" />}
        <ErrorMessage message={error} />
        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="btn-outline">Cancel</button><button disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save product"}</button></div>
      </form>
    </div>
  );
}
