import React from 'react';
import '../../css/MailToolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInbox, faPaperPlane, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

export default function MailToolbar({ onCompose }) {
  return (
    <div className="mail-toolbar-wrapper sticky-top">
      <div className="mail-toolbar">
        <div className="toolbar-icons">
          <FontAwesomeIcon icon={faInbox} title="Entrada" className='text-success' />
          <FontAwesomeIcon icon={faPaperPlane} title="Enviados" className='text-primary' />
          <FontAwesomeIcon icon={faPen} title="Borradores" className='text-warning' />
          <FontAwesomeIcon icon={faTrash} title="Spam" className='text-danger' />
        </div>
        <button className="toolbar-btn" onClick={onCompose}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}
