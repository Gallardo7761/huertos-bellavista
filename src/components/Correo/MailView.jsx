import React from 'react';
import '../../css/MailView.css';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MailView({ email }) {
  if (!email) {
    return (
      <div className='d-flex display-4 flex-column justify-content-center align-items-center vh-100 w-100'>
        <FontAwesomeIcon icon={faEnvelopeOpenText} className="me-2" />
        <h3 className='display-4'>No hay correo seleccionado</h3>
      </div>
    );
  }

  const from = email.from || "Remitente desconocido";
  const date = new Date(email.date).toLocaleString();
  const to = (email.to || []).join(', ');

  return (
    <div className="mail-view">
      <div className="mail-header">
        <h2>{email.subject || "(Sin asunto)"}</h2>
        <div className="mail-meta">
          <span><strong>De:</strong> {from}</span><br />
          <span><strong>Para:</strong> {to}</span><br />
          <span><strong>Fecha:</strong> {date}</span>
        </div>
      </div>
      <div className="mail-body">
        <pre>{email.content}</pre>
        {email.attachments && email.attachments.length > 0 && (
          <div className="mail-attachments mt-3">
            <h5>Adjuntos:</h5>
            <ul>
              {email.attachments.map((a, i) => (
                <li key={i}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">{a.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
