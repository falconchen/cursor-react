import React from 'react';

function SettingsMenu({ isOpen, onOverlayClick, isUserLoggedIn, onLogout }) {
  console.log(isUserLoggedIn);
  const handleItemClick = (event) => {
    if (event.target.tagName !== 'INPUT') {
      const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/logout');
      if (response.ok) {
        // 调用传入的 onLogout 函数来更新应用状态
        onLogout();
        // 可能还需要重定向到首页或刷新页面
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className={`settings-menu ${isOpen ? 'active' : ''}`} id="settingsMenu">
        <div className="settings-header">设置</div>
        <nav className="settings-list">
          {!isUserLoggedIn && (
            <a href="/auth/github" className="settings-item github-login">
              <span>使用GitHub登录</span>
              <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" className="github-icon">
                <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
              </svg>
            </a>
          )}
          {isUserLoggedIn && (
            <>
              <div className="settings-item" onClick={handleItemClick}>
                <span>通知</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="settings-item" onClick={handleItemClick}>
                <span>位置权限</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="settings-item" onClick={handleItemClick}>
                <span>数据同步</span>
                <input type="checkbox" />
              </div>
              <a href="/api/logout" className="settings-item" onClick={handleLogout}>
                <span>退出登录</span>
              </a>
            </>
          )}
          <a href="/privacy-policy" target="_blank" className="settings-item">
            <span>隐私政策</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </a>
          <a href="/about-us" target="_blank" className="settings-item">
            <span>关于我们</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </a>
        </nav>
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