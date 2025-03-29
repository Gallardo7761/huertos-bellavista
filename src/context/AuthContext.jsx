import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useConfig } from "../hooks/useConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = 'Token: ' + token;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

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

      sessionStorage.setItem("token", sessionToken);
      sessionStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(sessionToken);
    } catch (err) {
      setError(err.response?.data?.message || "Error de login");
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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