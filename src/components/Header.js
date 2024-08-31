import React, { useState } from 'react';
import SettingsMenu from './SettingsMenu';
import UserStatus from './UserStatus';


function Header({ title = 'GeoNotes' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleSettingsClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  const handleLoginStatusChange = (status) => {
    setIsUserLoggedIn(status);
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    setIsMenuOpen(false);
    // 可能还需要清除其他用户相关的状态
  };

  return (
    <>
      <header>
        <span className="header-title">{title}</span>
        <UserStatus 
          onLoginStatusChange={handleLoginStatusChange} 
          onSettingsClick={isUserLoggedIn ? handleSettingsClick : undefined}
        />
        {!isUserLoggedIn && (
          <div className="header-actions" onClick={handleSettingsClick}>
            <svg className="icon" viewBox="0 0 24 24" fill="#333">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
        )}
      </header>
      <SettingsMenu 
        isOpen={isMenuOpen} 
        onOverlayClick={handleOverlayClick} 
        isUserLoggedIn={isUserLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Header;
