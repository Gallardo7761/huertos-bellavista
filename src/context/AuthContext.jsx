// AuthContext adaptado al nuevo modelo con data.token y data.member
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useConfig } from "../hooks/useConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { config } = useConfig();
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(sessionStorage.getItem("user"));
    return stored || null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [authStatus, setAuthStatus] = useState("checking"); // 'checking' | 'authenticated' | 'unauthenticated'
  const [error, setError] = useState(null);

  const login = async (formData) => {
    setError(null);
    try {
      const response = await axios.post(`${BASE}${LOGIN_ENDPOINT}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, member, tokenTime } = response.data.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(member));
      sessionStorage.setItem("tokenTime", tokenTime);

      setToken(token);
      setUser(member);
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
        const response = await axios.get(`${BASE}${VALIDATE_TOKEN_ENDPOINT}`);
        if (response.status === 200) {
          setAuthStatus("authenticated");
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!config) return null;

  const BASE = config.apiConfig.baseUrl;
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
