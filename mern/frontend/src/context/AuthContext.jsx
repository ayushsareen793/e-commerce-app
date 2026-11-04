import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/storeService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On first load, validate the saved token with the backend.
  useEffect(() => {
    if (!localStorage.getItem("ls_token")) return setReady(true);
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("ls_token"))
      .finally(() => setReady(true));
  }, []);

  const saveSession = ({ user, token }) => {
    localStorage.setItem("ls_token", token);
    setUser(user);
    return user;
  };

  const login = async (email, password) => saveSession(await authApi.login({ email, password }));
  const register = async (name, email, password) => saveSession(await authApi.register({ name, email, password }));
  const logout = () => {
    localStorage.removeItem("ls_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin: user?.role === "admin", login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
