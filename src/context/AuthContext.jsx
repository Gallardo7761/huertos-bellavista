import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useConfig } from "../hooks/useConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { config } = useConfig();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authStatus, setAuthStatus] = useState("checking");
  const [error, setError] = useState(null);

  const BASE_URL = config?.apiConfig.baseUrl;
  const LOGIN_URL = `${BASE_URL}${config?.apiConfig.endpoints.auth.login}`;
  const VALIDATE_URL = `${BASE_URL}${config?.apiConfig.endpoints.auth.validateToken}`;

  useEffect(() => {
    if (!token || !VALIDATE_URL) return;
    const checkAuth = async () => {
      try {
        const res = await axios.get(VALIDATE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setAuthStatus("authenticated");
        else logout();
      } catch {
        logout();
      }
    };
    checkAuth();
  }, [token, VALIDATE_URL]);

  const login = async (formData) => {
    setError(null);
    const res = await axios.post(LOGIN_URL, formData);
    const { token, member, tokenTime } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(member));
    localStorage.setItem("tokenTime", tokenTime);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setToken(token);
    setUser(member);
    setAuthStatus("authenticated");
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.clear();
    setUser(null);
    setToken(null);
    setAuthStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, token, authStatus, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};