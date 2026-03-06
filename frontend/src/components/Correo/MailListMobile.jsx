import React from 'react';
import '../../css/MailListMobile.css';

export default function MailListMobile({ emails, onSelect, selectedEmail, className = '' }) {
  return (
    <div className={`mail-list-mobile ${className}`}>
      {emails.map((mail, index) => (
        <div
          key={index}
          className={`mail-item-mobile rounded-4 mb-2 ${selectedEmail?.index === index ? 'active' : ''}`}
          onClick={() => onSelect(mail, index)}
        >
          <div className="subject">{mail.subject || "(Sin asunto)"}</div>
          <div className="preview">{mail.content?.slice(0, 100) || "Sin contenido"}</div>
        </div>
      ))}
    </div>
  );
}

