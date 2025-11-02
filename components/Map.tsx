
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Stage } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  history: Stage[];
}

const Map: React.FC<MapProps> = ({ history }) => {
  const locations = history
    .map(stage => stage.location)
    .filter((location): location is NonNullable<Stage['location']> => !!location);

  if (locations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Journey</h3>
        <p>No location data available.</p>
      </div>
    );
  }

  const center: [number, number] = [locations[0].latitude, locations[0].longitude];
  const polylinePositions = locations.map(loc => [loc.latitude, loc.longitude] as [number, number]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Journey</h3>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location, idx) => (
            <Marker key={idx} position={[location.latitude, location.longitude]}>
              <Popup>
                Stage: {history[idx].name} <br />
                Timestamp: {new Date(history[idx].timestamp).toLocaleString()}
              </Popup>
            </Marker>
          ))}
          <Polyline positions={polylinePositions} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
