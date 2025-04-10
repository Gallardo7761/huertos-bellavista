// hooks/useConfig.js
import { useState, useEffect } from "react";

export const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [configLoading, setLoading] = useState(true);
  const [configError, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config/settings.json");
        if (!response.ok) throw new Error("Error al cargar settings.json");
        const json = await response.json();
        setConfig(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return { config, configLoading, configError };
};
