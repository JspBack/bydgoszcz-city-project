// frontend/web-mobile/src/pages/RegisterPage.jsx
import React from 'react';
import './registerpage.css'; // Wczytujemy nowy plik CSS

const RegisterPage = () => {
    return (
        // Używamy tych samych klas co Logowanie (.login-container, .login-header)
        <div className="login-container"> 
            
            <div className="login-header"> 
                <h1>BydGo</h1>
                <p>Rejestracja nowego konta</p>
            </div>

            <form>
                
                {/* Pole Nazwa Użytkownika */}
                <div className="form-group">
                    <label htmlFor="username">Nazwa Użytkownika</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="np. turysta_bydgoszcz"
                    />
                </div>
                
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
                    <label htmlFor="password">Hasło</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="***"
                    />
                </div>
                
                {/* Pole Potwierdzenie Hasła */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Potwierdź Hasło</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="***"
                    />
                </div>

                {/* Przyciski */}
                <div>
                    <button
                        type="submit"
                        className="login-button" // Używamy tego samego stylu
                    >
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
}

export default RegisterPage;