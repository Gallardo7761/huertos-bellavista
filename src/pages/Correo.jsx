import React, { useState } from 'react';
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

const mockEmails = [
  {
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
  },
  {
    id: 3,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 4,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 5,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 6,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 7,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 8,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 9,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 10,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 11,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 12,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 13,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 14,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 15,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 16,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 17,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 18,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
  {
    id: 19,
    subject: "Reunión de equipo mañana",
    sender: "soporte@miarma.es",
    preview: "Recordad que mañana tenemos la reunión de planificación...",
    body: "Hola equipo,\n\nRecordad que mañana a las 10:00 tenemos reunión...",
    date: "2025-04-22 12:00",
  },
  {
    id: 20,
    subject: "Oferta de colaboración",
    sender: "contacto@empresa.com",
    preview: "Nos gustaría proponeros una colaboración...",
    body: "Estimados señores,\n\nNos gustaría proponer una colaboración...",
    date: "2025-04-21 09:15",
  },
];

export default function Correo() {
  const isMobile = useMediaQuery({ maxWidth: 900 });
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [viewingMail, setViewingMail] = useState(false);

  if (isMobile) {
    return (
      <ContentWrapper>
        <MobileToolbar
          isViewingMail={viewingMail}
          onBack={() => setViewingMail(false)}
          onCompose={() => alert("Redactar...")}
          className='mt-3 px-3 sticky-toolbar'
        />
        {!viewingMail ? (
          <MailListMobile
            emails={mockEmails}
            onSelect={(mail) => {
              setSelectedEmail(mail);
              setViewingMail(true);
            }}
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
