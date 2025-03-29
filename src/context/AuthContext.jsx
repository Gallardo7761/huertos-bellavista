import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useConfig } from "../hooks/useConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);
  
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && event.newValue === null) {
        setUser(null);
        setToken(null);
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);  

  const { config } = useConfig();
  if (!config) return null;

  const isAuthenticated = !!token;

  let loginUrl = config.apiConfig.baseUrl + config.apiConfig.endpoints.login;

  const login = async (formData) => {
    setError(null);
    try {
      const response = await axios.post(loginUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { sessionToken, user } = response.data;

      localStorage.setItem("token", sessionToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(sessionToken);
    } catch (err) {
      setError(err.response?.data?.message || "Error de login");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  loginUrl: PropTypes.string.isRequired,
};

export {AuthContext};
