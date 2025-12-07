import React, { useState, useEffect} from 'react';
import Header from '../components/Header.jsx';
import MapView from '../components/MapView.jsx';

const TOTAL_PINS = 8;     // Nowa docelowa liczba pinów
const TOTAL_EASTER_EGGS = 4;

const HomePage = () => {
    const [progressData, setProgressData] = useState({
        discoveredPins: 0,
        discoveredEasterEggs: 0,
    });
    const updateProgress = (newPins, newEasterEggs) => {
        setProgressData({
            discoveredPins: newPins,
            discoveredEasterEggs: newEasterEggs,
        });
    };
    // Backend simulation
    useEffect(() => {
            //Mock of adding 3 normal pins and one special
        const mockFetch = setTimeout(() => {
            console.log('Symulacja pobierania danych: 3 Piny, 1 EE');

            updateProgress(3, 1); 
        }, 1000);

        return () => clearTimeout(mockFetch);
    }, []);

return (
        <div>
            <Header 
                discoveredPins={progressData.discoveredPins}
                totalPins={TOTAL_PINS}
                discoveredEasterEggs={progressData.discoveredEasterEggs}
                totalEasterEggs={TOTAL_EASTER_EGGS}
            />
            <main>
                <MapView />
            </main>
        </div>
    );
};

export default HomePage;
