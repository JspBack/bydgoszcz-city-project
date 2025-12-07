import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { get_api_client } from "../utils/axios";
import "leaflet/dist/leaflet.css";
import jsQR from "jsqr";

// Fix dla ikon, które mogą nie ładować się poprawnie
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          resolve(code.data); // Zwracamy treść (ID) kodu QR
        } else {
          reject(new Error("Nie znaleziono kodu QR na obrazie."));
        }
      };
      img.src = e.target.result; // Wczytanie obrazu
    };

    reader.onerror = reject;
    reader.readAsDataURL(file); // Wczytanie pliku jako URL
  });
};

const MapView = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const api = get_api_client();
        const response = await api.get("/locations");

        if (response.status === 200) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Błąd pobierania lokalizacji:", error);
      }
    };

    fetchLocations();
  }, []);

  const uploadQrIdToBackend = async (qrId, placeId) => {
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

    // Ważne w React: Resetujemy input, aby móc zrobić kolejne zdjęcie na tym samym markerze
    event.target.value = null;
  };

  // Użyjemy stylu w komponencie do ustalenia wysokości mapy
  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations?.map((place) => (
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
      </MapContainer>
    </div>
  );
};
export default MapView;
