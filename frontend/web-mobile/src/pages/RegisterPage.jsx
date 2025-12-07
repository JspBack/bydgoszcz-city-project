// frontend/web-mobile/src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_api_client } from "../utils/axios";
import "./registerpage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // only client side for now
    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne.");
      return;
    }

    if (password.length < 5) {
      setError("Hasło musi mieć co najmniej 5 znaków.");
      return;
    }

    try {
      const api = get_api_client();

      const payload = {
        username: username,
        email: email,
        password: password,
      };

      const response = await api.post("/register", payload);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration Error:", err);

      if (err.response) {
        if (err.response.status === 422) {
          setError("Nieprawidłowe dane (błąd walidacji). Sprawdź email.");
        } else if (err.response.status === 409) {
          setError("Taki użytkownik już istnieje.");
        } else {
          setError("Wystąpił błąd serwera. Spróbuj ponownie później.");
        }
      } else {
        setError("Brak połączenia z serwerem.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>BydGo</h1>
        <p>Rejestracja nowego konta</p>
      </div>

      <form onSubmit={handleRegister}>
        {/* Error / Success Messages */}
        {error && (
          <div
            style={{ color: "red", textAlign: "center", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: "green",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Konto utworzone! Przekierowywanie...
          </div>
        )}

        {/* Pole Nazwa Użytkownika */}
        <div className="form-group">
          <label htmlFor="username">Nazwa Użytkownika</label>
          <input
            type="text"
            id="username"
            placeholder="np. turysta_bydgoszcz"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // Not required for API currently, but good for UI
          />
        </div>

        {/* Pole Email */}
        <div className="form-group">
          <label htmlFor="email">Adres Email</label>
          <input
            type="email"
            id="email"
            placeholder="bydgo@app.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Pole Hasło */}
        <div className="form-group">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            placeholder="***"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Pole Potwierdzenie Hasła */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Potwierdź Hasło</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="***"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Przyciski */}
        <div>
          <button type="submit" className="login-button">
            Zarejestruj się
          </button>

          <p className="register-text">
            Masz już konto?
            <a href="/login" className="register-link">
              Zaloguj
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
