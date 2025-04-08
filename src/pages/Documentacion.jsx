import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import { DataProvider } from '../context/DataContext';

const Documentacion = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return <p><LoadingIcon /></p>;

    const HOST = config.apiConfig.baseUrl;
    const BASE = `${HOST}`;
    const ENDPOINT_VIEW = config.apiConfig.endpoints.incomes.allWithNames;
    const ENDPOINT_RAW = config.apiConfig.endpoints.incomes.all;

    const reqConfig = {
        baseUrl: BASE + ENDPOINT_VIEW,
        rawUrl: BASE + ENDPOINT_RAW,
        params: {
            _sort: 'created_at',
            _order: 'desc'
        }
    };

    return (
        <DataProvider config={reqConfig}>
            <DocumentacionContent />
        </DataProvider>
    );
}

const DocumentacionContent = () => {

}

export default Documentacion;