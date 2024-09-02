/**
 * Cloudflare functions
 * https://developers.cloudflare.com/pages/functions
 */

export async function onRequest(context) {
  // 确认 GNDB 是否已配置
  if (!context.env.GNDB) {
    console.error('GNDB 未配置');
    return new Response('GNDB 未配置', { status: 500 });
  }

  const id = crypto.randomUUID();

  const db = context.env.GNDB;
  // 修改插入代码以匹配 users 表的结构
  const result = await db.prepare('INSERT INTO users (id, platform_uid, name, avatar_url, created_at, last_login) VALUES (?, ?, ?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
                         .bind(id, `github:${crypto.randomUUID()}`,  'John', 'https://example.com/avatar.jpg') 
                         .run();

  if (result.success) {
    const users = await db.prepare('SELECT * FROM users').all();
    console.log(users);
  } else {
    console.error('插入数据失败');
  }

  console.log(context.request.cf.timezone);
  const timezone = context.timezone || context.env.DEFAULT_TIMEZONE;

  const localTimeStrings = new Date().toLocaleString('zh-CN', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\//g, '-').replace(',', '');

  await context.env.GNKV.put('time-key', localTimeStrings);
  const time = await context.env.GNKV.get('time-key');
  return new Response(`Hello, World ${time}`);
}