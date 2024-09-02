export async function onRequestGet(context) {
  const cookie = context.request.headers.get('Cookie');
  const sessionId = cookie?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    return new Response('Not logged in', { status: 401 });
  }

  const sessionData = await context.env.GNKV.get(sessionId);

  if (!sessionData) {
    return new Response('Session expired or not found', { status: 401 });
  }

  const { name, avatarUrl, platformUid } = JSON.parse(sessionData);

  return new Response(JSON.stringify({ userName: name, userAvatar: avatarUrl, userType: platformUid.split(':')[0] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}