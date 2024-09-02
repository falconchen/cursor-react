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

  // 存储用户信息到D1
  const platformUid = `github:${userData.id}`;
  const userId = crypto.randomUUID();
  const db = context.env.GNDB;
  await db.prepare(`
    INSERT INTO users (id, platform_uid, name, avatar_url)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(platform_uid) DO UPDATE SET
      name=excluded.name,
      avatar_url=excluded.avatar_url,
      last_login=CURRENT_TIMESTAMP
  `).bind(userId, platformUid, userData.name, userData.avatar_url).run();

  // 生成session并存储到KV
  const sessionId = crypto.randomUUID();
  const sessionData = {
    userId,
    platformUid,
    name: userData.name,
    avatarUrl: userData.avatar_url,
  };
  await context.env.GNKV.put(sessionId, JSON.stringify(sessionData), { expirationTtl: 31536000 }); // 1年 = 31536000秒

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
      }, 2000);
    </script>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });

  // 将sessionId设置到cookie中
  const isLocalDev = context.request.url.includes('localhost') || context.request.url.includes('local');
  const cookieOptions = `HttpOnly; ${isLocalDev ? '' : 'Secure;'} SameSite=${isLocalDev ? 'Lax' : 'Strict'}; Path=/; Max-Age=31536000`; // 1年 = 31536000秒
  response.headers.append('Set-Cookie', `sessionId=${sessionId}; ${cookieOptions}`);

  return response;
}
