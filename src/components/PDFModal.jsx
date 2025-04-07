import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button } from "react-bootstrap";
import { PDFViewer } from "@react-pdf/renderer";

const PDFModal = ({ show, onClose, title, children }) => (
    <Modal show={show} onHide={onClose} size="xl" centered>
        <Modal.Header className='justify-content-between'>
            <Modal.Title>{title}</Modal.Title>
            <Button variant='transparent' onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} className='close-button fa-xl' />
            </Button>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
            <PDFViewer width="100%" height="100%">
                {children}
            </PDFViewer>
        </Modal.Body>
    </Modal>
);

export default PDFModal;