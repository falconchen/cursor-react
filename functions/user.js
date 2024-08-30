export async function onRequestGet(context) {
  const cookie = context.request.headers.get('Cookie');
  const githubUser = cookie?.match(/github_user=([^;]+)/)?.[1];

  if (githubUser) {
    return new Response(JSON.stringify({ user: githubUser }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not logged in', { status: 401 });
}