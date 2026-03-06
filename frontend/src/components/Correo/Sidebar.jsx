import React, { useState } from 'react';
import '../../css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExclamationCircle, faInbox, faPaperPlane, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ComposeMailModal from './ComposeMailModal';


export default function Sidebar({ onFolderChange, onMailSend }) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleComposeOpen = () => setIsComposeOpen(true);
  const handleComposeClose = () => setIsComposeOpen(false);
  const handleSendMail = (mailData) => {
    onMailSend(mailData);
  };

  return (
    <div className="sidebar">
      <button className="compose-btn" onClick={handleComposeOpen}>
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        Redactar
      </button>
      <nav>
        <a href="#" onClick={() => onFolderChange("INBOX")}>
          <FontAwesomeIcon icon={faInbox} className="me-2" />
          Bandeja de entrada
        </a>
        <a href="#" onClick={() => onFolderChange("Sent")}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Enviados
        </a>
        <a className='disabled' href="#" onClick={() => onFolderChange("Drafts")}>
          <FontAwesomeIcon icon={faPen} className="me-2" />
          Borradores
        </a>
        <a className='disabled' href="#" onClick={() => onFolderChange("Spam")}>
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          Spam
        </a>
        <a className='disabled' href="#" onClick={() => onFolderChange("Trash")}>
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Papelera
        </a>
      </nav>
      <ComposeMailModal
        isOpen={isComposeOpen}
        onClose={handleComposeClose}
        onSend={handleSendMail}
      />
    </div>
  );
}
