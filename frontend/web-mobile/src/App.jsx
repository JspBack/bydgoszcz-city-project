import { useState } from 'react';
import { MapView } from './components/MapView';
import { TopBar } from './components/TopBar';
import { ProgressBar } from './components/ProgressBar';
import './components/component.css';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const discoveredPins = 5;
  const totalPins = 12;
  const discoveredThings = 1;
  const totalThings = 8;

  const pinsPercentage = (discoveredPins / totalPins) * 100;

  return (
    <div className="app-container">
      <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="progress-section">
        <ProgressBar
          label="Odkryte piny"
          current={discoveredPins}
          total={totalPins}
          percentage={pinsPercentage}
          color="green"
        />
      </div>

      <div className="progress-section">
        <ProgressBar
          label="Odkryte rzeczy"
          current={discoveredThings}
          total={totalThings}
          percentage={(discoveredThings / totalThings) * 100}
          color="purple"
        />
      </div>

      <div className="map-container">
        <MapView discoveredPins={discoveredPins} />

        {/* Sidebar */}
        <div
          className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}
        >
          <div className="sidebar-content">
            <h2 className="sidebar-title">Menu</h2>
            <ul className="sidebar-list">
              <li>Mapa</li>
              <li>Odkrycia</li>
              <li>Profil</li>
              <li>Ustawienia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
