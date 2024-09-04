export async function onRequestGet(context) {
  try {
    // 获取用户ID
    const cookie = context.request.headers.get('Cookie');
    const sessionId = cookie?.match(/sessionId=([^;]+)/)?.[1];

    if (!sessionId) {
      console.log("未找到 sessionId");
      return new Response(JSON.stringify({ success: false, message: "未登录" }), {
        headers: { "Content-Type": "application/json" },
        status: 401
      });
    }

    const sessionData = await context.env.GNKV.get(sessionId);
    if (!sessionData) {
      console.log("无效的 sessionId:", sessionId);
      return new Response(JSON.stringify({ success: false, message: "会话无效" }), {
        headers: { "Content-Type": "application/json" },
        status: 401
      });
    }

    const { userId } = JSON.parse(sessionData);
    console.log("用户ID:", userId);

    // 准备SQL语句
    const sql = `
      SELECT id, content, location_note, location, images, created_at, updated_at 
      FROM notes
      WHERE user_id = ? AND is_deleted = false
      ORDER BY created_at DESC
    `;
    console.log("SQL语句:", sql);

    // 准备参数
    const params = [userId];
    console.log("SQL参数:", JSON.stringify(params, null, 2));

    // 执行SQL
    const result = await context.env.GNDB.prepare(sql).bind(...params).all();
    console.log("SQL执行结果:", JSON.stringify(result, null, 2));

    const { results: rawNotes, success, message } = result;

    // 转换 images 字段
    const notes = rawNotes.map(note => {
      let parsedImages = [];
      try {
        if (note.images && note.images.trim() !== '') {
          parsedImages = JSON.parse(note.images);
        }
      } catch (error) {
        console.error(`解析笔记 ID ${note.id} 的 images 失败:`, error);        
      }

      return {
        ...note,
        images: Array.isArray(parsedImages) ? parsedImages : []
      };
    });

    console.log("处理后的笔记列表:", JSON.stringify(notes, null, 2));

    return new Response(JSON.stringify({ success, notes, message }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    console.error("获取笔记列表时出错:", error);
    return new Response(JSON.stringify({ success: false, message: '获取笔记列表时出错' }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
