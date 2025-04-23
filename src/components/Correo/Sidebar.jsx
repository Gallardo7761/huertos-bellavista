import React from 'react';
import '../../css/Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <button className="compose-btn">Redactar</button>
      <nav>
        <a href="#">Bandeja de entrada</a>
        <a href="#">Enviados</a>
        <a href="#">Borradores</a>
        <a href="#">Spam</a>
      </nav>
    </div>
  );
}
