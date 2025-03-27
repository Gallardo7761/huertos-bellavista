import {useData} from '../hooks/useData';
import {useConfig} from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import List from '../components/List';
import DateParser from '../util/parsers/dateParser';
import Container from '../components/Container';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';


const ListaEspera = () => {
    const { config, configLoading } = useConfig();

    if(configLoading) return <p><LoadingIcon /></p>;

    const BASE = config.apiConfig.baseUrl;
    const ENDPOINT = config.apiConfig.endpoints.lista_espera;

    const reqConfig = {
        baseUrl: BASE+ENDPOINT,
        params: {}
    }

    return(
        <DataProvider config={reqConfig}>
            <ListaEsperaContent />
        </DataProvider>
    );
}

const ListaEsperaContent = () => {
    const { data, dataLoading, dataError } = useData();

    if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
    if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

    const config = {
        title: 'nombre',
        subtitle: 'fechaDeAlta',
        showIndex: true
    }

    data.sort((a, b) => {
        return new Date(a.fechaDeAlta) - new Date(b.fechaDeAlta);
    });

    const mapped = data.map(item => ({
        ...item,
        fechaDeAlta: DateParser.sqlToString(item.fechaDeAlta),
    }));

    return (
        <Container>
            <ContentWrapper>
                <h1 className='section-title'>Lista de Espera</h1>
                <hr className="section-divider" />
                <List datos={mapped} config={config} />
            </ContentWrapper>
        </Container>
    );
    
}

export default ListaEspera;