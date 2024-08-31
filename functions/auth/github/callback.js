export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  // 交换code获取访问令牌
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'GeoNotes-App', // 添加User-Agent
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response('Failed to get access token', { status: 400 });
  }
  // console.log(`accessToken: ${accessToken}`);
  // 获取用户信息
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${accessToken}`,
      'User-Agent': 'GeoNotes-App', // 添加User-Agent
    },
  });

  let userData;
  let responseText;
  try {
    responseText = await userResponse.text(); // 先获取原始响应文本
    userData = JSON.parse(responseText); // 尝试解析为JSON
  } catch (error) {
    console.error('Failed to parse user data as JSON:', error);
    console.log('Raw response:', responseText);
    return new Response('Failed to parse user data', { status: 500 });
  }

  if (!userData || typeof userData !== 'object') {
    console.error('Invalid user data received');
    console.log('Raw response:', responseText);
    return new Response('Invalid user data received', { status: 500 });
  }

  // 设置cookie或其他方式存储用户信息
  // const response = new Response(JSON.stringify(userData), {
  //   headers: { 'Content-Type': 'application/json' },
  // });
  
  
  
  //返回一个包含用户信息的HTML页面，包含用户的名称头像，并且3秒后跳转到首页，显示一个正在跳转的动画
  const response = new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <title>正在登录...</title>
      <style> 
        body {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .spinner {    
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 
          to {
            transform: rotate(360deg);
          }
        }
          #userAvatar {
            width: 0;
            height: 0;            
          }
      </style>
    </head>
    <body>
    
      <img src="${userData.avatar_url}" alt="User Avatar" id="userAvatar"/>
      <div class="spinner"></div>
      
    </body> 
    <script>
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    </script>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
  //将用户数据设置到cookie中
  const userDataStr = JSON.stringify(userData);

  const isLocalDev = context.request.url.includes('localhost') || context.request.url.includes('local');
  const cookieOptions = `HttpOnly; ${isLocalDev ? '' : 'Secure;'} SameSite=${isLocalDev ? 'Lax' : 'Strict'}; Path=/`;

  response.headers.append('Set-Cookie', `userName=${encodeURIComponent(userData.name)}; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `userAvatar=${encodeURIComponent(userData.avatar_url)}; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `userType=github; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `userDataStr=${encodeURIComponent(userDataStr)}; ${cookieOptions}`);

  return response;
}
