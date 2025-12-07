import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import AddLocationModal from "./AddLocationModal";
import { get_api_client } from "../utils/axios";
import "leaflet/dist/leaflet.css";
import jsQR from "jsqr";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const default_pos = [53.1235, 18.0084];

const initialPlaces = [
  {
    id: 1,
    name: "Fontanna Potop",
    coords: [53.12688833879727, 18.006254141088036],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 2,
    name: "Kazimierz Wielki",
    coords: [53.12267718422295, 17.997524442342453],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 3,
    name: "Przechodzący przez Rzekę",
    coords: [53.12389793027659, 18.001607518341864],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 4,
    name: "Pomnik Kopernika",
    coords: [53.12890755721382, 18.013053833690282],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 5,
    name: "Ławeczka Mariana Rejewskiego",
    coords: [53.128621158509915, 18.005987610404663],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 6,
    name: "Rzeźba Łuczniczki",
    coords: [53.13089183902998, 18.01210701584773],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 7,
    name: "Zegar z czasem bydgoskim",
    coords: [53.123094839913556, 18.00003099986527],
    address: "Stary Rynek 15, Bydgoszcz",
  },
  {
    id: 8,
    name: "Mistrz Twardowski",
    coords: [53.12272049442523, 18.00115590552007],
    address: "Stary Rynek 15, Bydgoszcz",
  }, //this adress is good
];

const grayIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "custom-marker marker-unvisited-gray",
});

const decodeQRCode = (file) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      const maxDimension = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height *= maxDimension / width));
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width *= maxDimension / height));
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        resolve(code.data);
      } else {
        reject(
          new Error(
            "Nie znaleziono kodu QR. Upewnij się, że zdjęcie jest ostre i dobrze oświetlone."
          )
        );
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error("Błąd ładowania obrazu."));
    };

    img.src = url;
  });
};

const MapView = () => {
  const [locations, setLocations] = useState(initialPlaces);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);

  const [position, setPosition] = useState(default_pos);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];

        console.log("Updated User Position:", newPos);

        setPosition(newPos);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const fetchLocations = async () => {
    try {
      const api = get_api_client();
      const response = await api.get("/locations?limit=100");
      console.log("API Response Data:", response.data);

      if (response.status === 200) {
        setLocations((prev) => [...prev, ...(response.data?.locations || [])]);
      }
    } catch (error) {
      console.error("Błąd pobierania lokalizacji:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const uploadQrIdToBackend = async (qrId) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Błąd: Brak zalogowanego użytkownika.");
      return;
    }

    try {
      const api = get_api_client();
      const response = await api.post(
        `/scan?hashed_id=${qrId}&user_id=${userId}`
      );

      if (response.status === 200) {
        alert(`Gratulacje! ${response.data.message || "Miejsce odkryte!"}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Scan Error:", error);
      if (error.response && error.response.data) {
        alert(`Błąd: ${error.response.data.detail}`);
      } else {
        alert("Błąd połączenia z serwerem.");
      }
    }
  };

  const handlePhotoTaken = async (event, placeId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const qrId = await decodeQRCode(file);
      if (qrId) {
        await uploadQrIdToBackend(qrId, placeId);
      } else {
        alert(
          "Błąd: Kod QR nie został znaleziony na zdjęciu. Spróbuj ponownie."
        );
      }
    } catch (error) {
      console.error("Błąd skanowania/sieci:", error);
      alert(`Wystąpił błąd podczas skanowania: ${error.message}`);
    }
    event.target.value = null;
  };

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={14}
        whenCreated={(map) => {}}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        onClick={(e) => {
          const { lat, lng } = e.latlng;
          if (isAddModalOpen) {
            setClickedCoords([lat, lng]);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={position}
          radius={8}
          pathOptions={{
            color: "white",
            fillColor: "#007bff",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>Tu jesteś!</Popup>
        </CircleMarker>

        {locations.map((place) => (
          <Marker key={place.id} position={place.coords} icon={grayIcon}>
            <Popup>
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              <label
                htmlFor={`camera-input-${place.id}`}
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Zrób zdjęcie
              </label>
              <input
                id={`camera-input-${place.id}`}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(event) => {
                  handlePhotoTaken(event, place.id);
                }}
              ></input>
            </Popup>
          </Marker>
        ))}

        {clickedCoords && isAddModalOpen && (
          <Marker position={clickedCoords}>
            <Popup>Wybrane współrzędne</Popup>
          </Marker>
        )}
      </MapContainer>

      <button
        onClick={() => {
          setClickedCoords(null);
          setIsAddModalOpen(true);
        }}
        aria-label="Dodaj lokalizację"
        title="Dodaj lokalizację"
        style={{
          position: "fixed",
          left: 20,
          bottom: 20,
          zIndex: 1000,
          width: 48,
          height: 48,
          padding: 0,
          borderRadius: 24,
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          fontSize: 22,
          lineHeight: "22px",
        }}
      >
        <span style={{ transform: "translateY(-1px)" }}>✚</span>
      </button>

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialCoords={clickedCoords || position}
        onSuccess={() => {
          setIsAddModalOpen(false);
          setClickedCoords(null);
          fetchLocations();
        }}
      />
    </div>
  );
};
export default MapView;
