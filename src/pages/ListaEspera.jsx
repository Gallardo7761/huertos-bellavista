import {useData} from '../hooks/useData';
import {useConfig} from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import List from '../components/List';
import DateParser from '../util/parsers/dateParser';

const ListaEspera = () => {
    const { config, configLoading, configError } = useConfig();

    if(configLoading) return <p>Cargando configuración...</p>;
    if(configError) return <p>Error al cargar configuración</p>;
    if(!config) return <p>Configuración no encontrada</p>;

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

    if(dataLoading) return <p>Cargando datos...</p>;
    if(dataError) return <p>Error al cargar datos</p>;
    if(!data) return <p>Datos no encontrados</p>;

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
        <main className="custom-container">
            <div className="content-wrapper">
                <h1 className='section-title'>Lista de Espera</h1>
                <hr className="section-divider" />
                <List datos={mapped} config={config} />
            </div>
        </main>
    );
    
}

export default ListaEspera;