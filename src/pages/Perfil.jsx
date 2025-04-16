import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import { Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faIdCard, faEnvelope, faPhone, faHashtag, faSeedling, faUserShield, faCalendar
} from '@fortawesome/free-solid-svg-icons';
import '../css/Perfil.css';

const parseDate = (date) => {
    if (!date) return 'NO';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const Perfil = () => {
    const { config, configLoading } = useConfig();

    const ENDPOINT = config?.apiConfig.endpoints.members.profile;
    const HOST = config?.apiConfig.baseUrl;
    const reqConfig = {
        baseUrl: `${HOST}${ENDPOINT}`
    };

    const { data, dataLoading, dataError } = useData(reqConfig);

    if (configLoading || dataLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;
    if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

    const usuario = data;

    return (
        <CustomContainer>
            <ContentWrapper>
                <h1 className='section-title'>Mi Perfil</h1>
                <hr className="section-divider" />

                <Card className="shadow-sm rounded-4 perfil-card">
                    <Card.Header className="bg-secondary text-white rounded-top-4">
                        <Card.Title className="mb-0">Información del usuario</Card.Title>
                        <small>Desde {parseDate(usuario.created_at)}</small>
                    </Card.Header>

                    <Card.Body>
                        <ListGroup variant="flush" className="border rounded-3">
                            <ListGroup.Item><FontAwesomeIcon icon={faUser} className="me-2" />Nombre: <strong>{usuario.display_name}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI: <strong>{usuario.dni}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email: <strong>{usuario.email}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faPhone} className="me-2" />Teléfono: <strong>{usuario.phone}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faHashtag} className="me-2" />Socio Nº: <strong>{usuario.member_number}</strong> | Huerto Nº: <strong>{usuario.plot_number}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faSeedling} className="me-2" />Tipo de socio: <strong>{['Lista de Espera', 'Hortelano', 'Hortelano + Invernadero', 'Colaborador'][usuario.type]}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faUserShield} className="me-2" />Rol en huertos: <strong>{['Usuario', 'Admin', 'Desarrollador'][usuario.role]}</strong> | Global: <strong>{['Usuario', 'Admin'][usuario.global_role]}</strong></ListGroup.Item>
                            <ListGroup.Item><FontAwesomeIcon icon={faCalendar} className="me-2" />Estado: <strong>{usuario.status === 1 ? 'Activo' : 'Inactivo'}</strong></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </ContentWrapper>
        </CustomContainer>
    );
};

export default Perfil;
