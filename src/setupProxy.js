const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/auth'],
    createProxyMiddleware({
      target: 'http://localhost:8788', // 修改为后端服务器wrangler pages dev 的地址
      changeOrigin: true,
    })
  );
};
