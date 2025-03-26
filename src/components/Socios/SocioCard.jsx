// SocioCard.jsx
export default function SocioCard({ socio }) {
    return (
      <div className="socio-card">
        <img src={socio.foto} alt={socio.nombre} className="socio-foto" />
        <h3>{socio.nombre}</h3>
        <p>{socio.correo}</p>
        <span className="socio-rol">{socio.rol}</span>
      </div>
    );
  }
  