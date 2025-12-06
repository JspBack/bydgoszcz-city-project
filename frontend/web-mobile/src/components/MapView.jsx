import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix dla ikon, które mogą nie ładować się poprawnie
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Ustawienie domyślnych ikon dla Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});



    // Współrzędne początkowego widoku
    const position = [53.1235, 18.0084];
    const initialPlaces = [
        { id: 1, name: 'Spichrze nad Brdą', coords: [53.1221, 18.0019] },
        { id: 2, name: 'Pomnik Łuczniczki', coords: [53.1232, 17.9904] },
        { id: 3, name: 'Wyspa Młyńska', coords: [53.1256, 17.9961] },
        { id: 4, name: 'Opera Nova', coords: [53.1245, 18.0063] },
];

   const grayIcon = L.icon({
    iconUrl: markerIcon, 
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'custom-marker marker-unvisited-gray' 
});


const MapView = () => {
    
    // Użyjemy stylu w komponencie do ustalenia wysokości mapy
    return (
        <div style={{ height: '70vh', width: '100%' }}>
            {/* Ustawiamy centrum na Bydgoszcz i zoom na 14 */}
            <MapContainer 
                center={position} 
                zoom={14} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Mapujemy listę miejsc, tworząc markery */}
                {initialPlaces.map(place => (
                    <Marker 
                        key={place.id} 
                        position={place.coords} 
                        icon={grayIcon} // <= UŻYWAMY SZAREJ IKONY
                    >
                        <Popup>
                            <h3>{place.name}</h3>
                            <p style={{ color: 'gray' }}>Miejsce do odwiedzenia.</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
export default MapView;