const { createProxyMiddleware } = require("http-proxy-middleware");
const create = (app) => {
    app.use(
        [
            "/api/products", 
            "/api/products/:id", 
            "/api/products/top",
            "/api/users", 
            "/api/users/login", 
            "/api/users/check-password", 
            "/api/users/profile/:id",
            "/api/users/profile/:id/shipping",
            "/api/orders",
            "/api/config/paypal",
            "/api/order/myorders",
            "/api/upload",
        ], 
        createProxyMiddleware({
            target: "http://localhost:5000"
        })
    );
}
module.exports = create;