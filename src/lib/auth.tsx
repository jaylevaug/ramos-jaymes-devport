import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ADMIN_USERNAME = "UG202500910";
const ADMIN_PASSWORD = "Lebron2006!";
const STORAGE_KEY = "portfolio.admin.session";

type AuthCtx = {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAdmin(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const login = (username: string, password: string) => {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  };

  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
