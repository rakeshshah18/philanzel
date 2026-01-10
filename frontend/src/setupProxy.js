const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://philanzel-backend.onrender.com',
            changeOrigin: true,
        })
    );
    // Proxy uploads as well so requests to /uploads/... are forwarded to the backend
    // during local development. This allows <img src="/uploads/..." /> to work.
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: 'https://philanzel-backend.onrender.com',
            changeOrigin: true,
        })
    );
};
