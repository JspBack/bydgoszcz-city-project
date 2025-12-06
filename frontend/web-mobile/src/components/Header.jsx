import React, { useState } from 'react';
import ProgressBar from './ProgressBar.jsx'; // Importujemy pasek postępu
import logo from '../assets/logo.png';
const headerStyle = {
    padding: '10px 15px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'relative', // Przydatne, aby header był zawsze na górze
    top: 0,
    zIndex: 1000,
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

const Header = ({ 
    discoveredPins, 
    totalPins, 
    discoveredEasterEggs, 
    totalEasterEggs 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log(`Menu jest teraz: ${!isMenuOpen} ? 'otwarte' : 'zamkniete"}`);
    }
    const menuOverlayStyle = {
        position: 'absolute',
        top: '100%',
        right: 0,
        width: '250px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 2000,
        padding: '15px',
        display: isMenuOpen ? 'block' : 'none',
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
            <div style={menuOverlayStyle}>
                <h3>Menu Główne</h3>
                <p>Fontanna Potop</p>
                <p>Kazimierze Wielki</p>
                <p>Przechodzący przez Ramkę</p>
                <p>Pomnik Kopernika</p>
                <p>Ławeczka Mariana Rejewskiego</p>
                <p>Rzeźba Łuczniczki</p>
                <p>Zegar z czasem bydgoskim</p>
                <p></p>
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
            
        </header>
    );
};

export default Header;