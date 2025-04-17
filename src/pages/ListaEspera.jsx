import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useData } from '../hooks/useData';
import { useConfig } from '../hooks/useConfig';
import { useAuth } from '../hooks/useAuth';
import { DataProvider } from '../context/DataContext';
import List from '../components/List';
import { DateParser } from '../util/parsers/dateParser';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import PreUserForm from '../components/Solicitudes/PreUserForm';
import CustomModal from '../components/CustomModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import IfNotAuthenticated from '../components/Auth/IfNotAuthenticated';


const ListaEspera = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return <p><LoadingIcon /></p>;

    const BASE = config.apiConfig.baseUrl;
    const ENDPOINT = config.apiConfig.endpoints.members.limitedWaitlist;

    const reqConfig = {
        baseUrl: BASE + ENDPOINT,
        params: {}
    };

    return (
        <DataProvider config={reqConfig}>
            <ListaEsperaContent config={reqConfig} />
        </DataProvider>
    );
};

const ListaEsperaContent = ({ config }) => {
    const { data, dataLoading, dataError } = useData(config);
    const { authStatus } = useAuth();
    const [showFormModal, setShowFormModal] = useState(false);

    const handleClose = () => setModalShown(false);
    const handleFormOpen = () => {
        setModalShown(false);
        setShowFormModal(true);
    };
    const handleFormClose = () => setShowFormModal(false);

    const [modalShown, setModalShown] = useState(false);

    useEffect(() => {
        if (authStatus !== "authenticated" && authStatus !== "unauthenticated") return;

        if (authStatus === "authenticated") {
            setModalShown(false);
            return;
        }

        const hasSeenModal = localStorage.getItem('modalShown') === 'true';
        if (!hasSeenModal) {
            setModalShown(true);
            localStorage.setItem('modalShown', 'true');
        }
    }, [authStatus]);

    if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
    if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

    const displayConfig = {
        title: 'display_name',
        subtitle: 'created_at',
        showIndex: true
    };

    data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const mapped = data.map(item => ({
        ...item,
        created_at: DateParser.timestampToString(item.created_at),
    }));

    return (
        <>
            <CustomContainer>
                <ContentWrapper>
                    <div className='d-flex align-items-center m-0 p-0 justify-content-between'>
                        <h1 className='section-title'>Lista de Espera</h1>
                        <IfNotAuthenticated>
                            <Button variant="danger" onClick={() => setShowFormModal(true)}>
                                <FontAwesomeIcon icon={faPencil} className="me-2" />
                                Apuntarme
                            </Button>
                        </IfNotAuthenticated>
                    </div>
                    <hr className="section-divider" />
                    <List datos={mapped} config={displayConfig} />
                </ContentWrapper>
            </CustomContainer>

            {authStatus === "unauthenticated" && (
                <Modal show={modalShown} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Quieres unirte?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Te puedes apuntar a la lista de espera clicando en el botón de abajo. Una persona de la directiva revisará tu solicitud y se te notificará por el medio de contacto que elijas si entras o no.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="success" onClick={handleFormOpen}>
                            Apuntarme
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <CustomModal title="Solicitud de Huerto" show={showFormModal} onClose={handleFormClose}>
                <PreUserForm />
            </CustomModal>
        </>
    );
};

export default ListaEspera;
