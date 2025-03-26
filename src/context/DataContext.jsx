import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const DataContext = createContext();

export const DataProvider = ({ children, config }) => {
  const [data, setData] = useState(null);
  const [dataLoading, setLoading] = useState(true);
  const [dataError, setError] = useState(null);

  const prevConfigKey = useRef(null); // para comparar

  useEffect(() => {
    const configKey = JSON.stringify(config); // serializamos para comparar

    // Solo hace fetch si el config ha cambiado realmente
    if (prevConfigKey.current === configKey) return;

    prevConfigKey.current = configKey;

    const fetchData = async () => {
      setLoading(true); // importante reiniciar estado
      setError(null);

      try {
        const queryParams = new URLSearchParams(config.params).toString();
        const url = `${config.baseUrl}?${queryParams}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener datos");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config]);

  return (
    <DataContext.Provider value={{ data, dataLoading, dataError }}>
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