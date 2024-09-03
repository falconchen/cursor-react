export async function onRequestGet(context) {
  const cookie = context.request.headers.get('Cookie');
  const sessionId = cookie?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }

  const sessionData = await context.env.GNKV.get(sessionId);

  if (!sessionData) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }

  const { name, avatarUrl, platformUid } = JSON.parse(sessionData);

  return new Response(JSON.stringify({ 
    isLoggedIn: true,
    userName: name, 
    userAvatar: avatarUrl, 
    userType: platformUid.split(':')[0] 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}