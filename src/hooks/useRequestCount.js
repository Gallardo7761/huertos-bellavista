import { useEffect, useState } from 'react';
import axios from 'axios';
import { useConfig } from './useConfig';

const useRequestCount = () => {
  const { config } = useConfig();
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!config) return;

    const fetchCount = async () => {
      try {
        const res = await axios.get(
          config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.countPending, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCount(res.data.data.count);
      } catch (err) {
        console.error('❌ Error al obtener el número de solicitudes:', err.message);
      }
    };

    fetchCount();
  }, [config]);

  return count;
};

export default useRequestCount;
