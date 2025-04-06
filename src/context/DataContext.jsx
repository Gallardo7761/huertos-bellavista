import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const DataContext = createContext();

export const DataProvider = ({ children, config }) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);

  const prevConfigKey = useRef(null);

  // =====================
  // GET
  // =====================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      const queryParams = new URLSearchParams(config.params).toString();
      const url = `${config.baseUrl}?${queryParams}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
      });

      if (!response.ok) throw new Error("Error al obtener datos");

      const result = await response.json();
      setData(result.data); // ✅ Cambio aquí
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [config]);  

  // =====================
  // POST
  // =====================
  const postData = async (endpoint, payload) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Error al hacer POST");

      const result = await response.json();
      await fetchData();
      return result.data; // ✅ Cambio aquí

    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // =====================
  // PUT
  // =====================
  const putData = async (endpoint, payload) => {
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Error al hacer PUT");

      const result = await response.json();
      await fetchData();
      return result.data; // ✅ Cambio aquí

    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // =====================
  // DELETE
  // =====================
  const deleteData = async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
      });
      if (!response.ok) throw new Error("Error al hacer DELETE");
      
      const result = await response.json();
      await fetchData();
      return result.data; // ✅ Cambio aquí
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

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
        deleteData
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
