import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, updateCurrentUser } from "../api/authApi.js";
import { enterDemo } from "../api/demoApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [demoCommunity, setDemoCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload) {
    const data = await loginUser(payload);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await registerUser(payload);
    setUser(data.user);
    return data;
  }

  async function startDemo(mode = "member") {
    const data = await enterDemo(mode);
    setUser(data.user);
    setDemoCommunity(data.community);
    return data;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    setDemoCommunity(null);
  }

  async function updateProfile(payload) {
    const data = await updateCurrentUser(payload);
    setUser(data.user);
    return data;
  }

  const value = useMemo(
    () => ({ user, demoCommunity, isLoading, login, register, startDemo, logout, updateProfile }),
    [user, demoCommunity, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
