import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_api_client } from "../utils/axios";
import "./loginpage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const api = get_api_client();

      const payload = {
        email: email,
        password: password,
      };

      const response = await api.post("/login", payload);

      if (response.status === 200) {
        const { user_id } = response.data;

        if (user_id) {
          localStorage.setItem("user_id", user_id);

          navigate("/");
        } else {
          setErrorMessage("API response missing user_id");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Nieprawidłowy email lub hasło.");
      } else {
        setErrorMessage("Wystąpił błąd połączenia.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>BydGo</h1>
        <p>Logowanie</p>
      </div>

      {/* Bind the onSubmit handler */}
      <form onSubmit={handleLogin}>
        {/* Error Message Display */}
        {errorMessage && (
          <div
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {errorMessage}
          </div>
        )}

        {/* Email Input */}
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

        {/* Password Input */}
        <div className="form-group">
          <div className="label-container">
            <label htmlFor="password">Hasło</label>
            <a href="#" className="forgot-password-link">
              Zapomniałeś/aś hasła?
            </a>
          </div>
          <input
            type="password"
            id="password"
            placeholder="***"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div>
          <button type="submit" className="login-button">
            Zaloguj
          </button>

          <p className="register-text">
            Nie masz konta? Zarejestruj się!
            <a href="/register" className="register-link">
              Rejestracja
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
