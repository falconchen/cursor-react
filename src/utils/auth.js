export async function checkLoginStatus() {
  try {
    const response = await fetch('/api/check-login');
    const data = await response.json();
    return data.isLoggedIn;
  } catch (error) {
    console.error('检查登录状态时出错:', error);
    return false;
  }
}