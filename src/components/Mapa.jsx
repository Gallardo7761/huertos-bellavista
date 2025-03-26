// Mapa.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix para que los iconos carguen bien
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Mapa() {
  const position = [37.3282, -5.9648]; // Coordenadas del huerto

  return (
    <div style={{ height: '60vh', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
      <MapContainer center={position} zoom={17} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Asociación Huertos La Salud - Bellavista
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}