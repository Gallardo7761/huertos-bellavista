import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import BalanceReport from '../components/Balance/BalanceReport';
import { useError } from '../context/ErrorContext';

const Balance = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.balance.withTotals
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <BalanceContent />
    </DataProvider>
  );
};

const BalanceContent = () => {
  const { data, dataLoading } = useDataContext();

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (!data || !data.id) return <p className="text-center my-5">No se encontró el balance.</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <h1 className="section-title">Resumen del Balance</h1>
        <hr className="section-divider" />
        <BalanceReport balance={data} />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Balance;
