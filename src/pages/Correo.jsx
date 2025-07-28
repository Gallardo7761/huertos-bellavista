import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Correo/Sidebar';
import MailListMobile from '../components/Correo/MailListMobile';
import MailList from '../components/Correo/MailList';
import MailView from '../components/Correo/MailView';
import MobileToolbar from '../components/Correo/MobileToolbar';
import ContentWrapper from '../components/ContentWrapper';

import '../css/Correo.css';
import '../css/CorreoMobile.css';

export default function Correo() {
  const isMobile = useMediaQuery({ maxWidth: 900 });
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [viewingMail, setViewingMail] = useState(false);
  const [folder, setFolder] = useState("INBOX");

  useEffect(() => {
    fetch(`http://api.huertos.local/v1/mails/${folder}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
      })
      .catch((err) => console.error("Error cargando mails:", err));
  }, [folder]);

  const handleSelect = (mail, index) => {
    setSelectedEmail({ ...mail, index });
    setViewingMail(true);
  };

  if (isMobile) {
    return (
      <ContentWrapper>
        <MobileToolbar
          isViewingMail={viewingMail}
          onBack={() => setViewingMail(false)}
          onCompose={() => alert("Redactar...")}
          className="mt-3 px-3 sticky-toolbar"
        />
        {!viewingMail ? (
          <MailListMobile
            emails={emails}
            onSelect={handleSelect}
            selectedEmail={selectedEmail}
            className="px-3"
          />
        ) : (
          <MailView email={selectedEmail} />
        )}
      </ContentWrapper>
    );
  }

  return (
    <div className="correo-page">
      <Split className="split-wrapper" sizes={[45, 55]} minSize={[300, 300]} gutterSize={8} snapOffset={0}>
        <div className="mail-nav-pane">
          <div className="mail-nav-inner">
            <Sidebar onFolderChange={setFolder} />
            <MailList
              emails={emails}
              onSelect={handleSelect}
              selectedEmail={selectedEmail}
            />
          </div>
        </div>
        <MailView email={selectedEmail} />
      </Split>
    </div>
  );
}
