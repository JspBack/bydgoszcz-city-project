import { useEffect, useState } from "react";
import { get_api_client } from "../utils/axios";

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle = {
  background: "white",
  padding: 20,
  borderRadius: 8,
  width: 360,
  maxWidth: "90%",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
};

const AddLocationModal = ({ isOpen, onClose, initialCoords, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("general");
  const [isSecret, setIsSecret] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCoords && initialCoords.length === 2) {
      setLatitude(initialCoords[0]);
      setLongitude(initialCoords[1]);
    }
  }, [initialCoords, isOpen]);

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Proszę podać nazwę i krótki opis lokalizacji.");
      return;
    }

    const payload = {
      name,
      description,
      long_description: description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      is_secret: isSecret,
      category: category || "general",
      zone: "Bydgoszcz",
      address: address || "",
    };

    try {
      setLoading(true);
      const api = get_api_client();
      const resp = await api.post("/locations", payload);
      if (resp.status === 201) {
        alert("Lokalizacja została dodana.");
        if (onSuccess) onSuccess(resp.data);
      } else {
        alert("Nieoczekiwana odpowiedź serwera.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert(
          "Błąd: " +
            (err.response.data.detail || JSON.stringify(err.response.data))
        );
      } else {
        alert("Błąd połączenia z serwerem.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div
        style={modalStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3>Dodaj nową lokalizację</h3>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 8 }}>
            <label>Nazwa</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Krótki opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Szerokość (lat)</label>
              <input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Długość (lng)</label>
              <input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Adres (opcjonalnie)</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label>Kategoria</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
              />
              &nbsp;Sekretna lokalizacja
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 12px" }}
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
              }}
            >
              {loading ? "Wysyłanie..." : "Dodaj lokalizację"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;
