import React from 'react';
// Możesz stworzyć plik ProgressBar.css, jeśli potrzebujesz dedykowanych stylów.

const ProgressBar = ({ label, current, total, barColor }) => {
    // Obliczanie procentu postępu
    const percentage = (current / total) * 100;

    // Podstawowe style do wyświetlenia paska
    const containerStyle = {
        marginBottom: '15px',
        width: '100%',
    };

    const barStyle = {
        height: '10px',
        borderRadius: '5px',
        backgroundColor: '#e0e0e0', // Tło szarego paska
        overflow: 'hidden',
    };

    const fillStyle = {
        height: '100%',
        width: `${percentage}%`,
        backgroundColor: barColor || '#4CAF50', // Domyślnie zielony, ale można go zmienić
        transition: 'width 0.5s ease-in-out',
    };

    const labelStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        marginBottom: '5px',
        fontWeight: 'bold',
    };
    
const counterStyle = {
        marginLeft: '10px',
        fontWeight: 'bold',
        color: barColor || '#4CAF50', // Kolor licznika jest taki sam jak paska
    }
    
return (
        <div style={containerStyle}>
            {/* Pins discovered */}
            <div style={labelStyle}>
                <span>{label}</span>
                {/* Wystarczy wyświetlić bieżącą i całkowitą liczbę */}
                <span style={counterStyle}>
                    Odkryto {current}/{total}
                </span>
            </div>
            
            {/* Pasek wizualny */}
            <div style={barStyle}>
                <div style={fillStyle}></div>
            </div>
        </div>
    );
};

export default ProgressBar;