import React from 'react';
//导入 useState
import { useState } from 'react';
import SettingsMenu from './SettingsMenu';

// 头部组件接收一个props，用于设置头部标题，默认为GeoNotes
function Header({ title = 'GeoNotes' }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header>
        <span className="header-title">{title}</span>
        <div className="header-actions" onClick={handleSettingsClick}>
          <svg className="icon" viewBox="0 0 24 24" fill="#333">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </header>
      <SettingsMenu isOpen={isMenuOpen} onOverlayClick={handleOverlayClick} />
    </>
  );
}

export default Header;
