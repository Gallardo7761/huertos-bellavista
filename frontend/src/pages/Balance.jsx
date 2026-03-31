import { useConfig } from '../hooks/useConfig';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import BalanceReport from '../components/Balance/BalanceReport';
import { useError } from '../context/ErrorContext';
import { useEffect, useState } from 'react';
import { useData } from '../hooks/useData';

const Balance = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  const { getData } = useData(null, showError);

  const [balance, setBalance] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configLoading && config) {
      const init = async () => {
        setLoading(true);
        try {
          const yearsUrl = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.balance.years}`;
          const availableYears = await getData(yearsUrl, {}, false);
          setYears(availableYears);

          const yearToFetch = availableYears.includes(selectedYear) 
            ? selectedYear 
            : (availableYears[0] || selectedYear);
          
          setSelectedYear(yearToFetch);
          await fetchBalance(yearToFetch);
        } catch (err) {
          console.error("Error en la carga inicial", err);
        } finally {
          setLoading(false);
        }
      };
      init();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, configLoading]);

  const fetchBalance = async (year) => {
    setLoading(true);
    try {
      const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.balance.withTotals}`.replace(":year", year);
      const data = await getData(url, {}, false);
      setBalance(data);
    } catch (_e) {
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    const y = parseInt(year);
    setSelectedYear(y);
    fetchBalance(y);
  };

  if (configLoading || loading) return <p className="text-center my-5"><LoadingIcon /></p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <h1 className="section-title">Resumen del Balance</h1>
        <hr className="section-divider" />
        {balance ? (
          <BalanceReport 
            balance={balance} 
            years={years} 
            selectedYear={selectedYear}
            onYearChange={handleYearChange} 
          />
        ) : (
          <div className="text-center my-5">
            <p>No se encontraron datos para el año {selectedYear}.</p>
          </div>
        )}
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Balance;
