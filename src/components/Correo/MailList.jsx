import React from 'react';
import '../../css/MailList.css';

export default function MailList({ emails, onSelect, selectedEmail }) {
  return (
    <div className="mail-list">
      {emails.map((mail) => (
        <div
          key={mail.id}
          className={`mail-item rounded-4 mb-2 ${selectedEmail?.id === mail.id ? 'active' : ''}`}
          onClick={() => onSelect(mail)}
        >
          <div className="subject">{mail.subject}</div>
          <div className="preview">{mail.preview}</div>
        </div>
      ))}
    </div>
  );
}
