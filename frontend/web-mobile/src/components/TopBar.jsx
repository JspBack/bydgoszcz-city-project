import React from 'react';

export default function TopBar() {
  return (
    <div className="topbar">
      <button className="topbar-menu" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="topbar-title">Moja Aplikacja</h1>
    </div>
  );
}