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
        { id: 1, name: 'Fontanna Potop', coords: [53.12688833879727, 18.006254141088036], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 2, name: 'Kazimierz Wielki', coords: [53.12267718422295, 17.997524442342453], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 3, name: 'Przechodzący przez Rzekę', coords: [53.12389793027659, 18.001607518341864], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 4, name: 'Pomnik Kopernika', coords: [53.12890755721382, 18.013053833690282], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 5, name: 'Ławeczka Mariana Rejewskiego', coords: [53.128621158509915, 18.005987610404663], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 6, name: 'Rzeźba Łuczniczki', coords: [53.13089183902998, 18.01210701584773], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 7, name: 'Zegar z czasem bydgoskim', coords: [53.123094839913556, 18.00003099986527], address: 'Stary Rynek 15, Bydgoszcz' },
        { id: 8, name: 'Mistrz Twardowski', coords: [53.12272049442523, 18.00115590552007], address: 'Stary Rynek 15, Bydgoszcz' }, //this adress is good
]

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
                            <p>{place.address}</p>
                            <p></p>
                            <button>Zrób zdjęcie</button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
export default MapView;