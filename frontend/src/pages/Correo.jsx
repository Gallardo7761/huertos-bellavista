import { useState, useEffect } from 'react';
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

import { useConfig } from '../hooks/useConfig';
import LoadingIcon from '../components/LoadingIcon';
import { useData } from '../hooks/useData';

const Correo = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  return (
    <CorreoContent
      baseUrl={config.apiConfig.baseUrl}
      endpoint={config.apiConfig.endpoints.mail.all}
    />
  );
};

const CorreoContent = ({ baseUrl, endpoint }) => {
  const isMobile = useMediaQuery({ maxWidth: 900 });
  const [folder, setFolder] = useState("INBOX");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [viewingMail, setViewingMail] = useState(false);

  const { getData, postData } = useData({});

  const fetchMails = async (folderName) => {
    const url = `${baseUrl}${endpoint}/${folderName}`;
    const { data, error } = await getData(url);
    if (error) {
      console.error("Error cargando correos:", error);
      setEmails([]);
    } else {
      const mails = data?.emails || data || [];
      setEmails(mails);
    }
  };

  useEffect(() => {
    fetchMails(folder);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const handleSelect = (mail, index) => {
    setSelectedEmail({ ...mail, index });
    setViewingMail(true);
  };

  const handleSend = async (mailData) => {
    const url = `${baseUrl}${endpoint}/send`;
    try {
      await postData(url, mailData);
      setViewingMail(false);
      fetchMails(folder);
    } catch (error) {
      console.error("Error enviando correo:", error);
    }
  }

  if (!emails) return <p className="text-center my-5"><LoadingIcon /></p>;

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
            <Sidebar onFolderChange={setFolder} onMailSend={handleSend} />
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
};

export default Correo;
