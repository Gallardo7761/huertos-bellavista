import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomModal from '../../components/CustomModal';
import PreUserForm from '../Solicitudes/PreUserForm';

const NavListaEspera = () => {
  const [showing, setShowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AnimatedDropdown
        show={showing}
        onMouseEnter={() => setShowing(true)}
        onMouseLeave={() => setShowing(false)}
        onToggle={(isOpen) => setShowing(isOpen)}
        trigger={
          <Link className="nav-link dropdown-toggle" role="button">
            <FontAwesomeIcon icon={faList} className="me-2" />Lista de espera
          </Link>
        }
      >
        <Link to="/lista-espera" className="dropdown-item nav-link">
          <FontAwesomeIcon icon={faEye} className="me-2" />Ver la lista
        </Link>
        <Link to="#" className="disabled text-muted dropdown-item nav-link" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Solicitar huerto
        </Link>
      </AnimatedDropdown>
      <CustomModal title={"Solicitar huerto"} show={showModal} onClose={() => setShowModal(false)}>
        <PreUserForm />
      </CustomModal>
    </>
  );
};

export default NavListaEspera;
