import React from 'react';
import '../../css/MailView.css';

export default function MailView({ email }) {
  if (!email) return <div className="mail-view">Selecciona un correo</div>;

  return (
    <div className="mail-view">
      {window.innerWidth < 900 && (
        <button
          onClick={() => {
            document.querySelector('.correo-page')?.classList.remove('viewing-mail');
          }}
          style={{ marginBottom: '1rem', backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Volver
        </button>
      )}
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
