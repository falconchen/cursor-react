import React from 'react';

function SettingsMenu({ isOpen, onOverlayClick }) {
  return (
    <>
      <div className={`settings-menu ${isOpen ? 'active' : ''}`} id="settingsMenu">
        <div className="settings-header">设置</div>
        <div className="settings-list">
          <div className="settings-item">
            <span>通知</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="settings-item">
            <span>位置权限</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="settings-item">
            <span>数据同步</span>
            <input type="checkbox" />
          </div>
          <div className="settings-item">
            <span>隐私政策</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <div className="settings-item">
            <span>关于我们</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>

      <div 
        className={`overlay ${isOpen ? 'active' : ''}`} 
        id="overlay"
        onClick={onOverlayClick}
      ></div>
    </>
  );
}

export default SettingsMenu;