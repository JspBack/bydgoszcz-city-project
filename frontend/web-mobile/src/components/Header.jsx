import React, { useState } from 'react';
import ProgressBar from './ProgressBar.jsx'; // Importujemy pasek postępu
import logo from '../assets/logo.png';
const headerStyle = {
    padding: '10px 15px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'relative',
    top: 0,
    zIndex: 1000,
    overflow: 'visible',
};

const navBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '24px', // Ikony i logo
};

const logoConstainerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '35px',
};

const logoImageStyle = {
    height: '100%',
    width: 'auto',
    marginRight: '8px',
};

const ALL_PLACES = [
    "Fontanna Potop", "Kazimierz Wielki", "Przechodzący przez Rzekę",
    "Pomnik Kopernika", "Ławeczka Mariana Rejewskiego", "Rzeźba Łuczniczki", 
    "Zegar z czasem bydgoskim", "Mistrz Twardowski"
];

const Header = ({ 
    discoveredPins, 
    totalPins, 
    discoveredEasterEggs, 
    totalEasterEggs 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
const NAVIGATION_HEIGHT = '150px';
const menuOverlayStyle = (isMenuOpen) => ({
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 2000,
        padding: '15px',
        transition: 'transform 0.3s ease-in-out',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
    });

    const menuContentStyle = {
    paddingTop: NAVIGATION_HEIGHT,
    padding: '15px',
    overflowY: 'auto',
    height: '100%',
};
    const infoTextStyle = {
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    };

return (
<header style={headerStyle}>
            
            <div style={navBarStyle}>
                <div style={logoConstainerStyle}>
                    <img
                        src={logo}
                        alt="logo aplikacji"
                        style={logoImageStyle}
                    />
                    
                
                <div style={{fontWeight: 'bold', fontSize: '1.2em', color: 'black'}}>
                    BydGo
                </div> 
                </div>

                <div onClick={toggleMenu}
                    style = {{
                        color: 'black',
                        cursor: 'pointer',
                        padding: '5px',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '24px',
                    }}>
                    ☰ 
                </div> 
            </div>
            
            {/* Normal pins */}
            <ProgressBar 
                label="Odkryte piny (Miejsca turystyczne)" 
                current={discoveredPins} 
                total={totalPins}         
                barColor="#4CAF50" 
            />

            {/* Easter Eggs */}
            <ProgressBar 
                label="Odkryte rzeczy (Easter Eggi)" 
                current={discoveredEasterEggs} 
                total={totalEasterEggs}        
                barColor="#9C27B0" 
            />
           <div style={menuOverlayStyle(isMenuOpen)}>
                <div style={menuContentStyle}>
                    <div style={{fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px', color: 'black'}}>Przeglądaj miejsca</div>
                    
                    {ALL_PLACES.map((place, index) => (
                        <div key={index} style={{
                            padding: '10px 0',
                            borderBottom: '1px solid #eee',
                            fontSize: '16px',
                            color: 'black',
                        }}>
                            {place}
                        </div>
                    ))}
                    
                    <button 
                        onClick={toggleMenu} 
                        style={{ marginTop: '20px', padding: '10px', width: '100%' }}
                    >
                        Zamknij
                    </button>
                </div>
            </div> 
        </header>
    );
};

export default Header;