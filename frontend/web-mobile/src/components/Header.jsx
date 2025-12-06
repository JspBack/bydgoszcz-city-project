import React from 'react';
import ProgressBar from './ProgressBar.jsx'; // Importujemy pasek postępu

const headerStyle = {
    padding: '10px 15px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky', // Przydatne, aby header był zawsze na górze
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

const Header = ({ 
    discoveredPins, 
    totalPins, 
    discoveredEasterEggs, 
    totalEasterEggs 
}) => {
    // Style dla dużej informacji na górze
    const infoTextStyle = {
        textAlign: 'center',
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    };

return (
        <header style={headerStyle}>
            {/* ... Góra ... */}
            
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