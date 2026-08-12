import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ location }) {
  if (!location) {
    return (
      <p className="text-gray-600">
        Loading map...
      </p>
    );
  }

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={15}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[location.latitude, location.longitude]}
      >
        <Popup>
          You are here 📍
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;