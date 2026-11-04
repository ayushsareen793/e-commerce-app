import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const keyFor = (user) => `ls_cart_${user?._id || "guest"}`;
const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const { user, ready } = useAuth();
  const [items, setItems] = useState([]);
  const [loadedKey, setLoadedKey] = useState(null);

  // Each logged-in customer has their own saved cart; a guest cart is merged in on login.
  useEffect(() => {
    if (!ready) return;
    const key = keyFor(user);
    let next = read(key);
    if (user) {
      const guest = read(keyFor(null));
      guest.forEach((g) => {
        const found = next.find((i) => i._id === g._id);
        if (found) found.quantity = Math.min(found.quantity + g.quantity, g.stock);
        else next.push(g);
      });
      localStorage.removeItem(keyFor(null));
    }
    setItems(next);
    setLoadedKey(key);
  }, [user, ready]);

  useEffect(() => {
    if (loadedKey) localStorage.setItem(loadedKey, JSON.stringify(items));
  }, [items, loadedKey]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) => (i._id === product._id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i));
      }
      const { _id, name, price, image, stock, category } = product;
      return [...prev, { _id, name, price, image, stock, category, quantity: Math.min(quantity, stock) }];
    });
  };

  const updateQuantity = (id, quantity) =>
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)));
  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({ items, count, subtotal, total: subtotal, addToCart, updateQuantity, removeFromCart, clearCart }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
