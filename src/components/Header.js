import React from 'react';

function Header() {
  const handleSettingsClick = () => {
    alert('打开设置菜单');
  };

  return (
    <header>
      <span className="header-title">GeoNotes</span>
      <div className="header-actions" onClick={handleSettingsClick}>
        <svg className="icon" viewBox="0 0 24 24" fill="#333">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
    </header>
  );
}

export default Header;
