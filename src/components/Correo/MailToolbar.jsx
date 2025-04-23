import React from 'react';
import '../../css/MailToolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faInbox, faPaperPlane, faPenFancy, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function MailToolbar({ onToggleList, onCompose }) {
  return (
    <div className="mail-toolbar-wrapper">
      <div className="mail-toolbar">
        <button className="toolbar-btn" onClick={onToggleList}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="toolbar-icons">
          <FontAwesomeIcon icon={faInbox} title="Entrada" />
          <FontAwesomeIcon icon={faPaperPlane} title="Enviados" />
          <FontAwesomeIcon icon={faPenFancy} title="Borradores" />
          <FontAwesomeIcon icon={faTrash} title="Spam" />
        </div>
        <button className="toolbar-btn" onClick={onCompose}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}
