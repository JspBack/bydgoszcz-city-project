import React from 'react';
import MapView from '../components/MapView.jsx'; // <= IMPORTUJEMY NASZ KOMPONENT

const HomePage = () => {
    return (
        <div>
            {/* <Header /> */}
            <h2>Witaj na Stronie Głównej!</h2>
            
            {/* Tutaj wyświetlamy mapę */}
            <MapView /> 

            <p>Poniżej jest treść pod mapą.</p>

            {/* <Footer /> */}
        </div>
    );
};

export default HomePage;