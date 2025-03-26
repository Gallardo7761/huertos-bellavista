import { useLocation } from 'react-router-dom';
import '../css/Building.css'; // asegúrate de ajustar la ruta

export default function Building() {
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <div className="building-container">
      <div className="building-icon">🚧</div>
      <div className="building-title">Esta página está en construcción</div>
      <div className="building-subtitle">Estamos trabajando para traértela pronto 🌱</div>
    </div>
  );
}
