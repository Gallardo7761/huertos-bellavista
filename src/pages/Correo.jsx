import React, { useState } from 'react';
import Split from 'react-split';
import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Correo/Sidebar';
import MailList from '../components/Correo/MailList';
import MailView from '../components/Correo/MailView';
import MailToolbar from '../components/Correo/MailToolbar';

import '../css/Correo.css';
import '../css/CorreoMobile.css';

const mockEmails = [{
  id: 1,
  subject: "Reunión de equipo mañana",
  sender: "soporte@miarma.es",
  preview: "Recordad que mañana tenemos la reunión de planificación...",
  body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
  date: "2025-04-22 12:00",
},
{
  id: 2,
  subject: "Oferta de colaboración",
  sender: "contacto@empresa.com",
  preview: "Nos gustaría proponeros una colaboración...",
  body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
  date: "2025-04-21 09:15",
},];

export default function Correo() {
  const isMobile = useMediaQuery({ maxWidth: 900 });
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
  const [showListMobile, setShowListMobile] = useState(false);

  if (isMobile) {
    return (
      <div className="correo-mobile">
        <MailToolbar
          onToggleList={() => setShowListMobile(!showListMobile)}
          onCompose={() => alert("Redactar...")}
        />
        <div className={`mail-drawer ${showListMobile ? 'open' : ''}`}>
          <MailList
            emails={mockEmails}
            onSelect={(mail) => {
              setSelectedEmail(mail);
              setShowListMobile(false);
            }}
            selectedEmail={selectedEmail}
          />
        </div>
        <MailView email={selectedEmail} />
      </div>
    );
  }

  // Desktop layout con Sidebar + MailList juntos, y un splitter contra MailView
  return (
    <div className="correo-page">
      <Split
        className="split-wrapper"
        sizes={[45, 55]}
        minSize={[300, 300]}
        gutterSize={8}
        snapOffset={0}
      >
        <div className="mail-nav-pane">
          <div className="mail-nav-inner">
            <Sidebar />
            <MailList
              emails={mockEmails}
              onSelect={setSelectedEmail}
              selectedEmail={selectedEmail}
            />
          </div>
        </div>
        <MailView email={selectedEmail} />
      </Split>
    </div>
  );
}
