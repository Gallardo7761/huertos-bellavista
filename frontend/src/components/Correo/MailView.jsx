import React, { useEffect, useRef } from 'react';
import '../../css/MailView.css';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MailView({ email }) {
  const mailContentRef = useRef(null);

  const getFileIcon = (filename) => {
    if (!filename) return '/images/icons/filetype/file_64.svg';
    
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '/images/icons/filetype/pdf_64.svg';
      case 'jpg':
      case 'jpeg':
        return '/images/icons/filetype/jpg_64.svg';
      case 'png':
        return '/images/icons/filetype/png_64.svg';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '/images/icons/filetype/mp4_64.svg';
      case 'txt':
      case 'text':
        return '/images/icons/filetype/txt_64.svg';
      default:
        return '/images/icons/filetype/file_64.svg';
    }
  };

  const processTextContent = (text) => {
    if (!text) return "Sin contenido";
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    
    return text
      .replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(emailRegex, '<a href="mailto:$1">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const processHtmlContent = (html) => {
    if (!html) return "Sin contenido";
    
    let processedHtml = html;
    
    processedHtml = processedHtml.replace(
      /<a([^>]*?)(?:\s+target="[^"]*")?([^>]*?)>/g, 
      '<a$1 target="_blank" rel="noopener noreferrer"$2>'
    );
    
    processedHtml = processedHtml.replace(
      /<img([^>]*?)>/g,
      '<img$1 style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">'
    );
    
    return processedHtml;
  };

  useEffect(() => {
    const currentRef = mailContentRef.current;
    
    if (currentRef) {
      const handleLinkClick = (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
          e.preventDefault();
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      };

      const images = currentRef.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });

      currentRef.addEventListener('click', handleLinkClick);
      
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('click', handleLinkClick);
        }
      };
    }
  }, [email]);

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
  
  const isHtml = email.content && (
    email.content.includes('<html') || 
    email.content.includes('<body') || 
    email.content.includes('<div') || 
    email.content.includes('<p>') ||
    email.content.includes('<br') ||
    email.content.includes('<img') ||
    email.content.includes('<a href') ||
    email.content.includes('<table') ||
    email.content.includes('<ul') ||
    email.content.includes('<ol') ||
    /<[a-z][\s\S]*>/i.test(email.content)
  );

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
        <div 
          ref={mailContentRef}
          className="mail-content"
          dangerouslySetInnerHTML={{
            __html: isHtml 
              ? processHtmlContent(email.content)
              : processTextContent(email.content || "")
          }}
        />

        {email.attachments && email.attachments.length > 0 && (
          <div className="mail-attachments mt-3">
            <h5>Adjuntos:</h5>
            <ul>
              {email.attachments.map((a, i) => (
                <li key={i}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={getFileIcon(a.name)} 
                      alt="File icon" 
                      width="16" 
                      height="16" 
                      style={{ marginRight: '8px' }}
                    />
                    {a.name}
                    {a.size && <span className="attachment-size"> ({a.size})</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
