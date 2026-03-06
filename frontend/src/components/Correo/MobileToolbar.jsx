import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInbox, faPaperPlane, faPenFancy, faTrash,
  faPlus, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import '../../css/MobileToolbar.css';

export default function MobileToolbar({ isViewingMail, onBack, onCompose, className }) {
  return (
    <div className={`search-toolbar-wrapper ${className}`}>
      <div className="search-toolbar mobile-toolbar-content">
        {!isViewingMail ? (
          <>
            <div className="toolbar-icons mobile-toolbar-icons">
              <button className="icon-btn" title="Entrada">
                <FontAwesomeIcon icon={faInbox} />
              </button>
              <button className="icon-btn" title="Enviados">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <button className="icon-btn" title="Borradores">
                <FontAwesomeIcon icon={faPenFancy} />
              </button>
              <button className="icon-btn" title="Spam">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="toolbar-buttons">
              <button className="btn icon-btn" onClick={onCompose} title="Redactar">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </>
        ) : (
          <button className="btn icon-btn" onClick={onBack} title="Volver">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
      </div>
    </div>
  );
}
