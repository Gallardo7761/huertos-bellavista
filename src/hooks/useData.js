import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useData = (config) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);

  const configRef = useRef(config);
  configRef.current = config; // Se actualiza siempre

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(configRef.current.baseUrl, {
        headers: getAuthHeaders(),
        params: configRef.current.params,
      });
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []); // ← sin dependencias

  useEffect(() => {
    fetchData();
  }, [fetchData]); // se vuelve a ejecutar si cambia el config

  const postData = async (endpoint, payload) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
    };
    const response = await axios.post(endpoint, payload, { headers });
    await fetchData(); // ← SIEMPRE usa el último config
    return response.data.data;
  };

  const putData = async (endpoint, payload) => {
    const response = await axios.put(endpoint, payload, {
      headers: getAuthHeaders(),
    });
    await fetchData();
    return response.data.data;
  };

  const deleteData = async (endpoint) => {
    const response = await axios.delete(endpoint, {
      headers: getAuthHeaders(),
    });
    await fetchData();
    return response.data.data;
  };

  const deleteDataWithBody = async (endpoint, payload) => {
    const response = await axios.delete(endpoint, {
      headers: getAuthHeaders(),
      data: payload,
    });
    await fetchData();
    return response.data.data;
  };

  return {
    data,
    dataLoading,
    dataError,
    refetch: fetchData,
    postData,
    putData,
    deleteData,
    deleteDataWithBody,
  };
};
