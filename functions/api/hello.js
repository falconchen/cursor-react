/**
 * Cloudflare functions
 * https://developers.cloudflare.com/pages/functions
 */
export function onRequest(context) {
  // const clientId = context.env.GITHUB_CLIENT_ID;
  return new Response(`Hello, World`);
}