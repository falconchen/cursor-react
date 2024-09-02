export async function onRequestGet(context) {
  // 检查是否为开发环境
  
  const isLocalDev = context.request.url.includes('localhost') || context.request.url.includes('local');

  // 设置 cookie 选项
  const cookieOptions = `Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${isLocalDev ? '' : 'Secure;'} SameSite=${isLocalDev ? 'Lax' : 'Strict'}`;

  // 清除sessionId cookie
  const clearCookies = [`sessionId=; ${cookieOptions}`];

  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearCookies
    }
  });
}
