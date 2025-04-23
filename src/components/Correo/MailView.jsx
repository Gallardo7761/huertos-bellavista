import React from 'react';
import '../../css/MailView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

export default function MailView({ email }) {
  if (!email) return (
    <div className='d-flex display-4 flex-column justify-content-center align-items-center vh-100 w-100'>
      <FontAwesomeIcon icon={faEnvelopeOpenText} className="me-2" />
      <h3 className='display-4'>
        No hay correo seleccionado
      </h3>
    </div>
  );

  return (
    <div className="mail-view">
      <div className="mail-header">
        <h2>{email.subject}</h2>
        <div className="mail-meta">
          <span>{email.sender}</span> • <span>{email.date}</span>
        </div>
      </div>
      <div className="mail-body">
        {email.body}
      </div>
    </div>
  );
}
