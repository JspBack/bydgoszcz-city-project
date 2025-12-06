import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Wymagane jest również zaimportowanie stylów Leaflet
import 'leaflet/dist/leaflet.css';

// Fix dla ikon, które mogą nie ładować się poprawnie w bundlerach
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Ustawienie domyślnych ikon dla Leaflet
// to jest kluczowe, aby markery się poprawnie wyświetlały!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const MapView = () => {
    // Współrzędne początkowego widoku (np. Kraków)
    const position = [50.0647, 19.9450]; // Wawel, Kraków

    // Musisz ustalić wysokość dla kontenera mapy.
    // Użyję inline style, ale lepiej to zrobić w pliku component.css
    const mapStyle = { height: '500px', width: '100%' };

    return (
        <div style={mapStyle}>
            {/* MapContainer to główny komponent mapy */}
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                {/* TileLayer to warstwa kafelków, czyli wygląd mapy */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Marker to znacznik na mapie */}
                <Marker position={position}>
                    <Popup>
                        A simple Marker at starting point. <br /> Leaflet React app.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapView;