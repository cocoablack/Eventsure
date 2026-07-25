import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, clearSession, TOKEN_KEY, USER_KEY } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const saveSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authApi.me().then(({ user: currentUser }) => {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      setUser(currentUser);
    }).catch(logout).finally(() => setLoading(false));
  }, [logout]);

  const value = useMemo(() => ({ user, loading, login: async (credentials) => {
    const session = await authApi.login(credentials); saveSession(session); return session.user;
  }, register: async (details) => {
    const session = await authApi.register(details); saveSession(session); return session.user;
  }, logout }), [loading, logout, saveSession, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};
