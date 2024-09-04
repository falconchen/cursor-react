export async function onRequestGet(context) {
  try {
    const noteId = context.params.id;
    
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
      WHERE id = ? AND user_id = ? AND is_deleted = false
    `;
    console.log("SQL语句:", sql);

    // 准备参数
    const params = [noteId, userId];  
    console.log("SQL参数:", JSON.stringify(params, null, 2));

    // 执行SQL
    const result = await context.env.GNDB.prepare(sql).bind(...params).first();
    console.log("SQL执行结果:", JSON.stringify(result, null, 2));

    if (!result) {
      return new Response(JSON.stringify({ success: false, message: '笔记不存在或无权访问' }), {
        headers: { "Content-Type": "application/json" }, 
        status: 404
      });
    }

    // 转换 images 字段
    let parsedImages = [];
    try {
      if (result.images && result.images.trim() !== '') {
        parsedImages = JSON.parse(result.images);
      }
    } catch (error) {
      console.error(`解析笔记 ID ${result.id} 的 images 失败:`, error);        
    }

    const note = {
      ...result,
      images: Array.isArray(parsedImages) ? parsedImages : []
    };

    console.log("处理后的笔记详情:", JSON.stringify(note, null, 2));

    return new Response(JSON.stringify({ success: true, note }), {
      headers: { "Content-Type": "application/json" },
      status: 200  
    });
  } catch (error) {
    console.error("获取笔记详情时出错:", error);
    return new Response(JSON.stringify({ success: false, message: '获取笔记详情时出错' }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}