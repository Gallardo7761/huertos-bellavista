// AuthContext adaptado al nuevo modelo con data.token y data.member
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useConfig } from "../hooks/useConfig";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { config } = useConfig();

  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored || null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authStatus, setAuthStatus] = useState("checking");
  const [error, setError] = useState(null);

  const BASE_URL = config?.apiConfig.baseUrl;
  const LOGIN_ENDPOINT = config?.apiConfig.endpoints.auth.login;
  const VALIDATE_TOKEN_ENDPOINT = config?.apiConfig.endpoints.auth.validateToken;
  const LOGIN_URL = `${BASE_URL}${LOGIN_ENDPOINT}`;
  const VALIDATE_TOKEN_URL = `${BASE_URL}${VALIDATE_TOKEN_ENDPOINT}`;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(VALIDATE_TOKEN_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
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
  }, [token, config, VALIDATE_TOKEN_URL]);

  const login = async (formData) => {
    setError(null);
    try {
      const response = await axios.post(LOGIN_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, member, tokenTime } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(member));
      localStorage.setItem("tokenTime", tokenTime);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(member);
      setAuthStatus("authenticated");
    } catch (err) {
      setError(err.response?.data?.message || "Error de login");
      throw err;
    }
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
