// Mapa3D.jsx
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function Mapa3D() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: [
              'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=Ie0BAF3X6PIp1aV260ar'
            ],
            tileSize: 512,
            attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
          }
        },
        layers: [
          {
            id: 'satellite',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [-5.9648, 37.3282],
      zoom: 17,
      pitch: 30,
      bearing: -10,
      antialias: true,
      scrollZoom: false
    });

    map.addControl(new maplibregl.NavigationControl());

    new maplibregl.Marker()
      .setLngLat([-5.9648, 37.3282])
      .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '60vh', borderRadius: '10px', overflow: 'hidden' }}
    />
  );
}