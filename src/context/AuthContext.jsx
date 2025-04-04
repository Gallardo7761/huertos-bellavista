import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useConfig } from "../hooks/useConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = JSON.parse(sessionStorage.getItem("user"));
    const m = JSON.parse(sessionStorage.getItem("metadata"));
    return u && m ? { ...u, metadata: m } : u;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [authStatus, setAuthStatus] = useState("checking"); // 'checking' | 'authenticated' | 'unauthenticated'
  const [error, setError] = useState(null);

  const login = async (formData) => {
    setError(null);
    try {
      const response = await axios.post(`${BASE}:${HUERTOS_LOGIC_PORT}${LOGIN_ENDPOINT}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, member, tokenTime } = response.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(member.user));
      sessionStorage.setItem("metadata", JSON.stringify(member.metadata));
      sessionStorage.setItem("tokenTime", tokenTime);

      setToken(token);
      setUser({ ...member.user, metadata: member.metadata });
      setAuthStatus("authenticated");

      } catch (err) {
      setError(err.response?.data?.message || "Error de login");
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
    setToken(null);
    setAuthStatus("unauthenticated");
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const response = await axios.get(`${BASE}:${AUTH_LOGIC_PORT}${VALIDATE_TOKEN_ENDPOINT}`);
        if (response.status === 200) {
          setAuthStatus("authenticated");
        } else {
          logout();
          setAuthStatus("unauthenticated");
        }
      } catch {
        logout();
        setAuthStatus("unauthenticated");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const { config } = useConfig();
  if (!config) return null;

  const BASE = config.apiConfig.baseUrl;
  const HUERTOS_LOGIC_PORT = config.apiConfig.ports.huertos_logic;
  const AUTH_LOGIC_PORT = config.apiConfig.ports.auth_logic;
  const LOGIN_ENDPOINT = config.apiConfig.endpoints.auth.login;
  const VALIDATE_TOKEN_ENDPOINT = config.apiConfig.endpoints.auth.validateToken;

  return (
    <AuthContext.Provider value={{ user, token, authStatus, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
