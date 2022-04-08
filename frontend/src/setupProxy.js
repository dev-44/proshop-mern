const { createProxyMiddleware } = require("http-proxy-middleware");
const create = (app) => {
    app.use(
        [
            "/api/products", 
            "/api/products/:id", 
            "/api/users", 
            "/api/users/login", 
            "/api/users/check-password", 
            "/api/users/profile/:id",
            "/api/users/profile/:id/shipping",
            "/api/orders",
            "/api/config/paypal"
        ], 
        createProxyMiddleware({
            target: "http://localhost:5000"
        })
    );
}
module.exports = create;