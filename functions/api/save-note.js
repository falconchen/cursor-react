export async function onRequestPost(context) {
  try {
    // 获取请求体中的笔记数据
    const noteData = await context.request.json();
    console.log("收到的笔记数据:", JSON.stringify(noteData, null, 2));

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

    // 检查用户是否存在
    const userCheckResult = await context.env.GNDB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();
    console.log("用户检查结果:", JSON.stringify(userCheckResult, null, 2));

    if (!userCheckResult) {
      console.log("用户不存在");
      return new Response(JSON.stringify({ success: false, message: "用户不存在" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    // 将图片上传到 R2
    const imageUrls = [];
    for (const image of noteData.images) {
      const imageName = `${crypto.randomUUID()}.${image.split(';')[0].split('/')[1]}`;
      const imageData = image.split(',')[1];
      const imageBytes = new Uint8Array(atob(imageData).split('').map(char => char.charCodeAt(0)));
      await context.env.IMAGES_BUCKET.put(imageName, imageBytes, {
        httpMetadata: { contentType: image.split(';')[0].split(':')[1] },
      });
      imageUrls.push(`${context.env.R2_IMAGES_URL_PREFIX.replace(/\/$/, '')}/${imageName}`);
    }

    // 准备SQL语句
    const sql = `
      INSERT INTO notes (id, user_id, content, location_note, location, images, is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    console.log("SQL语句:", sql);

    // 准备参数
    const params = [
      noteData.id,
      userId,
      noteData.content,
      noteData.location_note,
      noteData.location,
      JSON.stringify(imageUrls), // 存储图片URL数组
      noteData.is_deleted
    ];
    console.log("SQL参数:", JSON.stringify(params, null, 2));

    // 执行SQL
    const result = await context.env.GNDB.prepare(sql).bind(...params).run();
    console.log("SQL执行结果:", JSON.stringify(result, null, 2));

    if (result.success) {
      return new Response(JSON.stringify({ success: true, message: "笔记保存成功" }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      });
    } else {
      throw new Error("保存笔记失败");
    }
  } catch (error) {
    console.error("保存笔记时出错:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
