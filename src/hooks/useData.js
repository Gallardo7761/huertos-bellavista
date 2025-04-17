import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useData = (config) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);
  const configRef = useRef();

  // Actualizamos configRef cuando cambia config
  useEffect(() => {
    if (config?.baseUrl) {
      configRef.current = config;
    }
  }, [config]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchData = useCallback(async () => {
    const current = configRef.current;
    if (!current?.baseUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(current.baseUrl, {
        headers: getAuthHeaders(),
        params: current.params,
      });
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Siempre que cambie config, hacemos fetch
  useEffect(() => {
    if (config?.baseUrl) {
      fetchData();
    }
  }, [config, fetchData]);

  const postData = async (endpoint, payload) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(payload instanceof FormData ? {} : { "Content-Type": "application/json" }),
    };
    const response = await axios.post(endpoint, payload, { headers });
    await fetchData(); // Refresca tras crear
    return response.data.data;
  };

  const putData = async (endpoint, payload) => {
    const response = await axios.put(endpoint, payload, {
      headers: getAuthHeaders(),
    });
    await fetchData(); // Refresca tras editar
    return response.data.data;
  };

  const deleteData = async (endpoint) => {
    const response = await axios.delete(endpoint, {
      headers: getAuthHeaders(),
    });
    await fetchData(); // Refresca tras borrar
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
    refetch: fetchData, // Puedes usar esto manualmente si hace falta
    postData,
    putData,
    deleteData,
    deleteDataWithBody,
  };
};
