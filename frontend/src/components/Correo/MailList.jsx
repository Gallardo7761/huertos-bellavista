import React from 'react';
import '../../css/MailList.css';

export default function MailList({ emails, onSelect, selectedEmail, className = '' }) {  
  return (
    <div className={`mail-list ${className}`}>
      {emails.map((mail, index) => (
        <div
          key={index}
          className={`mail-item rounded-4 mb-2 ${selectedEmail?.index === index ? 'active' : ''}`}
          onClick={() => onSelect(mail, index)}
        >
          <div className="subject">{mail.subject || "(Sin asunto)"}</div>
          <div className="preview">
            {!mail.content && "Sin contenido"}
            {mail.content.includes("<") ? (
              "Contenido HTML personalizado"
            ) : (
              mail.content?.slice(0, 100)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
