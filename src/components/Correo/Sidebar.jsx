import React from 'react';
import '../../css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInbox, faPaperPlane, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function Sidebar() {
  return (
    <div className="sidebar">
      <button className="compose-btn">
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        Redactar
        </button>
      <nav>
        <a href="#">
          <FontAwesomeIcon icon={faInbox} className="me-2" />
          Bandeja de entrada
        </a>
        <a href="#">
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Enviados
        </a>
        <a href="#">
          <FontAwesomeIcon icon={faPen} className="me-2" />
          Borradores
        </a>
        <a href="#">
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Spam
        </a>
      </nav>
    </div>
  );
}
