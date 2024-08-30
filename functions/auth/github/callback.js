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

  // 获取用户信息
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${accessToken}`,
    },
  });

  const userData = await userResponse.json();

  // 设置cookie或其他方式存��用户信息
  const response = new Response(JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });

  response.headers.set('Set-Cookie', `github_user=${userData.login}; HttpOnly; Secure; SameSite=Strict; Path=/`);

  return response;
}
