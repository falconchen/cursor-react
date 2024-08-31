export async function onRequestGet(context) {
  
  const cookie = context.request.headers.get('Cookie');
  const userName = cookie?.match(/userName=([^;]+)/)?.[1];    
  const userAvatar = cookie?.match(/userAvatar=([^;]+)/)?.[1];
  const userType = cookie?.match(/userType=([^;]+)/)?.[1];
  if (userAvatar && userName) {
    // 将userName和userAvatar解码
    const decodedUserName = decodeURIComponent(userName);
    const decodedUserAvatar = decodeURIComponent(userAvatar);
    const decodedUserType = decodeURIComponent(userType);
    return new Response(JSON.stringify({ userName: decodedUserName,userAvatar: decodedUserAvatar,userType: decodedUserType }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not logged in', { status: 401 });
}