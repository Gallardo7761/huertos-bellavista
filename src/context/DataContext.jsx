import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children, config }) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);

  const prevConfigKey = useRef(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  });

  // =====================
  // GET
  // =====================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(config.baseUrl, {
        headers: getAuthHeaders(),
        params: config.params,
      });
      setData(response.data.data); // ✅ Cambio aquí
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  // =====================
  // POST
  // =====================
  const postData = async (endpoint, payload) => {
    try {
      const isFormData = payload instanceof FormData;
  
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      };
  
      const response = await axios.post(endpoint, payload, { headers });
  
      await fetchData();
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // =====================
  // PUT
  // =====================
  const putData = async (endpoint, payload) => {
    try {
      const response = await axios.put(endpoint, payload, {
        headers: getAuthHeaders(),
      });
      await fetchData();
      return response.data.data; // ✅ Cambio aquí
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // =====================
  // DELETE
  // =====================
  const deleteData = async (endpoint) => {
    try {
      const response = await axios.delete(endpoint, {
        headers: getAuthHeaders(),
      });
      await fetchData();
      return response.data.data; // ✅ Cambio aquí
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const deleteDataWithBody = async (endpoint, payload) => {
    try {
      const response = await axios.delete(endpoint, {
        headers: getAuthHeaders(),
        data: payload,
      });
      await fetchData();
      return response.data.data; // ✅ Cambio aquí
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }

  useEffect(() => {
    const configKey = JSON.stringify(config);
    if (prevConfigKey.current === configKey) return;
    prevConfigKey.current = configKey;

    fetchData();
  }, [config, fetchData]);

  return (
    <DataContext.Provider
      value={{
        data,
        dataLoading,
        dataError,
        postData,
        putData,
        deleteData,
        deleteDataWithBody
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    params: PropTypes.object,
  }).isRequired,
};

export { DataContext };
