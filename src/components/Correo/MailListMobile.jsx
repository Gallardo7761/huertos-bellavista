import React from 'react';
import '../../css/MailListMobile.css';

export default function MailListMobile({ emails, onSelect, selectedEmail, className }) {
  return (
    <div className={`mail-list-mobile ${className}`}>
      {emails.map((mail) => (
        <div
          key={mail.id}
          className={`mail-item-mobile rounded-4 mb-2 ${selectedEmail?.id === mail.id ? 'active' : ''}`}
          onClick={() => onSelect(mail)}
        >
          <div className="subject">{mail.subject}</div>
          <div className="preview">{mail.preview}</div>
        </div>
      ))}
    </div>
  );
}
