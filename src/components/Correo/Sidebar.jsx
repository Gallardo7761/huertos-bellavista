import React from 'react';
import '../../css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInbox, faPaperPlane, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function Sidebar({ onFolderChange }) {
  return (
    <div className="sidebar">
      <button className="compose-btn">
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        Redactar
      </button>
      <nav>
        <a href="#" onClick={() => onFolderChange("inbox")}>
          <FontAwesomeIcon icon={faInbox} className="me-2" />
          Bandeja de entrada
        </a>
        <a href="#" onClick={() => onFolderChange("sent")}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Enviados
        </a>
        <a href="#" onClick={() => onFolderChange("drafts")}>
          <FontAwesomeIcon icon={faPen} className="me-2" />
          Borradores
        </a>
        <a href="#" onClick={() => onFolderChange("spam")}>
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Spam
        </a>
      </nav>
    </div>
  );
}
