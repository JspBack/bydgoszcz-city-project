// frontend/web-mobile/src/pages/LoginPage.jsx
import React from 'react';
import './loginpage.css'; // <= Importujemy nowy plik CSS

const LoginPage = () => {
    return (
        // Używamy .login-container
        <div className="login-container">
            
            <div className="login-header"> 
                <h1>BydGo</h1>
                <p>Logowanie</p>
            </div>

            <form> {/* Formularz */}
                
                {/* Pole Email */}
                <div className="form-group">
                    <label htmlFor="email">Adres Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="bydgo@app.com"
                    />
                </div>

                {/* Pole Hasło */}
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
                    />
                </div>

                {/* Przyciski */}
                <div>
                    <button
                        type="submit"
                        className="login-button"
                    >
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
}

export default LoginPage;