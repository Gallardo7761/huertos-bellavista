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

    const setAsteriscos = (nombre) => {
        let palabras = nombre.split(" ");
        for (let i = 0; i < palabras.length; i++) {
            if (palabras[i].length > 3) {
                palabras[i] = palabras[i].substring(0, 3) + "*".repeat(palabras[i].length - 3);
            } else if(palabras[i].length > 0) {
                palabras[i] = palabras[i][0] + "*".repeat(palabras[i].length - 1);
            }
        }
        nombre = palabras.join(" ");
        if (nombre.length > 16) {
            nombre = nombre.substring(0, 16) + "...";
        }
        return nombre;
    }

    const mapped = data
    .map(item => ({
        ...item,
        fechaDeAlta: DateParser.sqlToString(item.fechaDeAlta),
    }))
    .map(item => ({
        ...item,
        nombre: setAsteriscos(item.nombre),
    }));

    return (
        <CustomContainer>
            <ContentWrapper>
                <h1 className='section-title'>Lista de Espera</h1>
                <hr className="section-divider" />
                <List datos={mapped} config={config} />
            </ContentWrapper>
        </CustomContainer>
    );
    
}

export default ListaEspera;