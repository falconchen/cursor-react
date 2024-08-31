export async function onRequestGet(context) {

  

  const clientId = context.env.GITHUB_CLIENT_ID;
  const redirectUri = context.env.GITHUB_REDIRECT_URI || `${new URL(context.request.url).origin}/auth/github/callback`;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  
  return Response.redirect(githubAuthUrl, 302);
}