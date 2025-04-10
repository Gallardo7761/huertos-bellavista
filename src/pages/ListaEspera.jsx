import {useData} from '../hooks/useData';
import {useConfig} from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import List from '../components/List';
import DateParser from '../util/parsers/dateParser';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';


const ListaEspera = () => {
    const { config, configLoading } = useConfig();

    if(configLoading) return <p><LoadingIcon /></p>;

    const BASE = config.apiConfig.baseUrl;
    const ENDPOINT = config.apiConfig.endpoints.members.limitedWaitlist;

    const reqConfig = {
        baseUrl: BASE+ENDPOINT,
        params: {}
    }

    return(
        <DataProvider config={reqConfig}>
            <ListaEsperaContent config={reqConfig} />
        </DataProvider>
    );
}

const ListaEsperaContent = ({ config }) => {
    const { data, dataLoading, dataError } = useData(config);

    if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
    if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

    const displayConfig = {
        title: 'display_name',
        subtitle: 'created_at',
        showIndex: true
    }

    data.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
    });

    const mapped = data
    .map(item => ({
        ...item,
        created_at: DateParser.timestampToString(item.created_at),
    }));

    return (
        <CustomContainer>
            <ContentWrapper>
                <h1 className='section-title'>Lista de Espera</h1>
                <hr className="section-divider" />
                <List datos={mapped} config={displayConfig} />
            </ContentWrapper>
        </CustomContainer>
    );
    
}

export default ListaEspera;