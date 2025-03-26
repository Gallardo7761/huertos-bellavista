import { useState, useRef } from 'react';
import SocioCard from '../components/Socios/SocioCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../css/Socios.css';

const FAKE_SOCIOS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  nombre: `Socio ${i + 1}`,
  correo: `socio${i + 1}@huertos.es`,
  rol: i % 2 === 0 ? 'Miembro' : 'Administrador',
  foto: `https://i.pravatar.cc/150?img=${i + 10}`
}));

const PAGE_SIZE = 10;

export default function Socios() {
  const [socios, setSocios] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef();

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newSocios = FAKE_SOCIOS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
      setSocios(prev => [...prev, ...newSocios]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  useInfiniteScroll(loaderRef, loadMore);

  return (
    <div className="socios-container">
      <h2 className="section-title">Listado de Socios</h2>
      <div className="cards-grid">
        {socios.map(socio => (
          <SocioCard key={socio.id} socio={socio} />
        ))}
      </div>
      <div ref={loaderRef} className="loading-trigger">
        {loading && <p>Cargando más socios...</p>}
      </div>
    </div>
  );
}